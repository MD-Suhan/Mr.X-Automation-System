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
    // search for baseUrl or api endpoints
    const apiMatches = code.match(/baseUrl:["'\`][^"'\`]+["'\`]|["'\`]\/(?:api|v[0-9]|products?|categories?)\/[^"'\`]+/gi) || [];
    if (apiMatches.length > 0) {
      console.log('API endpoints in', chunk, [...new Set(apiMatches)].slice(0, 15));
    }
  }
}
run();
