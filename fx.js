(() => {
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("nav"), sc = () => nav && nav.classList.toggle("sc", scrollY > 8);
  addEventListener("scroll", sc, { passive: true }); sc();
  if (!rm && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".hero2,.page>h2,.page>.grid2>.card,.page>table,.page>p.note,.page>p.sub,.stats,.feat>*,.steps>*,.me,.mq").forEach((e, i) => { e.classList.add("rv"); e.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(e); });
  }
  const cv = document.getElementById("net");
  if (cv && !rm) {
    const g = cv.getContext("2d"), m = { x: -999, y: -999 }; let W, H, N = [];
    const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; N = Array.from({ length: Math.min(70, Math.round(W * H / 20000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 })); };
    fit(); addEventListener("resize", fit); addEventListener("pointermove", e => { m.x = e.clientX; m.y = e.clientY; });
    (function f() {
      g.clearRect(0, 0, W, H);
      for (const a of N) {
        a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        const dx = a.x - m.x, dy = a.y - m.y, d = Math.hypot(dx, dy); if (d < 120 && d > 0) { a.x += dx / d * .8; a.y += dy / d * .8; }
        g.fillStyle = "rgba(11,122,117,.4)"; g.beginPath(); g.arc(a.x, a.y, 2.2, 0, 6.3); g.fill();
      }
      for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) { const d = Math.hypot(N[i].x - N[j].x, N[i].y - N[j].y); if (d < 140) { g.strokeStyle = `rgba(11,122,117,${.16 * (1 - d / 140)})`; g.beginPath(); g.moveTo(N[i].x, N[i].y); g.lineTo(N[j].x, N[j].y); g.stroke(); } }
      requestAnimationFrame(f);
    })();
  }
  const pb = document.getElementById("pbar");
  if (pb) addEventListener("scroll", () => { const h = document.documentElement; pb.style.width = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1) * 100 + "%"; }, { passive: true });
  const st = document.querySelector(".stats");
  if (st && "IntersectionObserver" in window) { const o = new IntersectionObserver(es => { if (es[0].isIntersecting) { o.disconnect(); animateNums(st); } }, { threshold: .5 }); o.observe(st); }
  document.addEventListener("pointermove", e => { const t = e.target.closest && e.target.closest(".fc,.card,.me"); if (t) { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px"); } });
  const inp = document.getElementById("in");
  if (inp && !rm) {
    const Q = ["Best catalyst for ammonia synthesis", "Cheapest green methanol route", "Is ruthenium worth it for ammonia?", "Lowest CO₂ Sabatier methane"], DEF = inp.placeholder; let qi = 0, ci = 0, del = false;
    (function t() {
      if (inp.value || document.activeElement === inp) { inp.placeholder = DEF; return setTimeout(t, 700); }
      const s = Q[qi]; ci += del ? -1 : 1; inp.placeholder = s.slice(0, ci) || " "; let w = del ? 25 : 55;
      if (!del && ci === s.length) { del = true; w = 1600; } else if (del && ci === 0) { del = false; qi = (qi + 1) % Q.length; w = 400; }
      setTimeout(t, w);
    })();
  }
})();
