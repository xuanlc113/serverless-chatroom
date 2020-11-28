import * as AWS from "aws-sdk";

export default class DynamoDBClient {
  constructor(config = {}) {
    this.client = new AWS.DynamoDB.DocumentClient(config);
    this.userTable = process.env.USER_TABLE;
    this.roomIndex = process.env.ROOM_INDEX;
    this.messageTable = process.env.MESSAGE_TABLE;
  }

  async addUser(connectionId, roomId, username) {
    let ttl = Math.floor(Date.now() / 1000 + 86400);
    const params = {
      TableName: this.userTable,
      Item: {
        connectionId,
        roomId,
        username,
        ttl,
      },
    };

    try {
      await this.client.put(params).promise();
    } catch (err) {
      console.log(err);
      throw new Error("failed to add user");
    }
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

  async removeUser(connectionId) {
    const params = {
      TableName: this.userTable,
      Key: {
        connectionId,
      },
      ReturnValues: "ALL_OLD",
    };

    try {
      const { Attributes } = await this.client.delete(params).promise();
      return Attributes;
    } catch (err) {
      throw new Error("failed to remove user");
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
    };

    try {
      const { Items } = await this.client.query(params).promise();
      console.log(Items);
      return Items;
    } catch (err) {
      console.log(err);
      throw new Error(`failed to get participants from room: ${roomId}`);
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
      console.log(Items);
      return Items;
    } catch (err) {
      throw new Error("failed to get user");
    }
  }

  async addRoomMessage(roomId, dateTime, username, message, type) {
    const params = {
      TableName: this.messageTable,
      Item: {
        roomId,
        dateTime,
        username,
        message,
        type,
        ttl: dateTime + 86400,
      },
    };

    try {
      await this.client.put(params).promise();
    } catch (err) {
      throw new Error("failed to update room history");
    }
  }
}
