const fs = require('fs');
const keyJson = fs.readFileSync('./key/key.json');
const keyData = keyJson.toString();
const key = JSON.parse(keyData);
console.log(key.certificate)
console.log(key.db_url)
const admin = require("firebase-admin");
const {spawn} = require('child_process');
const serviceAccount = require("./key/"+key.certificate);
const { json } = require('express');
const crypto = require('crypto')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: key.db_url
});

const db = admin.database();
const ref = db.ref('users/');
ref.on('child_changed', (snapshot) => {
    const check = snapshot.val();
    console.log("Connect Request: "+check.chkConnectRequest);
    console.log("Connect Response: "+check.chkConnectResponse);
    console.log("key: "+snapshot.key);
    //newInstance(snapshot.key);
    if(check.chkConnectRequest == true && check.chkConnectResponse == false) {
      console.log("Start Instance: "+snapshot.key);
      const hash = crypto.createHash('sha256').update(snapshot.key).digest('hex');
      const key = snapshot.key;
      console.log("Hash: "+hash);
      const args = [hash, key];
      const python = spawn('python', ['test.py', hash, key]);
    }
    
});
