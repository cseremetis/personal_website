var express = require('express');
var nodemailer = require('nodemailer');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Christian Seremetis' });
});

/* POST to email */
router.post('/email', function(req, res, next) {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS
    }
  });

  let mailOptions = {
      from: process.env.GMAIL,
      to: process.env.GMAIL,
      subject: `new contact message from ${req.body.name}, email: ${req.body.email_address}`,
      text: req.body.content
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error.message);
      }
      console.log('success');
  });

  res.render('index', { title: 'Christian Seremetis' });
});

module.exports = router;
