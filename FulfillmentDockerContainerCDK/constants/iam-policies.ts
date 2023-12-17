import * as iam from "aws-cdk-lib/aws-iam";

export type AWSManagedPolicy = iam.ManagedPolicy | iam.IManagedPolicy;
export type CreatedPolicy = iam.PolicyStatement;

export interface Policies {
  MANAGED_POLICIES: AWSManagedPolicy[];
  CREATED_POLICIES: CreatedPolicy[];
}

export const FULFILLMENT_POLICIES: Policies = {
  MANAGED_POLICIES: [
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
  ],
  CREATED_POLICIES: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["sts:AssumeRole"],
      resources: [
        "arn:aws:iam::123456789:role/FulfillmentRedshiftRole",
        "arn:aws:iam::123456789:role/fulfillment_docker_container",
      ],
    }),
  ],
};
