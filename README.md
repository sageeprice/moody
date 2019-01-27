# moody
Record my mood each day from text messages, using AWS stack.

Primary motivation is to create a project using several AWS tools. The only actual code involved at this point is a short Python script executed by Lambda, which parses a notification from SNS and writes a summary to Dynamo.

## AWS service interaction

![Flow diagram](MoodyFlow.svg)

## Services

### Shown in diagram

1. [Pinpoint](https://aws.amazon.com/pinpoint/) is used for scheduling and SMS message coordination. I would have preferred to trigger SMS messages via SNS, but ran into some trouble trying to figure out how to subscribe to SMS directly to enable two-way messaging.
1. [Simple Notification Service (SNS)](https://aws.amazon.com/sns/) is responsible for sending/receiving text messages, as well as triggering a Lambda function to save user responses.
1. [Lambda](https://aws.amazon.com/lambda/) processes notifications from SNS when a user responds. Moody only uses one Lambda, which parses the SNS message for SMS content and saves the result to DynamoDB.
1. [DynamoDB](https://aws.amazon.com/dynamodb/) is used to store mood messages. Writes are performed by Lambda.


### Additional dependencies

1. [Identity and Access Management (IAM)](https://aws.amazon.com/iam/) controls resource and service access. IAM roles and policies are used for all interactions within Moody, e.g. Lambda write permissions to DynamoDB are controlled via IAM.
1. [CloudWatch](https://aws.amazon.com/cloudwatch/) is enabled for the moody Lambda, so all traces resulting from Lambda execution are logged. This has been very helpful in debugging issues with actual execution - while running a Lambda on fixed input for a unit test is simple, I could not find any logging for real traffic within Lambda itself. CloudWatch also provides alarms: besides base DynamoDB alarms, one additional alarm on Lambda execution error rate has been added for this project.
