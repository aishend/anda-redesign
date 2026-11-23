/* Ecrãs do protótipo.
 *
 * Cada ecrã é uma função (sel, v) => HTML, onde:
 *   v   = versão 'A' ou 'B'
 *   sel = estado da tarefa (escolhas feitas, utilizador, etc.)
 *
 * A navegação é declarativa (é isto que permite gerar a galeria e ligar os ecrãs no Figma):
 *   data-go="ecra"        → vai para outro ecrã
 *   data-set="k=v;k2=v2"  → altera o estado (pode combinar com data-go)
 *   data-toast="texto"    → mostra uma mensagem (funcionalidade fora do âmbito do protótipo)
 *   data-label="texto"    → texto que o plugin do Figma usa para encontrar o botão (por omissão, o texto visível)
 */

const USERS = {
  sofia: {
    nome: 'Sofia', completo: 'Sofia Lopes', idade: 20,
    passe: 'Passe Sub23', estado: 'Válido', ate: '31 out', faltam: 'faltam 2 dias', lido: '21:40',
  },
  carlos: {
    nome: 'Carlos', completo: 'Carlos Moreira', idade: 54,
    passe: 'Passe Metropolitano', estado: 'Válido', ate: '31 out', faltam: 'faltam 2 dias', lido: '08:05',
  },
};

// Histórico da Sofia (tarefa 1). O carregamento de novembro foi pago na app mas ainda não foi gravado no cartão.
const HIST = [
  { dia: '29 out', tipo: 'v', t: 'Validação · Trindade (Metro)', r: '08:12' },
  { dia: '28 out', tipo: 'c', t: 'Carregamento Sub23 · novembro', s: 'App Anda · por gravar no cartão', r: '0,00 €', pend: true },
  { dia: '28 out', tipo: 'v', t: 'Validação · Campanhã (CP)', r: '18:40' },
  { dia: '27 out', tipo: 'v', t: 'Validação · Paredes (CP)', r: '08:12' },
  { dia: '30 set', tipo: 'c', t: 'Carregamento Sub23 · outubro', s: 'Máquina Campanhã · gravado no cartão', r: '0,00 €' },
];

const PASSES = [
  { id: 'sub23', t: 'Sub23', s: 'Até aos 23 anos · gratuito' },
  { id: '4_18', t: '4_18', s: 'Estudantes dos 4 aos 18 anos' },
  { id: 'senior', t: 'Sénior 65+', s: 'A partir dos 65 anos' },
  { id: 'social', t: 'Social+', s: 'Apoio social' },
];
const ENTREGA = [
  { id: 'nfc', t: 'No meu telemóvel (NFC)', s: 'Fica disponível logo após a aprovação', p: '0,00 €' },
  { id: 'atual', t: 'No meu cartão atual', s: 'Cartão Andante nº •••• 3381', p: '0,00 €' },
  { id: 'novo', t: 'Cartão novo por correio', s: 'Entrega em 5 a 7 dias úteis', p: '3,00 €' },
];

const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Respostas simuladas do Andy (por palavras-chave) — o caminho principal da tarefa continua a ser pelos botões
function andyReply(t, u) {
  const m = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const has = (...k) => k.some(x => m.includes(x));
  if (has('ola', 'bom dia', 'boa tarde', 'boa noite')) return `Olá, ${u.nome}! Em que posso ajudar?`;
  if (has('mb way', 'mbway', 'pagar', 'pagamento', 'pago', 'cartao bancario', 'multibanco')) return 'Posso pagar com o MB WAY deste telemóvel. Toque em «Sim, pagar com MB WAY» e confirme na app do MB WAY. Não é cobrado nada antes de confirmar.';
  if (has('erro', 'nao consigo', 'falhou', 'problema')) return 'A renovação parou porque não há nenhum método de pagamento guardado. Não foi cobrado nada. Posso ajudar a pagar com o MB WAY.';
  if (has('renov')) return 'Para renovar, vá a Início → Renovar passe. Se faltar um método de pagamento, eu ajudo a resolver.';
  if (has('sub23', 'pedir', 'pedido', 'passe novo')) return 'Pode pedir o Sub23 na app: Pedidos → Novo pedido. Com a Chave Móvel Digital a idade fica confirmada na hora.';
  if (has('validar', 'valid', 'carreg', 'gravad', 'cartao')) return 'Em Cartão → Carregamentos vê se cada carregamento já ficou gravado. Se aparecer «por gravar», encoste o cartão ao telemóvel ou valide numa estação.';
  if (has('obrigad')) return 'De nada! Estou aqui se precisar.';
  return 'Desculpe, ainda não sei responder a isso. Posso ajudar a renovar o passe, pagar com MB WAY, pedir o Sub23 ou ver os carregamentos.';
}

/* ---------- Componentes ---------- */
const H = {
  top(title, back) {
    return `<div class="topbar">${back ? `<button class="back" data-go="${back}" data-label="‹" aria-label="Voltar"><span class="glyph">‹</span></button>` : `<img class="logo" src="assets/logo_anda_white.png" alt="anda">`}<h1>${back ? title : ''}</h1></div>`;
  },
  tabs(on) {
    const t = [['app-inicio', 'Início', I.home], ['app-cartao', 'Cartão', I.card], ['app-pedidos', 'Pedidos', I.list], ['app-mais', 'Mais', I.more]];
    return `<nav class="tabbar">${t.map(([go, l, ic]) => `<button data-go="${go}" data-set="f=tudo" class="${go === on ? 'on' : ''}">${ic}<span>${l}</span></button>`).join('')}</nav>`;
  },
  pass(u, extra = '') {
    return `<div class="card pass"><img class="pattern" src="assets/design_andante_pattern.png" alt="">
      <div class="row"><h2>${u.passe}</h2><span class="badge ok">${I.check.replace('width="24" height="24"', 'width="14" height="14"')}${u.estado}</span></div>
      <div class="muted" style="font-size:16px;margin-top:2px">Até ${u.ate} · ${u.faltam}</div>
      <div class="small" style="margin-top:6px">Lido do cartão às ${u.lido}</div>${extra}</div>`;
  },
  option(on, set, t, s, price = '', go = '') {
    return `<button class="option ${on ? 'on' : ''}" data-set="${set}" ${go ? `data-go="${go}"` : ''} data-label="${t}"><span class="radio"><i></i></span><span style="flex:1"><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</span>${price ? `<span class="price">${price}</span>` : ''}</button>`;
  },
  nfcIllu() {
    return `<svg viewBox="0 0 200 110" width="200" height="110" aria-hidden="true">
      <rect x="92" y="14" width="96" height="60" rx="8" fill="#bbbfe6" transform="rotate(-12 140 44)"/>
      <rect x="98" y="22" width="40" height="8" rx="3" fill="#303f9f" transform="rotate(-12 140 44)"/>
      <rect x="30" y="6" width="58" height="100" rx="10" fill="#1a237e"/><rect x="35" y="16" width="48" height="78" rx="4" fill="#fff"/>
      <path d="M96 40a14 14 0 010 22M102 34a22 22 0 010 34" stroke="#303f9f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="59" y="58" font-size="13" font-weight="700" fill="#303f9f" text-anchor="middle" font-family="Source Sans 3, sans-serif">NFC</text></svg>`;
  },
  fotoBtns() {
    return `<div class="chips foto-btns"><button class="chip" data-toast="Abre a câmara (simulado)." data-label="Fotografar">${I.camera.replace('width="24" height="24"', 'width="16" height="16"')} Fotografar</button><button class="chip" data-toast="Abre os ficheiros (simulado)." data-label="Escolher ficheiro">${I.doc.replace('width="24" height="24"', 'width="16" height="16"')} Escolher ficheiro</button></div>`;
  },
  andyFab(ctx = 'geral') {
    return `<button class="andy-fab" data-go="andy" data-set="ctx=${ctx}" data-label="Precisa de ajuda?"><span class="andy-av">A</span><span>Precisa de ajuda?</span></button>`;
  },
  mbway(go) {
    return `<div class="notif"><div class="nh"><span class="mbway">MB</span><b>MB WAY</b><span style="margin-left:auto">agora</span></div>
      <div class="nb"><b>Confirmar pagamento</b><br>40,00 € a Transportes Metropolitanos do Porto</div>
      <div class="na"><button class="btn secondary" data-set="mb=0" data-toast="Pagamento recusado. Não foi cobrado nada." data-label="Recusar">Recusar</button><button class="btn primary" data-go="${go}" data-set="mb=0" data-label="Confirmar">Confirmar</button></div></div>`;
  },
  histItem(h) {
    const ic = h.tipo === 'c' ? (h.pend ? `<span class="ic warn">${I.topup}</span>` : `<span class="ic ok">${I.topup}</span>`) : `<span class="ic">${I.train}</span>`;
    const s = h.s ? `<div class="s">${h.pend ? '⚠ ' : '✓ '}${h.s}</div>` : '';
    return `<div class="item">${ic}<div class="grow"><div class="t">${h.t}</div>${s}</div><div class="r">${h.r}</div></div>`;
  },
};

/* ---------- Ecrãs ---------- */
const SCREENS = {
  /* Ecrã inicial do telemóvel, com o widget da Anda (Tarefa 1) */
  'os-home'(sel, v) {
    const u = USERS[sel.u || 'sofia'];
    const widgetA = `
      <div class="w-head"><img src="assets/ic_anda.png" alt=""><span class="grow">Anda</span><span>lido às ${u.lido}</span></div>
      <div class="w-title"><span>${u.passe}</span><span class="badge ok">${u.estado}</span></div>
      <div class="w-sub">Até ${u.ate} · ${u.faltam}</div>
      <div class="w-actions"><span>Renovar</span><span>Histórico</span></div>`;
    const widgetB = `
      <div class="w-head"><img src="assets/ic_anda.png" alt=""><span class="grow">Anda</span><span>lido às ${u.lido}</span></div>
      <div class="w-title"><span>${u.passe}</span><span class="badge ok">${u.estado}</span></div>
      <div class="w-sub">Até ${u.ate} · ${u.faltam}</div>
      <div class="w-row"><span class="badge warn">⚠</span><span><b>Carregamento de novembro por gravar</b><br><span class="muted">Encoste o cartão ao telemóvel ou valide numa estação.</span></span></div>`;
    const apps = [['Mapas', '#3c8d5a'], ['Câmara', '#555'], ['Mensagens', '#2fa84f'], ['Calendário', '#e0573d'], ['Fotos', '#d9a033'], ['Definições', '#777'], ['Relógio', '#222'], ['Notas', '#e8c23a']];
    return `<div class="os">
      <div class="clock">21:40</div><div class="date">quinta-feira, 29 de outubro</div>
      <button class="widget" data-go="app-cartao" data-set="f=tudo" data-label="${u.passe}">${v === 'B' ? widgetB : widgetA}</button>
      <div class="apps">${apps.map(([n, c]) => `<button class="app-icon" data-toast="Abra a app Anda ou use o widget." data-label="${n}"><span class="ico" style="background:${c}">${n[0]}</span>${n}</button>`).join('')}</div>
      <div class="dock">
        <button class="app-icon" data-go="app-inicio" data-label="Anda"><span class="ico"><img src="assets/ic_anda.png" alt=""></span>Anda</button>
        <span class="app-icon"><span class="ico" style="background:#2b7de9">T</span>Telefone</span>
        <span class="app-icon"><span class="ico" style="background:#4b9be8">B</span>Browser</span>
        <span class="app-icon"><span class="ico" style="background:#e94b7d">M</span>Música</span>
      </div></div>`;
  },

  'app-inicio'(sel, v) {
    const u = USERS[sel.u || 'sofia'];
    return `<div class="app">${H.top('')}
      <div class="content">
        <div style="font-size:22px;font-weight:700">Olá, ${u.nome}</div>
        ${H.pass(u)}
        <div class="section-title">O que quer fazer?</div>
        <div class="list">
          <button class="item tap" ${sel.u === 'carlos' ? 'data-go="renovar"' : 'data-toast="O Sub23 de novembro já foi carregado. Veja no Cartão."'} data-label="Renovar passe"><span class="ic">${I.topup}</span><div class="grow"><div class="t">Renovar passe</div><div class="s">${sel.u === 'carlos' ? 'Novembro · 40,00 €' : 'Novembro · 0,00 €'}</div></div>${I.chev}</button>
          <button class="item tap" data-go="app-cartao" data-set="f=tudo" data-label="Ver histórico"><span class="ic">${I.card}</span><div class="grow"><div class="t">Ver histórico</div><div class="s">Viagens e carregamentos</div></div>${I.chev}</button>
          <button class="item tap" data-go="app-pedidos" data-label="Pedir um passe"><span class="ic">${I.doc}</span><div class="grow"><div class="t">Pedir um passe</div><div class="s">Sub23, 4_18, Sénior e outros</div></div>${I.chev}</button>
        </div>
      </div>
      ${v === 'A' ? H.andyFab() : ''}
      ${H.tabs('app-inicio')}</div>`;
  },

  'app-cartao'(sel, v) {
    const u = USERS[sel.u || 'sofia'];
    const f = sel.f || 'tudo';
    const rows = HIST.filter(h => f === 'tudo' || (f === 'viagens' ? h.tipo === 'v' : h.tipo === 'c'));
    let html = '', lastDay = '';
    for (const h of rows) { if (h.dia !== lastDay) { html += `<div class="day">${h.dia}</div>`; lastDay = h.dia; } html += H.histItem(h); }
    const chip = (id, l) => `<button class="chip ${f === id ? 'on' : ''}" data-set="f=${id}" data-label="${l}">${l}</button>`;
    return `<div class="app">${H.top('O meu cartão', 'app-inicio')}
      <div class="content">
        ${H.pass(u)}
        <div class="chips">${chip('tudo', 'Tudo')}${chip('viagens', 'Viagens')}${chip('carregamentos', 'Carregamentos')}</div>
        <div class="list">${html}</div>
      </div>
      ${v === 'A' ? H.andyFab() : ''}
      ${H.tabs('app-cartao')}</div>`;
  },

  'app-pedidos'(sel, v) {
    const enviado = sel.enviado === '1';
    return `<div class="app">${H.top('Pedidos', 'app-inicio')}
      <div class="content">
        ${enviado ? `<div class="section-title">Em curso</div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Sub23 2026/27</h2><span class="badge info">Em análise</span></div><div class="muted">Nº SUB-2026-04817 · no telemóvel (NFC)</div></div>`
          : `<div class="card" style="text-align:center;border-style:dashed"><b>Ainda não tem pedidos em curso.</b><div class="muted">Peça um passe sem ir à loja.</div></div>`}
        <button class="btn primary" data-go="${v === 'B' ? 'b-pedido-1' : 'a-pedido-tipo'}" data-set="tipo=;id=;ent=" data-label="Novo pedido">${I.plus} Novo pedido</button>
        <div class="section-title">Pedidos anteriores</div>
        <div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Sub23 2025/26</h2><span class="badge ok">Aprovado</span></div><div class="muted">Pedido na Loja Andante · set 2025</div></div>
      </div>
      ${v === 'A' ? H.andyFab() : ''}
      ${H.tabs('app-pedidos')}</div>`;
  },

  'app-mais'(sel, v) {
    const it = (ic, t, extra = '') => `<button class="item tap" ${extra || `data-toast="Não disponível neste protótipo."`} data-label="${t}"><span class="ic">${ic}</span><div class="grow"><div class="t">${t}</div></div>${I.chev}</button>`;
    return `<div class="app">${H.top('Mais', 'app-inicio')}
      <div class="content"><div class="list">
        ${it(I.user, 'Perfil')}${it(I.card, 'Meios de pagamento')}${it(I.gear, 'Definições')}
        ${it(I.help, 'Andy · Ajuda', 'data-go="andy" data-set="ctx=geral"')}
        ${it(I.mail, 'Contactos')}${it(I.logout, 'Terminar sessão')}
      </div><div class="small" style="text-align:center">Protótipo académico · IPC FEUP 2026/27</div></div>
      ${H.tabs('app-mais')}</div>`;
  },

  /* ----- Tarefa 2 · Versão A: duas páginas (escolher passe → detalhes num só ecrã) ----- */
  'a-pedido-tipo'(sel) {
    return `<div class="app">${H.top('Novo pedido', 'app-pedidos')}
      <div class="content"><div class="q">Que passe quer pedir?</div>
        <div class="options">${PASSES.map(p => H.option(sel.tipo === p.id, `tipo=${p.id}`, p.t, p.s)).join('')}</div></div>
      <div class="footer-actions"><button class="btn primary" ${sel.tipo ? '' : 'disabled'} data-go="a-pedido-detalhes" data-label="Continuar">Continuar</button></div>
      ${H.tabs('app-pedidos')}</div>`;
  },
  'a-pedido-detalhes'(sel) {
    const u = USERS.sofia;
    const ok = sel.id && sel.ent;
    return `<div class="app">${H.top('Pedido ' + (PASSES.find(p => p.id === sel.tipo) || PASSES[0]).t, 'a-pedido-tipo')}
      <div class="content">
        <div class="q">Comprovar a idade</div>
        <div class="options">
          ${H.option(sel.id === 'cmd', 'id=cmd', 'Chave Móvel Digital', `${u.completo} · ${u.idade} anos ✓ · pode pedir o Sub23`)}
          ${H.option(sel.id === 'foto', 'id=foto', 'Enviar foto do Cartão de Cidadão', '')}${H.fotoBtns()}
        </div>
        <div class="q">Onde quer o passe?</div>
        <div class="options">${ENTREGA.map(e => H.option(sel.ent === e.id, `ent=${e.id}`, e.t, '', e.p)).join('')}</div>
      </div>
      <div class="footer-actions"><button class="btn primary" ${ok ? '' : 'disabled'} data-go="pedido-enviado" data-set="enviado=1" data-label="Enviar pedido">Enviar pedido</button></div>
      ${H.tabs('app-pedidos')}</div>`;
  },

  /* ----- Tarefa 2 · Versão B: passo a passo (4 passos com barra de progresso) ----- */
  'b-pedido-1'(sel) { return SCREENS._wiz(1, sel, 'Que passe quer pedir?', `<div class="options">${PASSES.map(p => H.option(sel.tipo === p.id, `tipo=${p.id}`, p.t, p.s)).join('')}</div>`, !!sel.tipo, 'app-pedidos'); },
  'b-pedido-2'(sel) {
    const u = USERS.sofia;
    return SCREENS._wiz(2, sel, 'Como quer comprovar a idade?', `<div class="options">
      ${H.option(sel.id === 'cmd', 'id=cmd', 'Chave Móvel Digital', `${u.completo} · ${u.idade} anos ✓ · pode pedir o Sub23`)}
      ${H.option(sel.id === 'foto', 'id=foto', 'Enviar foto do Cartão de Cidadão', '')}${H.fotoBtns()}</div>
      <div class="alertbox info">A Chave Móvel Digital confirma a idade na hora. Com foto, o pedido demora mais 2 dias.</div>`, !!sel.id);
  },
  'b-pedido-3'(sel) { return SCREENS._wiz(3, sel, 'Onde quer o passe?', `<div class="options">${ENTREGA.map(e => H.option(sel.ent === e.id, `ent=${e.id}`, e.t, e.s, e.p)).join('')}</div>`, !!sel.ent); },
  'b-pedido-4'(sel) {
    const p = PASSES.find(x => x.id === sel.tipo) || PASSES[0];
    const e = ENTREGA.find(x => x.id === sel.ent) || ENTREGA[0];
    return SCREENS._wiz(4, sel, 'Confirme o seu pedido', `<div class="card">
      <div class="kv"><span>Passe</span><span>${p.t}</span></div>
      <div class="kv"><span>Idade</span><span>${sel.id === 'foto' ? 'Foto do CC' : 'Chave Móvel Digital ✓'}</span></div>
      <div class="kv"><span>Onde</span><span>${e.t.replace('No meu ', '').replace('Cartão novo por correio', 'Cartão novo')}</span></div>
      <div class="kv"><span>Custo</span><span>${e.p}</span></div></div>
      <div style="display:flex;gap:16px"><button class="btn link" data-go="b-pedido-1" data-label="Alterar passe">Alterar passe</button><button class="btn link" data-go="b-pedido-3" data-label="Alterar entrega">Alterar entrega</button></div>`, true);
  },
  _wiz(n, sel, q, body, can, back) {
    const prog = [1, 2, 3, 4].map(i => `<span class="${i <= n ? 'on' : ''}"></span>`).join('');
    const next = n < 4 ? `data-go="b-pedido-${n + 1}" data-label="Continuar"` : `data-go="pedido-enviado" data-set="enviado=1" data-label="Enviar pedido"`;
    return `<div class="app">${H.top('Novo pedido', back || `b-pedido-${n - 1}`)}
      <div class="content"><div class="progress">${prog}</div><div class="small">Passo ${n} de 4</div>
        <div class="q">${q}</div>${body}</div>
      <div class="footer-actions"><button class="btn primary" ${can ? '' : 'disabled'} ${next}>${n < 4 ? 'Continuar' : 'Enviar pedido'}</button></div>
      ${H.tabs('app-pedidos')}</div>`;
  },

  'pedido-enviado'(sel) {
    return `<div class="app">${H.top('Pedido enviado', '')}
      <div class="content">
        <div class="result"><div class="big ok">${I.check}</div><h2>Recebemos o seu pedido</h2><div class="muted">Nº SUB-2026-04817</div></div>
        <div class="card"><ul class="steps">
          <li class="done"><i></i>Enviado · hoje</li><li><i></i>Em análise · até 5 dias úteis</li><li><i></i>Aprovado</li><li><i></i>Disponível no telemóvel</li></ul></div>
        <div class="muted">Avisamos por notificação e e-mail quando o estado mudar.</div>
      </div>
      <div class="footer-actions"><button class="btn secondary" data-go="app-pedidos" data-label="Ver os meus pedidos">Ver os meus pedidos</button></div>
      ${H.tabs('app-pedidos')}</div>`;
  },

  /* ----- Tarefa 3: renovar o passe sem método de pagamento ----- */
  'renovar'(sel, v) {
    const u = USERS[sel.u || 'carlos'];
    return `<div class="app">${H.top('Renovar passe', 'app-inicio')}
      <div class="content">
        <div class="card"><div class="kv"><span>Título</span><span>${u.passe}</span></div><div class="kv"><span>Período</span><span>1 a 30 nov</span></div><div class="kv"><span>Preço</span><span>40,00 €</span></div></div>
        <div class="card" style="display:flex;justify-content:space-between"><b>Pagar com</b><span class="muted">Nenhum guardado</span></div>
        <div class="card nfc-illu">${H.nfcIllu()}<div class="muted">Depois de pagar, encoste o cartão Andante atrás do telemóvel para gravar o passe.</div></div>
      </div>
      ${v === 'A' ? H.andyFab('renovar') : ''}
      <div class="footer-actions"><button class="btn primary" data-go="${v === 'B' ? 'b-erro' : 'a-erro'}" data-set="${v === 'B' ? '' : 'pop=1'}" data-label="Pagar 40,00 € e renovar">Pagar 40,00 € e renovar</button></div>
      ${H.tabs('app-inicio')}</div>`;
  },

  // Versão A: erro + pop-up do Andy que oferece ajuda
  'a-erro'(sel) {
    return `<div class="app">${H.top('Renovar passe', 'renovar')}
      <div class="content">
        <div class="result"><div class="big err">${I.alert}</div><h2>Não foi possível renovar</h2></div>
        <div class="alertbox err"><b>Falta um método de pagamento.</b>Não foi cobrado nada.</div>
        <button class="btn link" data-toast="Abre Meios de pagamento (fora do âmbito do protótipo)." data-label="Adicionar método de pagamento">Adicionar método de pagamento</button>
      </div>
      ${sel.pop === '1' ? `<div class="andy-pop"><div class="h"><span class="andy-av">A</span>Andy<button class="x" data-set="pop=0" data-label="✕" aria-label="Fechar">✕</button></div>
        <p>Falta um método de pagamento. Posso ajudar a adicionar o MB WAY deste telemóvel e renovar já o passe.</p>
        <button class="btn primary" data-go="andy" data-set="ctx=erro;pop=0" data-label="Sim, ajudar">Sim, ajudar</button></div>` : H.andyFab('erro')}
      ${H.tabs('app-inicio')}</div>`;
  },

  'andy'(sel, v) {
    const u = USERS[sel.u || 'carlos'];
    const erro = sel.ctx === 'erro';
    const msgs = erro
      ? `<div class="msg-who">Andy</div><div class="msg bot">Olá, ${u.nome}. A renovação parou porque não tem nenhum método de pagamento. Não foi cobrado nada.</div>
         <div class="msg-who">Andy</div><div class="msg bot">Quer pagar os <b>40,00 €</b> com o MB WAY deste telemóvel (912 *** 678)?</div>
         <button class="btn primary" data-set="mb=1" data-label="Sim, pagar com MB WAY">Sim, pagar com MB WAY</button>
         <button class="btn secondary" data-set="sheet=1" data-label="Usar outro meio">Usar outro meio</button>
         <div class="small">Depois de confirmar no MB WAY, encoste o cartão ao telemóvel para gravar o passe.</div>`
      : `<div class="msg-who">Andy</div><div class="msg bot">Olá, ${u.nome}! Sou o Andy, o assistente da Anda. Em que posso ajudar?</div>
         <div class="chips"><button class="chip" data-go="renovar" data-label="Renovar o passe">Renovar o passe</button><button class="chip" data-go="app-cartao" data-set="f=carregamentos" data-label="O carregamento ficou no cartão?">O carregamento ficou no cartão?</button><button class="chip" data-go="app-pedidos" data-label="Pedir o Sub23">Pedir o Sub23</button></div>`;
    return `<div class="app">${H.top('Andy', erro ? 'a-erro' : 'app-inicio')}
      <div class="chat">${msgs}${sel.said ? `<div class="msg me">${esc(sel.said)}</div><div class="msg-who">Andy</div><div class="msg bot">${andyReply(sel.said, u)}</div>` : ''}</div>
      <form class="composer" data-chat><input name="m" placeholder="Escreva ou toque no microfone…" autocomplete="off"><button type="button" class="mic" data-toast="A ouvir… (simulado)" data-label="mic">${I.mic}</button></form>
      ${sel.mb === '1' ? H.mbway('renovado') : ''}
      ${sel.sheet === '1' ? SCREENS._outroMeio() : ''}
      ${H.tabs('app-inicio')}</div>`;
  },

  // Versão B: o Andy aparece dentro do próprio ecrã de erro (sem pop-up nem página de conversa)
  'b-erro'(sel) {
    const u = USERS[sel.u || 'carlos'];
    return `<div class="app">${H.top('Renovar passe', 'renovar')}
      <div class="content">
        <div class="result" style="padding-top:6px"><div class="big err">${I.alert}</div><h2>Não foi possível renovar</h2></div>
        <div class="alertbox err"><b>Falta um método de pagamento.</b>Não foi cobrado nada.</div>
        <div class="card andy-card">
          <div class="andy-head"><span class="andy-av">A</span><b>Andy</b><span class="small">o seu assistente</span></div>
          <p>${u.nome}, a renovação parou porque não tem nenhum método de pagamento. Posso pagar os <b>40,00 €</b> com o MB WAY deste telemóvel (912 *** 678) e renovar já o passe.</p>
          <button class="btn primary" data-set="mb=1" data-label="Sim, pagar com MB WAY">Sim, pagar com MB WAY</button>
          <button class="btn secondary" data-set="sheet=1" data-label="Usar outro meio">Usar outro meio</button>
          <div class="small">Depois de confirmar no MB WAY, encoste o cartão ao telemóvel para gravar o passe.</div>
        </div>
      </div>
      ${sel.mb === '1' ? H.mbway('renovado') : ''}
      ${sel.sheet === '1' ? SCREENS._outroMeio() : ''}
      ${H.tabs('app-inicio')}</div>`;
  },
  _outroMeio() {
    return `<div class="sheet-bg"><div class="sheet"><h3>Escolher outro meio</h3>
      <div class="list">
        <button class="item tap" data-toast="Não disponível neste protótipo." data-label="Cartão bancário"><span class="ic">${I.card}</span><div class="grow"><div class="t">Cartão bancário</div></div>${I.chev}</button>
        <button class="item tap" data-toast="Não disponível neste protótipo." data-label="Referência Multibanco"><span class="ic">${I.doc}</span><div class="grow"><div class="t">Referência Multibanco</div></div>${I.chev}</button>
      </div><button class="btn secondary" data-set="sheet=0" data-label="Cancelar">Cancelar</button></div></div>`;
  },

  'renovado'(sel) {
    const u = USERS[sel.u || 'carlos'];
    return `<div class="app">${H.top('Renovar passe', '')}
      <div class="content">
        <div class="result"><div class="big ok">${I.check}</div><h2>Passe renovado</h2><div class="muted">Pagamento confirmado no MB WAY</div></div>
        <div class="card"><div class="kv"><span>${u.passe}</span><span>1 a 30 nov</span></div><div class="kv"><span>Pago</span><span>40,00 € · MB WAY</span></div><div class="small">Gravado no cartão às 21:46 ✓</div></div>
        <div class="muted">O MB WAY ficou guardado como método de pagamento para as próximas renovações.</div>
      </div>
      <div class="footer-actions"><button class="btn secondary" data-go="app-inicio" data-label="Voltar ao início">Voltar ao início</button></div>
      ${H.tabs('app-inicio')}</div>`;
  },
};

/* ---------- Tarefas do teste com utilizadores ---------- */
const TASKS = {
  1: {
    titulo: 'Ver o estado do passe',
    texto: 'Imagine que é a <b>Sofia</b>, tem 20 anos e usa o passe Sub23. Ontem carregou o passe de novembro na app.<br><br>Descubra, o mais depressa que conseguir, <b>se o passe está válido</b> e <b>se o carregamento de novembro já ficou gravado no cartão</b>.<br><br>Quando souber, toque em <b>«Terminei»</b>.',
    start: 'os-home', sel: { u: 'sofia' }, fim: null,
    perguntas: [
      { k: 'valido', q: 'O passe está válido?', certo: 'Sim' },
      { k: 'gravado', q: 'O carregamento de novembro já está gravado no cartão?', certo: 'Não' },
    ],
  },
  2: {
    titulo: 'Pedir o passe Sub23',
    texto: 'Continua a ser a <b>Sofia</b>. Precisa do passe <b>Sub23</b> para o novo ano letivo e quer tratar disso sem ir à loja.<br><br>Faça o pedido do Sub23 na app, com o passe <b>no seu telemóvel</b>.',
    start: 'app-inicio', sel: { u: 'sofia' }, fim: 'pedido-enviado',
    certo: sel => sel.tipo === 'sub23' && sel.ent === 'nfc',
  },
  3: {
    titulo: 'Renovar o passe',
    texto: 'Agora é o <b>Carlos</b>, tem 54 anos. Quer renovar o seu <b>Passe Metropolitano</b> para novembro, na app.<br><br>Se aparecer algum problema, tente resolvê-lo <b>sem sair da app</b>. Pode usar o MB WAY deste telemóvel.',
    start: 'app-inicio', sel: { u: 'carlos' }, fim: 'renovado',
    certo: () => true,
  },
};
