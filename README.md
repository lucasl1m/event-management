# Handoff — Painel de Gestão de Eventos

Este pacote contém tudo que você precisa para conduzir o desenvolvimento do teste técnico de forma organizada, usando IA como aliada sem perder controle do projeto.

## Arquivos

| Arquivo | Para quê serve | Onde colocar |
|---|---|---|
| **`AGENTS.md`** | Fonte da verdade para qualquer agente de IA (Claude Code, Cursor, etc.). Define stack, estrutura, convenções e regras de negócio. | **Raiz do repositório do projeto** |
| **`HANDOFF.md`** | Sequência de prompts numerados (0 a 11) para conduzir o desenvolvimento, etapa por etapa. | Pasta separada (não precisa estar no repo) |
| **`STITCH_HANDOFF.md`** | Prompts otimizados para gerar a UI no Google Stitch, com briefing visual completo. | Pasta separada (não precisa estar no repo) |

## Fluxo de uso recomendado

### Antes de começar a codar
1. Crie o repositório vazio no GitHub (público).
2. Clone localmente.
3. Copie o **`AGENTS.md`** para a raiz do repo e faça o primeiro commit (`docs: add agents guide`).
4. Abra o **`STITCH_HANDOFF.md`** e gere as 3 telas no Google Stitch. Salve as imagens.

### Durante o desenvolvimento
1. Abra o Claude Code apontando para o repositório.
2. Cole o **Prompt 0** (contexto inicial) do `HANDOFF.md`.
3. Execute os prompts **em ordem** (1 → 11), um por vez.
4. Após cada prompt:
   - Revise o que o agente fez.
   - Rode `pnpm typecheck && pnpm lint`.
   - Faça o commit sugerido.
   - Aí passe para o próximo prompt.
5. Use os **prompts auxiliares** (Apêndice A do `HANDOFF.md`) sempre que precisar refatorar, debugar testes ou criar componente novo.

### Antes de entregar
1. Execute o **Prompt 11** (checklist final).
2. Confira o histórico de commits — deve contar uma história coerente.
3. Verifique se o repo está público.
4. Envie o link.

## Por que esta estrutura?

- **`AGENTS.md` na raiz** funciona como "constitution" do projeto. Qualquer agente novo lê esse arquivo e já sabe o que fazer. Convenção emergente em projetos modernos com IA.
- **Prompts pequenos e numerados** evitam o problema clássico de "agente faz tudo de uma vez e bagunça". Cada commit conta uma decisão.
- **Stitch separado do código** porque design e implementação têm ritmos diferentes. Você pode iterar no Stitch enquanto o agente codifica a parte que já está pronta.

## Pequenos ajustes que recomendo fazer

- **Personalize o nome no Stitch** se quiser uma marca diferente de "Eventos".
- **Decida cor de acento** (a sugestão é emerald, mas violet ou blue também combinam com o tema dark).
- **Edite o `AGENTS.md`** se mudar de ideia sobre qualquer convenção. O arquivo é seu, agentes apenas leem.
- **Documente desvios** no próprio `AGENTS.md` se algo mudar durante o desenvolvimento. Isso ajuda na revisão e mostra maturidade.

Boa sorte no teste!