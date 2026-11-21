const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MARK = `<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#0b7a75" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 2.5l12 7v13l-12 7-12-7v-13z"/><path d="M11 11.5h10l-10 9h10"/><circle cx="21" cy="20.5" r="1.6" fill="#0b7a75" stroke="none"/></svg>`;
const SOC = `<a href="https://www.instagram.com/devpatra07/?hl=en" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.3 6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg></a><a href="https://www.linkedin.com/in/dev-patra-78711a223/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 9.5h4v11H3v-11zm7 0h3.8v1.6h.1c.6-1 1.9-2 3.9-2 4.1 0 4.7 2.6 4.7 6v5.4h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.1h-4v-11z"/></svg></a><a href="https://github.com/devpatra07" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 015 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z"/></svg></a><a href="mailto:patradev77@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.2L4.5 7v10h15V7L12 12.2zM5.5 7L12 11.3 18.5 7h-13z"/></svg></a><a href="https://devpatra07.github.io/" target="_blank" rel="noopener" aria-label="Website"><svg class="st" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg></a>`;
function chrome(a) {
  const L = [["index.html", "Home"], ["platform.html", "Platform"], ["science.html", "Science"], ["pricing.html", "Pricing"]];
  $("nav").innerHTML = `<a class="logo" href="index.html">${MARK}Necrovix</a>` + L.map(l => `<a class="l ${l[1] === a ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("") + `<button class="ib" id="theme" aria-label="Toggle light and dark theme">◐</button><a class="btn" href="pricing.html#contact">Contact</a>`;
  const rt = document.documentElement; try { const t = localStorage.getItem("zt"); if (t) rt.dataset.theme = t; } catch (e) {}
  $("theme").onclick = () => { const d = rt.dataset.theme === "dark" ? "light" : "dark"; rt.dataset.theme = d; try { localStorage.setItem("zt", d); } catch (e) {} };
  if (!$("pbar")) { const b = document.createElement("div"); b.id = "pbar"; b.className = "bar"; document.body.prepend(b); }
  $("foot").innerHTML = `<div class="ft"><div><a class="logo" href="index.html">${MARK}Necrovix</a><p class="note">Ask about materials, catalysts and plants. Answers come with sources.</p><p class="built">Built by a student of <b>ICT Mumbai</b> and <b>IIT Bombay</b>.</p></div><div class="fr"><div class="soc">${SOC}</div><a class="btn alt" href="https://devpatra07.github.io/" target="_blank" rel="noopener">Visit devpatra07.github.io ↗</a></div></div><div class="fb"><span>© 2026 Necrovix · <a href="mailto:patradev77@gmail.com">patradev77@gmail.com</a></span><a href="#nav">↑ Back to top</a></div>`;
}
function model(R, c, T, P, L, h2k, grid) {
  const t50 = R.t50 + R.ps * Math.log10(P / R.p0), xeq = 1 / (1 + Math.exp((T - t50) / R.w));
  const k = 1.2 * c.act * L * Math.exp(-R.ea * 1000 / 8.314 * (1 / (T + 273.15) - 1 / (R.tref + 273.15)));
  const x = xeq * (1 - Math.exp(-k)), y = 0.98 * (1 - Math.exp(-4 * x));
  const kwh = (R.comp * Math.log(P) / Math.log(100) + R.heat * (T - 25) / 400) * (0.6 + 0.4 * Math.min(3, 0.25 / Math.max(x, 0.05)));
  const h2kg = R.h2 * 0.98 / Math.max(y, 0.02), g = GRIDS[grid], s = H2SRC[h2k];
  const h2c = h2kg * (h2k === "grid" ? 50 * g.price + 1.5 : s.cost), ec = kwh * g.price, catC = c.price * 5 * L / (c.life * 365);
  const cost = h2c + ec + catC + R.opex, co2 = (kwh * g.ef + h2kg * (s.ef === null ? 50 * g.ef : s.ef)) / 1000;
  return { x, y, kwh, cost, co2, catC, h2kg, h2c, ec, profit: R.price - cost };
}
function best(R, o) {
  let b = null;
  R.cats.forEach((c, ci) => { if (o.only && !o.only.includes(ci)) return;
    for (let T = R.T[0]; T <= R.T[1]; T += 10) for (let P = R.P[0]; P <= R.P[1]; P += Math.max(1, Math.round((R.P[1] - R.P[0]) / 20))) {
      const m = model(R, c, T, P, o.L, o.h2, o.grid), sc = o.obj === "profit" ? m.profit : o.obj === "co2" ? -m.co2 : m.y;
      if (!b || sc > b.sc) b = { sc, ci, T, P, m };
    } });
  return b;
}
const elOf = c => (c.n.match(/[A-Z][a-z]?/) || ["Fe"])[0];
async function getJ(u, o) { const r = await fetch(u, { ...o, signal: AbortSignal.timeout(9000) }); if (!r.ok) throw new Error(r.status); return r.json(); }
const pubchem = async R => (await getJ(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${R.pubchem}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`)).PropertyTable.Properties[0];
const cathub = async el => (await getJ("https://api.catalysis-hub.org/graphql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: `{reactions(first:6, surfaceComposition:"${el}"){edges{node{Equation reactionEnergy facet}}}}` }) })).data.reactions.edges.map(e => e.node);
const papers = async (q, n = 5) => (await getJ(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&filter=from_publication_date:2022-01-01&sort=cited_by_count:desc&per-page=${n}&select=display_name,publication_year,doi,cited_by_count`)).results;
function animateNums(el) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.querySelectorAll("b").forEach(b => {
    const t = b.textContent, m = t.match(/-?\d+(\.\d+)?/); if (!m) return;
    const to = +m[0], dec = m[1] ? m[1].length - 1 : 0, t0 = performance.now();
    (function f(n) { const p = Math.min(1, (n - t0) / 700), e = 1 - Math.pow(1 - p, 3); b.textContent = t.replace(m[0], (to * e).toFixed(dec)); if (p < 1) requestAnimationFrame(f); })(t0);
  });
}
