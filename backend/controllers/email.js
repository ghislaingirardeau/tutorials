const nodemailer = require("nodemailer");

exports.send = async (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_TEST_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_TEST_USER, // adresse email ici
            pass: process.env.EMAIL_TEST_PASSWORD, // mon mot de passe 
        },
    });
    try {
        let info = await transporter.sendMail({
            from: '"<xyz@example.fr>', // sender address
            to: "xyz@example.fr", // list of receivers
            subject: "Hello ", // Subject line
            html: "<h1>Hello ceci est le titre<h1/><p>Je suis le contenu du message</p>"
        });
        console.log(info);
        res.status(200).send("Message sent")
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}