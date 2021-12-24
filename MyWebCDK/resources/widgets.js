const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const bucketName = process.env.TABLE_NAME;
const surveyTable = process.env.SURVEY_TABLE;

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    try {
        let key = event.httpMethod + ' ' + event.resource;
        switch (key) {
            case "GET /{appId}":
                body = await docClient
                    .get({
                        TableName: bucketName,
                        Key: {
                            appId: event.pathParameters.appId
                        }
                    })
                    .promise();
                break;
            case "GET /":
                body = await docClient.scan({TableName: bucketName}).promise();
                break;
            case "PUT /":
                let requestJSON = JSON.parse(event.body);
                await docClient
                    .put({
                        TableName: bucketName,
                        Item: {
                            appId: requestJSON.appId,
                            dTimestamp: requestJSON.dTimestamp,
                            gender: requestJSON.gender,
                            name: requestJSON.name,
                            ttl: new Date(new Date().getDate() + 1).getUTCMilliseconds()
                        }
                    })
                    .promise();
                body = `Put item ${requestJSON.appId}`;
                break;
            case "PUT /{appId}/message":
                let messageJSON = JSON.parse(event.body);
                await docClient
                    .put({
                        TableName: surveyTable,
                        Item: {
                            appId: event.pathParameters.appId,
                            messageId: crypto.randomUUID(),
                            timestamp: Date.now(),
                            gender: messageJSON.gender,
                            name: messageJSON.name,
                            message: messageJSON.message,
                            expectedDate: messageJSON.expectedDate,
                            boyName: messageJSON.boyName,
                            girlName: messageJSON.girlName
                        }
                    })
                    .promise();
                body = `Put item ${messageJSON.appId}`;
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