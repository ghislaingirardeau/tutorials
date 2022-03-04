self.addEventListener('push', event => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: 'Yay it works, this is my notif',
    });
});
self.addEventListener("activate", event => {
    console.log('WORKER: activate event in progress.');
});