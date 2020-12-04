# Serverless Chatrooms

![Program Flow](/Preview.png)

Online chatrooms that anybody can join via url. It supports text and file sharing.
This mini project was created to put into practice AWS serverless technologies.

## Tech/frameworks used

- Node.js v12.x
- React
- Serverless Framework
- AWS Api Gateway
- AWS Lambda
- AWS S3
- AWS DynamoDB
- AWS IAM
- AWS Cloudwatch

## Program Flow

![Program Flow](/Structure.png)

## Setting up development environment

- Install Serverless Framework `npm install -g serverless`
- [Set up AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)
- `git clone https://github.com/xuanlc113/serverless-chatrooms.git`
- run `npm install`
- `cd api` and run `serverless deploy`. This may take a while
- create a `.env` file in `/client` and fill in API gateway urls (AWS Management Console > API Gateway > Click on the appropriate api name > stages > Invoke/Websocket URL)

```
REACT_APP_WEBSOCKET_URL=[serverless-chat-file-api url]
REACT_APP_API_GATEWAY_URL=[serverless-chat-websocket-api url]
```

- In a new terminal, `cd client` and run `npm start`
- App should now be running on `http://localhost:3000`
