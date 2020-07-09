/**
 * Copyright 2019, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START functions_pubsub_setup]
const {PubSub} = require('@google-cloud/pubsub');

// Instantiates a client
const pubsub = new PubSub();
// [END functions_pubsub_setup]

const {Buffer} = require('safe-buffer');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.topic Topic name on which to publish.
 * @param {string} req.body.message Message to publish.
 * @param {!express:Response} res HTTP response context.
 */
exports.pFiveStream = (req, res) => {
  
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
  
    if (!req.body.eventTimestamp) {
      res
        .status(500)
        .send(
          new Error(
            'Topic not provided. Make sure you have a "topic" property in your request'
          )
        );
      return;
    } else if (!req.body.message) {
      res
        .status(500)
        .send(
          new Error(
            'Message not provided. Make sure you have a "message" property in your request'
          )
        );
      return;
    }

  // Set Pub/Sub topic name
  let topicName = 'p5-events';

  // console.log(`Publishing message to topic ${req.body.topic}`);
  console.log(`Publishing message to topic ${topicName}`);
  
  // References an existing topic
  const topic = pubsub.topic(topicName);

  const message = {
    data: {
      eventTimestamp: req.body.eventTimestamp,
      message: req.body.message,
      particle: req.body.particle
    },
  };
  
  // convert object to string
  const data = JSON.stringify(message);

  // Publishes the message as a string, 
  const dataBuffer = Buffer.from(data);
  
  // Add two custom attributes, origin and username, to the message
  const customAttributes = {
    origin: 'p5stream-cloud-function',
    username: 'gcp-demo',
  };
  
  // Publishes a message to Pub/Sub
  return topic
    .publish(dataBuffer, customAttributes)
    .then(() => res.status(200).send('{"message": "pubsub sent"}'))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
      return Promise.reject(err);
   });
    
  }
  //let message = req.query.message || req.body.message || 'Hello World!';
  //res.status(200).send(message);
};