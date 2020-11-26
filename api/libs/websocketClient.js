import { ApiGatewayManagementApi } from "aws-sdk";
import DynamoDbClient from "./dynamoClient";

export default class WebsocketClient {
  constructor(domainName, stage) {
    this.api = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: `https://${domainName}/${stage}`,
    });
    this.dbclient = new DynamoDbClient();
  }

  async sendMessage(connections, message) {
    const payload = { type: "message", data: message };
    let posts = connections.map(async (id) => {
      try {
        await this.api
          .postToConnection({
            ConnectionId: id,
            Data: JSON.stringify(payload),
          })
          .promise();
      } catch (err) {
        console.log(err);
        await this.dbclient.removeUser(id);
      }
    });

    await Promise.all(posts);
  }

  async sendHistory(connection, history) {
    const payload = { type: "history", data: history };
    console.log(payload);
    try {
      await this.api
        .postToConnection({
          ConnectionId: connection,
          Data: JSON.stringify(payload),
        })
        .promise();
    } catch (err) {
      console.log(err);
      return { statusCode: 500 };
    }

    return { statusCode: 200 };
  }
}
