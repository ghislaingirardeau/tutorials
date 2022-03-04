const webPush = require('web-push');

const publicVapidKey = process.env.TUTO_SW_PUBLIC;
const privateVapidKey = process.env.TUTO_SW_PRIVATE;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);


exports.pushNotif = async (req, res, next) => {
    const subscription = req.body
    console.log(subscription);
    res.status(201).json('notification sent');

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
}