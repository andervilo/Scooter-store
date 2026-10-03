# Production readiness

## Health
- GET /api/health/live: processo web está respondendo.
- GET /api/health/ready: valida acesso ao banco e retorna 503 se indisponível.

## Logs
Use logs estruturados JSON por evento. Não registrar OTP, tokens, cookies, AUTH_SECRET, dados bancários ou payloads sensíveis.

## Checklist antes de PROD
1. Variáveis de produção configuradas no provedor.
2. Banco PROD separado e migrado.
3. AUTH_SECRET exclusivo e forte.
4. Provedor real de e-mail/OTP configurado.
5. Build, lint, typecheck e testes verdes.
6. Readiness respondendo 200.
7. Fluxos de tenant e portal do cliente validados em HML.
8. Backup/restore do banco documentado e testado.
9. Alertas externos apontando para readiness e taxa de erros.
