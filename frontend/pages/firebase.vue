<template>
  <div>
    <h1>Training</h1>
    <v-btn @click="sendEmail"> send email </v-btn>
    <v-btn @click="notifs">notif firebase</v-btn>
    <div>
      <v-btn @click="testServiceWorker">push and service worker</v-btn>
    </div>
    <h1>Test firestore</h1>
    <v-btn @click="postFirestore"> write DB </v-btn>
    <v-btn @click="getFirestore"> read DB </v-btn>
    <h1>Test realtime database</h1>
    <h2>value DB response : {{ RLvalue }}</h2>
    <v-btn @click="postRealTimeDB"> write DB </v-btn>
    <v-btn @click="getRealTimeDB"> read DB </v-btn>
    <v-btn @click="updateRealTimeDB"> update DB </v-btn>
    <v-btn @click="removeRealTimeDB"> remove DB </v-btn>

    <!-- REGISTER BLOCK -->
    <div class="w-1/3 px-12 py-12 my-24 mx-24">
      <form action class="space-y-3">
        <div>
          <h1 class="font-bold text-lg md:text-xl xl:text-2xl tracking-tight">
            Register
          </h1>
        </div>
        <div class="space-y-2">
          <label for="email" class="block font-medium tracking-tight"
            >Email</label
          >
          <input v-model="email" type="email" placeholder="hey@abhishek.com" />
        </div>
        <div class="space-y-2">
          <label for="password" class="block font-medium tracking-tight"
            >Password</label
          >
          <input v-model="password" type="password" placeholder="*********" />
        </div>
        <div class="flex justify-end">
          <v-btn
            color="teal"
            @click="createUser"
            class="
              inline-flex
              items-center
              text-white
              px-5
              py-2
              rounded-lg
              overflow-hidden
              focus:outline-none
              bg-indigo-500
              hover:bg-indigo-600
              font-semibold
              tracking-tight
            "
            >Register</v-btn
          >
        </div>
      </form>
    </div>

    <!-- LOGIN BLOCK -->
    <div class="w-1/3 px-12 py-12 my-24 mx-24">
      <form action class="space-y-3">
        <div>
          <h1 class="font-bold text-lg md:text-xl xl:text-2xl tracking-tight">
            Login
          </h1>
          <h2>The user log : {{user}} </h2>
        </div>
        <div class="space-y-2">
          <label for="email" class="block font-medium tracking-tight"
            >Email</label
          >
          <input v-model="email" type="email" placeholder="hey@abhishek.com" />
        </div>
        <div class="space-y-2">
          <label for="password" class="block font-medium tracking-tight"
            >Password</label
          >
          <input v-model="password" type="password" placeholder="*********" />
        </div>
        <div class="flex justify-end">
          <v-btn
            @click="loginUser"
            color="teal"
            class="
              inline-flex
              items-center
              text-white
              px-5
              py-2
              rounded-lg
              overflow-hidden
              focus:outline-none
              bg-indigo-500
              hover:bg-indigo-600
              font-semibold
              tracking-tight
            "
            >Login</v-btn
          >
        </div>
      </form>
    </div>

    <div>
      <v-btn @click="updateUser" color="teal">update User</v-btn>
      <v-btn @click="logoutUser" color="teal">logout</v-btn>
    </div>
  </div>
</template>

<script>
import { getAuth, signInAnonymously } from "firebase/auth";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { messaging } from "@/plugins/firebase";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      RLvalue: undefined,
      email: "gege@mail.com",
      password: "qwerty1",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["currentUser"]),

    // NUXT FIREBASE AUTH
    async createUser() {
      console.log("stArted");
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        console.log(
          "Register success",
          "add the redirect home page with router push"
        );
      } catch (e) {
        console.log("Error on register");
      }
    },
    async loginUser() {
      console.log("stArted");
      let formData = {
        email: this.email,
        password: this.password
      }
      this.currentUser(formData)
    },
    async updateUser() {
      // when it's currently connected
      // All methods for update, delete, confirm
      // https://firebase.google.com/docs/auth/web/manage-users?hl=fr&authuser=0
      // currentUser.updateEmail('gg@mail') => methods to update email
      // currentUser.sendEmailVerification => methods to send a verification email
      await this.$fire.auth.currentUser
        .updateProfile({
          displayName: "gege user",
        })
        .then(() => {
          console.log("Profile updated!");
        })
        .catch((error) => {
          console.log("Faile Profile updated ");
        });
    },
    async logoutUser() {
      try {
        this.$fire.auth.signOut();
        // action define inside the user listener
      } catch (error) {}
    },
    // NUXT FIREBASE REALTIME DB
    async getRealTimeDB() {
      const messageRef = this.$fire.database.ref("object");
      console.log(messageRef);
      try {
        messageRef.once("value", function (snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var data = childSnapshot.val();
            console.log(key, data);
          });
        });
        /* const snapshot = await messageRef.get('value')
          this.RLvalue = snapshot.val() */
      } catch (e) {
        alert(e);
      }
    },
    async postRealTimeDB() {
      // CREATE A NEW DATA
      const messageRef = this.$fire.database.ref("object");
      try {
        await messageRef.set({
          id: "1",
          name: "my first object",
          content: "object description",
        });
        console.log("success");
      } catch (e) {
        return;
      }
    },
    async updateRealTimeDB() {
      const messageRef = this.$fire.database.ref("message");
      try {
        // UPDATE ONLY ONE VALUE INSIDE THE OBJECT
        /* await messageRef.child('/update').update({
            name: 'i update only name',
          }) */
        // UPDATE A DATA / WILL CREATE ONE IF DOESN'T EXIST YET
        await messageRef.child("/update").update({
          id: "4",
          name: "MY NEW UPDATE",
          content: "update description",
          postID: ["a", "b", "c"],
        });
        // INSERT A NEW NODE WITH AUTO ID
        /* await messageRef.push({
            text: 'new text add'
          }) */
        console.log("success");
        const snapshot = await messageRef.get("value");
        console.log(snapshot.val());
        this.RLvalue = snapshot.val();
      } catch (e) {
        console.log(e);
        return;
      }
    },
    async removeRealTimeDB() {
      const messageRef = this.$fire.database.ref("object");
      try {
        await messageRef.child("id").remove();
        console.log("success");
        const snapshot = await messageRef.get("value");
        console.log(snapshot.val());
        this.RLvalue = snapshot.val();
      } catch (e) {
        console.log(e);
        return;
      }
    },
    // NUXT FIREBASE FIRESTORE
    async postFirestore() {
      const citiesRef = this.$fire.firestore.collection("villes");

      await citiesRef.doc("SF").set({
        name: "San Francisco",
        state: "CA",
        country: "USA",
        capital: false,
        population: 860000,
      });
      await citiesRef.doc("LA").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA",
        capital: false,
        population: 3900000,
      });
      await citiesRef.doc("DC").set({
        name: "Washington, D.C.",
        state: null,
        country: "USA",
        capital: true,
        population: 680000,
      });
      await citiesRef.doc("TOK").set({
        name: "Tokyo",
        state: null,
        country: "Japan",
        capital: true,
        population: 9000000,
      });
      await citiesRef.doc("BJ").set({
        name: "Beijing",
        state: null,
        country: "China",
        capital: true,
        population: 21500000,
      });
      console.log("post to firestore");
    },
    async getFirestore() {
      const cityRef = this.$fire.firestore.collection("villes").doc("TOK");
      console.log(cityRef);
      const doc = await cityRef.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        console.log("Document data:", doc.data());
      }
    },
    // SERVER SIDE : SEND EMAIL
    async sendEmail() {
      this.$axios
        .$get("http://localhost:8000/api/email", {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
        });
    },
    // FIREBASE WITHOUT NUXT NOTIFICATION
    async notifs() {
      await signInAnonymously(getAuth());
      this.activate();
    },
    async activate() {
      const token = await getToken(messaging, {
        vapidKey:
          "BIT7KGJsMGEk14QRS8m2tmLvA_0HJyhVJ-lOzYfhu4C5ajAXJfUKgAdldqoxvIFX4yxrwZx_4-hWJmBH_cpXZXo",
      });
      if (token) {
        console.log(token);
      }
    },
    // FIREBASE WITHOUT NUXT SERVICE WORKER
    async testServiceWorker() {
      function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      const publicVapidKey =
        "BOQfBurRCItoXzGcuYd11z4xvpipGBf09mTlKygsOTyMBU1O8rgZIOsm2TcrlLIeVuojBGwr5prkI5kwqzyzE7s";
      console.log(publicVapidKey);
      if ("serviceWorker" in navigator) {
        const register = await navigator.serviceWorker.register("sw.js", {
          scope: "/",
        });
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await this.$axios
          .$post(
            "http://localhost:8000/api/subscribe",
            JSON.stringify(subscription),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response);
          });
      } else {
        console.error("Service workers are not supported in this browser!");
      }
    },
  },
  mounted() {
    const messaging = getMessaging();

    onMessage(messaging, (playload) => {
      console.log("message on client", playload);
    });
  },
};
</script>

<style lang="scss" scoped>
</style>
