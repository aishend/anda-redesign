// Plugin «Anda · atualizar protótipo».
// Pega na galeria importada (galeria.html?figma, com as versões A e B), põe cada versão na sua página,
// apaga os ecrãs antigos, cria as zonas clicáveis alinhadas com os botões e os pontos de início (1 por tarefa).
// As ligações (DATA) vêm de window.FIGMA_LINKS em galeria.html?figma.
const DATA = {"n":["A · Tarefa 1 · Ecrã inicial do telemóvel","A · Tarefa 1 · O meu cartão · Carregamentos","A · Tarefa 1 · O meu cartão · Validações","A · Tarefa 1 · O meu cartão · Viagens","A · Tarefa 2 · Início (Sofia)","A · Tarefa 2 · Pedidos","A · Tarefa 2 · Novo pedido · tipo","A · Tarefa 2 · Novo pedido · Sub23 escolhido","A · Tarefa 2 · Pedido Sub23 · detalhes","A · Tarefa 2 · Pedido Sub23 · CMD escolhida","A · Tarefa 2 · Pedido Sub23 · tudo preenchido","A · Tarefa 2 · Pedido enviado","A · Tarefa 2 · Pedidos · em análise","A · Tarefa 3 · Início (Carlos)","A · Tarefa 3 · Renovar passe","A · Tarefa 3 · Erro + pop-up do Andy","A · Tarefa 3 · Erro (pop-up fechado)","A · Tarefa 3 · Andy · conversa","A · Tarefa 3 · Andy · confirmar no MB WAY","A · Tarefa 3 · Andy · outro meio","A · Tarefa 3 · Passe renovado","A · Outros ecrãs · Mais","A · Outros ecrãs · Andy · início","B · Tarefa 1 · Ecrã inicial do telemóvel","B · Tarefa 1 · O meu cartão · Carregamentos","B · Tarefa 1 · O meu cartão · Validações","B · Tarefa 1 · O meu cartão · Viagens","B · Tarefa 2 · Início (Sofia)","B · Tarefa 2 · Pedidos","B · Tarefa 2 · Passo 1 · tipo","B · Tarefa 2 · Passo 1 · Sub23 escolhido","B · Tarefa 2 · Passo 2 · idade","B · Tarefa 2 · Passo 2 · CMD escolhida","B · Tarefa 2 · Passo 3 · entrega","B · Tarefa 2 · Passo 3 · NFC escolhido","B · Tarefa 2 · Passo 4 · confirmar","B · Tarefa 2 · Pedido enviado","B · Tarefa 2 · Pedidos · em análise","B · Tarefa 3 · Início (Carlos)","B · Tarefa 3 · Renovar passe","B · Tarefa 3 · Erro + Andy no ecrã","B · Tarefa 3 · Erro + Andy · confirmar no MB WAY","B · Tarefa 3 · Erro + Andy · outro meio","B · Tarefa 3 · Passe renovado","B · Outros ecrãs · Mais","B · Outros ecrãs · Andy · início"],"l":[[0,1,18,168,354,142,"Passe Sub23"],[0,4,26,673,85,79,"Anda"],[1,4,10,44,34,34,"‹"],[1,2,162,227,104,33,"Validações"],[1,3,274,227,85,33,"Viagens"],[1,22,194,658,182,46,"Precisa de ajuda?"],[1,4,0,723,98,51,"Início"],[1,5,195,723,98,51,"Pedidos"],[1,21,293,723,98,51,"Mais"],[2,4,10,44,34,34,"‹"],[2,1,16,227,138,33,"Carregamentos"],[2,3,274,227,85,33,"Viagens"],[2,22,194,658,182,46,"Precisa de ajuda?"],[2,4,0,723,98,51,"Início"],[2,1,98,723,98,51,"Cartão"],[2,5,195,723,98,51,"Pedidos"],[2,21,293,723,98,51,"Mais"],[3,4,10,44,34,34,"‹"],[3,1,16,227,138,33,"Carregamentos"],[3,2,162,227,104,33,"Validações"],[3,22,194,658,182,46,"Precisa de ajuda?"],[3,4,0,723,98,51,"Início"],[3,1,98,723,98,51,"Cartão"],[3,5,195,723,98,51,"Pedidos"],[3,21,293,723,98,51,"Mais"],[4,1,17,367,356,65,"Ver histórico"],[4,5,17,432,356,83,"Pedir um passe"],[4,22,194,658,182,46,"Precisa de ajuda?"],[4,1,98,723,98,51,"Cartão"],[4,5,195,723,98,51,"Pedidos"],[4,21,293,723,98,51,"Mais"],[5,4,10,44,34,34,"‹"],[5,6,16,191,358,50,"Novo pedido"],[5,22,194,658,182,46,"Precisa de ajuda?"],[5,4,0,723,98,51,"Início"],[5,1,98,723,98,51,"Cartão"],[5,21,293,723,98,51,"Mais"],[6,5,10,44,34,34,"‹"],[6,5,299,45,75,32,"Cancelar"],[6,7,16,146,358,73,"Sub23"],[6,4,0,723,98,51,"Início"],[6,1,98,723,98,51,"Cartão"],[6,5,195,723,98,51,"Pedidos"],[6,21,293,723,98,51,"Mais"],[7,5,299,45,75,32,"Cancelar"],[7,8,16,654,358,50,"Continuar"],[7,4,0,723,98,51,"Início"],[7,1,98,723,98,51,"Cartão"],[7,21,293,723,98,51,"Mais"],[8,7,10,44,34,34,"‹"],[8,5,299,45,75,32,"Cancelar"],[8,9,16,146,358,73,"Chave Móvel Digital"],[8,4,0,723,98,51,"Início"],[8,1,98,723,98,51,"Cartão"],[8,21,293,723,98,51,"Mais"],[9,5,299,45,75,32,"Cancelar"],[9,10,16,375,358,53,"No meu telemóvel (NFC)"],[9,4,0,723,98,51,"Início"],[9,1,98,723,98,51,"Cartão"],[9,21,293,723,98,51,"Mais"],[10,5,299,45,75,32,"Cancelar"],[10,11,16,654,358,50,"Enviar pedido"],[10,4,0,723,98,51,"Início"],[10,1,98,723,98,51,"Cartão"],[10,21,293,723,98,51,"Mais"],[11,12,16,654,358,50,"Ver os meus pedidos"],[11,4,0,723,98,51,"Início"],[11,1,98,723,98,51,"Cartão"],[11,12,195,723,98,51,"Pedidos"],[11,21,293,723,98,51,"Mais"],[12,4,10,44,34,34,"‹"],[12,6,16,228,358,50,"Novo pedido"],[12,22,194,658,182,46,"Precisa de ajuda?"],[12,4,0,723,98,51,"Início"],[12,1,98,723,98,51,"Cartão"],[12,21,293,723,98,51,"Mais"],[13,14,17,302,356,65,"Renovar passe"],[14,13,10,44,34,34,"‹"],[14,13,299,45,75,32,"Cancelar"],[14,15,16,654,358,50,"Pagar 40,00 € e renovar"],[14,13,0,723,98,51,"Início"],[15,13,299,45,75,32,"Cancelar"],[15,16,329,516,30,30,"✕"],[15,17,31,627,328,50,"Sim, ajudar"],[15,13,114,679,163,28,"Cancelar renovação"],[16,14,10,44,34,34,"‹"],[16,13,299,45,75,32,"Cancelar"],[16,17,194,658,182,46,"Precisa de ajuda?"],[16,13,0,723,98,51,"Início"],[17,16,10,44,34,34,"‹"],[17,13,299,45,75,32,"Cancelar"],[17,18,16,313,358,50,"Sim, pagar com MB WAY"],[17,19,16,373,358,50,"Usar outro meio"],[17,13,114,435,163,28,"Cancelar renovação"],[17,13,0,723,98,51,"Início"],[18,17,24,136,168,40,"Recusar"],[18,20,200,136,166,40,"Confirmar"],[19,17,16,728,358,50,"Cancelar"],[20,13,16,654,358,50,"Voltar ao início"],[20,13,0,723,98,51,"Início"],[21,4,10,44,34,34,"‹"],[21,22,17,284,356,59,"Andy · Ajuda"],[21,4,0,723,98,51,"Início"],[21,1,98,723,98,51,"Cartão"],[21,5,195,723,98,51,"Pedidos"],[22,4,10,44,34,34,"‹"],[22,1,16,241,259,33,"O carregamento ficou no cartão?"],[22,5,16,282,124,33,"Pedir o Sub23"],[22,4,0,723,98,51,"Início"],[22,1,98,723,98,51,"Cartão"],[22,5,195,723,98,51,"Pedidos"],[22,21,293,723,98,51,"Mais"],[23,24,18,168,354,180,"Passe Sub23"],[23,27,26,673,85,79,"Anda"],[24,27,10,44,34,34,"‹"],[24,25,162,227,104,33,"Validações"],[24,26,274,227,85,33,"Viagens"],[24,27,0,723,98,51,"Início"],[24,28,195,723,98,51,"Pedidos"],[24,44,293,723,98,51,"Mais"],[25,27,10,44,34,34,"‹"],[25,24,16,227,138,33,"Carregamentos"],[25,26,274,227,85,33,"Viagens"],[25,27,0,723,98,51,"Início"],[25,24,98,723,98,51,"Cartão"],[25,28,195,723,98,51,"Pedidos"],[25,44,293,723,98,51,"Mais"],[26,27,10,44,34,34,"‹"],[26,24,16,227,138,33,"Carregamentos"],[26,25,162,227,104,33,"Validações"],[26,27,0,723,98,51,"Início"],[26,24,98,723,98,51,"Cartão"],[26,28,195,723,98,51,"Pedidos"],[26,44,293,723,98,51,"Mais"],[27,24,17,367,356,65,"Ver histórico"],[27,28,17,432,356,83,"Pedir um passe"],[27,24,98,723,98,51,"Cartão"],[27,28,195,723,98,51,"Pedidos"],[27,44,293,723,98,51,"Mais"],[28,27,10,44,34,34,"‹"],[28,29,16,191,358,50,"Novo pedido"],[28,27,0,723,98,51,"Início"],[28,24,98,723,98,51,"Cartão"],[28,44,293,723,98,51,"Mais"],[29,28,10,44,34,34,"‹"],[29,28,299,45,75,32,"Cancelar"],[29,30,16,226,358,73,"Sub23"],[29,27,0,723,98,51,"Início"],[29,24,98,723,98,51,"Cartão"],[29,28,195,723,98,51,"Pedidos"],[29,44,293,723,98,51,"Mais"],[30,28,299,45,75,32,"Cancelar"],[30,31,107,106,85,34,"Passo 2 · Idade"],[30,31,16,654,358,50,"Continuar"],[30,27,0,723,98,51,"Início"],[30,24,98,723,98,51,"Cartão"],[30,44,293,723,98,51,"Mais"],[31,30,10,44,34,34,"‹"],[31,28,299,45,75,32,"Cancelar"],[31,30,16,106,85,34,"Passo 1 · Passe"],[31,32,16,226,358,73,"Chave Móvel Digital"],[31,27,0,723,98,51,"Início"],[31,24,98,723,98,51,"Cartão"],[31,44,293,723,98,51,"Mais"],[32,28,299,45,75,32,"Cancelar"],[32,33,198,106,85,34,"Passo 3 · Entrega"],[32,33,16,654,358,50,"Continuar"],[32,27,0,723,98,51,"Início"],[32,24,98,723,98,51,"Cartão"],[32,44,293,723,98,51,"Mais"],[33,32,10,44,34,34,"‹"],[33,28,299,45,75,32,"Cancelar"],[33,32,107,106,85,34,"Passo 2 · Idade"],[33,34,16,226,358,92,"No meu telemóvel (NFC)"],[33,27,0,723,98,51,"Início"],[33,24,98,723,98,51,"Cartão"],[33,44,293,723,98,51,"Mais"],[34,28,299,45,75,32,"Cancelar"],[34,35,289,106,85,34,"Passo 4 · Confirmar"],[34,35,16,654,358,50,"Continuar"],[34,27,0,723,98,51,"Início"],[34,24,98,723,98,51,"Cartão"],[34,44,293,723,98,51,"Mais"],[35,34,10,44,34,34,"‹"],[35,28,299,45,75,32,"Cancelar"],[35,34,198,106,85,34,"Passo 3 · Entrega"],[35,34,137,398,123,34,"Alterar entrega"],[35,36,16,654,358,50,"Enviar pedido"],[35,27,0,723,98,51,"Início"],[35,24,98,723,98,51,"Cartão"],[35,44,293,723,98,51,"Mais"],[36,37,16,654,358,50,"Ver os meus pedidos"],[36,27,0,723,98,51,"Início"],[36,24,98,723,98,51,"Cartão"],[36,37,195,723,98,51,"Pedidos"],[36,44,293,723,98,51,"Mais"],[37,27,10,44,34,34,"‹"],[37,29,16,228,358,50,"Novo pedido"],[37,27,0,723,98,51,"Início"],[37,24,98,723,98,51,"Cartão"],[37,44,293,723,98,51,"Mais"],[38,39,17,302,356,65,"Renovar passe"],[39,38,10,44,34,34,"‹"],[39,38,299,45,75,32,"Cancelar"],[39,40,16,654,358,50,"Pagar 40,00 € e renovar"],[39,38,0,723,98,51,"Início"],[40,39,10,44,34,34,"‹"],[40,38,299,45,75,32,"Cancelar"],[40,41,33,457,324,50,"Sim, pagar com MB WAY"],[40,42,33,517,324,50,"Usar outro meio"],[40,38,114,579,163,28,"Cancelar renovação"],[40,38,0,723,98,51,"Início"],[41,40,24,136,168,40,"Recusar"],[41,43,200,136,166,40,"Confirmar"],[42,40,16,728,358,50,"Cancelar"],[43,38,16,654,358,50,"Voltar ao início"],[43,38,0,723,98,51,"Início"],[44,27,10,44,34,34,"‹"],[44,45,17,284,356,59,"Andy · Ajuda"],[44,27,0,723,98,51,"Início"],[44,24,98,723,98,51,"Cartão"],[44,28,195,723,98,51,"Pedidos"],[45,27,10,44,34,34,"‹"],[45,24,16,241,259,33,"O carregamento ficou no cartão?"],[45,28,16,282,124,33,"Pedir o Sub23"],[45,27,0,723,98,51,"Início"],[45,24,98,723,98,51,"Cartão"],[45,28,195,723,98,51,"Pedidos"],[45,44,293,723,98,51,"Mais"]]};
const isScreen = n => n.type === 'FRAME' && Math.abs(n.width - 390) < 3 && Math.abs(n.height - 800) < 3;
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
const rel = (n, s) => ({ x: n.absoluteTransform[0][2] - s.absoluteTransform[0][2], y: n.absoluteTransform[1][2] - s.absoluteTransform[1][2], w: n.width, h: n.height });
const ROWS = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3', 'Outros'];

async function anda() {
  // 1) encontrar a(s) galeria(s) importada(s) e os ecrãs, pela ordem da galeria
  const caps = [];
  for (const p of figma.root.children) {
    await p.loadAsync();
    for (const n of p.children) if (n.type === 'FRAME' && !n.name.startsWith('↳') && n.findOne(isScreen)) caps.push(n);
  }
  const all = [];
  for (const c of caps) all.push(...c.findAll(isScreen).filter(n => !isScreen(n.parent)));
  if (all.length !== DATA.n.length) throw new Error(`Encontrei ${all.length} ecrãs nas galerias importadas, esperava ${DATA.n.length}.`);
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  const report = [];
  for (const v of ['A', 'B']) {
    let page = figma.root.children.find(p => p.name === 'Versão ' + v);
    if (!page) { page = figma.createPage(); page.name = 'Versão ' + v; }
    await page.loadAsync();
    for (const c of [...page.children]) if (c.type === 'SECTION') c.remove();
    const idx = DATA.n.map((nome, i) => [nome, i]).filter(([nome]) => nome.startsWith(v + ' · ')).map(([, i]) => i);
    const section = figma.createSection(); section.name = 'Versão ' + v; page.appendChild(section); section.x = 0; section.y = 0;
    for (let r = 0; r < 4; r++) {
      const t = figma.createText(); t.fontName = { family: 'Inter', style: 'Bold' };
      t.characters = 'Versão ' + v + ' · ' + (r === 3 ? 'Outros ecrãs' : ROWS[r]); t.fontSize = 28;
      t.fills = [{ type: 'SOLID', color: { r: 0.145, g: 0.173, b: 0.4 } }];
      section.appendChild(t); t.x = 40; t.y = 40 + r * 960;
    }
    const cols = {}; let maxX = 0, maxY = 0;
    for (const i of idx) {
      const s = all[i], nome = DATA.n[i], row = Math.max(0, ROWS.findIndex(k => nome.includes(k)));
      const col = cols[row] = (cols[row] === undefined ? -1 : cols[row]) + 1;
      section.appendChild(s); s.x = 40 + col * 430; s.y = 100 + row * 960; s.name = nome; s.clipsContent = true;
      for (const n of s.findAll(n => n.type === 'FRAME' && n.overflowDirection && n.overflowDirection !== 'NONE')) n.overflowDirection = 'NONE';
      for (const n of s.findAll(n => n.name.startsWith('↳ '))) n.remove();
      maxX = Math.max(maxX, s.x + 390); maxY = Math.max(maxY, s.y + 800);
      // painel «Escolher outro meio» encostado ao fundo
      if (nome.includes('outro meio')) {
        const t = s.findOne(n => n.type === 'TEXT' && n.characters.trim() === 'Escolher outro meio');
        if (t) {
          let sheet = t; while (sheet.parent && sheet.parent !== s && !(Math.abs(sheet.width - 390) < 3 && sheet.height > 200)) sheet = sheet.parent;
          const par = sheet.parent;
          if (par.layoutMode === 'VERTICAL') par.primaryAxisAlignItems = 'MAX';
          else if (par.layoutMode === 'HORIZONTAL') par.counterAxisAlignItems = 'MAX';
          else sheet.y = par.height - sheet.height;
        }
      }
    }
    section.resizeWithoutConstraints(maxX + 40, maxY + 40);
    // 2) zonas clicáveis encostadas à camada real de cada botão
    let hs = 0;
    for (const [from, to, x, y, w, h, label] of DATA.l) {
      if (!idx.includes(from)) continue;
      const s = all[from];
      let r = { x, y, w, h };
      const texts = s.findAll(n => n.type === 'TEXT');
      let cands = [];
      for (const k of [label, label.split(' · ').pop()]) { cands = texts.filter(t => { const c = norm(t.characters); return c === k || c.endsWith(k); }); if (cands.length) break; }
      if (cands.length) {
        let best = null;
        for (const t of cands) {
          let node = t, pick = null;
          while (node.parent && node.parent !== s) { node = node.parent; if (node.width <= w * 1.25 + 4 && node.height <= h * 1.4 + 4) pick = node; else break; }
          const q = rel(pick || t, s);
          const score = Math.abs(q.w - w) + Math.abs(q.h - h) + 0.2 * Math.hypot(q.x + q.w / 2 - (x + w / 2), q.y + q.h / 2 - (y + h / 2));
          if (!best || score < best.score) best = { q, score, sizeOk: Math.abs(q.w - w) < w * 0.3 && Math.abs(q.h - h) < h * 0.5 };
        }
        const q = best.q;
        r = best.sizeOk ? q : { x: q.x + q.w / 2 - w / 2, y: q.y + q.h / 2 - h / 2, w, h };
      }
      const f = figma.createFrame();
      f.name = '↳ ' + label; f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.01 }];
      s.appendChild(f); if (s.layoutMode && s.layoutMode !== 'NONE') f.layoutPositioning = 'ABSOLUTE';
      f.resize(Math.max(Math.round(r.w), 8), Math.max(Math.round(r.h), 8)); f.x = Math.round(r.x); f.y = Math.round(r.y);
      await f.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: all[to].id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.15 }, preserveScrollPosition: false }] }]);
      hs++;
    }
    const by = t => all[idx.find(i => DATA.n[i].includes(t))];
    page.flowStartingPoints = [
      { nodeId: all[idx[0]].id, name: v + ' · Tarefa 1 · Widget' },
      { nodeId: by('Início (Sofia)').id, name: v + ' · Tarefa 2 · Sub23' },
      { nodeId: by('Início (Carlos)').id, name: v + ' · Tarefa 3 · Andy' },
    ];
    report.push(`${v}: ${idx.length} ecrãs, ${hs} zonas`);
  }
  // 3) limpar: galerias importadas e páginas que ficaram vazias
  for (const c of caps) if (!c.removed) c.remove();
  const pa = figma.root.children.find(p => p.name === 'Versão A');
  await figma.setCurrentPageAsync(pa);
  if (figma.root.children.indexOf(pa) !== 0) figma.root.insertChild(0, pa);
  const pb = figma.root.children.find(p => p.name === 'Versão B');
  figma.root.insertChild(1, pb);
  for (const p of [...figma.root.children]) { await p.loadAsync(); if (p !== pa && p !== pb && p.children.length === 0) p.remove(); }
  return report.join(' · ');
}

anda().then(r => figma.closePlugin('Feito · ' + r)).catch(e => figma.closePlugin('Erro: ' + e.message));
