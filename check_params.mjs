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
  const html = await fetchChunk('https://badhonsworld.com/');
  const chunks = [...html.matchAll(/src="(\/_next\/static\/chunks\/[a-zA-Z0-9.-]+\.js)"/g)].map(m => m[1]);
  for (const chunk of chunks) {
    const code = await fetchChunk('https://badhonsworld.com' + chunk);
    const pos = code.indexOf('/product?');
    if (pos !== -1) {
      console.log('Found /product? in', chunk);
      console.log(code.substring(Math.max(0, pos - 100), Math.min(code.length, pos + 300)));
    }
  }
}
run();
