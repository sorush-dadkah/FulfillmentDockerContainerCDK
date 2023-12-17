import { HydraTestRunResources } from '@amzn/hydra';
import { BrazilEcrImage, DeploymentStackProps } from '@amzn/pipelines';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export interface StackProps extends DeploymentStackProps {
  vpcId: string;
  stage: string;
}

export interface LambdaProps {
  vpc: ec2.IVpc;
  stage: string;
  sharedImage: BrazilEcrImage,
  hydraResources: HydraTestRunResources
  description: string
  cmd: string
  memorySize: number
  timeout: number
}
