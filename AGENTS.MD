# AGENTS.md

> Guia operacional para agentes de IA (Claude Code, Cursor, Copilot, Codex etc.) trabalhando neste repositório.
> Este arquivo é a **fonte da verdade** sobre como o código deve ser escrito, testado e entregue.

---

## 1. Visão geral do projeto

**Painel de Gestão de Eventos** — aplicação full-stack (frontend + mock backend) para acompanhamento de eventos, controle de acesso de participantes e visualização de métricas em dashboard.

- **Frontend:** Next.js (App Router) + React + TypeScript
- **Estilo:** Tailwind CSS + shadcn/ui (tema dark como padrão)
- **Estado servidor:** TanStack Query (React Query)
- **Estado cliente:** Zustand
- **URL state:** nuqs (filtros, busca, ordenação sincronizados na URL)
- **Backend mock:** json-server (mesmo monorepo, pasta `/server`)
- **Testes E2E:** Playwright
- **Acessibilidade:** axe-core integrado nos testes
- **Lint/Format:** ESLint + Prettier
- **Gerenciador:** pnpm (preferido) ou npm

---

## 2. Estrutura do repositório

```
.
├── AGENTS.md                  # Este arquivo
├── README.md                  # Documentação do usuário
├── package.json               # Scripts e deps do frontend
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json            # Config shadcn/ui
├── .eslintrc.json
├── .prettierrc
├── playwright.config.ts
├── server/                    # Backend mock
│   ├── db.json                # Dados (eventos, participants, checkins)
│   ├── routes.json            # Rewrites do json-server
│   └── server.js              # json-server programático (opcional)
├── public/
├── src/
│   ├── app/                   # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Listagem de eventos
│   │   ├── events/[id]/
│   │   │   └── page.tsx       # Detalhe / dashboard
│   │   ├── providers.tsx      # QueryClient, ThemeProvider
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # shadcn primitives
│   │   ├── events/            # EventCard, EventList, EventFilters...
│   │   ├── dashboard/         # MetricCard, EntriesChart, ParticipantsTable...
│   │   └── shared/            # EmptyState, ErrorState, LoadingSkeleton...
│   ├── features/              # Lógica por feature
│   │   ├── events/
│   │   │   ├── api.ts         # fetchers
│   │   │   ├── hooks.ts       # useEvents, useEvent
│   │   │   ├── types.ts
│   │   │   └── schemas.ts     # Zod schemas
│   │   └── checkins/
│   │       ├── api.ts
│   │       ├── hooks.ts       # useCheckIn mutation
│   │       └── rules.ts       # Regras de negócio (VIP, Normal, closed)
│   ├── stores/                # Zustand stores
│   │   └── ui-store.ts
│   ├── lib/
│   │   ├── api-client.ts      # Axios/fetch wrapper
│   │   ├── query-client.ts
│   │   └── utils.ts
│   └── types/
│       └── api.ts
├── tests/
│   └── e2e/
│       ├── events-list.spec.ts
│       ├── event-detail.spec.ts
│       ├── checkin-rules.spec.ts
│       └── a11y.spec.ts
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 3. Setup e comandos

### Instalação

```bash
pnpm install
```

### Desenvolvimento (rodar tudo junto)

```bash
pnpm dev          # roda frontend (3000) + json-server (3001) via concurrently
pnpm dev:web      # apenas Next.js
pnpm dev:api      # apenas json-server
```

### Build e produção

```bash
pnpm build
pnpm start
```

### Qualidade

```bash
pnpm lint         # ESLint
pnpm format       # Prettier --write
pnpm typecheck    # tsc --noEmit
```

### Testes

```bash
pnpm test:e2e         # Playwright headless
pnpm test:e2e:ui      # Playwright UI mode
pnpm test:a11y        # Apenas testes de acessibilidade
```

> **Importante:** o `pnpm dev` deve subir frontend e backend em paralelo. Use `concurrently` no script.

---

## 4. Convenções de código

### TypeScript

- `strict: true` sempre. Sem `any` implícito.
- Prefira `type` para union/intersection, `interface` para contratos públicos extensíveis.
- Use Zod para validar respostas da API antes de entregar para o app.
- Nada de `// @ts-ignore`. Se for inevitável, use `// @ts-expect-error` com comentário explicando.

### React / Next.js

- App Router. Server Components por padrão; `"use client"` apenas quando necessário (hooks, eventos, browser APIs).
- Data fetching:
  - **Listagens e detalhes** → React Query no client (porque há filtros, busca, mutations).
  - Server Components só onde realmente compensam (ex: SEO de páginas estáticas).
- Sempre tipar props. Componentes em PascalCase, arquivos em `kebab-case.tsx` (ou PascalCase, contanto que seja consistente — escolha uma e mantenha).
- Hooks customizados começam com `use`.

### Estilo (Tailwind + shadcn)

- Tema **dark por padrão** (`<html class="dark">` no layout raiz, sem toggle obrigatório).
- Use os tokens do tema (`bg-background`, `text-foreground`, `border-border`) em vez de cores cruas.
- shadcn/ui é **copiado** para `src/components/ui` — pode editar à vontade.
- Nada de CSS-in-JS. Tailwind + classes utilitárias. Variantes via `cva` (já vem com shadcn).
- Use `cn()` (clsx + tailwind-merge) para concatenar classes condicionais.

### Estado

- **Server state** (qualquer coisa que vem da API): React Query. Nunca duplique em Zustand.
- **Client state** (UI: modais abertos, sidebar colapsada, toasts pendentes): Zustand.
- **URL state** (filtros, busca, página, ordenação): **nuqs**. Isso é obrigatório porque permite compartilhar links e voltar/avançar no histórico.

### Padrão de chamadas à API

- Centralize em `src/lib/api-client.ts`.
- A base URL vem de `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- Cada feature tem `api.ts` com funções puras + `hooks.ts` com os wrappers React Query.

### Tratamento de erros

- Toda query deve renderizar 3 estados: **loading**, **empty**, **error**.
- Erros do React Query devem ter `retry` configurado de forma sensata (não retry infinito em 404).
- Mutations devem dar feedback via `toast` (sonner, que vem com shadcn).

### Acessibilidade

- Use elementos semânticos (`<button>`, `<nav>`, `<main>`).
- Toda interação relevante precisa estar acessível por teclado.
- ARIA labels em ícones-only.
- Contraste mínimo AA. Os tokens do shadcn dark já passam — não invente cores fora do tema.
- Rodar axe nos testes (ver seção de testes).

---

## 5. Regras de negócio (críticas)

Estas regras vivem em `src/features/checkins/rules.ts`. **Não duplique** em componentes.

### Participante VIP

- Pode entrar e sair múltiplas vezes.
- Cada `entry`/`exit` gera um registro novo em `checkins`.
- Status alterna entre `inside` e `outside`.

### Participante Normal

- Pode fazer **apenas um** check-in com sucesso.
- Segunda tentativa → erro com `error_reason: "already_checked_in"` e toast claro.

### Evento com `status: "closed"` (ou `"cancelled"`)

- Bloqueia **todas** as ações de check-in/saída.
- Botões devem ficar `disabled` com `aria-disabled` e tooltip explicando o motivo.
- Tentativa via API → erro com `error_reason: "event_closed"`.

### Função pura para validar

```ts
type CheckInIntent = {
  participant: Participant;
  event: Event;
  action: "entry" | "exit";
};
type CheckInResult =
  | { ok: true }
  | {
      ok: false;
      reason: "event_closed" | "already_checked_in" | "invalid_action";
    };

export function validateCheckIn(intent: CheckInIntent): CheckInResult {
  /* ... */
}
```

Toda chamada à mutation passa por essa função primeiro. Os testes cobrem essa função isoladamente.

---

## 6. Integração com a API

Usar **Opção B (json-server local)** porque o teste pede mutations (POST `/checkins`, PATCH `/participants/:id`).

Endpoints (ver `db.json`):

- `GET /events`
- `GET /events/:id`
- `GET /participants?event_id=EVT-001`
- `GET /checkins?event_id=EVT-001&_sort=timestamp&_order=desc`
- `POST /checkins`
- `PATCH /participants/:id`
- `PATCH /events/:id` (atualizar `checkin_count`, `error_count`, `entry_rate`)

### Fluxo de check-in (mutation)

1. Valida com `validateCheckIn` → se inválido, mostra toast e aborta.
2. POST `/checkins` com `{ event_id, participant_id, timestamp, success, action, error_reason }`.
3. Se sucesso: PATCH `/participants/:id` (`status`, `checkin_count`).
4. PATCH `/events/:id` recalculando métricas agregadas.
5. `queryClient.invalidateQueries(['event', id])` para refetch.

> Sim, isso faz N requests sequenciais. Está ok para o teste; documente como melhoria futura no README ("API real teria endpoint atômico").

---

## 7. Testes

Mínimo 2-3 testes E2E significativos com Playwright. Sugestão:

1. **`events-list.spec.ts`**
   - Lista carrega, filtra por status, busca por nome com debounce, navega para detalhe.
   - Valida estados loading e empty (mockando rotas com `page.route`).

2. **`checkin-rules.spec.ts`**
   - VIP entra, sai, entra de novo → histórico tem 3 entradas.
   - Normal entra → segunda tentativa mostra toast de erro.
   - Evento closed → botão desabilitado, ação não dispara.

3. **`a11y.spec.ts`**
   - `@axe-core/playwright` rodando na home e na página de detalhe.
   - Sem violações `serious` ou `critical`.

### Setup do Playwright

- `webServer` no `playwright.config.ts` sobe `pnpm dev` antes dos testes.
- Use `data-testid` apenas quando seletores semânticos não bastam (`getByRole`, `getByText` primeiro).

---

## 8. Workflow do agente de IA

Quando você (agente) for fazer mudanças neste repo:

### Antes de codar

1. **Leia o AGENTS.md inteiro** (este arquivo).
2. Se a tarefa toca regra de negócio, releia a seção 5.
3. Se toca API, releia a seção 6.

### Durante

1. **Commits pequenos e descritivos.** Convencional Commits: `feat:`, `fix:`, `chore:`, `test:`, `refactor:`, `docs:`.
2. Um commit = uma mudança coerente. Evite commits-monstro.
3. Rode `pnpm typecheck && pnpm lint` antes de marcar como pronto.
4. Se criou componente novo de UI complexo, escreva pelo menos um teste.

### Depois

1. Atualize o README se mudou setup, scripts ou decisões arquiteturais.
2. Se descobriu algo que vale a pena registrar para o próximo agente, **atualize este AGENTS.md**.

### Não faça

- Não adicione bibliotecas pesadas sem justificar (ex: trocar React Query por SWR no meio do projeto).
- Não use `localStorage` direto em Server Components.
- Não acople regra de negócio a componente — sempre extraia para `features/.../rules.ts`.
- Não invente endpoints que não existem em `db.json`.
- Não desabilite testes para "passar o CI". Conserte o teste ou conserte o código.
- Não suba `node_modules`, `.next`, `playwright-report` no Git.

---

## 9. Diferenciais já planejados

Estes são os "diferenciais" do enunciado que **estão no escopo desde o início** — não são extras opcionais para este projeto:

- ✅ Next.js App Router
- ✅ React Query + Zustand
- ✅ Debounce na busca (via nuqs com `throttleMs` ou `useDebouncedValue`)
- ✅ Acessibilidade (axe-core nos testes, navegação por teclado, ARIA)
- ✅ Componentização com shadcn/ui
- ✅ Documentação de uso de IA no README

---

## 10. Variáveis de ambiente

`.env.local` (não commitado):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

`.env.example` (commitado, sem segredos):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 11. Glossário rápido

- **Evento**: entidade principal com status `active | closed | cancelled`.
- **Participante**: `vip` (múltiplas entradas) ou `normal` (única entrada).
- **Check-in**: registro de `entry` ou `exit` com timestamp, sucesso/erro.
- **Taxa de entrada (`entry_rate`)**: `checkin_count / expected_count`.

---

**Última atualização:** mantenha esta linha viva. Quem editar, atualiza data e o que mudou.
