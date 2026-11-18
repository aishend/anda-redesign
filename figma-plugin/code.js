// Plugin de desenvolvimento: liga os ecrãs importados com o html.to.design.
// Usa o ficheiro de ligações gerado pela galeria (galeria.html): para cada botão,
// cria uma zona clicável transparente ("↳ texto") exatamente na posição do botão.
figma.showUI(__html__, { width: 340, height: 360 });

const isScreen = n => n.type === 'FRAME' && Math.abs(n.width - 390) < 3 && Math.abs(n.height - 800) < 3;

figma.ui.onmessage = async msg => {
  if (msg.type !== 'link') return;
  const { frames: defs, links } = msg.data;
  const roots = figma.currentPage.selection.length ? figma.currentPage.selection : [figma.currentPage];
  let screens = [];
  for (const r of roots) {
    if (isScreen(r)) screens.push(r);
    else if ('findAll' in r) screens.push(...r.findAll(isScreen).filter(n => !isScreen(n.parent)));
  }
  // 1.ª vez: ecrãs pela ordem da galeria; depois: pelo nome
  const byName = defs.map(d => screens.find(s => s.name === d.nome));
  if (byName.every(Boolean)) screens = byName;
  else if (screens.length === defs.length) defs.forEach((d, i) => { screens[i].name = d.nome; });
  else { figma.ui.postMessage(`Encontrei ${screens.length} ecrãs de 390×800, mas o ficheiro tem ${defs.length}.\nConfirme que importou a mesma galeria (?v=A ou ?v=B).`); return; }

  // os ecrãs têm de estar no nível de cima (página ou secção) para o protótipo funcionar
  for (const s of screens) {
    const top = s.parent && (s.parent.type === 'PAGE' || s.parent.type === 'SECTION');
    if (!top) {
      let holder = s.parent; while (holder.parent && holder.parent.type !== 'PAGE' && holder.parent.type !== 'SECTION') holder = holder.parent;
      const target = holder.parent; const ax = s.absoluteTransform[0][2], ay = s.absoluteTransform[1][2];
      target.appendChild(s);
      const bx = target.type === 'PAGE' ? 0 : target.absoluteTransform[0][2], by = target.type === 'PAGE' ? 0 : target.absoluteTransform[1][2];
      s.x = ax - bx; s.y = ay - by;
    }
  }
  // limpa ligações e zonas antigas
  for (const s of screens) {
    for (const n of s.findAll(n => n.name && n.name.startsWith('↳ '))) n.remove();
    for (const n of s.findAll(n => 'reactions' in n && n.reactions.length)) await n.setReactionsAsync([]);
  }
  let ok = 0;
  for (const l of links) {
    const s = screens[l.from], r = l.rect;
    const hs = figma.createFrame();
    hs.name = '↳ ' + l.label; hs.fills = []; hs.clipsContent = false;
    s.appendChild(hs);
    if (s.layoutMode && s.layoutMode !== 'NONE') hs.layoutPositioning = 'ABSOLUTE';
    hs.resize(Math.max(r.w, 8), Math.max(r.h, 8)); hs.x = r.x; hs.y = r.y;
    await hs.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: screens[l.to].id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.15 }, preserveScrollPosition: false }] }]);
    ok++;
  }
  const v = defs[0].id[0];
  try { figma.currentPage.flowStartingPoints = [{ nodeId: screens[0].id, name: `Versão ${v}` }]; } catch (e) {}
  figma.ui.postMessage(`Feito: ${ok} zonas clicáveis criadas.\nCarregue em ▶ Present para testar.`);
};
