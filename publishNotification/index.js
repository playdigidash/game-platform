'use strict';

// Load the AWS SDK for Node.js
module.exports.handler = async (event, context) => {
  const AWS = require('aws-sdk');
  // Set region
  AWS.config.update({region: 'us-east-1'});
  
  const sns = new AWS.SNS()

  const params = {
    Message: event.Message,
    Subject: event.Subject,
    TopicArn: 'arn:aws:sns:us-east-1:821475164415:polk-event-notification'
  };

  let response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  try {
    const data = await sns.publish(params).promise();
    response.messageId = data.MessageId,
    response.result = 'Success'
  } catch (e) {
    console.log(e.stack)
    response.result = 'Error'
  }
  
  return response
};
