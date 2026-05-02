# Painel de Gestão de Eventos

Dashboard para acompanhamento de eventos, controle de acesso de participantes e visualização de métricas em tempo real.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

---

## Stack

| Camada         | Tecnologia                                               |
| -------------- | -------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript 5        |
| Estilo         | Tailwind CSS v4 + shadcn/ui (tema light/dark, base zinc) |
| i18n           | next-intl (rotas `/pt` e `/en`)                          |
| Estado server  | TanStack Query v5                                        |
| Estado cliente | Zustand v5                                               |
| URL state      | nuqs v2                                                  |
| Gráficos       | Recharts v3                                              |
| Animações      | @number-flow/react                                       |
| Backend mock   | json-server 0.17 (mesmo monorepo, porta 3001)            |
| Validação      | Zod v4                                                   |
| Testes E2E     | Playwright + @axe-core/playwright                        |
| Lint/Format    | ESLint 9 + Prettier 3 + eslint-plugin-jsx-a11y           |
| Git hooks      | Lefthook (pre-commit: lint-staged; pre-push: typecheck)  |
| CI             | GitHub Actions (quality + e2e jobs)                      |
| Gerenciador    | pnpm                                                     |

---

## Pré-requisitos

- **Node.js** 20 ou superior
- **pnpm** 9 ou superior (`npm install -g pnpm`)

---

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd event-management

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Inicie frontend + backend juntos
pnpm dev
```

- Frontend: http://localhost:3000
- API mock: http://localhost:3001

---

## Scripts disponíveis

| Script              | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | Inicia frontend (3000) e json-server (3001) juntos |
| `pnpm dev:web`      | Apenas o frontend Next.js                          |
| `pnpm dev:api`      | Apenas o json-server                               |
| `pnpm build`        | Build de produção                                  |
| `pnpm start`        | Serve o build de produção                          |
| `pnpm typecheck`    | Verifica tipos TypeScript sem emitir arquivos      |
| `pnpm lint`         | ESLint em todo o projeto                           |
| `pnpm format`       | Prettier (escrita) em todos os arquivos suportados |
| `pnpm format:check` | Prettier (verificação, sem escrita)                |
| `pnpm test:e2e`     | Testes E2E com Playwright (todos os projetos)      |
| `pnpm test:e2e:ui`  | Playwright com interface gráfica                   |

---

## Estrutura de pastas

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: typecheck, lint, build + E2E
├── server/
│   ├── db.json                 # Banco de dados do json-server (mutável)
│   ├── db.seed.json            # Cópia imutável do estado inicial
│   └── routes.json             # Rewrites de rota do json-server
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (home)/
│   │   │   │   └── page.tsx        # Dashboard home localizado
│   │   │   ├── events/
│   │   │   │   ├── page.tsx        # Listagem de eventos localizada
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Detalhe do evento localizado
│   │   │   │       └── loading.tsx # Skeleton automático do App Router
│   │   │   └── layout.tsx          # Shell visual + NextIntlClientProvider
│   │   ├── page.tsx                # Redireciona para `/pt`
│   │   ├── layout.tsx              # Layout raiz técnico com metadados globais
│   │   ├── providers.tsx           # ThemeProvider + QueryClient + NuqsAdapter + Toaster
│   │   └── globals.css             # Variáveis de tema e estilos base
│   ├── components/
│   │   ├── ui/                 # Primitivos shadcn/ui (button, input, etc.)
│   │   ├── shared/             # EmptyState, ErrorState, AnimatedNumber...
│   │   ├── layout/             # Sidebar, TopBar, MobileNav, ThemeToggle, LocaleToggle
│   │   ├── home/               # StatCard, CheckinsChart, HomeSkeleton...
│   │   └── events/
│   │       ├── *.tsx           # EventCard, EventList, EventFilters...
│   │       └── details/        # MetricsGrid, ParticipantsTable, Charts...
│   ├── features/
│   │   ├── events/
│   │   │   ├── api.ts          # getEvents, getEvent (fetch + Zod)
│   │   │   ├── hooks.ts        # useEvents, useEvent (React Query)
│   │   │   ├── schemas.ts      # Zod schemas para validação da API
│   │   │   └── types.ts        # Re-exporta tipos relevantes
│   │   └── checkins/
│   │       ├── rules.ts        # validateCheckIn — lógica pura e testável
│   │       ├── api.ts          # createCheckin, updateParticipant, updateEventMetrics
│   │       └── hooks.ts        # useCheckIn — mutation orquestrada
│   ├── stores/
│   │   └── ui-store.ts         # Zustand: sidebar, isMobile
│   ├── hooks/
│   │   └── use-debounced-value.ts
│   ├── i18n/
│   │   ├── navigation.ts       # Helpers de navegação locale-aware
│   │   ├── request.ts          # Agrega mensagens por locale
│   │   └── routing.ts          # Locales suportados e locale padrão
│   ├── lib/
│   │   ├── api-client.ts       # Fetch wrapper tipado com tratamento de erros
│   │   ├── query-client.ts     # Factory de QueryClient com defaults
│   │   ├── format.ts           # Intl.NumberFormat helpers (pt-BR)
│   │   └── utils.ts            # cn() do shadcn
│   ├── messages/
│   │   ├── pt/                 # Traduções em português por domínio/página
│   │   └── en/                 # Traduções em inglês por domínio/página
│   └── types/
│       └── api.ts              # Tipos base: Event, Participant, Checkin...
├── src/middleware.ts           # Middleware do next-intl para `/pt` e `/en`
└── tests/
    └── e2e/
        ├── events-list.spec.ts  # Listagem, filtros, busca, empty/error states
        ├── checkin-rules.spec.ts # Regras de negócio de check-in
        └── a11y.spec.ts         # axe-core nas rotas principais
```

---

## Decisões técnicas

### Next.js App Router

Server Components por padrão reduzem JavaScript no cliente. O `loading.tsx` do App Router gera skeletons automaticamente sem lógica extra no componente de página. O layout raiz fica técnico, enquanto `src/app/[locale]/layout.tsx` concentra o shell visual da aplicação.

### Internacionalização com next-intl

As rotas são prefixadas com locale (`/pt` e `/en`) para tornar links compartilháveis e previsíveis. As mensagens ficam separadas por domínio/página em `src/messages`, mas são agregadas por `src/i18n/request.ts`, mantendo organização sem dificultar o uso dos hooks do `next-intl`.

### Tema light/dark/system com next-themes

O tema dark continua sendo o padrão visual da aplicação, mas o usuário pode alternar entre claro, escuro e sistema. A escolha fica no `ThemeProvider`, usando CSS variables em `globals.css` para manter os componentes independentes de cores hardcoded.

### React Query + Zustand + nuqs — três tipos de estado

- **React Query**: estado de servidor (dados remotos, cache, revalidação). Centraliza fetch, deduplicação e invalidação pós-mutation.
- **Zustand**: estado de UI que persiste entre rotas mas não precisa de URL (sidebar aberta, detecção mobile).
- **nuqs**: estado de URL (filtros, busca, ordenação). Permite compartilhar links com o estado preservado e funciona com o botão voltar do browser.

### shadcn/ui em vez de MUI ou Chakra

shadcn/ui não é uma biblioteca de componentes instalada como dep — é código que você possui. Facilita customização fina do tema dark sem sobrescrever estilos de terceiros, e integra nativamente com Tailwind v4 e CSS variables.

### json-server local em vez de GitHub Pages

Permite mutations reais (POST/PATCH) que afetam o estado do banco durante o desenvolvimento, reproduzindo fielmente o comportamento de uma API REST. Rodar no mesmo monorepo elimina configuração de CORS e HTTPS.

### Playwright em vez de Jest + RTL

Testes E2E verificam o comportamento real no browser, incluindo mutações de estado, debounce e transições de UI. `page.route()` intercepta mutations nos testes que precisam de estado isolado sem resetar o db.json.

### Recharts

API declarativa baseada em componentes React, leve e com suporte nativo a SVG responsivo via `ResponsiveContainer`. Integra sem configuração extra com Tailwind e permite tooltips customizados.

### Animações de números com @number-flow/react

`AnimatedNumber` encapsula o `NumberFlow` iniciando em `0` e animando até o valor real via `requestAnimationFrame` após o skeleton desaparecer. Cria percepção de dados "chegando" ao invés de aparecerem estáticos.

---

## Regras de negócio

Implementadas em `src/features/checkins/rules.ts` como função pura `validateCheckIn`, sem efeitos colaterais:

| Condição                                         | Resultado                        |
| ------------------------------------------------ | -------------------------------- |
| Evento `closed` ou `cancelled`                   | Bloqueado — `event_closed`       |
| Participante **Normal** tentando sair (`exit`)   | Bloqueado — `invalid_action`     |
| Participante **Normal** com `checkin_count >= 1` | Bloqueado — `already_checked_in` |
| Participante **VIP** `inside` tentando entrar    | Bloqueado — `invalid_action`     |
| Participante **VIP** `outside` tentando sair     | Bloqueado — `invalid_action`     |
| Demais casos                                     | Permitido                        |

**Participante Normal**: máximo de 1 check-in (sem saída permitida).
**Participante VIP**: entradas e saídas ilimitadas, alternadas.

---

## Testes

### Rodar todos os testes E2E

```bash
pnpm test:e2e
```

### Apenas acessibilidade

```bash
pnpm test:e2e tests/e2e/a11y.spec.ts
```

### Com interface gráfica (debug)

```bash
pnpm test:e2e:ui
```

### Apenas Chromium (mais rápido)

```bash
pnpm test:e2e --project=chromium
```

### Estratégia de isolamento

Os testes usam `page.route()` para interceptar mutations (POST `/checkins`, PATCH `/participants/**`, PATCH `/events/**`). O `db.json` nunca é modificado durante os testes — preservando determinismo sem precisar resetar o banco antes de cada spec.

---

## Edge cases tratados

- **Evento cancelado**: botões de check-in desabilitados com tooltip explicativo.
- **Evento encerrado**: mesma regra de cancelado.
- **Normal com 1 check-in**: botão de entrada desabilitado com tooltip.
- **VIP alternando**: botão alterna entre "Entrada" e "Saída" conforme o status atual.
- **Divisão por zero**: `entry_rate` e `error_rate` protegidos quando `expected_count = 0`.
- **Lista vazia**: EmptyState exibido na listagem e na tabela de participantes.
- **Erro de API**: ErrorState com botão "Tentar novamente" que aciona `refetch`.
- **Debounce na busca**: 400 ms via `useDebouncedValue` para não disparar requests a cada tecla.

---

## Como utilizei IA durante o desenvolvimento

**Ferramenta principal:** Claude Code (claude-sonnet-4-6) via CLI e extensão VS Code.

**O que foi delegado ao agente:**

- Geração de boilerplate (schemas Zod, hooks React Query, configuração do Playwright).
- Estrutura inicial de componentes de UI (MetricCard, EventCard, Skeletons).
- Configuração de ferramentas (lefthook, lint-staged, GitHub Actions).
- Instalação e integração de libs novas (@number-flow/react, axe-core, next-intl).

**O que foi revisado manualmente:**

- Todas as regras de negócio em `features/checkins/rules.ts` — verificadas caso a caso contra o enunciado.
- Decisões arquiteturais (qual estado vai onde, estratégia de isolamento dos testes).
- Dados do `server/db.json` para garantir cobertura dos edge cases.
- Comportamento visual dos componentes animados e responsividade.

**Guia operacional:** o arquivo `AGENTS.md` na raiz serviu como "constitution" do projeto — toda sessão nova com o agente começava com a leitura desse arquivo, garantindo consistência de convenções entre sessões.

---

## Melhorias com mais tempo

- **Endpoint atômico para check-in**: hoje são 3 requests separados (POST `/checkins` + PATCH `/participants` + PATCH `/events`). Um endpoint único eliminaria inconsistências parciais em caso de falha.
- **Testes unitários para `validateCheckIn`**: com Vitest, cada branch da função pura teria cobertura explícita.
- **Optimistic updates**: atualizar o estado local imediatamente e reverter em caso de erro melhora a percepção de velocidade.
- **Real-time via WebSocket**: múltiplos operadores de check-in veriam o painel atualizar sem refresh.
- **Storybook**: catálogo isolado dos componentes do design system.
- **Cobertura i18n completa**: revisar textos remanescentes em tooltips, gráficos e mensagens operacionais para garantir paridade total PT/EN.
- **PWA / offline-first**: permitir check-ins mesmo sem internet, sincronizando ao reconectar.

---

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

**Autor:** Lucas Araújo de Lima — lucasarlim@gmail.com
