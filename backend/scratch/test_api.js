import http from 'http';

http.get('http://localhost:5000/api/exams', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      if (parsed.success) {
        console.log('Exams returned:', parsed.exams.length);
        console.log('Sample exam keys:', Object.keys(parsed.exams[0]));
        console.log('Sample categories:', [...new Set(parsed.exams.map(e => e.category))]);
      } else {
        console.log('Error message:', parsed.message);
      }
    } catch (err) {
      console.error('Failed to parse JSON:', err.message);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('HTTP Request Error:', err.message);
});
