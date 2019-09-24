# moody
Record my mood each day from text messages, using a serverless backend stack.

Primary motivation is to create a project using several AWS tools. The only
backend code is a short Python script executed by Lambda, which parses
notifications from SNS and writes summaries to Dynamo.

The frontend is a [Vue application](https://vuejs.org) hosted on GCP. Pages are
served directly from [Cloud Storage](https://cloud.google.com/storage/) via
[Cloud Load Balancing](https://cloud.google.com/load-balancing/) (since this is
required for serving files in GCS over HTTPS).

## AWS Backend Services Interaction

![Flow diagram](MoodyFlow.svg)

## Services

### Shown in diagram

1. [Pinpoint](https://aws.amazon.com/pinpoint/) is used for scheduling and SMS
   message coordination. I would have preferred to trigger SMS messages via
   SNS, but ran into some trouble trying to figure out how to subscribe to SMS
   directly to enable two-way messaging.
1. [Simple Notification Service (SNS)](https://aws.amazon.com/sns/) is 
   responsible for sending/receiving text messages, as well as triggering a 
   Lambda function to save user responses.
1. [Lambda](https://aws.amazon.com/lambda/) processes notifications from SNS
   when a user responds. Moody only uses one Lambda, which parses the SNS
   message for SMS content and saves the result to DynamoDB.
1. [DynamoDB](https://aws.amazon.com/dynamodb/) is used to store mood messages.
   Writes are performed by Lambda.


### Additional dependencies

1. [Identity and Access Management (IAM)](https://aws.amazon.com/iam/) controls
   resource and service access. IAM roles and policies are used for all
   interactions within Moody, e.g. Lambda write permissions to DynamoDB are
   controlled via IAM.
1. [CloudWatch](https://aws.amazon.com/cloudwatch/) is enabled for the moody
   Lambda, so all traces resulting from Lambda execution are logged. This has
   been very helpful in debugging issues with actual execution - while running
   a Lambda on fixed input for a unit test is simple, I could not find any
   logging for real traffic within Lambda itself. CloudWatch also provides
   alarms: besides base DynamoDB alarms, one additional alarm on Lambda
   execution error rate has been added for this project.
1. [Simple Storage System S3](https://aws.amazon.com/s3/) is used incidentally
   to store endpoints (i.e. phone numbers) for Pinpoint. I had a lot of trouble
   specifying endpoints for Pinpoint, and kept running into Exceptions
   (specifically NotFoundException came up several times) trying to configure
   an endpoint via the AWS CLI. Importing a JSON blob from S3 worked relatively
   seamlessly.

## Usage

Currently, moody is only enabled for my personal use since this whole thing is
just for my benefit and learning. Hit me up if you want some help setting up a
similar system.

## Future work

Data collection is complete, simple front end is up.

1. Enable export/download of mood summaries.
1. Consider expanding to support other users (probably just my family).
