import { ApiGatewayManagementApi } from "aws-sdk";

export default class WebsocketClient {
  constructor(domainName, stage) {
    this.api = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: `https://${domainName}/${stage}`,
    });
  }

  async send(connections, message) {
    let posts = connections.map(async (id) => {
      try {
        await this.api
          .postToConnection({
            ConnectionId: id,
            Data: JSON.stringify(message),
          })
          .promise();
      } catch (err) {
        //remove stale connections
        throw err;
      }
    });

    try {
      await Promise.all(posts);
    } catch (err) {
      throw err;
    }

    return;
  }
}
