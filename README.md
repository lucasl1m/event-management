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

---

## Backend mock (json-server)

A API de desenvolvimento roda localmente via `json-server` na porta `3001`.

### Como rodar

```bash
pnpm install
pnpm dev:api          # apenas o backend mock
# ou
pnpm dev              # frontend (3000) + backend (3001) juntos
```

### Endpoints principais

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/events` | Lista eventos |
| `GET` | `/events/:id` | Detalhe do evento |
| `GET` | `/participants?event_id=EVT-001` | Participantes do evento |
| `GET` | `/checkins?event_id=EVT-001&_sort=timestamp&_order=desc` | Histórico de check-ins |
| `POST` | `/checkins` | Registra check-in |
| `PATCH` | `/participants/:id` | Atualiza status do participante |
| `PATCH` | `/events/:id` | Atualiza métricas agregadas do evento |

### Origem dos dados

O `server/db.json` foi obtido do repositório oficial do teste técnico:
[`ThiagoLifters/api_test`](https://github.com/ThiagoLifters/api_test). O conteúdo
foi copiado integralmente, sem alterações, para garantir paridade com o seed
canônico do desafio.

### Resetar o banco

`json-server` persiste mutações (POST/PATCH) diretamente no `db.json`. Para
voltar ao estado original:

```bash
git checkout server/db.json
```

### Eventos disponíveis (edge cases)

| ID | Nome | Status |
| --- | --- | --- |
| `EVT-001` | Tech Summit 2025 | `active` |
| `EVT-002` | Design Week Rio | `closed` |
| `EVT-003` | Startup Pitch Night | `active` |
| `EVT-004` | Festival de Música Indie | `cancelled` |
| `EVT-005` | DevConf Brasil | `active` |
