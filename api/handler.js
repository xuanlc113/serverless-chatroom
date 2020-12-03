import DynamoDBClient from "./libs/dynamoClient";
import WebsocketClient from "./libs/websocketClient";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

const dbClient = new DynamoDBClient();
let wsClient = new WebsocketClient(
  process.env.WEBSOCKET_URL.replace("wss://", ""),
  process.env.STAGE
);
const s3 = new AWS.S3();

export const connectHandler = async () => {
  return { statusCode: 200 };
};

export const disconnectHandler = async (event) => {
  const { connectionId } = event.requestContext;

  try {
    const Attributes = await dbClient.removeUser(connectionId);
    const Items = await dbClient.getRoomParticipants(Attributes.room);
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

  try {
    const { room, username } = await dbClient.getUser(connectionId);
    const messageObj = {
      room,
      dateTime: Math.floor(Date.now() / 1000),
      username,
      message,
      type: "text",
    };
    await dbClient.addRoomTextMessage(
      room,
      messageObj.dateTime,
      username,
      message,
      messageObj.type
    );
    const Items = await dbClient.getRoomParticipants(room);
    const connections = Items.map((item) => item.connectionId);

    await wsClient.send(connections, messageObj, "message");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

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

export const generateUploadUrl = async (event) => {
  const { room, username, filename, filetype } = JSON.parse(event.body);

  try {
    const url = s3.getSignedUrl("putObject", {
      Bucket: process.env.FILE_BUCKET,
      Key: `${room}/${username}/${v4()}_${filename}`,
      ContentType: filetype,
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(url),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }
};

export const generateDownloadUrl = async (event) => {
  const { room, username, id, filename } = JSON.parse(event.body);

  try {
    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.FILE_BUCKET,
      Key: `${room}/${username}/${id}_${filename}`,
      Expires: 60,
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(url),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }
};

export const fileHandler = async (event) => {
  const body = event.Records[0].s3;
  const filesize = body.object.size;
  const [room, username, compositeFilename] = body.object.key.split("/");
  const [id, filename] = compositeFilename.split(/_(.+)/);

  try {
    const fileObj = {
      room,
      dateTime: Math.floor(Date.now() / 1000),
      username,
      filename,
      filesize,
      id,
      type: "file",
    };
    await dbClient.addRoomFileMessage(
      room,
      fileObj.dateTime,
      username,
      filename,
      filesize,
      id,
      "file"
    );
    const Items = await dbClient.getRoomParticipants(room);
    const connections = Items.map((item) => item.connectionId);
    await wsClient.send(connections, fileObj, "message");
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return {
    statusCode: 200,
  };
};
