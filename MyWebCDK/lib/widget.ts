import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import {AttributeType, BillingMode, Table} from "@aws-cdk/aws-dynamodb";
import {Cors} from "@aws-cdk/aws-apigateway";
import {CorsOptions} from "@aws-cdk/aws-apigateway/lib/cors";

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

        const handler = new lambda.Function(this, "WidgetHandler", {
            runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset("resources"),
            handler: "widgets.handler",
            environment: {
                TABLE_NAME: table.tableName,
                PARTITION_KEY: 'appId'
            }
        });
        // @ts-ignore
        table.grantFullAccess(handler.role);

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

        api.root.addMethod("GET", getWidgetsIntegration); // GET /
        const widget = api.root.addResource("{id}");

        // Add new widget to bucket with: POST /{id}
        const postWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Get a specific widget from bucket with: GET /{id}
        const getWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Remove a specific widget from the bucket with: DELETE /{id}
        const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Remove a specific widget from the bucket with: DELETE /{id}
        const putWidgetIntegration = new apigateway.LambdaIntegration(handler);

        widget.addMethod("POST", postWidgetIntegration); // POST /{id}
        widget.addMethod("GET", getWidgetIntegration); // GET /{id}
        widget.addMethod("DELETE", deleteWidgetIntegration); // DELETE /{id}
        widget.addMethod("PUT", putWidgetIntegration); // DELETE /{id}
    }
}