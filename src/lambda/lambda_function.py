import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
  """
  Reads SNS notification and writes message to DynamoDB.

  Args:
      event: SNS notification containing a SMS message.
      context: AWS execution specific metadata.

  Returns:
      HTTP response w/ status code 200 on completion.
  """
  print('Received new event:' + str(event))
  print('Execution time is:' + str(datetime.now()))
  
  payload = json.loads(event['Records'][0]['Sns']['Message'])
  print('Parsed message from notification:' + json.dumps(payload))
  message_parts = payload['messageBody'].split("\n")
  print(message_parts)
  note = ''
  if (len(message_parts) > 1):
    note = message_parts[1]
  mood_rating = message_parts[0]

  dynamodb = boto3.client('dynamodb')
  dynamodb.put_item(
      TableName='MoodMessages',
      Item={
          'MessageId': {'S': payload['inboundMessageId']},
          'ProcessedTimestamp': {'S': str(datetime.utcnow())},
          'MoodRating': {'N': mood_rating},
          'Note': {'S': note},
          'UserPhone': {'S': payload['originationNumber']}
          }
      )
  
  return {
      'statusCode': 200,
      'body': json.dumps(event)
  }
