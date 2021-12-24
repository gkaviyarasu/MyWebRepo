import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import {Cors} from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import {AttributeType, BillingMode, Table} from "@aws-cdk/aws-dynamodb";

export class WidgetService extends core.Construct {
    constructor(scope: core.Construct, id: string) {
        super(scope, id);
        //const bucket = new s3.Bucket(this, "WidgetStore");
        const table = new Table(this, "MyRepoTable", {
            tableName: 'MyRepoTable',
            partitionKey: {
                name: 'appId',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: 'ttl'
        });

        const surveyTable = new Table(this, "GenderRevealSurveyTable", {
            tableName: 'GenderRevealSurveyTable',
            partitionKey: {
                name: 'appId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "messageId",
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: 'ttl'
        });

        const handler = new lambda.Function(this, "WidgetHandler", {
            runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset("resources"),
            handler: "widgets.handler",
            environment: {
                TABLE_NAME: table.tableName,
                SURVEY_TABLE: surveyTable.tableName
            }
        });
        // @ts-ignore
        table.grantFullAccess(handler.role);
        // @ts-ignore
        surveyTable.grantFullAccess(handler.role);

        const api = new apigateway.RestApi(this, "widgets-api", {
            restApiName: "Widget Service",
            description: "This service serves widgets.",
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS
            }
        });

        const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: {"application/json": '{ "statusCode": "200" }'}
        });
        const putWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: {"application/json": '{ "statusCode": "200" }'}
        });

        api.root.addMethod("GET", getWidgetsIntegration); // GET /
        api.root.addMethod("PUT", putWidgetsIntegration); // PUT
        const widget = api.root.addResource("{appId}");

        // Add new widget to bucket with: POST /{appId}
        const postWidgetIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: {"application/json": '{ "statusCode": "200" }'}
        });

        // Get a specific widget from bucket with: GET /{appId}
        const getWidgetIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: {"application/json": '{ "statusCode": "200" }'}
        });

        // Remove a specific widget from the bucket with: DELETE /{appId}
        const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: {"application/json": '{ "statusCode": "200" }'}
        });

        widget.addMethod("POST", postWidgetIntegration); // POST /{appId}
        widget.addMethod("GET", getWidgetIntegration); // GET /{appId}
        widget.addMethod("DELETE", deleteWidgetIntegration); // DELETE /`{appId}`

        const messageWidget = widget.addResource("message");
        messageWidget.addMethod("PUT", getWidgetIntegration)
    }
}