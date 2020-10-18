import * as AWS from "aws-sdk";

export default class DynamoDBClient {
  constructor(config = {}) {
    this.client = new AWS.DynamoDB.DocumentClient(config);
    this.userTable = process.env.USER_TABLE;
    this.roomIndex = process.env.ROOM_INDEX;
    this.messageTable = process.env.MESSAGE_TABLE;
  }

  async getUser(connectionId) {
    const params = {
      TableName: this.userTable,
      Key: {
        connectionId,
      },
    };

    try {
      const { Item } = await this.client.get(params).promise();
      return Item;
    } catch (err) {
      throw new Error("failed to get user");
    }
  }

  async getRoomParticipants(roomId) {
    const params = {
      TableName: this.userTable,
      IndexName: this.roomIndex,
      KeyConditionExpression: "roomId = :r",
      ExpressionAttributeValues: {
        ":r": roomId,
      },
      ProjectionExpression: "connectionId",
    };

    try {
      const { Items } = await this.client.query(params).promise();
      console.log(Items);
      const connectionIds = Items.map((item) => item.connectionId);
      return connectionIds;
    } catch (err) {
      console.log(err);
      throw new Error(`failed to get participants from room: ${roomId}`);
    }
  }

  async addUser(connectionId, roomId, name) {
    const params = {
      TableName: this.userTable,
      Item: {
        connectionId,
        roomId,
        name,
      },
    };

    try {
      await this.client.put(params).promise();
    } catch (err) {
      throw new Error("failed to add user");
    }
  }

  async removeUser(connectionId) {
    const params = {
      TableName: this.userTable,
      Key: {
        connectionId,
      },
    };

    try {
      await this.client.delete(params).promise();
    } catch (err) {
      throw new Error("failed to remove user");
    }
  }

  async addRoomMessage(roomId, message, connectionId) {
    const user = await this.getUser(connectionId);
    const params = {
      TableName: this.messageTable,
      Item: {
        roomId,
        dateTime: Date.now().toString(),
        name: user.name,
        message,
      },
    };

    try {
      await this.client.put(params).promise();
    } catch (err) {
      throw new Error("failed to update room history");
    }
  }

  async getRoomHistory(roomId) {
    const params = {
      TableName: this.messageTable,
      KeyConditionExpression: "roomId = :r",
      ExpressionAttributeValues: {
        ":r": roomId,
      },
    };

    try {
      const { Items } = await this.client.query(params).promise();
      return Items;
    } catch (err) {
      throw new Error("failed to get user");
    }
  }
}
