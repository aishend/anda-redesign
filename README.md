# Anda · Protótipo de alta fidelidade (IPC · Fase III)

Protótipo académico de três funcionalidades novas para a app Anda (IPC, FEUP 2026/27).
**Não é a app oficial.** As cores e os logótipos foram retirados do APK da Anda só para o protótipo parecer realista.

## Como abrir

Basta servir a pasta (ou publicá-la no GitHub Pages):

```bash
cd prototipo
python3 -m http.server 8765
# abrir http://localhost:8765
```

| Página | Para quê |
|---|---|
| `index.html` | Painel: links para explorar A/B, iniciar sessões de teste e exportar resultados |
| `app.html?v=A&u=sofia&ecra=os-home` | Protótipo livre (`v` = A/B, `u` = sofia/carlos, `ecra` = ecrã inicial) |
| `app.html?modo=teste` | Sessão de teste guiada (é aberta pelo painel) |
| `galeria.html` | Todos os ecrãs lado a lado (relatório + importar para o Figma) |

## As duas alternativas (comparação exigida para funcionalidades novas)

| Tarefa | Versão A (wireflows da Fase 2) | Versão B (alternativa) |
|---|---|---|
| 1 · Widget do passe | Widget simples; para saber se o carregamento ficou no cartão é preciso abrir o histórico (abre nos carregamentos) | O próprio widget mostra se há um carregamento por gravar |
| 2 · Pedir o Sub23 | 2 ecrãs: tipo de passe → idade + entrega no mesmo ecrã | Passo a passo em 4 ecrãs, com barra de progresso e ecrã de confirmação |
| 3 · Andy resolve um erro | Andy num pop-up → página de conversa → MB WAY | Andy dentro do ecrã de erro, já com a solução (MB WAY), sem abrir conversa |

Para mudar uma alternativa, edite o ecrã respetivo em `js/screens.js`.

## Sessão de teste

1. No painel, escreva o nº do participante e carregue em **Começar sessão**. A ordem alterna sozinha: ímpares A→B, pares B→A.
2. O participante lê cada tarefa no telemóvel e carrega em **Começar a tarefa**. Na barra de cima pode carregar em **Terminei** ou **Desistir**. As tarefas 2 e 3 terminam sozinhas quando chega ao ecrã de sucesso.
3. Depois de cada tarefa responde à satisfação (1 a 5); na tarefa 1 responde também às perguntas de verificação. No fim de cada versão preenche o **SUS**.
4. O painel mostra as médias por tarefa e versão comparadas com os requisitos da Fase 2, e exporta CSV.

Dados registados por tarefa: sucesso, tempo, toques (totais, em botões e fora), quantas vezes voltou atrás, ecrãs visitados, escolhas e satisfação. Os dados ficam no `localStorage` do browser. Se testarem em vários computadores, usem **Cópia de segurança (JSON)** e **Importar JSON** para juntar tudo.

## Passar para o Figma (protótipo clicável com link figma.com/proto)

1. Publique o protótipo (GitHub Pages) ou sirva-o localmente.
2. No Figma, use o plugin **html.to.design** e importe `galeria.html?v=A&figma` (e depois `?v=B&figma`, ou tudo sem `v`). Cada ecrã fica uma frame de 390×800 editável.
3. Na galeria (no browser), carregue em **Descarregar ligações para o Figma (JSON)** com o mesmo filtro de versão.
4. No Figma Desktop: *Plugins → Development → Import plugin from manifest…* e escolha `figma-plugin/manifest.json`.
5. Selecione a frame importada, corra o plugin **Anda · ligar ecrãs**, escolha o JSON e carregue em **Ligar ecrãs**. Ele dá nome às frames, cria as ligações de clique e define os pontos de início «Versão A» e «Versão B».
6. Carregue em ▶ **Present** e partilhe o link do protótipo (e use-o no Maze, se quiserem).

> O plugin encontra os botões pelo texto. Se o html.to.design importar algum texto de forma diferente, o plugin indica os botões que não ligou e esses ligam-se à mão.

## Estrutura

```
css/style.css     estilos (cores da Anda)
js/icons.js       ícones SVG
js/screens.js     todos os ecrãs + dados + texto das tarefas
js/engine.js      navegação, sessão de teste, SUS, exportação CSV
js/gallery.js     lista de ecrãs da galeria e cálculo das ligações
figma-plugin/     plugin do Figma que liga os ecrãs importados
assets/           logótipos e padrão retirados do APK
```
