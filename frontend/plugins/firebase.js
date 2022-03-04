import { initializeApp, getApps} from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: "AIzaSyBLnHNJdZknby9T4J6UT4Kb5BYDBLLG95A",
    authDomain: "notification-test-32c2d.firebaseapp.com",
    projectId: "notification-test-32c2d",
    storageBucket: "notification-test-32c2d.appspot.com",
    messagingSenderId: "522260320487",
    appId: "1:522260320487:web:fabac123a7de23e17bd242"
};


const apps = getApps()

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0]

export const messaging = getMessaging(app)