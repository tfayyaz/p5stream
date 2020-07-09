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

// Demo website
// https://editor.p5js.org/tfayyaz/sketches/E-z7C0kYX

// cloud function URL
const url = 'https://region-project-id.cloudfunctions.net/pFiveStream';

// no of new random particles to generate
const noOfParticles = 10

let postData = {
  topic:'p5-events'
}

function setup() {
  createCanvas(800, 800);
}

function mousePressed() {
  
  // create timestamp for event
  let eventTimestamp = +new Date()
  
  // Pick new random color values
  let r = random(255);
  let g = random(255);
  let b = random(255);
  
  for (let i = 0; i < noOfParticles; i++) {
    
    // create random position for new particle near main particle
    let randomMoveX = random(-20,20) + mouseX;
    let randomMoveY = random(-20,20) + mouseY;
    
    // draw ellipe for random particle generated
    noStroke()
    fill(r, g, b, 200);
    ellipse(randomMoveX, randomMoveY, 20, 20);
    
    // set data to be sent to cloud function
    postData.eventTimestamp = eventTimestamp;
    
    postData.message = "p5 particle sent";
    
    postData.particle = {
      index: i,
      r: r,
      g: g,
      b: b,
      mouseX: mouseX,
      mouseY: mouseY,
      randomMoveX: randomMoveX,
      randomMoveY: randomMoveY
    }
    
    httpPost(url, 'json', postData, function(result) {
      console.log(result)
      // console.log(eventTimestamp)
    });
  }
}