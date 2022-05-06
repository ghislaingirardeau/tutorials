import { initializeApp, getApps} from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
    apiKey: "AIzaSyCAdzvIYwTXrf139FyQScXbBKrR5t4fkcY",
    authDomain: "my-database-project-1f237.firebaseapp.com",
    projectId: "my-database-project-1f237",
    storageBucket: "my-database-project-1f237.appspot.com",
    messagingSenderId: "86336628395",
    databaseURL: "https://my-database-project-1f237-default-rtdb.europe-west1.firebasedatabase.app/",
    appId: "1:86336628395:web:eea9b92f1eea075dcbb9ee"
};

const apps = getApps()

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0]

export const messaging = getMessaging(app)

/* https://my-database-project-1f237-default-rtdb.europe-west1.firebasedatabase.app/
apiKey: "AIzaSyBLnHNJdZknby9T4J6UT4Kb5BYDBLLG95A",
    authDomain: "notification-test-32c2d.firebaseapp.com",
    databaseURL: "https://notification-test-32c2d-default-rtdb.asia-southeast1.firebaseio.com",
    databaseURL: "https://my-database-project-1f237-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "notification-test-32c2d",
    storageBucket: "notification-test-32c2d.appspot.com",
    messagingSenderId: "522260320487",
    appId: "1:522260320487:web:fabac123a7de23e17bd242"
*/