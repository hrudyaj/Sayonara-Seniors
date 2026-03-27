// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMFCbhqN4C_OktRjOvo88DwQvc1GfyULQ",
  authDomain: "sayonara-seniors-5ccec.firebaseapp.com",
  databaseURL: "https://sayonara-seniors-5ccec-default-rtdb.firebaseio.com",
  projectId: "sayonara-seniors-5ccec",
  storageBucket: "sayonara-seniors-5ccec.firebasestorage.app",
  messagingSenderId: "692848207815",
  appId: "1:692848207815:web:dcfb05d0968eb07b53dbe2",
  measurementId: "G-FG1JSXHR8Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
