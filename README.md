# Scooter Store

SaaS de gestão para lojas e oficinas de mobilidade elétrica.

## Stack

Next.js App Router, React, TypeScript e Tailwind CSS.

## Desenvolvimento local

Requer Node.js 20+.

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Validação

```bash
npm run typecheck
npm run lint
npm run build
```

## Health check

`GET /api/health` retorna o estado básico da aplicação.

## Documentação

Consulte a pasta `docs/` para PRD, especificação técnica e plano de implementação.

## Banco de dados

Sem variáveis configuradas, o desenvolvimento usa `file:local.db`. Para Turso, configure `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` no servidor.

```bash
npm run db:migrate
npm run db:seed
```

Valores monetários são armazenados em centavos (inteiros) para evitar erros de ponto flutuante.
