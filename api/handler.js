import DynamoDBClient from "./libs/dynamoClient";
import WebsocketClient from "./libs/websocketClient";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

let domainName = "89rqvefb8d.execute-api.ap-southeast-1.amazonaws.com";
const dbClient = new DynamoDBClient();
let wsClient = new WebsocketClient(domainName, "dev");
const s3 = new AWS.S3();

export const connectHandler = async (event) => {
  return { statusCode: 200 };
};

export const disconnectHandler = async (event) => {
  const { connectionId } = event.requestContext;
  console.log(event);

  try {
    const Attributes = await dbClient.removeUser(connectionId);
    const Items = await dbClient.getRoomParticipants(Attributes.roomId);
    const connections = Items.map((item) => item.connectionId);
    const participants = Items.map((item) => item.username);
    await wsClient.send(connections, participants, "join");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

export const joinHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { room, username } = JSON.parse(event.body);
  try {
    await dbClient.addUser(connectionId, room, username);
    const Items = await dbClient.getRoomParticipants(room);
    const connections = Items.map((item) => item.connectionId);
    const participants = Items.map((item) => item.username);
    await wsClient.send(connections, participants, "join");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

export const historyHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { room } = JSON.parse(event.body);
  try {
    const history = await dbClient.getRoomHistory(room);
    await wsClient.send([connectionId], history, "history");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

export const messageHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { message } = JSON.parse(event.body);

  console.log(event);
  try {
    const { roomId, username } = await dbClient.getUser(connectionId);
    const messageObj = {
      roomId,
      dateTime: Math.floor(Date.now() / 1000),
      username,
      message,
      type: "text",
    };
    await dbClient.addRoomTextMessage(
      roomId,
      messageObj.dateTime,
      username,
      message,
      messageObj.type
    );
    const Items = await dbClient.getRoomParticipants(roomId);
    const connections = Items.map((item) => item.connectionId);

    await wsClient.send(connections, messageObj, "message");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

// client setTimeout/setInterval to ping
export const defaultHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const action = event.body.action;

  try {
    if (action == "PING") {
      await wsClient.send([connectionId], "PONG", "PONG");
    }
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

// client send
// get presigned, and upload
// s3 event, identify folder(room)
// update dynamodb, send to all
// xmlhttprequest eventlistener progress (client)

export const generateUploadUrl = async (event) => {
  const { room, username, filename, filetype } = JSON.parse(event.body);
  const url = s3.getSignedUrl("putObject", {
    Bucket: process.env.FILE_BUCKET,
    Key: `${room}/${username}/${v4()}_${filename}`,
    ContentType: filetype,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
};

export const generateDownloadUrl = async (event) => {
  const { filename } = JSON.parse(event.body);
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.FILE_BUCKET,
    Key: filename,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
};

export const fileHandler = async (event) => {
  const body = event.Records[0].s3;
  const filesize = body.object.size;
  const [room, username, compositeFilename] = body.object.key.split("/");
  const [id, filename] = compositeFilename.split(/_(.+)/);

  try {
    await dbClient.addRoomFileMessage(
      room,
      Math.floor(Date.now() / 1000),
      username,
      filename,
      filesize,
      id,
      "file"
    );
    const Items = await dbClient.getRoomParticipants(room);
    const connections = Items.map((item) => item.connectionId);
    const participants = Items.map((item) => item.username);
    await wsClient.send(connections, participants, "message");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return {
    statusCode: 200,
  };
};
