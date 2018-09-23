import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyB072RmWt3i4Tz-ne5JlpAP78JVtEBdfUY",
  authDomain: "ismails-kanban.firebaseapp.com",
  databaseURL: "https://ismails-kanban.firebaseio.com",
  projectId: "ismails-kanban",
  storageBucket: "",
  messagingSenderId: "168490831657"
};

firebase.initializeApp(config);

const db = firebase.database()

export default db