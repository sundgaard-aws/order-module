import { ISecurityGroup, IVpc } from '@aws-cdk/aws-ec2';
import { Code, Runtime, Tracing } from '@aws-cdk/aws-lambda';
import * as Core from '@aws-cdk/core';
import { MetaData } from './meta-data';
import IAM = require("@aws-cdk/aws-iam");
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { CfnOutput } from '@aws-cdk/core';
import Lambda = require('@aws-cdk/aws-lambda');

export interface LambdaHttpApiProps {
    apiRole:IAM.IRole, apiSecurityGroup: ISecurityGroup, functionName:string, handlerMethod:string, assetPath:string, vpc:IVpc;
}

export class LambdaHttpApi extends Core.Construct {
    constructor(scope: Core.Construct, id: string, props:LambdaHttpApiProps) {
        super(scope, id);
        var codeFromLocalZip = Code.fromAsset(props.assetPath);
        var lambdaFunction = new Lambda.Function(this, MetaData.PREFIX+props.functionName, { 
            functionName: MetaData.PREFIX+props.functionName, vpc: props.vpc, code: codeFromLocalZip, handler: props.handlerMethod, runtime: Runtime.NODEJS_12_X, memorySize: 256, 
            timeout: Core.Duration.seconds(20), role: props.apiRole, securityGroups: [props.apiSecurityGroup],
            tracing: Tracing.ACTIVE
        });
        
        const proxyIntegration = new LambdaProxyIntegration({
            handler: lambdaFunction,
        });
            
        const httpApi = new HttpApi(this, MetaData.PREFIX+props.functionName+"-api");
        
        httpApi.addRoutes({
            path: "/" + MetaData.PREFIX+props.functionName,
            methods: [ HttpMethod.POST, HttpMethod.OPTIONS ],
            integration: proxyIntegration,
        });
        
        Core.Tags.of(lambdaFunction).add(MetaData.NAME, MetaData.PREFIX+props.functionName);
        new CfnOutput(this, MetaData.PREFIX+props.functionName+"-out", {description:"apiEndpointUrl", value:httpApi.apiEndpoint+"/"+httpApi.httpApiName});
        return lambdaFunction;
    } 
}