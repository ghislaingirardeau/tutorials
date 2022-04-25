<template>
  <div>
    <h1>Training</h1>
    <v-btn @click="sendEmail">
      send email
    </v-btn>
    <v-btn @click="notifs">notif firebase</v-btn>
    <div>
      <v-btn @click="testServiceWorker">push and service worker</v-btn>
    </div>
  </div>
</template>

<script>
import {getAuth, signInAnonymously} from 'firebase/auth';
import {getMessaging, onMessage, getToken} from 'firebase/messaging';
import {messaging} from '@/plugins/firebase'

  export default {
    methods: {
      async sendEmail() {
        this.$axios.$get('http://localhost:8000/api/email', {
            headers: {
            "content-type": "application/json",
            },
        })
        .then(response => {
          console.log(response)
        })
      },
      async notifs() {
        await signInAnonymously(getAuth())
        this.activate()
      },
      async activate() {
        const token = await getToken(messaging, {
          vapidKey: 'BIT7KGJsMGEk14QRS8m2tmLvA_0HJyhVJ-lOzYfhu4C5ajAXJfUKgAdldqoxvIFX4yxrwZx_4-hWJmBH_cpXZXo'
        })
        if(token) {
          console.log(token);
        }
      },
      async testServiceWorker() {

          function urlBase64ToUint8Array(base64String) {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
        
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        }

        const publicVapidKey = 'BOQfBurRCItoXzGcuYd11z4xvpipGBf09mTlKygsOTyMBU1O8rgZIOsm2TcrlLIeVuojBGwr5prkI5kwqzyzE7s';
        console.log(publicVapidKey);
        if ('serviceWorker' in navigator) {
          const register = await navigator.serviceWorker.register("sw.js", {
            scope: '/'
          });
          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });
      
          await this.$axios.$post('http://localhost:8000/api/subscribe', JSON.stringify(subscription), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            console.log(response);
          })
        } else {
          console.error('Service workers are not supported in this browser!');
        }
      }
    },
    mounted() {
      const messaging = getMessaging()

      onMessage(messaging, (playload) => {
        console.log('message on client', playload);
      })
    },
  }
</script>

<style lang="scss" scoped>

</style>
