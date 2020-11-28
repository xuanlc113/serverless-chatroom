import DynamoDBClient from "./libs/dynamoClient";
import WebsocketClient from "./libs/websocketClient";

// wss://89rqvefb8d.execute-api.ap-southeast-1.amazonaws.com/dev/?room=room1&username=user2
// {"action": "history", "room": "room1"}
// {"action": "message", "message": "message1"}
const dbClient = new DynamoDBClient();
let wsClient;

export const connectHandler = async () => {
  return { statusCode: 200 };
};

export const disconnectHandler = async (event) => {
  const { connectionId, domainName, stage } = event.requestContext;
  wsClient = new WebsocketClient(domainName, stage);
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
  const { connectionId, domainName, stage } = event.requestContext;
  const { room, username } = JSON.parse(event.body);
  wsClient = new WebsocketClient(domainName, stage);
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
  const { connectionId, domainName, stage } = event.requestContext;
  const { room } = JSON.parse(event.body);
  wsClient = new WebsocketClient(domainName, stage);
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
  const { connectionId, domainName, stage } = event.requestContext;
  const { message } = JSON.parse(event.body);

  console.log(event);

  wsClient = new WebsocketClient(domainName, stage);
  try {
    const { roomId, username } = await dbClient.getUser(connectionId);
    const messageObj = {
      roomId,
      dateTime: Math.floor(Date.now() / 1000),
      username,
      message,
      type: "text",
    };
    await dbClient.addRoomMessage(
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
  const { connectionId, domainName, stage } = event.requestContext;
  wsClient = new WebsocketClient(domainName, stage);
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
