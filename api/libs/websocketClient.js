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

  async send(connections, data, type) {
    const payload = { type, data };
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
}
