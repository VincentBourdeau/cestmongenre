import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/performance'
import 'firebase/analytics'
import 'firebase/functions'

// The configuration below is not sensitive data. You can serenely add your config here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_GOOGLE_API,
  authDomain: 'feminin-masculin.firebaseapp.com',
  projectId: 'feminin-masculin',
  storageBucket: 'feminin-masculin.appspot.com',
  messagingSenderId: '596446256067',
  appId: '1:596446256067:web:d37d12dadc0f3b88f0fb76',
  measurementId: 'G-2TZ0DQ4NC3'
}

firebase.initializeApp(firebaseConfig)

// Enable libs
const perf = firebase.performance()
const analytics = firebase.analytics()
const functions = firebase.functions()

export { functions, perf, analytics }
