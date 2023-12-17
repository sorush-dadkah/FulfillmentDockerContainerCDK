import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

import { Duration } from "aws-cdk-lib";
import { toTitleCase } from "../../../helpers";
import { ETL } from "../constructs/etl/etl";
import { LambdaProps } from "../types/fulfillmentStackProps";

export class IncomingVolume extends ETL {
  public constructor(
    parent: Construct,
    name: string,
    regionName: string,
    props: LambdaProps
  ) {
    super(parent, name, regionName, props);

    regionName = toTitleCase(regionName);
    props.description = `Lambda to get incoming volume for region ${regionName}`;
    props.cmd =
      "fulfillment_docker_container/compute/lambdas/fulfillment/etl/incoming_volume.handler";
    const etl = new ETL(
      this,
      `fulfillmentIncomingVolume${regionName}`,
      regionName,
      props
    );

    const eventRule = new events.Rule(this, "LambdaEventTrigger", {
      schedule: events.Schedule.rate(Duration.minutes(60)),
    });

    eventRule.addTarget(new targets.LambdaFunction(etl));
  }
}
