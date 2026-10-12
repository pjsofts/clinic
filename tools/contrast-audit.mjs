// WCAG contrast audit of key text/background pairs for every theme (optionally with ?style=).
// Usage: start Chrome with --remote-debugging-port=9333, serve site/ (e.g. `python3 -m http.server 8080 -d site`), then
//   node tools/contrast-audit.mjs http://127.0.0.1:8080 [style]
// Reports every pair under 4.5:1. The ocean hero eyebrow sits on a gradient and is skipped (checked by hand).
const [, , base, style = ''] = process.argv;
const target = await (await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); };
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable'); await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.navigate', { url: base + '/themes.html' }); await new Promise(r => setTimeout(r, 1500));
const themes = (await send('Runtime.evaluate', { expression: 'JSON.stringify(CLINIC_THEMES.map(t => t.id))' })).result.value;
const probe = `(() => { try {
  const toRGBA = (v) => { const el = document.createElement('i'); el.style.color = v; document.body.append(el); const c = getComputedStyle(el).color; el.remove();
    let m = c.match(/^rgba?\\(([^)]+)\\)/); if (m) { const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
    m = c.match(/color\\(srgb ([^)]+)\\)/); const p = m[1].split(/[ \\/]+/).filter(Boolean).map(Number); return [p[0]*255, p[1]*255, p[2]*255, p[3] ?? 1]; };
  const over = (fg, bg) => fg[3] >= 1 ? fg : [0,1,2].map(i => fg[i]*fg[3] + bg[i]*(1-fg[3])).concat(1);
  const L = (c) => { const [r,g,b] = c.slice(0,3).map(v => { v/=255; return v <= .03928 ? v/12.92 : ((v+.055)/1.055)**2.4; }); return .2126*r+.7152*g+.0722*b; };
  const cr = (fg, bg) => { const a = L(fg), b = L(bg); return (Math.max(a,b)+.05)/(Math.min(a,b)+.05); };
  const cs = getComputedStyle(document.documentElement); const v = (n) => toRGBA(cs.getPropertyValue(n).trim());
  const bg = v('--bg'), alt = over(v('--bg-alt'), bg), surf = over(v('--surface'), bg);
  const col = (sel, prop = 'color') => { const el = document.querySelector(sel); return el ? toRGBA(getComputedStyle(el)[prop]) : null; };
  const pairs = {
    'text/bg': [v('--text'), bg], 'muted/bg': [v('--muted'), bg], 'muted/alt': [v('--muted'), alt], 'muted/surface': [v('--muted'), surf],
    'btn': [v('--on-primary'), v('--primary')], 'primary/bg': [v('--primary'), bg], 'primary/surface': [v('--primary'), surf],
    'eyebrow': getComputedStyle(document.querySelector('.hero')).backgroundImage.includes('linear-gradient(to left') ? [null, null] : [col('.eyebrow'), over(col('.eyebrow', 'backgroundColor'), bg)], 'role': [col('.therapist .role'), surf],
    'tag': [col('.tags li'), over(col('.tags li', 'backgroundColor'), surf)],
    'chip-on': [col('.chip[aria-pressed=true]'), over(col('.chip[aria-pressed=true]', 'backgroundColor'), alt)],
    'footer': [v('--footer-text'), v('--footer-bg')], 'notice': [v('--text'), over(v('--notice-bg'), alt)],
  };
  const out = {}; for (const [k, [f, b]] of Object.entries(pairs)) if (f && b) out[k] = +cr(over(f, b), b).toFixed(2);
  return JSON.stringify(out);
} catch (e) { return JSON.stringify({ error: String(e) }); } })()`;
const fails = [];
for (const t of JSON.parse(themes)) {
  await send('Page.navigate', { url: `${base}/?theme=${t}${style ? '&style=' + style : ''}` }); await new Promise(r => setTimeout(r, 3000));
  const res = JSON.parse((await send('Runtime.evaluate', { expression: probe })).result.value);
  if (res.error) { console.log(t.padEnd(10), 'ERROR', res.error); continue; }
  const bad = Object.entries(res).filter(([, r]) => r < 4.5).map(([k, r]) => `${k} ${r}`);
  console.log(t.padEnd(10), bad.length ? 'FAIL: ' + bad.join(', ') : 'ok');
  if (bad.length) fails.push(t);
}
console.log(`\n${fails.length} theme(s) with pairs under 4.5:1`);
ws.close();
