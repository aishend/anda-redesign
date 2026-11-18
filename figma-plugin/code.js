// Plugin de desenvolvimento: liga os ecrãs importados com o html.to.design,
// usando o ficheiro de ligações gerado pela galeria do protótipo (galeria.html).
figma.showUI(__html__, { width: 340, height: 360 });

const norm = s => (s || '').replace(/\s+/g, ' ').trim();
const isScreen = n => n.type === 'FRAME' && Math.abs(n.width - 390) < 3 && Math.abs(n.height - 800) < 3;

figma.ui.onmessage = async msg => {
  if (msg.type !== 'link') return;
  const { frames: defs, links } = msg.data;
  const roots = figma.currentPage.selection.length ? figma.currentPage.selection : [figma.currentPage];
  const screens = [];
  for (const r of roots) {
    if (isScreen(r)) screens.push(r);
    else if ('findAll' in r) screens.push(...r.findAll(isScreen).filter(n => !n.parent || !isScreen(n.parent)));
  }
  if (screens.length !== defs.length) {
    figma.ui.postMessage(`Encontrei ${screens.length} ecrãs de 390×800, mas o ficheiro tem ${defs.length}.\nConfirme que importou a mesma galeria (mesma versão: ?v=A, ?v=B ou todas).`);
    return;
  }
  defs.forEach((d, i) => { screens[i].name = d.nome; });

  let ok = 0; const falhas = [];
  for (const d of defs) {
    const frame = screens[d.idx];
    const mine = links.filter(l => l.from === d.idx);
    const labels = new Set(mine.map(l => l.label));
    const texts = frame.findAll(n => n.type === 'TEXT');
    for (const l of mine) {
      let hits = texts.filter(t => norm(t.characters) === l.label);
      if (!hits.length) hits = texts.filter(t => norm(t.characters).endsWith(l.label));
      if (!hits.length) { falhas.push(`${d.nome}: «${l.label}»`); continue; }
      // sobe até ao "botão": para antes de apanhar outro botão ou uma zona demasiado grande
      let node = hits[hits.length - 1];
      while (node.parent && node.parent !== frame && node.parent.type !== 'PAGE') {
        const p = node.parent;
        if (p.height > 200 || p.width > 392) break;
        const others = p.findAll(n => n.type === 'TEXT' && labels.has(norm(n.characters))).length;
        if (others > 1) break;
        node = p;
      }
      const reaction = { trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: screens[l.to].id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.15 }, preserveScrollPosition: false }] };
      try {
        if (node.setReactionsAsync) await node.setReactionsAsync([reaction]); else node.reactions = [reaction];
        ok++;
      } catch (e) { falhas.push(`${d.nome}: «${l.label}» (${e.message})`); }
    }
  }
  // pontos de início do protótipo (um por versão)
  const starts = [];
  for (const v of ['A', 'B']) {
    const d = defs.find(x => x.id.startsWith(v + '-'));
    if (d) starts.push({ nodeId: screens[d.idx].id, name: 'Versão ' + v });
  }
  try { figma.currentPage.flowStartingPoints = starts; } catch (e) {}
  figma.ui.postMessage(`Feito: ${ok} ligações criadas.\n${falhas.length ? 'Não encontrei ' + falhas.length + ':\n' + falhas.join('\n') : 'Sem falhas.'}\n\nCarregue em ▶ Present para testar.`);
};
