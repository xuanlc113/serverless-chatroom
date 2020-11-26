import DynamoDBClient from "./libs/dynamoClient";
import WebsocketClient from "./libs/websocketClient";

// wss://e06vdkebt9.execute-api.ap-southeast-1.amazonaws.com/dev/?room=room1&username=user2
// {"action": "history", "room": "room1"}
// {"action": "message", "message": "message1"}
const dbClient = new DynamoDBClient();
let wsClient;

export const connectHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { room, username } = event.queryStringParameters;

  try {
    await dbClient.addUser(connectionId, room, username);
    console.log(event);
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};

export const disconnectHandler = async (event) => {
  const { connectionId } = event.requestContext;

  console.log(event);

  try {
    await dbClient.removeUser(connectionId);
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
    const messages = await dbClient.getRoomHistory(room);
    await wsClient.sendHistory(connectionId, messages);
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
      dateTime: Date.now(),
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
    const connections = await dbClient.getRoomParticipants(roomId);

    await wsClient.sendMessage(connections, messageObj);
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
      await wsClient.send([connectionId], "PONG");
    }
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};
