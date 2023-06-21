const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const jQuery = require('jquery');
const jsdom = require('jsdom');

const crypto = require('crypto');
const Iconv = require('iconv').Iconv;

const app = express();

let isDisableKeepAlive = false
app.use((req, res, next) => {
  if (isDisableKeepAlive) res.set('Connection', 'close');
  next();
})
app.use(fileUpload());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/decrypt', (req, res) => {
  if (!req.files.paper) {
    res.send('No file specified.');
    return;
  }
  if (!req.body.password) {
    res.send('No password specified.');
    return;
  }

  jsdom.env(
    req.files.paper.data.toString(),

    function (err, window) {
      const $ = jQuery(window);

      const encrypted = $("input[name*='_viewData']").attr('value');

      try {
        let decrypted = decryptPayPaper(req.body.password, encrypted);

        // hack: force replace 'EUC-KR' => 'UTF-8'
        decrypted = decrypted.replace('EUC-KR', 'UTF-8');

        // send response
        res.send(decrypted);
      } catch (e) {
        // console.log(e.message)
        res.send(e.message);
      }
    },
  );
});

app.listen(process.env.PORT || 8282, () => {
  process.send('ready')
  console.log(`application is listening on port: ${process.env.PORT}...`)
});

process.on('SIGINT', () => {
  isDisableKeepAlive = true
  app.close(() => {
    console.log('server closed')
    process.exit(0)
  })
})

function decryptPayPaper(password, encrypted) {
  // read blob from base64 encoded string
  var blob = Buffer.from(encrypted, 'base64');

  // find Initialization Vector, Salt, Content from Encrypted blob
  // ref : http://www.jensign.com/JavaScience/dotnet/DeriveBytes/
  var IV = blob.subarray(56 + 2, 56 + 2 + 8);
  var salt = blob.subarray(66 + 2, 66 + 2 + 16);

  var content = blob.subarray(84 + 4, blob.length);

  // convert password into UNICODE string
  var iconv = new Iconv('utf-8', 'UTF-16LE');
  password = Buffer.from(password);
  password = iconv.convert(password);

  var key = hashSaltPassword(salt, password);

  // decrypt
  var decipher = crypto.createDecipheriv('rc2-cbc', key, IV);
  var decrypted1 = decipher.update(content);
  var decrypted2 = decipher.final();

  var decrypted = Buffer.concat([decrypted1, decrypted2]);

  // convert 'decrypted' to utf8 string, from utf-16 Little Endian
  var iconv = new Iconv('UTF-16LE', 'utf-8');
  var decryptedUtf8 = iconv.convert(decrypted).toString();

  return decryptedUtf8;
}

function hashSaltPassword(salt, password) {
  const hash = crypto.createHash('SHA1');

  hash.update(password);
  hash.update(salt);

  var saltedKey = hash.digest().subarray(0, 16);
  return saltedKey;
}
