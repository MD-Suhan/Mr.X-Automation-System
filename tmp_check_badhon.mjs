import https from 'node:https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const html = await fetchUrl('https://badhonsworld.com/');
  const jsMatches = html.match(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g) || [];
  console.log('JS Chunks:', jsMatches);

  for (const m of jsMatches.slice(0, 5)) {
    const chunkPath = m.replace('src="', '').replace('"', '');
    const chunkData = await fetchUrl('https://badhonsworld.com' + chunkPath);
    const backendMatches = chunkData.match(/https?:\/\/[a-zA-Z0-9.-]+(?::[0-9]+)?\/[a-zA-Z0-9/_-]*(?:api|product|category)[a-zA-Z0-9/_-]*/gi) || [];
    if (backendMatches.length > 0) {
      console.log('Found endpoints in', chunkPath, backendMatches);
    }
    // Also look for NEXT_PUBLIC or env or base url
    const baseUrlMatch = chunkData.match(/https?:\/\/[a-zA-Z0-9.-]+\.com/gi) || [];
    const valid = baseUrlMatch.filter(u => !u.includes('w3.org') && !u.includes('badhonsworld.com') && !u.includes('google'));
    if (valid.length > 0) {
      console.log('External hosts:', [...new Set(valid)]);
    }
  }
}
run();
