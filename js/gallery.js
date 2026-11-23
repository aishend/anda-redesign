/* Lista de todos os ecrãs (frames) do protótipo, por versão e tarefa.
 * A galeria desenha-os lado a lado e calcula as ligações entre eles (para o plugin do Figma). */
const OFF = { mb: '', sheet: '', pop: '' };
const F = (nome, screen, sel) => ({ nome, screen, sel: { ...OFF, ...sel } });

const FLOWS = {
  'Tarefa 1 · Widget do passe': [
    F('Ecrã inicial do telemóvel', 'os-home', { u: 'sofia' }),
    F('O meu cartão · Tudo', 'app-cartao', { u: 'sofia', f: 'tudo' }),
    F('O meu cartão · Viagens', 'app-cartao', { u: 'sofia', f: 'viagens' }),
    F('O meu cartão · Carregamentos', 'app-cartao', { u: 'sofia', f: 'carregamentos' }),
  ],
  'Tarefa 2 · Pedir o Sub23': {
    common0: [
      F('Início (Sofia)', 'app-inicio', { u: 'sofia' }),
      F('Pedidos', 'app-pedidos', { u: 'sofia', enviado: '', tipo: '', id: '', ent: '' }),
    ],
    A: [
      F('Novo pedido · tipo', 'a-pedido-tipo', { u: 'sofia', tipo: '', id: '', ent: '' }),
      F('Novo pedido · Sub23 escolhido', 'a-pedido-tipo', { u: 'sofia', tipo: 'sub23', id: '', ent: '' }),
      F('Pedido Sub23 · detalhes', 'a-pedido-detalhes', { u: 'sofia', tipo: 'sub23', id: '', ent: '' }),
      F('Pedido Sub23 · CMD escolhida', 'a-pedido-detalhes', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: '' }),
      F('Pedido Sub23 · tudo preenchido', 'a-pedido-detalhes', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: 'nfc' }),
    ],
    B: [
      F('Passo 1 · tipo', 'b-pedido-1', { u: 'sofia', tipo: '', id: '', ent: '' }),
      F('Passo 1 · Sub23 escolhido', 'b-pedido-1', { u: 'sofia', tipo: 'sub23', id: '', ent: '' }),
      F('Passo 2 · idade', 'b-pedido-2', { u: 'sofia', tipo: 'sub23', id: '', ent: '' }),
      F('Passo 2 · CMD escolhida', 'b-pedido-2', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: '' }),
      F('Passo 3 · entrega', 'b-pedido-3', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: '' }),
      F('Passo 3 · NFC escolhido', 'b-pedido-3', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: 'nfc' }),
      F('Passo 4 · confirmar', 'b-pedido-4', { u: 'sofia', tipo: 'sub23', id: 'cmd', ent: 'nfc' }),
    ],
    common1: [
      F('Pedido enviado', 'pedido-enviado', { u: 'sofia', enviado: '1' }),
      F('Pedidos · em análise', 'app-pedidos', { u: 'sofia', enviado: '1' }),
    ],
  },
  'Tarefa 3 · Resolver um erro': {
    common0: [
      F('Início (Carlos)', 'app-inicio', { u: 'carlos' }),
      F('Renovar passe', 'renovar', { u: 'carlos' }),
    ],
    A: [
      F('Erro + pop-up do Andy', 'a-erro', { u: 'carlos', pop: '1' }),
      F('Erro (pop-up fechado)', 'a-erro', { u: 'carlos', pop: '' }),
      F('Andy · conversa', 'andy', { u: 'carlos', ctx: 'erro' }),
      F('Andy · confirmar no MB WAY', 'andy', { u: 'carlos', ctx: 'erro', mb: '1' }),
      F('Andy · outro meio', 'andy', { u: 'carlos', ctx: 'erro', sheet: '1' }),
    ],
    B: [
      F('Erro + Andy no ecrã', 'b-erro', { u: 'carlos' }),
      F('Erro + Andy · confirmar no MB WAY', 'b-erro', { u: 'carlos', mb: '1' }),
      F('Erro + Andy · outro meio', 'b-erro', { u: 'carlos', sheet: '1' }),
    ],
    common1: [
      F('Passe renovado', 'renovado', { u: 'carlos' }),
    ],
  },
  'Outros ecrãs': {
    common0: [F('Mais', 'app-mais', { u: 'sofia' })],
    A: [F('Andy · início', 'andy', { u: 'sofia', ctx: 'geral' })],
    B: [F('Andy · início', 'andy', { u: 'sofia', ctx: 'geral' })],
    common1: [],
  },
};

/* Expande para a lista final de frames (com versão) */
function allFrames(versions = ['A', 'B']) {
  const out = [];
  for (const v of versions) {
    for (const [grupo, def] of Object.entries(FLOWS)) {
      const list = Array.isArray(def) ? def : [...def.common0, ...def[v], ...def.common1];
      list.forEach(f => out.push({ ...f, v, grupo }));
    }
  }
  out.forEach((f, i) => { f.idx = i; f.id = `${f.v}-${String(i + 1).padStart(2, '0')}`; f.titulo = `${f.v} · ${f.grupo.split(' · ')[0]} · ${f.nome}`; });
  return out;
}

const norm = x => (x === undefined || x === null || x === '0') ? '' : String(x);

/* Encontra o frame que corresponde a (versão, ecrã, estado) */
function matchFrame(frames, v, screen, sel) {
  let best = null, bestScore = -1;
  for (const f of frames) {
    if (f.v !== v || f.screen !== screen) continue;
    let ok = true, score = 0;
    for (const [k, val] of Object.entries(f.sel)) {
      if (norm(sel[k]) !== norm(val)) { ok = false; break; }
      score++;
    }
    if (ok && score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}

/* Calcula as ligações (cliques) de cada frame, usando os mesmos atributos data-go / data-set que a app usa */
function computeLinks(frames, rootEls) {
  const links = [];
  frames.forEach((f, i) => {
    const root = rootEls[i];
    root.querySelectorAll('[data-go],[data-set]').forEach(b => {
      if (b.disabled || b.dataset.go === '') return;
      const sel = { ...f.sel, ...parseSet(b.dataset.set) };
      const to = matchFrame(frames, f.v, b.dataset.go || f.screen, sel);
      if (!to || to.idx === f.idx) return;
      const label = (b.dataset.label || b.textContent).trim().replace(/\s+/g, ' ');
      const R = root.getBoundingClientRect(), r = b.getBoundingClientRect();
      const rect = { x: Math.round(r.left - R.left), y: Math.round(r.top - R.top), w: Math.round(r.width), h: Math.round(r.height) };
      if (!links.some(l => l.from === f.idx && l.label === label)) links.push({ from: f.idx, to: to.idx, label, rect });
    });
  });
  return links;
}
