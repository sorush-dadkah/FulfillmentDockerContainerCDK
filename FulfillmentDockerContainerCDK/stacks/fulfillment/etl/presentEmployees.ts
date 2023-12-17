import { Duration } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

import { toTitleCase } from "../../../helpers";
import { ETL } from "../constructs/etl/etl";
import { LambdaProps } from "../types/fulfillmentStackProps";

export class PresentEmployees extends ETL {
  public constructor(
    parent: Construct,
    name: string,
    regionName: string,
    props: LambdaProps
  ) {
    super(parent, name, regionName, props);

    regionName = toTitleCase(regionName);
    props.description = `Lambda to get employees who are clock-in for region ${regionName}`;
    props.cmd =
      "fulfillment_docker_container/compute/lambdas/fulfillment/etl/present_employees.handler";
    const etl = new ETL(
      this,
      `fulfillmentPresentEmployees${regionName}`,
      regionName,
      props
    );

    const eventRule = new events.Rule(this, "LambdaEventTrigger", {
      schedule: events.Schedule.rate(Duration.minutes(1)),
    });

    eventRule.addTarget(new targets.LambdaFunction(etl));
  }
}
