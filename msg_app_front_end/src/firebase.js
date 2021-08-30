import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAvPqzfnJ1ei0_SKBNzHpBm_ekSKbC0HCE",
    authDomain: "psj-msgapp.firebaseapp.com",
    projectId: "psj-msgapp",
    storageBucket: "psj-msgapp.appspot.com",
    messagingSenderId: "839576582844",
    appId: "1:839576582844:web:914f64b57a68ddd2316eb9"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth,provider };
  export default db ;