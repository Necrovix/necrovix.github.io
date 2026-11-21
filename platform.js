chrome("Platform");
const COL = ["#0b7a75", "#b4541a", "#3b5bdb", "#8a8f98"]; let scen = [];
const ctl = () => ({ R: REACTIONS[$("rx").value], ci: +$("cat").value, T: +$("T").value, P: +$("P").value, L: +$("L").value, cap: +$("cap").value, h2: $("h2").value, grid: $("grid").value });
function setRanges(R) { $("T").min = R.T[0]; $("T").max = R.T[1]; $("T").value = R.T[2]; $("P").min = R.P[0]; $("P").max = R.P[1]; $("P").value = R.P[2]; $("cat").innerHTML = R.cats.map((c, i) => `<option value="${i}">${c.n}</option>`).join(""); }
function lines(cv, S, x0, x1, xl) {
  const g = cv.getContext("2d"), W = cv.width, H = cv.height, p = 44; g.clearRect(0, 0, W, H); g.font = "12px Segoe UI, sans-serif";
  const X = x => p + (W - p - 12) * (x - x0) / (x1 - x0), Y = y => 12 + (H - p - 12) * (1 - y); g.strokeStyle = "#e3e7eb"; g.fillStyle = "#5b6773";
  for (let i = 0; i <= 4; i++) { const y = Y(i / 4); g.beginPath(); g.moveTo(p, y); g.lineTo(W - 12, y); g.stroke(); g.fillText(i * 25 + "%", 6, y + 4); }
  for (let i = 0; i <= 5; i++) { const x = x0 + (x1 - x0) * i / 5; g.fillText(Math.round(x) + xl, X(x) - 14, H - 10); }
  S.forEach((s, i) => { g.strokeStyle = s.c; g.lineWidth = s.w; g.beginPath(); s.d.forEach((q, j) => j ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1]))); g.stroke(); g.fillStyle = s.c; g.fillText(s.n, W - 150, 20 + i * 16); });
}
function render() {
  const s = ctl(), R = s.R, c = R.cats[s.ci], m = model(R, c, s.T, s.P, s.L, s.h2, s.grid);
  $("Tv").textContent = s.T + " °C"; $("Pv").textContent = s.P + " bar"; $("Lv").textContent = s.L + "×"; $("capv").textContent = s.cap + " t/day"; $("title").textContent = R.name + ": " + R.eq;
  const yr = m.profit * s.cap * 330 / 1e6;
  const K = [["Overall yield", (m.y * 100).toFixed(0) + "%", m.y > .8], ["Cost per tonne", "$" + m.cost.toFixed(0), m.cost < R.price], ["Market price", "$" + R.price, null], ["Profit per year", (yr >= 0 ? "$" : "-$") + Math.abs(yr).toFixed(1) + "M", yr >= 0], ["CO₂ per tonne", m.co2.toFixed(2) + " t", m.co2 < 1], ["Energy per tonne", m.kwh.toFixed(0) + " kWh", null]];
  $("kpis").innerHTML = K.map(a => `<div class="kpi"><span>${a[0]}</span><b class="${a[2] === null ? "" : a[2] ? "good" : "bad"}">${a[1]}</b></div>`).join("");
  $("f1").textContent = (m.h2kg * s.cap / 1000).toFixed(0) + " t H₂/day"; $("f2").textContent = s.P + " bar"; $("f3").textContent = s.T + " °C, " + (m.x * 100).toFixed(0) + "% per pass"; $("f4").textContent = "recycle " + ((1 - m.x) * 100).toFixed(0) + "%"; $("f5").textContent = s.cap + " t/day";
  const parts = [["Hydrogen", m.h2c, COL[0]], ["Energy", m.ec, COL[2]], ["Catalyst", m.catC, COL[1]], ["Other operating", R.opex, COL[3]]];
  $("bar").innerHTML = parts.map(p => `<div style="width:${p[1] / m.cost * 100}%;background:${p[2]}" title="${p[0]}"></div>`).join(""); $("leg").innerHTML = parts.map(p => `<span><i style="background:${p[2]}"></i>${p[0]} $${p[1].toFixed(0)}</span>`).join("");
  const rows = R.cats.map((cc, i) => ({ i, cc, m: model(R, cc, s.T, s.P, s.L, s.h2, s.grid) })).sort((a, b) => b.m.profit - a.m.profit);
  $("rows").innerHTML = rows.map(r => `<tr data-i="${r.i}" class="${r.i === s.ci ? "sel" : ""}"><td>${r.cc.n}</td><td>${(r.m.y * 100).toFixed(0)}%</td><td>$${r.m.cost.toFixed(0)}</td><td>$${r.m.catC.toFixed(1)}</td><td>${r.cc.life} yr</td><td>${r.cc.risk}</td></tr>`).join("");
  document.querySelectorAll("#rows tr").forEach(tr => tr.onclick = () => { $("cat").value = tr.dataset.i; render(); live(false); });
  const T0 = R.T[0] - 30, T1 = R.T[1] + 30, A = [], B = [];
  R.cats.forEach((cc, i) => { const w = i === s.ci ? 3 : 1.5, d = [], e = [], y0 = model(R, cc, s.T, s.P, s.L, s.h2, s.grid).y;
    for (let t = T0; t <= T1; t += 5) d.push([t, model(R, cc, t, s.P, s.L, s.h2, s.grid).x]); for (let q = 0; q <= 60; q += 2) e.push([q, y0 * Math.exp(-q / (cc.life * 12))]);
    A.push({ n: cc.n, c: COL[i], w, d }); B.push({ n: cc.n, c: COL[i], w, d: e }); });
  lines($("c1"), A, T0, T1, "°C"); lines($("c2"), B, 0, 60, " mo");
}
function pill(id, ok) { const e = $(id); e.textContent = ok ? "Live" : "Offline"; e.className = "pill " + (ok ? "on" : "off"); }
async function live(chem) {
  const s = ctl(), R = s.R, el = elOf(R.cats[s.ci]), J = [];
  if (chem) J.push((async () => { try { const p = await pubchem(R); $("d1").innerHTML = `${esc(R.product)}: formula ${esc(p.MolecularFormula)}, molecular weight ${esc(p.MolecularWeight)} g/mol, IUPAC name ${esc(p.IUPACName)}.`; pill("s1", 1); } catch (e) { $("d1").textContent = `Could not reach PubChem. Built-in value: ${R.mw} g/mol.`; pill("s1", 0); } })());
  J.push((async () => { try { const e = await cathub(el); $("d2").innerHTML = e.length ? `<table>${e.map(x => `<tr><td>${esc(x.Equation)}</td><td>${esc(x.facet || "")}</td><td>${(+x.reactionEnergy).toFixed(2)} eV</td></tr>`).join("")}</table>` : `No entries for ${esc(el)}.`; pill("s2", 1); } catch (e) { $("d2").textContent = "Could not reach Catalysis-Hub. Try again."; pill("s2", 0); } })());
  J.push((async () => { try { const w = await papers(`${el} catalyst ${R.product} synthesis`); $("d3").innerHTML = w.length ? `<ul class="p">${w.map(x => `<li>${x.doi ? `<a href="${esc(x.doi)}" target="_blank" rel="noopener">${esc(x.display_name)}</a>` : esc(x.display_name)} (${x.publication_year}, cited ${x.cited_by_count})</li>`).join("")}</ul>` : "No papers found."; pill("s3", 1); } catch (e) { $("d3").textContent = "Could not reach OpenAlex. Try again."; pill("s3", 0); } })());
  await Promise.all(J); $("stamp").textContent = "Fetched " + new Date().toLocaleTimeString();
}
function showScen() { $("scen").innerHTML = scen.length ? scen.map(r => `<tr><td>${esc(r.n)}</td><td>${(r.y * 100).toFixed(0)}%</td><td>$${r.cost.toFixed(0)}</td><td>${r.co2.toFixed(2)} t</td><td>${r.yr.toFixed(1)}M</td></tr>`).join("") : `<tr><td colspan="5" class="note">No scenarios yet. Use "Save as scenario".</td></tr>`; }
$("rx").innerHTML = Object.entries(REACTIONS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join("");
$("h2").innerHTML = Object.entries(H2SRC).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("");
$("grid").innerHTML = Object.keys(GRIDS).map(k => `<option>${k}</option>`).join("");
const hp = new URLSearchParams(location.hash.slice(1)); if (REACTIONS[hp.get("rx")]) $("rx").value = hp.get("rx");
setRanges(REACTIONS[$("rx").value]); ["cat", "T", "P"].forEach(k => { if (hp.get(k) !== null) $(k).value = hp.get(k); });
$("rx").onchange = () => { setRanges(REACTIONS[$("rx").value]); render(); live(true); };
$("cat").onchange = () => { render(); live(false); }; ["T", "P", "L", "cap", "h2", "grid"].forEach(id => $(id).oninput = render);
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => { document.querySelectorAll(".tabs button,.tab").forEach(e => e.classList.remove("on")); b.classList.add("on"); $(b.dataset.t).classList.add("on"); if (b.dataset.t === "t2") fx2(); });
$("opt").onclick = () => { const s = ctl(), b = best(s.R, { L: s.L, h2: s.h2, grid: s.grid, obj: $("obj").value }); $("cat").value = b.ci; $("T").value = b.T; $("P").value = b.P; render(); live(false);
  $("optmsg").textContent = `Best: ${s.R.cats[b.ci].n} at ${b.T} °C and ${b.P} bar. Yield ${(b.m.y * 100).toFixed(0)}%, $${b.m.cost.toFixed(0)} per tonne.`; };
$("save").onclick = () => { const s = ctl(), c = s.R.cats[s.ci], m = model(s.R, c, s.T, s.P, s.L, s.h2, s.grid); scen.push({ n: `${s.R.product}: ${c.n}, ${s.T} °C, ${s.P} bar, ${H2SRC[s.h2].label}, ${s.grid}`, y: m.y, cost: m.cost, co2: m.co2, yr: m.profit * s.cap * 330 / 1e6 }); showScen(); };
$("clr").onclick = () => { scen = []; showScen(); };
function fx2() { animateNums($("kpis")); document.querySelectorAll("#t2 canvas").forEach(c => { c.classList.remove("wipe"); void c.offsetWidth; c.classList.add("wipe"); }); const b = $("bar"); b.classList.add("go"); setTimeout(() => b.classList.remove("go"), 900); }
showScen(); render(); live(true);
