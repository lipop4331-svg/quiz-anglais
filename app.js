const app = document.getElementById("app");
const SESSION_SIZE = 10;
const KEY = "quiz-anglais-v1";

// ---- Sauvegarde : pour chaque question, boite (0 = a retravailler ... 4 = acquise), erreurs et date de prochaine revision
const INTERVALS = [0, 1, 3, 7, 30]; // jours avant de revoir la question, selon la boite
const DAILY_GOAL = 10;
const DKEY = "quiz-anglais-daily-v1";
const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
let progress = {}, daily = {};
try { progress = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { progress = {}; }
try { daily = JSON.parse(localStorage.getItem(DKEY)) || {}; } catch (e) { daily = {}; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); localStorage.setItem(DKEY, JSON.stringify(daily)); } catch (e) {} }
const id = (q) => q.c + "|" + q.q;
const st = (q) => ({ box: null, wrong: 0, due: 0, ...progress[id(q)] });
// Serie : jours d'affilee ou l'objectif du jour est atteint (aujourd'hui compte s'il est deja atteint)
function streak() {
  let d = today(), n = 0;
  if ((daily[d] || 0) < DAILY_GOAL) d--;
  while ((daily[d] || 0) >= DAILY_GOAL) { n++; d--; }
  return n;
}
// Enregistre une reponse : une bonne reponse espace la prochaine revision, une erreur la ramene a aujourd'hui
function grade(q, good) {
  const s = st(q), t = today();
  if (good) { if (s.box === null || s.due <= t) s.box = Math.min(4, s.box === null ? 1 : s.box + 1); }
  else { s.box = 0; s.wrong++; }
  s.due = t + INTERVALS[s.box];
  progress[id(q)] = s;
  daily[t] = (daily[t] || 0) + 1;
  save();
}

const categories = [...new Set(QUESTIONS.map((q) => q.c))];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Poids : les questions ratees reviennent beaucoup plus souvent que celles qu'elle maitrise
function weight(q) {
  const s = st(q);
  if (s.box === null) return 3;
  return [8, 4, 1.5, 0.5, 0.2][s.box] * (s.due > today() ? 0.4 : 1);
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
const mistakes = (pool = QUESTIONS) => pool.filter((q) => st(q).wrong > 0 && st(q).box < 3);

// ---- Quiz crees par l'utilisateur
const CKEY = "quiz-anglais-custom-v1";
let custom = [];
try { custom = JSON.parse(localStorage.getItem(CKEY)) || []; } catch (e) { custom = []; }
function saveCustom() { try { localStorage.setItem(CKEY, JSON.stringify(custom)); } catch (e) {} }
const toPool = (quiz) => quiz.questions.map((q) => ({ ...q, c: quiz.name }));
const enc = (o) => { const b = new TextEncoder().encode(JSON.stringify(o)); let s = ""; b.forEach((x) => (s += String.fromCharCode(x))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const dec = (t) => { const s = atob(t.replace(/-/g, "+").replace(/_/g, "/")); return JSON.parse(new TextDecoder().decode(Uint8Array.from(s, (c) => c.charCodeAt(0)))); };
const validQuiz = (z) => z && typeof z.name === "string" && Array.isArray(z.questions) && z.questions.length > 0 &&
  z.questions.every((q) => typeof q.q === "string" && Array.isArray(q.o) && q.o.length >= 2 && q.o.every((t) => typeof t === "string") && Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length);
const mastered = (list) => list.filter((q) => st(q).box >= 3).length;
const cardsPool = VOCAB;
const allPool = () => QUESTIONS.concat(cardsPool, ...custom.map(toPool));
const duePool = () => allPool().filter((q) => st(q).box !== null && st(q).due <= today());

// ---- Ecrans
let session = null;

function home() {
  const m = mistakes().length, due = duePool().length;
  const total = QUESTIONS.length;
  const done = daily[today()] || 0, sk = streak();
  app.innerHTML = `
    <h1>English Quiz</h1>
    <div class="card" style="margin-top:12px">
      <div class="row" style="align-items:center">
        <div><b>Aujourd'hui : ${Math.min(done, DAILY_GOAL)} / ${DAILY_GOAL}</b>
          <small class="sub" style="display:block">${done >= DAILY_GOAL ? "Objectif atteint, bravo !" : "Objectif du jour : " + DAILY_GOAL + " questions"}</small></div>
        <div class="center"><div class="streak">${sk}</div><small class="sub">jour${sk > 1 ? "s" : ""} d'affilee</small></div>
      </div>
      <div class="bar"><i style="width:${Math.min(100, (done / DAILY_GOAL) * 100)}%"></i></div>
    </div>
    <div class="card stack" style="margin-top:14px">
      <button class="btn" data-mode="due" ${due ? "" : "disabled"}>${due ? "A revoir aujourd'hui (" + due + ")" : "Rien a revoir aujourd'hui"}</button>
      <button class="btn ${due ? "ghost" : ""}" data-mode="mix">Quiz melange (${SESSION_SIZE} questions)</button>
      <button class="btn ghost" data-mode="cards">Cartes de vocabulaire</button>
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
    <h2>Mes quiz</h2>
    <div class="stack">
      ${custom.length ? "" : `<p class="sub">Tu n'as pas encore de quiz. Cree le tien avec tes propres questions.</p>`}
      ${custom.map((z, i) => `<div class="card">
        <b>${esc(z.name)}</b> <small class="sub">${z.questions.length} questions</small>
        <div class="row" style="margin-top:10px">
          <button class="mini main" data-play="${i}">Jouer</button>
          <button class="mini" data-edit="${i}">Modifier</button>
          <button class="mini" data-share="${i}">Partager</button>
          <button class="mini" data-del="${i}">Supprimer</button>
        </div></div>`).join("")}
      <button class="btn ghost" id="new">Creer un quiz</button>
    </div>
    <div class="center"><button class="link" id="reset">Effacer ma progression</button></div>`;
  app.querySelector('[data-mode="due"]').onclick = () => start(duePool());
  app.querySelector('[data-mode="cards"]').onclick = () => start(cardsPool);
  app.querySelector('[data-mode="mix"]').onclick = () => start(QUESTIONS);
  app.querySelector('[data-mode="err"]').onclick = () => start(mistakes());
  app.querySelectorAll("[data-cat]").forEach((b) => (b.onclick = () => fiche(b.dataset.cat)));
  app.querySelector("#new").onclick = () => editor(null);
  app.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => start(toPool(custom[+b.dataset.play]))));
  app.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => editor(custom[+b.dataset.edit])));
  app.querySelectorAll("[data-share]").forEach((b) => (b.onclick = () => share(custom[+b.dataset.share])));
  app.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => {
    const z = custom[+b.dataset.del];
    if (confirm('Supprimer le quiz "' + z.name + '" ?')) { custom.splice(+b.dataset.del, 1); saveCustom(); home(); }
  }));
  app.querySelector("#reset").onclick =() => { if (confirm("Effacer toute ta progression ?")) { progress = {}; daily = {}; save(); home(); } };
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
  session = { qs, i: 0, score: 0, wrong: [], pool };
  question();
}

// Reponse attendue, quel que soit le type de question (carte, a ecrire, choix multiple)
const ans = (q) => q.en || (q.t ? q.t[0] : q.o[q.a]);
const norm = (s) => s.toLowerCase().replace(/[’`]/g, "'").replace(/[.!?]+$/, "").replace(/\s+/g, " ").trim();
const fbBox = (good, extra, e) => `<div class="fb ${good ? "ok" : "bad"}"><b>${good ? "Bravo !" : "Pas tout a fait."}</b>${esc(extra)}${esc(e || "")}</div>`;

function question() {
  const q = session.qs[session.i];
  const head = `<div class="top"><button id="quit">Quitter</button><span>${session.i + 1} / ${session.qs.length}</span></div>`;
  if (q.en) drawCard(q, head);
  else if (q.t) drawTyped(q, head);
  else drawChoice(q, head);
  app.querySelector("#quit").onclick = home;
}

function record(q, good) {
  grade(q, good);
  if (good) session.score++; else session.wrong.push(q);
}
function goNext() { session.i++; session.i >= session.qs.length ? result() : question(); }

// Affiche le retour puis le bouton pour continuer
function finish(q, good, html) {
  record(q, good);
  const last = session.i === session.qs.length - 1;
  app.querySelector("#fb").innerHTML = html + `<button class="btn" style="margin-top:14px" id="next">${last ? "Voir mon resultat" : "Suivante"}</button>`;
  app.querySelector("#next").onclick = goNext;
}

function drawChoice(q, head) {
  const opts = shuffle(q.o.map((t, k) => ({ t, ok: k === q.a })));
  app.innerHTML = `${head}
    <div class="card">
      <span class="tag">${esc(q.c)}</span>
      <p class="q">${esc(q.q)}</p>
      <div class="stack">${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join("")}</div>
      <div id="fb"></div>
    </div>`;
  app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
    const k = +b.dataset.k, good = opts[k].ok;
    app.querySelectorAll(".opt").forEach((o, j) => {
      o.disabled = true;
      if (opts[j].ok) o.classList.add("ok"); else if (j === k) o.classList.add("bad");
    });
    finish(q, good, fbBox(good, good ? "" : "La bonne reponse : " + q.o[q.a] + ". ", q.e));
  }));
}

// Question a ecrire : retrouver la reponse de tete marque bien mieux que la reconnaitre
function drawTyped(q, head) {
  app.innerHTML = `${head}
    <div class="card">
      <span class="tag">${esc(q.c)} - a ecrire</span>
      <p class="q">${esc(q.q)}</p>
      <form id="f" autocomplete="off">
        <input class="in" id="ans" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Ta reponse">
        <div class="row"><button type="button" class="btn ghost" id="idk">Je ne sais pas</button><button class="btn" id="ok">Valider</button></div>
      </form>
      <div id="fb"></div>
    </div>`;
  const inp = app.querySelector("#ans");
  inp.focus();
  const done = (good) => {
    inp.disabled = true;
    app.querySelector(".row").remove();
    finish(q, good, fbBox(good, good ? "" : "La bonne reponse : " + q.t[0] + ". ", q.e));
  };
  app.querySelector("#f").onsubmit = (ev) => { ev.preventDefault(); if (inp.value.trim()) done(q.t.some((a) => norm(a) === norm(inp.value))); };
  app.querySelector("#idk").onclick = () => done(false);
}

// Carte de vocabulaire : on se souvient, puis on verifie et on s'auto-evalue
function drawCard(q, head) {
  app.innerHTML = `${head}
    <div class="card center">
      <span class="tag">Vocabulaire</span>
      <p class="q" style="margin:18px 0">${esc(q.q)}</p>
      <div id="fb"><button class="btn" id="flip">Voir la traduction</button></div>
    </div>`;
  app.querySelector("#flip").onclick = () => {
    app.querySelector("#fb").innerHTML = `<p class="q" style="color:var(--accent)">${esc(q.en)}</p>
      <div class="row"><button class="btn ghost" id="no">Je ne savais pas</button><button class="btn" id="yes">Je savais</button></div>`;
    app.querySelector("#no").onclick = () => { record(q, false); goNext(); };
    app.querySelector("#yes").onclick = () => { record(q, true); goNext(); };
  };
}

function result() {
  const n = session.qs.length, sc = session.score;
  const msg = sc === n ? "Sans faute !" : sc >= n * 0.7 ? "Tres bien, continue." : "Ce n'est pas grave, c'est comme ca qu'on apprend.";
  app.innerHTML = `
    <div class="card center">
      <div class="score">${sc} / ${n}</div>
      <p>${msg}</p>
      ${session.wrong.length ? `<h2>A retenir</h2><ul class="list">${session.wrong.map((q) => `<li>${esc(q.q)}<small><b>${esc(ans(q))}</b>${q.e ? " - " + esc(q.e) : ""}</small></li>`).join("")}</ul>` : ""}
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn ghost" id="home">Accueil</button>
      <button class="btn" id="again">${session.wrong.length ? "Retravailler mes erreurs" : "Rejouer"}</button>
    </div>`;
  app.querySelector("#home").onclick = home;
  app.querySelector("#again").onclick = () => start(session.wrong.length ? mistakes(session.pool) : session.pool);
}

// ---- Editeur de quiz
let draft = null;
const blankQ = () => ({ q: "", o: ["", "", "", ""], a: 0, e: "" });

function editor(quiz) {
  draft = quiz ? JSON.parse(JSON.stringify(quiz)) : { id: Date.now().toString(36), name: "", questions: [blankQ()] };
  // on garde toujours 4 cases pour l'edition
  draft.questions.forEach((q) => { while (q.o.length < 4) q.o.push(""); });
  drawEditor();
}

function drawEditor() {
  app.innerHTML = `
    <div class="top"><button id="cancel">Annuler</button><span>${draft.questions.length} question(s)</span></div>
    <label class="lbl">Nom du quiz</label>
    <input class="in" id="name" placeholder="Ex : Vocabulaire unit 3" value="${esc(draft.name).replace(/"/g, "&quot;")}">
    ${draft.questions.map((q, i) => `
      <div class="card" style="margin-top:14px">
        <div class="top"><b>Question ${i + 1}</b>${draft.questions.length > 1 ? `<button data-rm="${i}">Retirer</button>` : ""}</div>
        <input class="in" data-i="${i}" data-f="q" placeholder="La question" value="${esc(q.q).replace(/"/g, "&quot;")}">
        <label class="lbl">Reponses (coche la bonne)</label>
        ${q.o.map((t, k) => `<div class="optrow">
          <input type="radio" name="a${i}" data-i="${i}" data-f="a" value="${k}" ${q.a === k ? "checked" : ""}>
          <input class="in" data-i="${i}" data-f="o${k}" placeholder="Reponse ${k + 1}${k > 1 ? " (facultatif)" : ""}" value="${esc(t).replace(/"/g, "&quot;")}">
        </div>`).join("")}
        <label class="lbl">Explication (facultatif)</label>
        <input class="in" data-i="${i}" data-f="e" placeholder="Pourquoi c'est la bonne reponse" value="${esc(q.e).replace(/"/g, "&quot;")}">
      </div>`).join("")}
    <div class="stack" style="margin-top:14px">
      <button class="btn ghost" id="add">Ajouter une question</button>
      <button class="btn" id="save">Enregistrer le quiz</button>
    </div>`;
  app.querySelector("#cancel").onclick = home;
  app.querySelector("#name").oninput = (e) => (draft.name = e.target.value);
  app.querySelectorAll("[data-f]").forEach((el) => {
    el.oninput = el.onchange = () => {
      const q = draft.questions[+el.dataset.i], f = el.dataset.f;
      if (f === "a") q.a = +el.value;
      else if (f === "q" || f === "e") q[f] = el.value;
      else q.o[+f.slice(1)] = el.value;
    };
  });
  app.querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => { draft.questions.splice(+b.dataset.rm, 1); drawEditor(); }));
  app.querySelector("#add").onclick = () => { draft.questions.push(blankQ()); drawEditor(); window.scrollTo(0, document.body.scrollHeight); };
  app.querySelector("#save").onclick = saveDraft;
}

function saveDraft() {
  const name = draft.name.trim();
  if (!name) return alert("Donne un nom a ton quiz.");
  const questions = [];
  for (let i = 0; i < draft.questions.length; i++) {
    const d = draft.questions[i];
    if (!d.q.trim() && d.o.every((t) => !t.trim())) continue; // question vide : ignoree
    if (!d.q.trim()) return alert("Question " + (i + 1) + " : il manque la question.");
    const filled = d.o.map((t, k) => ({ t: t.trim(), k })).filter((x) => x.t);
    if (filled.length < 2) return alert("Question " + (i + 1) + " : mets au moins 2 reponses.");
    const a = filled.findIndex((x) => x.k === d.a);
    if (a < 0) return alert("Question " + (i + 1) + " : la reponse cochee est vide.");
    questions.push({ q: d.q.trim(), o: filled.map((x) => x.t), a, e: d.e.trim() });
  }
  if (!questions.length) return alert("Ajoute au moins une question.");
  const quiz = { id: draft.id, name, questions };
  const at = custom.findIndex((z) => z.id === quiz.id);
  if (at >= 0) custom[at] = quiz; else custom.push(quiz);
  saveCustom();
  home();
}

// ---- Partage par lien : le quiz est contenu dans le lien
function share(quiz) {
  const url = location.href.split("#")[0] + "#quiz=" + enc({ id: quiz.id, name: quiz.name, questions: quiz.questions });
  const done = () => alert("Lien copie. Envoie-le : en l'ouvrant, le quiz s'ajoute tout seul.");
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => prompt("Copie ce lien :", url));
  else prompt("Copie ce lien :", url);
}

function importFromLink() {
  const m = location.hash.match(/^#quiz=(.+)$/);
  if (!m) return;
  try {
    const z = dec(m[1]);
    if (!validQuiz(z)) throw new Error("invalid");
    if (confirm('Ajouter le quiz "' + z.name + '" (' + z.questions.length + " questions) a ta liste ?")) {
      z.id = z.id || Date.now().toString(36);
      const at = custom.findIndex((c) => c.id === z.id);
      if (at >= 0) custom[at] = z; else custom.push(z);
      saveCustom();
    }
  } catch (e) { alert("Ce lien de quiz n'est pas valide."); }
  history.replaceState(null, "", location.pathname + location.search);
}

importFromLink();
home();
