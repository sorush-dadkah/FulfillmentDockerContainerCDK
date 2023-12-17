import { LambdaImageAsset } from "@amzn/pipelines";

import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaProps } from "../../types/fulfillmentStackProps";

export class ETL extends lambda.DockerImageFunction {
  public constructor(
    parent: Construct,
    name: string,
    regionName: string,
    props: LambdaProps
  ) {
    super(parent, name, {
      functionName: name,
      description: props.description,
      vpc: props.vpc,
      environment: {
        stage: props.stage,
        region_name: regionName,
      },
      code: LambdaImageAsset.fromEcr({
        image: props.sharedImage,
        cmd: [props.cmd],
      }),
      memorySize: props.memorySize, // 1 VCPU
      timeout: Duration.seconds(props.timeout),
      tracing: lambda.Tracing.ACTIVE,
      architecture: lambda.Architecture.X86_64,
    });

    for (let policy of FULFILLMENT_POLICIES.MANAGED_POLICIES) {
      this.role?.addManagedPolicy(policy);
    }

    for (let policy of FULFILLMENT_POLICIES.CREATED_POLICIES) {
      this.addToRolePolicy(policy);
    }

    this.grantInvoke(props.hydraResources.invocationRole);
  }
}
