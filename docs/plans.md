# SaaS Plans Foundation

Esta etapa prepara planos e assinaturas sem integrar cobrança.

## Modelo
- plans: catálogo de planos e limites.
- company_subscriptions: plano atual e status por empresa.
- Limites iniciais: funcionários, clientes e veículos.
- NULL em um limite significa ilimitado.

## Status
TRIAL, ACTIVE, PAST_DUE e CANCELED.

## Cobrança
Nenhum gateway de pagamento está acoplado nesta feature. Uma integração futura poderá atualizar company_subscriptions via webhook sem alterar o domínio operacional.
