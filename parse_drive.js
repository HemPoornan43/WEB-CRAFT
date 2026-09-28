const fs = require('fs');
const html = fs.readFileSync('d:/yuva/drive.html', 'utf8');

// Look for file names ending in .csv, .xlsx, .json, .pdf, etc. or Drive folder data patterns
const regex = /"([a-zA-Z0-9_-]{25,})",\["([^"]+\.(?:csv|xlsx|json|pdf|tsv|txt))"/gi;
let m;
const files = [];
while ((m = regex.exec(html)) !== null) {
  files.push({ id: m[1], name: m[2] });
}
console.log('Found with extension:', files);

// Let's also search for section names or any mentions of Section / timetable
const secRegex = /Section[^"<>\\/]+/gi;
console.log('Section mentions:', [...new Set(html.match(secRegex) || [])].slice(0, 20));

// Let's also look for any title or item names in JS objects
const titles = [...html.matchAll(/\["([^"]{5,80})",[0-9]+,[0-9]+,[0-9]+,\["([a-zA-Z0-9_-]{25,})"/g)];
console.log('Titles found:', titles.slice(0, 20).map(t => ({ title: t[1], id: t[2] })));
