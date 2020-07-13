/*const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const admin = require('firebase-admin');
const serviceAccount = require("./keys/admin.json");


 admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mediasalone.firebaseio.com"
});

var db = firebase.firestore();

var events = [
    {
        "confirmed":
        {
            "value":82,
            "detail":"https://covid19.mathdro.id/api/countries/Sierra Leone/confirmed"
        },
        "recovered":
        {
            "value":10,
            "detail":"https://covid19.mathdro.id/api/countries/Sierra Leone/recovered"
        },
            
        "deaths":{
            "value":2,
            "detail":"https://covid19.mathdro.id/api/countries/Sierra Leone/deaths"
        },
            "timestamp":"2020-04-25T19:30:31.000Z"
        
    }    
];

events.forEach(function(obj) {
    db.collection("covid19").add({
        id: "local",
        name: obj.name,
        description: obj.description,
        category: obj.category,
        imageUrl: obj.imageUrl,
        venue: obj.venue,
        startDateTime: obj.startDateTime,
        endDateTime: obj.endDateTime,
        host: obj.host,
        hostUID: obj.hostUID,
        isFlagged: obj.isFlagged,
        isVerified: obj.isVerified,
        tags: obj.tags    
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});
 */

