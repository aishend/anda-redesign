/* Motor de navegação + registo de dados para os testes com utilizadores. */

const Store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  push(k, v) { const a = Store.get(k, []); a.push(v); Store.set(k, a); },
};

function parseSet(s) {
  const o = {};
  (s || '').split(';').filter(Boolean).forEach(p => { const i = p.indexOf('='); o[p.slice(0, i)] = p.slice(i + 1); });
  return o;
}

/* ---------- Aplicação (um telemóvel) ---------- */
class Phone {
  constructor(el, { v = 'A', screen = 'app-inicio', sel = {}, onNav, onClick } = {}) {
    this.el = el; this.v = v; this.screen = screen; this.sel = { ...sel };
    this.onNav = onNav; this.onClick = onClick;
    el.classList.remove('study-mode');
    el.innerHTML = `<div class="statusbar"><span>21:40</span><span style="display:flex;gap:6px;align-items:center">${I.signal}${I.battery}</span></div>
      <div class="screen"></div><div class="homebar"><button data-home aria-label="Ecrã inicial"></button></div>`;
    this.scr = el.querySelector('.screen');
    el.onclick = e => this.click(e);
    el.onsubmit = (e => {
      e.preventDefault();
      const m = e.target.querySelector('input')?.value.trim();
      if (m) { this.sel.said = m; this.render(); this.onNav?.('chat', m); }
    });
    this.render();
  }
  render() {
    const f = SCREENS[this.screen];
    this.scr.innerHTML = f ? f.call(SCREENS, this.sel, this.v) : `<div class="content">Ecrã «${this.screen}» não existe.</div>`;
    this.el.classList.toggle('on-os', this.screen === 'os-home');
    const c = this.scr.querySelector('.content, .chat'); if (c) c.scrollTop = 0;
  }
  go(screen, set = {}) {
    const from = this.screen;
    Object.assign(this.sel, set);
    if (screen) this.screen = screen;
    this.render();
    this.onNav?.(from, this.screen);
  }
  toast(t) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
    this.scr.appendChild(d); setTimeout(() => d.remove(), 1900);
  }
  click(e) {
    if (e.target.closest('[data-home]')) { this.onClick?.({ action: 'home', valid: true, back: false }); return this.go('os-home'); }
    const b = e.target.closest('[data-go],[data-set],[data-toast]');
    const valid = !!b && !b.disabled;
    this.onClick?.({ action: b ? (b.dataset.label || b.textContent.trim().slice(0, 40)) : '(fora)', valid, back: !!b?.classList.contains('back'), toast: !!b?.dataset.toast });
    if (!valid) return;
    if (b.dataset.go !== undefined || b.dataset.set !== undefined) {
      if (b.dataset.go !== '') this.go(b.dataset.go, parseSet(b.dataset.set)); // '' = botão sem destino
    }
    if (b.dataset.toast) this.toast(b.dataset.toast); // depois de navegar, para não ser apagado
  }
}

/* ---------- Sessão de teste ---------- */
const SUS_Q = [
  'Acho que gostaria de usar esta app com frequência.',
  'Achei a app desnecessariamente complexa.',
  'Achei a app fácil de usar.',
  'Acho que precisaria de ajuda de uma pessoa com conhecimentos técnicos para usar esta app.',
  'Achei que as várias funcionalidades da app estavam bem integradas.',
  'Achei que a app tinha muitas inconsistências.',
  'Imagino que a maioria das pessoas aprenderia a usar esta app muito rapidamente.',
  'Achei a app muito complicada de usar.',
  'Senti-me muito confiante ao usar a app.',
  'Tive de aprender muitas coisas antes de conseguir usar esta app.',
];

function susScore(ans) { // ans: 10 valores 1..5
  let s = 0; ans.forEach((a, i) => { s += i % 2 === 0 ? a - 1 : 5 - a; }); return s * 2.5;
}

function buildSteps(order) {
  const st = [{ k: 'intro' }];
  order.forEach((v, n) => {
    st.push({ k: 'version', v, n: n + 1 });
    [1, 2, 3].forEach(t => { st.push({ k: 'brief', v, t, n: n + 1 }); st.push({ k: 'task', v, t, n: n + 1 }); st.push({ k: 'post', v, t, n: n + 1 }); });
    st.push({ k: 'sus', v, n: n + 1 });
  });
  st.push({ k: 'end' });
  return st;
}

class Study {
  constructor(phoneEl, testbar) {
    this.el = phoneEl; this.bar = testbar;
    this.s = Store.get('anda_session', null);
    if (!this.s) { phoneEl.innerHTML = '<div class="study"><h2>Sem sessão ativa</h2><p>Comece uma sessão no painel do investigador.</p><a href="index.html">Abrir painel</a></div>'; return; }
    this.bar.querySelector('[data-done]').onclick = () => this.finishTask(false);
    this.bar.querySelector('[data-giveup]').onclick = () => this.finishTask(true);
    this.show();
  }
  get step() { return this.s.steps[this.s.i]; }
  save() { Store.set('anda_session', this.s); }
  next() { this.s.i++; this.save(); this.show(); }
  frame(html) {
    this.el.onclick = null; this.el.onsubmit = null;
    this.el.classList.add('study-mode'); this.el.classList.remove('on-os');
    this.el.innerHTML = `<div class="statusbar"><span>21:40</span><span style="display:flex;gap:6px;align-items:center">${I.signal}${I.battery}</span></div><div class="study">${html}</div><div class="homebar"><button></button></div>`;
  }
  show() {
    const st = this.step, s = this.s;
    document.body.parentElement.querySelector('.stage').classList.toggle('testing', st.k === 'task');
    this.bar.classList.toggle('hidden', st.k !== 'task');
    if (st.k === 'intro') {
      this.frame(`<span class="tag">Participante ${s.pid}</span><h2>Obrigado por participar!</h2>
        <p>Vai experimentar <b>duas versões</b> de uma app de transportes, a Anda. Em cada versão fará <b>3 tarefas curtas</b>.</p>
        <p>Estamos a avaliar a app, <b>não a si</b>. Não há respostas erradas. Se não conseguir, pode desistir a qualquer momento.</p>
        <p>Pense em voz alta enquanto usa a app: diga o que procura e o que espera que aconteça.</p>
        <div class="grow"></div><button class="btn primary" data-n>Começar</button>`);
    } else if (st.k === 'version') {
      this.frame(`<span class="tag">Versão ${st.n} de 2</span><h2>Versão ${st.n}</h2><p>${st.n === 1 ? 'Vamos começar com a primeira versão da app.' : 'Agora vai repetir as mesmas tarefas noutra versão da app. Repare que algumas coisas podem funcionar de forma diferente.'}</p><div class="grow"></div><button class="btn primary" data-n>Continuar</button>`);
    } else if (st.k === 'brief') {
      const T = TASKS[st.t];
      this.frame(`<span class="tag">Versão ${st.n} · Tarefa ${st.t} de 3</span><h2>${T.titulo}</h2><p>${T.texto}</p><div class="grow"></div><button class="btn primary" data-n>Começar a tarefa</button>`);
    } else if (st.k === 'task') {
      this.startTask();
      return;
    } else if (st.k === 'post') {
      this.postTask();
      return;
    } else if (st.k === 'sus') {
      this.sus();
      return;
    } else if (st.k === 'end') {
      this.frame(`<h2>Terminou! 🎉</h2><p>Muito obrigado pela sua ajuda.</p><p class="small">Investigador: os dados foram guardados. Volte ao painel para exportar.</p><div class="grow"></div><a class="btn secondary" href="index.html" style="text-decoration:none">Painel do investigador</a>`);
      Store.set('anda_session', null);
    }
    this.el.querySelector('[data-n]')?.addEventListener('click', () => this.next());
  }
  startTask() {
    const st = this.step, T = TASKS[st.t];
    this.bar.querySelector('[data-label]').textContent = `Tarefa ${st.t} · ${T.titulo}`;
    this.cur = { t0: performance.now(), toques: 0, validos: 0, voltar: 0, ecras: [T.start], fora: 0 };
    this.ended = false;
    const log = (type, d) => Store.push('anda_events', { ts: new Date().toISOString(), pid: this.s.pid, versao: st.v, tarefa: st.t, ms: Math.round(performance.now() - this.cur.t0), type, ...d });
    log('inicio', { ecra: T.start });
    this.phone = new Phone(this.el, {
      v: st.v, screen: T.start, sel: { ...T.sel },
      onClick: c => { this.cur.toques++; if (c.valid) this.cur.validos++; else this.cur.fora++; if (c.back) this.cur.voltar++; log('toque', { alvo: c.action, valido: c.valid }); },
      onNav: (from, to) => {
        if (from === 'chat') { log('chat', { texto: to }); return; }
        if (from !== to) { this.cur.ecras.push(to); log('ecra', { de: from, para: to }); }
        if (T.fim && to === T.fim && !this.ended) { this.ended = true; this.cur.t1 = performance.now(); setTimeout(() => this.finishTask(false, true), 1800); }
      },
    });
  }
  finishTask(desistiu, auto = false) {
    const st = this.step, T = TASKS[st.t], c = this.cur;
    const t1 = c.t1 || performance.now();
    const sel = this.phone.sel;
    this.result = {
      pid: this.s.pid, ordem: this.s.order.join(''), versao: st.v, posicao: st.n, tarefa: st.t,
      concluiu: desistiu ? 0 : (T.fim ? (auto ? 1 : 0) : 1),
      tempo_s: +((t1 - c.t0) / 1000).toFixed(2),
      toques: c.toques, toques_validos: c.validos, toques_fora: c.fora, voltar: c.voltar,
      ecras: c.ecras.length, caminho: c.ecras.join(' > '),
      desistiu: desistiu ? 1 : 0,
      escolhas: st.t === 2 ? `tipo=${sel.tipo || ''};id=${sel.id || ''};ent=${sel.ent || ''}` : '',
    };
    if (st.t === 2) this.result.sucesso = (!desistiu && auto && T.certo(sel)) ? 1 : 0;
    if (st.t === 3) this.result.sucesso = (!desistiu && auto) ? 1 : 0;
    Store.push('anda_events', { ts: new Date().toISOString(), pid: this.s.pid, versao: st.v, tarefa: st.t, ms: Math.round(t1 - c.t0), type: desistiu ? 'desistiu' : 'fim' });
    this.next();
  }
  postTask() {
    const st = this.step, T = TASKS[st.t], r = this.result;
    const ans = {};
    const qs = (T.perguntas && !r.desistiu) ? T.perguntas : [];
    this.frame(`<span class="tag">Versão ${st.n} · Tarefa ${st.t} de 3</span><h2>${r.desistiu ? 'Sem problema!' : 'Tarefa terminada'}</h2>
      ${qs.map(q => `<div class="sus-item"><p><b>${q.q}</b></p><div class="yn" data-q="${q.k}">${['Sim', 'Não', 'Não sei'].map(o => `<button data-o="${o}">${o}</button>`).join('')}</div></div>`).join('')}
      <div class="sus-item"><p><b>Quão satisfeito/a ficou com a forma como fez esta tarefa?</b></p>
        <div class="likert" data-q="satisfacao">${[1, 2, 3, 4, 5].map(n => `<button data-o="${n}">${n}</button>`).join('')}</div>
        <div class="likert-labels"><span>Nada satisfeito/a</span><span>Muito satisfeito/a</span></div></div>
      <div class="grow"></div><button class="btn primary" data-n disabled>Continuar</button>`);
    const need = qs.length + 1;
    this.el.querySelectorAll('[data-q]').forEach(g => g.addEventListener('click', e => {
      const b = e.target.closest('[data-o]'); if (!b) return;
      g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      ans[g.dataset.q] = b.dataset.o;
      this.el.querySelector('[data-n]').disabled = Object.keys(ans).length < need;
    }));
    this.el.querySelector('[data-n]').addEventListener('click', () => {
      r.satisfacao = +ans.satisfacao;
      if (T.perguntas) {
        T.perguntas.forEach(q => { r['resp_' + q.k] = ans[q.k] || ''; });
        r.sucesso = (!r.desistiu && T.perguntas.every(q => ans[q.k] === q.certo)) ? 1 : 0;
      }
      Store.push('anda_results', r);
      this.next();
    });
  }
  sus() {
    const st = this.step, ans = Array(10).fill(0);
    this.frame(`<span class="tag">Versão ${st.n} · Questionário</span><h2>Como foi usar a versão ${st.n}?</h2>
      <p class="small" style="font-size:14px">1 = Discordo totalmente · 5 = Concordo totalmente</p>
      ${SUS_Q.map((q, i) => `<div class="sus-item"><p>${i + 1}. ${q}</p><div class="likert" data-i="${i}">${[1, 2, 3, 4, 5].map(n => `<button data-o="${n}">${n}</button>`).join('')}</div></div>`).join('')}
      <button class="btn primary" data-n disabled>Continuar</button>`);
    this.el.querySelectorAll('[data-i]').forEach(g => g.addEventListener('click', e => {
      const b = e.target.closest('[data-o]'); if (!b) return;
      g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      ans[+g.dataset.i] = +b.dataset.o;
      this.el.querySelector('[data-n]').disabled = ans.some(a => !a);
    }));
    this.el.querySelector('[data-n]').addEventListener('click', () => {
      const row = { pid: this.s.pid, ordem: this.s.order.join(''), versao: st.v, posicao: st.n };
      ans.forEach((a, i) => { row['q' + (i + 1)] = a; });
      row.sus = susScore(ans);
      Store.push('anda_sus', row);
      this.next();
    });
  }
}

/* ---------- Exportação CSV ---------- */
function toCSV(rows) {
  if (!rows.length) return '';
  const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const esc = v => { v = v ?? ''; v = String(v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
}
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click();
}
