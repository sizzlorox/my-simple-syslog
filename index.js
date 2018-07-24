const fs = require('fs');
const stdio = require('stdio');
const monthReg = '((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))';
const whiteSpaceReg = '(\\s+)';
const digitReg = '(\\d)';
const timeReg = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';
const ipReg = '(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})';
// const macReg = '(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+';

const datePattern = new RegExp(monthReg + whiteSpaceReg + digitReg + digitReg + whiteSpaceReg + timeReg, 'g');
const ipPattern = new RegExp(ipReg, 'g');
// const macPattern = new RegExp(macReg, 'g');
let lastLine;
let logPath = '';

stdio.question('Path to log to visualize (ex: /var/log/router.log): ', function (err, value) {
  if (err) {
    return console.log(err);
  }
  if (value) {
    logPath = value;
  } else {
    return console.log('No path');
  }
});

fs.watchFile(logPath, function (event) {
  fs.readFile(logPath, 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const lines = data.trim().split("\n");
    lastLine = lastLine ? lastLine : lines.length - 25;
    console.log(`Last Line: ${lastLine} - LineLength: ${lines.length}`);
    lines.slice(lastLine, lines.length).forEach((line) => {
      const date = line.match(datePattern);
      const ipAddresses = line.match(ipPattern);
      // const macAddresses = line.match(macPattern);
      const src = ipAddresses[0];
      // const destination = ipAddresses[1];
      const message = line.split(`${ipAddresses[0]} `)[1];
      console.log(`.-----------------------------------------------------------------------------------------.
| Date: ${date} Source: ${src.padEnd(58, ' ')}|
|-----------------------------------------------------------------------------------------|
| Message: ${message.padEnd(79, ' ')}|
.-----------------------------------------------------------------------------------------.
`);
    });
  });
});