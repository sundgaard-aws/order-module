# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


# Set context
cdk synth -c bucket_name=mygroovybucket

# Get context
``` typescript
const app = new cdk.App();
const bucket_name = app.node.tryGetContext('bucket_name');
```

# Agenda
Constructs L1+L2


# Using Input Parameters
The short version is to avoid this via CDK.
https://stackoverflow.com/questions/58138536/how-to-specify-parameter-definition-in-cdk-stack
cdk deploy --parameters ygg-om-compute-stack:inputparam1="test123" ygg*

# CDK docs
https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html

# CDK Pipeline
https://docs.aws.amazon.com/cdk/latest/guide/cdk_pipeline.html

# CDK on GitHub
https://github.com/aws/aws-cdk
https://github.com/aws-samples/aws-cdk-examples

# CDK Workshop
https://cdkworkshop.com/

# Using conditions
https://stackoverflow.com/questions/59411734/add-conditions-to-resources-in-cdk

# Using other resources
https://garbe.io/blog/2019/09/20/hey-cdk-how-to-use-existing-resources/
``` typescript
const vpc = Vpc.fromLookup(this, 'MyExistingVPC', { isDefault: true });
new cdk.CfnOutput(this, "MyVpc", {value: vpc.vpcId });
```


