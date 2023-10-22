import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Api, ApiProps} from './api';
import {StateMachine, StateMachineProps} from './stateMachine';
import {Storage} from './storage';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export type NewsletterStackProps = cdk.StackProps &
    Pick<ApiProps, 'redirectUrls'> &
    Omit<StateMachineProps, 'newsletterTable'>;

export class SlsItaNewsletterStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: NewsletterStackProps) {
        super(scope, id, props);

        const storage = new Storage(this, 'Storage');

        const stateMachine = new StateMachine(this, 'StateMachine', {
            newsletterTable: storage.newsletterTable,
            ...props,
        });

        const api = new Api(this, 'Api', {
            stateMachine,
            ...props,
        });

        new cdk.CfnOutput(this, 'ApiEndpoint', {
            value: api.api.url,
        });
    }
}
