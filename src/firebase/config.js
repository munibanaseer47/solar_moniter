// src/firebase/config.js
import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAIPa3XCF-mIiqT7rKNygWjTB99iBwC2_A",
  authDomain: "solarinvertermonitor-89db0.firebaseapp.com",
  databaseURL: "https://solarinvertermonitor-89db0-default-rtdb.firebaseio.com/",
  projectId: "solarinvertermonitor-89db0",
  storageBucket: "solarinvertermonitor-89db0.appspot.com",
  messagingSenderId: "3596373236",
  appId: "1:3596373236:android:a963e09456644fa042a2a1"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize Firebase services
const firebaseAuth = auth();
const firebaseDatabase = database();

export { firebaseAuth, firebaseDatabase };