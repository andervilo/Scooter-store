# Ambientes

O projeto usa três ambientes isolados:

| Ambiente | Branch | Vercel project | Banco |
|---|---|---|---|
| DEV | develop | scooter-store-dev | Turso DEV |
| HML | hml | scooter-store-hml | Turso HML |
| PROD | main | scooter-store | Turso PROD |

## Variáveis obrigatórias
- TURSO_DATABASE_URL
- TURSO_AUTH_TOKEN
- AUTH_SECRET
- APP_ENV (development, homologation ou production)

Nunca reutilize banco ou AUTH_SECRET entre ambientes. Segredos ficam no provedor de deploy, nunca no Git.

## Promoção
feature/* → develop → hml → main. Migrações devem ser executadas no banco do ambiente antes da validação funcional correspondente.
