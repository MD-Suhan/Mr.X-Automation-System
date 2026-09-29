import https from 'node:https';

function fetchChunk(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const code = await fetchChunk('https://badhonsworld.com/_next/static/chunks/edcbc8b340001d74.js');
  const endpoints = code.match(/["'\`]\/(?:product|category)[^"'\`]+/g) || [];
  console.log('Endpoints in edcbc8b340001d74.js:', [...new Set(endpoints)]);
}
run();
