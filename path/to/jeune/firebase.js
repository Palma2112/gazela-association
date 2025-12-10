// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBMXFG1hRdZgottPlkTUTT0KacyXD70TA",
  authDomain: "gazela-31196.firebaseapp.com",
  projectId: "gazela-31196",
  storageBucket: "gazela-31196.appspot.com",
  messagingSenderId: "684160987114",
  appId: "1:684160987114:web:36bc996595b5bdc4a60c93",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
