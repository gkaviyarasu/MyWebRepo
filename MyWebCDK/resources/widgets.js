const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const bucketName = process.env.TABLE_NAME;

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    try {
        let key = event.httpMethod + ' ' + event.resource;
        switch (key) {
            case "DELETE /{id}":
                await docClient
                    .delete({
                        TableName: bucketName,
                        Key: {
                            appId: event.pathParameters.id
                        }
                    })
                    .promise();
                body = `Deleted item ${event.pathParameters.id}`;
                break;
            case "GET /{id}":
                body = await docClient
                    .get({
                        TableName: bucketName,
                        Key: {
                            appId: event.pathParameters.id
                        }
                    })
                    .promise();
                break;
            case "GET /":
                body = await docClient.scan({ TableName: bucketName }).promise();
                break;
            case "PUT /{id}":
                let requestJSON = JSON.parse(event.body);
                await docClient
                    .put({
                        TableName: bucketName,
                        Item: {
                            appId: requestJSON.appId,
                            dTimestamp: requestJSON.dTimestamp,
                            gender:requestJSON.gender,
                            name: requestJSON.name,
                            ttl: new Date(new Date().getDate() + 1).getUTCMilliseconds()
                        }
                    })
                    .promise();
                body = `Put item ${requestJSON.appId}`;
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = event;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};