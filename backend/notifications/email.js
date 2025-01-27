var email = {};

email.send = function(emailContent, toEmail, emailSubject){
    const logger = require('npmlog');
    const config = require('config');

    if (!config.has('email')){
        logger.verbose("Notifications[email] - Triggered but not configured");
        return;
    }

    var emailConfig = config.get('email');
    if (!emailConfig.enabled){
        logger.verbose("Notifications[email] - Triggered but not enabled");
        return;
    }

    var emailPort = (typeof(emailConfig.port) === "undefined") ? 25 : emailConfig.port;
    var emailSecure = (typeof(emailConfig.secure) === "undefined") ? false : emailConfig.secure;

    var transportOpts = {
        host: emailConfig.service,
        port: emailPort,
        secure: emailSecure
    };

    if (!emailSecure){
        transportOpts.tls = {
            rejectUnauthorized: false
        }
    }

    if ( (emailConfig.user !== "") && (emailConfig.pass !== "") ){
        transportOpts.auth = {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    }

    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport(transportOpts);

    var mailOptions = {
        from: emailConfig.from,
        to: toEmail,
        subject: emailSubject,
        html: emailContent
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.error("Error sending email to ", mailOptions.to, error);
            return;
        }
        logger.verbose("Email sent: " + info.response);
    });
}

module.exports = email;