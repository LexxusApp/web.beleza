# Lumière — E-commerce de Cosméticos de Luxo

Loja virtual completa em **Next.js 15 + Tailwind CSS 4 + Supabase** com painel administrativo, autenticação, gestão de produtos/categorias/pedidos e upload de imagens.

---

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Hospedagem sugerida:** Vercel

---

## Funcionalidades

### Loja pública
- Navbar fixa que muda de cor ao rolar
- Banner hero com call-to-action
- Grade de produtos por categoria
- Busca preditiva (server-side)
- Página de produto com abas (Como Usar / Ingredientes / Avaliações)
- Carrinho lateral (drawer) com persistência em `localStorage`
- Checkout que grava o pedido no banco

### Painel administrativo (`/admin`)
- Login com e-mail e senha (Supabase Auth)
- Dashboard com estatísticas e alertas de estoque baixo
- CRUD de **produtos** com upload de imagem para o Supabase Storage
- CRUD de **categorias**
- Visualização e atualização de status dos **pedidos**
- Gestão de **administradores** (criar/listar)

---

## Setup inicial

### 1. Pré-requisitos
- Node.js 20+
- Conta no [Supabase](https://supabase.com) com um projeto criado

### 2. Instalar dependências
```powershell
npm install
```

### 3. Configurar variáveis de ambiente
Edite `.env.local` na raiz e cole as chaves do seu projeto Supabase (em **Project Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://ylrzovnteodyxnlxvybt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...        # anon public
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...            # service_role (privado!)
```

> O `service_role` nunca deve ser exposto publicamente. Mantenha-o apenas em `.env.local` e nas variáveis do servidor (Vercel).

### 4. Aplicar o schema no Supabase

Faça login no CLI e vincule ao seu projeto:

```powershell
npx supabase login
npx supabase link --project-ref ylrzovnteodyxnlxvybt
```

Aplique a migration e o seed:

```powershell
npx supabase db push
npx supabase db seed
```

> Alternativa rápida: copie e cole o conteúdo de `supabase/migrations/20260526000000_init_schema.sql` e depois `supabase/seed.sql` no **SQL Editor** do painel do Supabase.

### 5. Criar o primeiro administrador

No painel do Supabase:

1. Vá em **Authentication → Users → Add user** e crie um usuário com e-mail e senha.
2. Copie o `id` desse usuário.
3. No **SQL Editor**, rode:

```sql
insert into public.admins (user_id, email)
values ('COLE-O-ID-AQUI', 'seu-email@exemplo.com');
```

### 6. Rodar o servidor

```powershell
npm run dev
```

- Loja: `http://localhost:3000`
- Painel: `http://localhost:3000/admin`

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (site)/                # rotas públicas (com Navbar)
│   │   ├── page.tsx           # home
│   │   ├── produto/[slug]/
│   │   ├── checkout/
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── login/             # tela de login
│   │   ├── (panel)/           # rotas autenticadas
│   │   │   ├── page.tsx       # dashboard
│   │   │   ├── produtos/
│   │   │   ├── categorias/
│   │   │   ├── pedidos/
│   │   │   └── admins/
│   │   └── actions.ts         # Server Actions de CRUD
│   ├── api/
│   │   ├── search/            # busca preditiva
│   │   ├── checkout/          # criar pedido
│   │   └── admin/create-admin/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── admin/                 # componentes do painel
│   └── (públicos)
├── context/CartContext.tsx
├── lib/
│   ├── queries.ts             # leitura do Supabase nas páginas
│   └── supabase/
│       ├── client.ts          # browser
│       ├── server.ts          # server components
│       ├── admin.ts           # service role
│       ├── middleware.ts
│       └── types.ts
└── middleware.ts              # auth nas rotas /admin
supabase/
├── config.toml
├── migrations/
│   └── 20260526000000_init_schema.sql
└── seed.sql
```

---

## Próximos passos sugeridos

- Integrar gateway de pagamento (Stripe, MercadoPago)
- Variações de produto (cor, tamanho)
- Sistema de cupons de desconto
- E-mails transacionais (confirmação de pedido)
- SEO avançado (sitemap, metadata por produto)

---

© 2026 LUMIÈRE — Beleza de luxo, entregue com elegância.
