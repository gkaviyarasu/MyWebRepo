import {Stack, StackProps} from '@aws-cdk/core';
import {Construct} from 'constructs';
import {WidgetService} from "./widget";

export class MyWebCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        new WidgetService(this, 'Widgets');
    }
}
