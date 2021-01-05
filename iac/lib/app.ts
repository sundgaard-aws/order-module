#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
//import { MetaData } from './meta-data';
import { env } from 'process';
import EC2 = require('@aws-cdk/aws-ec2');
import { MetaData } from './meta-data';
import { PipelineStack } from './pipeline-stack';
import { NetworkStack } from './network-stack';
import { ComputeStack } from './compute-stack';

const app = new cdk.App();
var props = {env: {account: process.env["CDK_DEFAULT_ACCOUNT"], region: process.env["CDK_DEFAULT_REGION"] } };
props.env.region = "eu-north-1";
var metaData = new MetaData();

console.log("REGION=" + props.env.region);
var networkStack = new NetworkStack(app, MetaData.PREFIX+"network-stack", props);
new ComputeStack(app, MetaData.PREFIX+"compute-stack", networkStack.Vpc, networkStack.ApiSecurityGroup, props);