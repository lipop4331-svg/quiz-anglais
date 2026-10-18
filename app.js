const app = document.getElementById("app");
const SESSION_SIZE = 10;
const KEY = "quiz-anglais-v1";

// ---- Sauvegarde : pour chaque question, boite (0 = a retravailler ... 3 = acquise) et nombre d'erreurs
let progress = {};
try { progress = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { progress = {}; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} }
const id = (q) => q.c + "|" + q.q;
const st = (q) => progress[id(q)] || { box: null, wrong: 0 };

const categories = [...new Set(QUESTIONS.map((q) => q.c))];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Poids : les questions ratees reviennent beaucoup plus souvent que celles qu'elle maitrise
function weight(q) {
  const s = st(q);
  if (s.box === null) return 3;
  return [8, 4, 1.5, 0.4][s.box];
}
function pick(pool, n) {
  const left = pool.slice(), out = [];
  while (out.length < n && left.length) {
    const total = left.reduce((t, q) => t + weight(q), 0);
    let r = Math.random() * total, i = 0;
    for (; i < left.length - 1; i++) { r -= weight(left[i]); if (r <= 0) break; }
    out.push(left.splice(i, 1)[0]);
  }
  return out;
}
const mistakes = () => QUESTIONS.filter((q) => st(q).wrong > 0 && st(q).box < 3);
const mastered = (list) => list.filter((q) => st(q).box === 3).length;

// ---- Ecrans
let session = null;

function home() {
  const m = mistakes().length;
  const total = QUESTIONS.length;
  app.innerHTML = `
    <h1>English Quiz</h1>
    <p class="sub">${total} questions. Celles que tu rates reviennent plus souvent jusqu'a ce que tu les reussisses.</p>
    <div class="card stack" style="margin-top:16px">
      <button class="btn" data-mode="mix">Quiz melange (${SESSION_SIZE} questions)</button>
      <button class="btn ghost" data-mode="err" ${m ? "" : "disabled"}>Revoir mes erreurs (${m})</button>
      <div class="bar"><i style="width:${(mastered(QUESTIONS) / total) * 100}%"></i></div>
      <small class="sub">${mastered(QUESTIONS)} questions acquises sur ${total}</small>
    </div>
    <h2>Fiches et exercices par theme</h2>
    <div class="cats">
      ${categories.map((c) => {
        const l = QUESTIONS.filter((q) => q.c === c);
        return `<button class="cat" data-cat="${esc(c)}">${esc(c)}<small>${mastered(l)} / ${l.length} acquises</small>
          <div class="bar"><i style="width:${(mastered(l) / l.length) * 100}%"></i></div></button>`;
      }).join("")}
    </div>
    <div class="center"><button class="link" id="reset">Effacer ma progression</button></div>`;
  app.querySelector('[data-mode="mix"]').onclick = () => start(QUESTIONS);
  app.querySelector('[data-mode="err"]').onclick = () => start(mistakes());
  app.querySelectorAll("[data-cat]").forEach((b) => (b.onclick = () => fiche(b.dataset.cat)));
  app.querySelector("#reset").onclick = () => { if (confirm("Effacer toute ta progression ?")) { progress = {}; save(); home(); } };
}

// Fiche de cours d'un theme : a lire avant de s'entrainer
function fiche(cat) {
  const f = FICHES[cat];
  app.innerHTML = `
    <div class="top"><button id="back">Retour</button><span>Fiche</span></div>
    <div class="card">
      <span class="tag">${esc(cat)}</span>
      <h2 style="margin-top:0">A retenir</h2>
      <ul class="list" style="margin-top:0">${f.regle.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <div class="fb ok" style="margin-top:16px"><b>Astuce pour retenir</b>${esc(f.astuce)}</div>
    </div>
    <button class="btn" style="margin-top:14px" id="go">S'entrainer sur ce theme</button>`;
  app.querySelector("#back").onclick = home;
  app.querySelector("#go").onclick = () => start(QUESTIONS.filter((q) => q.c === cat));
}

function start(pool) {
  const qs = pick(pool, SESSION_SIZE);
  if (!qs.length) return home();
  session = { qs, i: 0, score: 0, wrong: [] };
  question();
}

function question() {
  const q = session.qs[session.i];
  const opts = shuffle(q.o.map((t, k) => ({ t, ok: k === q.a })));
  app.innerHTML = `
    <div class="top"><button id="quit">Quitter</button><span>${session.i + 1} / ${session.qs.length}</span></div>
    <div class="card">
      <span class="tag">${esc(q.c)}</span>
      <p class="q">${esc(q.q)}</p>
      <div class="stack">${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join("")}</div>
      <div id="fb"></div>
    </div>`;
  app.querySelector("#quit").onclick = home;
  app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => answer(q, opts, +b.dataset.k)));
}

function answer(q, opts, k) {
  const good = opts[k].ok;
  const s = st(q);
  if (good) { session.score++; s.box = Math.min(3, (s.box === null ? 1 : s.box + 1)); }
  else { s.box = 0; s.wrong++; session.wrong.push(q); }
  progress[id(q)] = s; save();

  app.querySelectorAll(".opt").forEach((b, j) => {
    b.disabled = true;
    if (opts[j].ok) b.classList.add("ok");
    else if (j === k) b.classList.add("bad");
  });
  const last = session.i === session.qs.length - 1;
  app.querySelector("#fb").innerHTML = `
    <div class="fb ${good ? "ok" : "bad"}"><b>${good ? "Bravo !" : "Pas tout a fait."}</b>${good ? "" : "La bonne reponse : " + esc(q.o[q.a]) + ". "}${esc(q.e)}</div>
    <button class="btn" style="margin-top:14px" id="next">${last ? "Voir mon resultat" : "Question suivante"}</button>`;
  app.querySelector("#next").onclick = () => { session.i++; last ? result() : question(); };
}

function result() {
  const n = session.qs.length, sc = session.score;
  const msg = sc === n ? "Sans faute !" : sc >= n * 0.7 ? "Tres bien, continue." : "Ce n'est pas grave, c'est comme ca qu'on apprend.";
  app.innerHTML = `
    <div class="card center">
      <div class="score">${sc} / ${n}</div>
      <p>${msg}</p>
      ${session.wrong.length ? `<h2>A retenir</h2><ul class="list">${session.wrong.map((q) => `<li>${esc(q.q)}<small><b>${esc(q.o[q.a])}</b> - ${esc(q.e)}</small></li>`).join("")}</ul>` : ""}
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn ghost" id="home">Accueil</button>
      <button class="btn" id="again">${session.wrong.length ? "Retravailler mes erreurs" : "Rejouer"}</button>
    </div>`;
  app.querySelector("#home").onclick = home;
  app.querySelector("#again").onclick = () => start(session.wrong.length ? mistakes() : QUESTIONS);
}

home();
