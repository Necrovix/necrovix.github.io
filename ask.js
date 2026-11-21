chrome("Home");
const KW = { ammonia: /ammonia|haber|nh3|nitrogen/i, methanol: /methanol|ch3oh/i, methane: /methane|sabatier|ch4/i };
const EL = { Ru: /\bru\b|ruthenium/i, Fe: /\bfe\b|iron/i, Ni: /\bni\b|nickel/i, Co: /\bco\b|cobalt/i, Cu: /\bcu\b|copper/i, Pd: /\bpd\b|palladium/i, In: /indium|in2o3/i };
const REL = { ammonia: ["Cheapest ammonia with green hydrogen", "Lowest CO₂ ammonia catalyst"], methanol: ["Best catalyst for CO₂ to methanol", "Lowest CO₂ methanol route"], methane: ["Is nickel enough for Sabatier methane?", "Lowest CO₂ Sabatier catalyst"] };
const settle = async p => { try { return await p; } catch (e) { return null; } };
async function ask(q) {
  q = q.trim(); if (!q) return;
  $("in").value = q; $("home").style.display = "none"; $("res").style.display = "block";
  $("res").innerHTML = `<h1>${esc(q)}</h1><p class="note">Searching live sources…</p><div class="sk"></div><div class="sk" style="width:82%"></div><div class="sk" style="width:60%"></div>`;
  const rk = Object.keys(KW).find(k => KW[k].test(q)), el = Object.keys(EL).find(e => EL[e].test(q));
  const R = REACTIONS[rk], o = { L: 1.5, h2: "green", grid: "India", obj: /green|carbon|co2|emission/i.test(q) && !/co2 to|co₂ to/i.test(q) ? "co2" : /yield|convert/i.test(q) ? "yield" : "profit" };
  let list = [], f = null;
  if (R) { list = R.cats.map((c, ci) => best(R, { ...o, only: [ci] })).sort((a, b) => b.sc - a.sc); f = (el && list.find(b => elOf(R.cats[b.ci]) === el)) || list[0]; }
  const fel = f ? elOf(R.cats[f.ci]) : el;
  const [pp, ch, pc] = await Promise.all([settle(papers(q + (R ? " catalyst" : ""), 5)), fel ? settle(cathub(fel)) : null, R ? settle(pubchem(R)) : null]);
  const S = []; const cite = n => `<sup><a href="#s${n}">${n}</a></sup>`;
  let out = "";
  if (R) {
    const c = R.cats[f.ci], m = f.m; S.push({ t: "Zervion process model", d: "Data snapshot, rounded", u: `platform.html#rx=${rk}&cat=${f.ci}&T=${f.T}&P=${f.P}` });
    const goal = { profit: "profit", co2: "lowest carbon", yield: "yield" }[o.obj], rank = list.indexOf(f) + 1;
    out += `<p>For ${esc(R.product.toLowerCase())} (${R.eq}), ${list[0] === f ? "the best option" : "the catalyst you asked about"} for ${goal} in Zervion's model is <b>${esc(c.n)}</b> at ${f.T} °C and ${f.P} bar. It gives about ${(m.y * 100).toFixed(0)}% yield at $${m.cost.toFixed(0)} per tonne, against a market price near $${R.price} per tonne, with ${m.co2.toFixed(2)} t of CO₂ per tonne.${cite(1)}${list.length > 1 ? ` It ranks ${rank} of ${list.length}.` : ""}</p>`;
    out += `<p>Each catalyst at its own best conditions: ${list.map(b => `${esc(R.cats[b.ci].n)} ($${b.m.cost.toFixed(0)}/t, ${(b.m.y * 100).toFixed(0)}% yield)`).join("; ")}.${cite(1)}</p>`;
  } else out += `<p>Zervion's process model covers ammonia, methanol and methane. Try one of those, or read the recent papers below.</p>`;
  if (ch) { S.push({ t: "Catalysis-Hub.org", d: `DFT energies on ${fel} surfaces`, u: "https://www.catalysis-hub.org/" }); const n = S.length;
    out += ch.length ? `<p>Catalysis-Hub has computed reaction energies on ${esc(fel)} surfaces, for example ${esc(ch[0].Equation)} at ${(+ch[0].reactionEnergy).toFixed(2)} eV.${cite(n)}</p>` : ""; }
  if (pc) { S.push({ t: "PubChem (NIH)", d: R.product, u: `https://pubchem.ncbi.nlm.nih.gov/#query=${R.pubchem}` }); const n = S.length;
    out += `<p>${esc(R.product)} has formula ${esc(pc.MolecularFormula)} and molecular weight ${esc(pc.MolecularWeight)} g/mol.${cite(n)}</p>`; }
  const first = S.length + 1;
  (pp || []).forEach(w => S.push({ t: w.display_name, d: `OpenAlex, ${w.publication_year}, cited ${w.cited_by_count}`, u: w.doi || "https://openalex.org" }));
  if (pp && pp.length) out += `<p>The most cited recent papers on this topic are listed in the sources.${cite(first)}</p>`;
  if (!pc && !pp && !ch && !R) out += `<p class="bad">Could not reach the live sources. Check your connection and try again.</p>`;
  const asum = R ? `<p class="note">Assumes green hydrogen, the India grid, 1.5× catalyst loading and ${o.obj === "profit" ? "the highest-profit" : o.obj === "co2" ? "the lowest-carbon" : "the highest-yield"} conditions. This is a rule-based answer from Zervion's model and live databases, not a language model.</p>` : "";
  $("res").innerHTML = `<h1>${esc(q)}</h1><h3 class="k">Sources</h3><div class="src">${S.map((s, i) => `<a id="s${i + 1}" href="${esc(s.u)}" target="_blank" rel="noopener">${i + 1} · ${esc(s.t)}<br><span>${esc(s.d)}</span></a>`).join("")}</div><h3 class="k">Answer</h3>${out}${asum}` +
    (R ? `<a class="btn" href="${esc(S[0].u)}">Open in simulator</a>` : "") + `<h3 class="k">Related</h3><div class="chips" style="justify-content:flex-start">${(REL[rk] || REL.ammonia).map(r => `<button class="chip">${r}</button>`).join("")}<button class="chip" id="back">New question</button></div>`;
  document.querySelectorAll("#res .chip").forEach(b => b.onclick = () => b.id === "back" ? (location.hash = "", $("res").style.display = "none", $("home").style.display = "block", $("in").value = "", $("in").focus()) : ask(b.textContent));
}
$("form").onsubmit = e => { e.preventDefault(); location.hash = "q=" + encodeURIComponent($("in").value); ask($("in").value); };
document.querySelectorAll("#chips .chip").forEach(b => b.onclick = () => ask(b.textContent));
const hq = new URLSearchParams(location.hash.slice(1)).get("q"); if (hq) ask(hq);
