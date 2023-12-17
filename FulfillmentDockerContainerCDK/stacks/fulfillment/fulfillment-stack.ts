import { HydraTestRunResources } from "@amzn/hydra";
import {
  BrazilPackage,
  DeploymentStack,
  HydraComputeEngine,
  ImageAsset,
} from "@amzn/pipelines";

import { App } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

import { PresentEmployees, IncomingVolume } from "./etl";
import { LambdaProps, StackProps } from "./types/fulfillmentStackProps";

export class FulfillmentStack extends DeploymentStack {
  public readonly hydraResources: HydraTestRunResources;

  public constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    const vpcId = props.vpcId;
    const vpc = ec2.Vpc.fromLookup(this, "DB_VPC", {
      vpcId: vpcId,
    });

    this.hydraResources = new HydraTestRunResources(
      this,
      "HydraTestRunResources",
      {
        hydraEnvironment: props.env.hydraEnvironment,
        hydraAsset: {
          targetPackage: BrazilPackage.fromString(
            "FulfillmentDockerContainerTests-1.0"
          ),
          engine: HydraComputeEngine.FARGATE,
          transformationPackage: BrazilPackage.fromString(
            "GigaHydraFargateBATSTransform-1.0"
          ),
        },
      }
    );

    this.hydraResources.invocationRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );
    this.hydraResources.invocationRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaRole")
    );

    const sharedImage = ImageAsset.ecrImageFromBrazil({
      brazilPackage: BrazilPackage.fromString("FulfillmentDockerContainer-1.0"),
      transformPackage: BrazilPackage.fromString(
        "FulfillmentDockerContainerImageBuild-1.0"
      ),
      componentName: "FulfillmentContainer",
    });

    const lambdaProps: LambdaProps = {
      vpc: vpc,
      stage: props.stage,
      sharedImage: sharedImage,
      hydraResources: this.hydraResources,
      description: "",
      cmd: "",
      memorySize: 1792,
      timeout: 900,
    };

    new IncomingVolume(this, "fulfillmentIncomingVolume", "na", lambdaProps);
    new PresentEmployees(this, "fulfillmentPresentEmployees", "na", lambdaProps);
  }
}
