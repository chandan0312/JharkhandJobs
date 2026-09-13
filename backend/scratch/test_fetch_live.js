import https from 'https';
import fs from 'fs';
import path from 'path';

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const main = async () => {
  try {
    console.log('Fetching government-jobs page...');
    const govHtml = await fetchUrl('https://www.freejobalert.com/government-jobs/');
    console.log('government-jobs page length:', govHtml.length);
    fs.writeFileSync('scratch/gov_jobs_live.html', govHtml);
    console.log('Saved scratch/gov_jobs_live.html');

    console.log('Fetching jharkhand-government-jobs page...');
    const jhHtml = await fetchUrl('https://www.freejobalert.com/jharkhand-government-jobs/');
    console.log('jharkhand-government-jobs page length:', jhHtml.length);
    fs.writeFileSync('scratch/jh_jobs_live.html', jhHtml);
    console.log('Saved scratch/jh_jobs_live.html');
  } catch (err) {
    console.error('Error fetching live data:', err);
  }
};

main();
