// Netlify Function: proxies Upstox historical-candle requests server-to-server,
// so the browser never has to call api.upstox.com directly (avoids CORS block).
exports.handler = async function (event) {
  const params = event.queryStringParameters || {};
  const { instrumentKey, from, to } = params;
  const auth = event.headers.authorization || event.headers.Authorization;

  if (!auth) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: 'Missing Authorization header' })
    };
  }
  if (!instrumentKey || !from || !to) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: 'Missing instrumentKey, from, or to' })
    };
  }

  const upstoxUrl = `https://api.upstox.com/v3/historical-candle/${encodeURIComponent(instrumentKey)}/days/1/${to}/${from}`;

  try {
    const upstream = await fetch(upstoxUrl, {
      headers: { Authorization: auth, Accept: 'application/json' }
    });
    const body = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { 'Content-Type': 'application/json' },
      body
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: 'Proxy request to Upstox failed: ' + err.message })
    };
  }
};
