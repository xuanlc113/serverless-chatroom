import DynamoDBClient from "./libs/dynamoClient";
import WebsocketClient from "./libs/websocketClient";

const dbClient = new DynamoDBClient();
let wsClient;

export const connectHandler = async (event) => {
  const { connectionId, domainName, stage } = event.requestContext;
  const { room, name } = event.queryStringParameters;
  wsClient = new WebsocketClient(domainName, stage);

  console.log(event);

  try {
    await dbClient.addUser(connectionId, room, name);
    const messages = await dbClient.getRoomHistory(room);
    wsClient.send([connectionId], messages);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Failed to connect: ${JSON.stringify(err)}`,
    };
  }

  return { statusCode: 200, body: "Connected." };
};

export const disconnectHandler = async (event) => {
  const { connectionId } = event.requestContext;

  console.log(event);

  try {
    await dbClient.removeUser(connectionId);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Failed to disconnect: ${JSON.stringify(err)}`,
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};

export const messageHandler = async (event) => {
  const { connectionId, domainName, stage } = event.requestContext;
  const { message } = JSON.parse(event.body);

  console.log(event);

  wsClient = new WebsocketClient(domainName, stage);
  try {
    const user = await dbClient.getUser(connectionId);
    await dbClient.addRoomMessage(user.roomId, message, connectionId);
    const connections = await dbClient.getRoomParticipants(user.roomId);

    await wsClient.send(connections, message);
  } catch (err) {
    console.log(err);
  }

  return { statusCode: 200, body: "message sent" };
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
    return {
      statusCode: 500,
      body: `Sefault socket response error: ${JSON.stringify(err)}`,
    };
  }
  return { statusCode: 200, body: "Default socket response" };
};
