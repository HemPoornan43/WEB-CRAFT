const fs = require('fs');
const html = fs.readFileSync('d:/yuva/drive.html', 'utf8');

// Search for AF_initDataCallback
const regex = /AF_initDataCallback\((.*?)\);<\/script>/gs;
let match;
let i = 0;
while ((match = regex.exec(html)) !== null) {
  i++;
  console.log(`Callback ${i} length:`, match[1].length);
  fs.writeFileSync(`d:/yuva/callback_${i}.txt`, match[1]);
}
console.log(`Found ${i} callbacks`);
