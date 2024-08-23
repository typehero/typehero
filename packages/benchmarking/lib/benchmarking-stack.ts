import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import { CfnOutput} from 'aws-cdk-lib';

export class BenchmarkingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ecrRepo = new ecr.Repository(this, 'EcrRepo', {
      repositoryName: 'code-tester',
    });

    ecrRepo.grantRead(new iam.ServicePrincipal('lambda.amazonaws.com'));

    const codePerfLambda = new lambda.DockerImageFunction(this, 'CodePerfLambda', {
      code: lambda.DockerImageCode.fromEcr(ecrRepo),
      functionName: 'code-perf-lambda',
      environment: {
        ECR_REPO: ecrRepo.repositoryUri,
      },
    });

    // const codePerfLambda = new lambda.Function(this, 'CodePerfLambda', {
    //   code: lambda.DockerImageCode.fromEcr(ecrRepo),
    //   // code: lambda.Code.fromAsset('lib/code-perf-lambda'),
    //   // handler: 'index.handler',
    //   // runtime: lambda.Runtime.NODEJS_18_X,
    //   // environment: {
    //   //   ECR_REPO: ecrRepo.repositoryUri,
    //   // },
    // });

    new CfnOutput(this, 'EcrRepo', {
      value: ecrRepo.repositoryUri,
    });

  }
}
