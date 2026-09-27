import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
for (const [path, status, text] of [
 ['/', 200, 'A little more'],
 ['/shop?category=audio&sort=price-asc', 200, 'Loyal Halo One'],
 ['/shop?q=not-a-real-product-000', 200, 'Nothing matched those filters'],
 ['/product/halo-one', 200, 'Loyal Halo One'],
 ['/product/not-a-real-product', [200, 404], 'This shelf is empty'],
 ['/checkout', 200, 'Checkout'],
 ['/about', 200, 'Less of everything else'],
 ['/help', 200, 'Good to know'],
 ['/api/health', 200, 'ok'],
 ['/images/headphones.webp', 200, null],
 ['/images/hero-headphones.webp', 200, null],
]) {
 const response = await fetch(new URL(path, origin));
 // Next.js can stream its loading boundary before rendering notFound (HTTP 200).
 assert.ok((Array.isArray(status) ? status : [status]).includes(response.status), `${path}: unexpected status ${response.status}`);
 if (text) {
  const html = await response.text();
  assert.ok(html.includes(text), `${path}: expected content missing`);
  if (Array.isArray(status)) assert.match(html, /name="robots" content="noindex"/);
 }
 console.log(`PASS ${path}`);
}
const health = await (await fetch(new URL('/api/health', origin))).json();
if (health.mode === 'catalog-preview') {
 for (const path of ['/api/orders', '/api/reviews']) {
  const response = await fetch(new URL(path, origin), { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /preview store/);
  console.log(`PASS ${path}: preview submissions correctly blocked`);
 }
}
