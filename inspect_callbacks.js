const fs = require('fs');
for (let i = 1; i <= 5; i++) {
  const content = fs.readFileSync(`d:/yuva/callback_${i}.txt`, 'utf8');
  console.log(`=== Callback ${i} ===`);
  // Look for any filenames or spreadsheet names
  const strings = content.match(/"([^"\\]{4,80})"/g) || [];
  const clean = strings.map(s => s.slice(1, -1)).filter(s => !s.startsWith('http') && !s.includes('/') && !s.includes('\\') && (s.toLowerCase().includes('section') || s.toLowerCase().includes('timetable') || s.toLowerCase().includes('attendance') || s.toLowerCase().includes('class') || s.toLowerCase().includes('vibecraft') || s.endsWith('.csv') || s.endsWith('.xlsx')));
  console.log('Filtered strings:', [...new Set(clean)]);
}
