import http from 'http';

const cases = [
  'http://localhost:5000/api/exams',
  'http://localhost:5000/api/exams?category=Admit%20Card',
  'http://localhost:5000/api/exams?category=Results',
  'http://localhost:5000/api/exams?category=Upcoming%20Exams',
  'http://localhost:5000/api/exams?search=Civil',
  'http://localhost:5000/api/exams?org=JPSC',
  'http://localhost:5000/api/exams?category=Admit%20Card&search=Lecturer'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`URL: ${url} -> Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          console.log(`  Success: ${parsed.success}, Count: ${parsed.exams?.length || 0}`);
          if (!parsed.success) {
            console.log(`  Error: ${parsed.message}`);
          }
        } catch (e) {
          console.log(`  Failed to parse JSON. Raw length: ${data.length}`);
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`URL: ${url} -> Request Error: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const c of cases) {
    await testUrl(c);
  }
}

run();
