# Implementation Plan

## Estratégia de branches e ambientes

Fluxo principal:

```text
feature/* → develop → hml → main
              DEV       HML    PROD
```

Cada feature nasce de `develop` e retorna por Pull Request. `develop` representa integração/desenvolvimento, `hml` homologação e `main` produção. Hotfixes de produção poderão usar `hotfix/*` e depois ser sincronizados de volta para as branches inferiores.

## Feature 00 — Project Bootstrap
**Branch:** `feature/project-bootstrap`

- Criar projeto Next.js com TypeScript.
- Configurar Tailwind CSS.
- Definir estrutura modular.
- ESLint/formatting.
- Layout base responsivo.
- Configuração de variáveis de ambiente.
- Health check.
- README com execução local.

**Aceite:** aplicação compila, executa localmente e está pronta para deploy.

## Feature 01 — Database Foundation
**Branch:** `feature/database-foundation`
**Depende de:** Feature 00.

- Integrar `@libsql/client`.
- SQLite/libSQL local e Turso por ambiente.
- Criar mecanismo de migrations/schema.
- Criar tabelas companies, users, customers, vehicles, batteries, service_orders e service_order_items.
- UUID/ULID.
- Índices e constraints.
- Datas de auditoria.
- Seed mínimo para desenvolvimento.

**Aceite:** banco inicializável e testes de persistência passando.

## Feature 02 — Authentication
**Branch:** `feature/authentication`
**Depende de:** 01.

- Login por Magic Link ou OTP.
- Normalização de e-mail.
- Sessão segura HTTP-only.
- Logout.
- Recuperação do usuário autenticado.
- Middleware/proteção de áreas privadas.
- Tela de login.

**Aceite:** usuário autenticado acessa área privada e usuário anônimo é bloqueado.

## Feature 03 — Multi-tenancy & Authorization
**Branch:** `feature/multi-tenancy`
**Depende de:** 02.

- Roles ADMIN, EMPLOYEE e CUSTOMER.
- Contexto de tenant pela sessão.
- Helpers requireUser, requireCompany, requireRole e requireCustomer.
- Impedir uso de companyId do frontend como fonte de autorização.
- Testes de isolamento entre tenants.
- Testes de ownership para clientes.

**Aceite:** Empresa B não acessa recursos da Empresa A e Cliente B não acessa dados do Cliente A.

## Feature 04 — Company Management
**Branch:** `feature/company-management`
**Depende de:** 03.

- Cadastro/edição da empresa.
- Nome, fantasia, CNPJ, contatos e endereço.
- Tela /app/configuracoes.
- Permissões exclusivas de ADMIN onde aplicável.

**Aceite:** ADMIN administra apenas a própria empresa.

## Feature 05 — Employee Management
**Branch:** `feature/employee-management`
**Depende de:** 03, 04.

- Cadastro de funcionários.
- Ativação/desativação.
- ADMIN/EMPLOYEE.
- Associação ao tenant.
- Convite por e-mail futuramente preparado.

**Aceite:** ADMIN controla usuários internos sem acesso cruzado entre empresas.

## Feature 06 — Customer Management
**Branch:** `feature/customer-management`
**Depende de:** 03.

- CRUD de clientes.
- CPF opcional, telefone, WhatsApp, e-mail e observações.
- Busca e paginação.
- Tela de listagem e detalhes.
- Preparar vínculo entre customer e usuário CUSTOMER.

**Aceite:** oficina gerencia clientes somente dentro do tenant.

## Feature 07 — Vehicle Management
**Branch:** `feature/vehicle-management`
**Depende de:** 06.

- CRUD de veículos.
- Associação ao cliente.
- Tipo, marca, modelo, serial, cor, potência e tensão.
- Busca por modelo/serial/proprietário.
- Tela de detalhes.
- Helpers de autorização por veículo.

**Aceite:** cliente pode possuir múltiplos veículos e não há acesso entre tenants.

## Feature 08 — Battery Management
**Branch:** `feature/battery-management`
**Depende de:** 07.

- Cadastro de bateria.
- Tecnologia, tensão, Ah, fabricante e serial.
- Instalação/remoção.
- Bateria atual.
- Histórico de substituições.
- Validações de uma bateria ativa quando aplicável.

**Aceite:** ficha do veículo mostra bateria atual e histórico.

## Feature 09 — Service Order Core
**Branch:** `feature/service-orders`
**Depende de:** 07.

- Criar/editar OS.
- Numeração sequencial por empresa.
- Problema relatado, diagnóstico e observações.
- Datas de abertura/conclusão/entrega.
- Próxima revisão.
- Fluxo de status.
- Listagem e filtros.
- requireServiceOrderAccess.

**Aceite:** oficina conduz uma OS do OPEN ao DELIVERED respeitando tenant e regras de status.

## Feature 10 — Service Order Items & Pricing
**Branch:** `feature/service-order-items`
**Depende de:** 09.

- Itens SERVICE/PART.
- Quantidade e valor unitário.
- Cálculo de total do item.
- Subtotal da OS.
- Desconto.
- Total final.
- Testes monetários.

**Aceite:** valores são calculados no backend e apresentados corretamente.

## Feature 11 — Vehicle History
**Branch:** `feature/vehicle-history`
**Depende de:** 08, 09, 10.

- Timeline do veículo.
- Ordens anteriores.
- Serviços e peças.
- Histórico de baterias.
- Próxima revisão.
- Ordenação cronológica.

**Aceite:** oficina visualiza prontuário técnico básico do veículo.

## Feature 12 — Workshop Dashboard
**Branch:** `feature/workshop-dashboard`
**Depende de:** 09.

- Contadores de OS por status.
- Ordens recentes.
- Atalhos para nova OS/cliente/veículo.
- Consultas agregadas por tenant.
- Layout mobile-first.

**Aceite:** dashboard resume a operação da empresa autenticada.

## Feature 13 — Global Search
**Branch:** `feature/global-search`
**Depende de:** 06, 07, 09.

- Busca por cliente.
- Telefone/CPF.
- Veículo/modelo/serial.
- Número da OS.
- Resultados limitados ao tenant.

**Aceite:** pesquisa retorna somente recursos autorizados.

## Feature 14 — Customer Portal
**Branch:** `feature/customer-portal`
**Depende de:** 03, 07, 09, 10, 11.

- Usuário CUSTOMER vinculado ao customer.
- Dashboard /cliente.
- Meus veículos.
- Detalhes e bateria.
- OS atual e anteriores.
- Serviços, peças e valores.
- Histórico.
- Próxima revisão.
- Perfil.

**Aceite:** cliente autenticado visualiza somente seus próprios dados.

## Feature 15 — Responsive UX & Design System
**Branch:** `feature/responsive-ui`
**Depende de:** pode evoluir paralelamente após 00.

- Componentes compartilhados.
- Navegação desktop/mobile.
- Formulários.
- Tabelas/cards responsivos.
- Feedback de loading/error/empty.
- Acessibilidade básica.
- Padronização visual dos dois portais.

**Aceite:** fluxos principais são confortáveis em smartphone, tablet e desktop.

## Feature 16 — Automated Tests
**Branch:** `feature/test-suite`
**Depende de:** transversal.

- Unitários para regras.
- Integração para repositories/services.
- APIs.
- Multi-tenancy.
- Ownership.
- Status de OS.
- Cálculos.
- Smoke tests dos fluxos críticos.

**Aceite:** cenários críticos impedem regressão de segurança e negócio.

## Feature 17 — DEV/HML/PROD Infrastructure
**Branch:** `feature/environments`
**Depende de:** 00, 01.

- Projeto Vercel DEV ligado a develop.
- Projeto Vercel HML ligado a hml.
- Projeto Vercel PROD ligado a main.
- Bancos Turso separados DEV/HML/PROD.
- Variáveis de ambiente separadas.
- Estratégia de migrations.
- Health checks.
- Documentação de promoção.

**Aceite:** cada branch longa possui aplicação e banco independentes.

## Feature 18 — Observability & Production Readiness
**Branch:** `feature/observability`
**Depende de:** MVP funcional.

- Logging estruturado.
- Tratamento consistente de erros.
- Páginas 404/500.
- Validação de input.
- Rate limiting em autenticação quando necessário.
- Revisão de headers/cookies.
- Auditoria básica.
- Checklist de produção.

**Aceite:** falhas são rastreáveis e configurações críticas de segurança revisadas.

## Feature 19 — SaaS Plans Foundation
**Branch:** `feature/plans-foundation`
**Depende de:** 04.

- Modelo de plano.
- Limites Free.
- Preparação para Pro.
- Guards de limites.
- Tela informativa de plano.
- Sem cobrança real no primeiro MVP.

**Aceite:** aplicação consegue diferenciar recursos/limites por plano.

# Backlog pós-MVP

Features futuras: aprovação online de orçamento, notificações WhatsApp/e-mail/push, QR Code, fotos, assinatura do cliente, estoque, financeiro, checkout/assinatura, PWA e prontuário digital expandido.

# Ordem sugerida

```text
00 Bootstrap
  ↓
01 Database
  ↓
02 Authentication
  ↓
03 Multi-tenancy
  ├─→ 04 Company → 05 Employees
  ├─→ 06 Customers → 07 Vehicles → 08 Batteries
  │                         └──────→ 11 Vehicle History
  └────────────────→ 09 Service Orders → 10 Items/Pricing
                                  ├─→ 12 Dashboard
                                  ├─→ 13 Search
                                  └─→ 14 Customer Portal

15 Responsive UI — transversal
16 Tests         — transversal
17 Environments  — iniciar cedo
18 Observability — antes da produção
19 Plans         — após núcleo do MVP
```

# Definition of Done por feature

Uma feature só deve ser considerada concluída quando código e migrations necessários estiverem versionados; regras de autorização forem aplicadas; testes relevantes passarem; UI estiver responsiva quando aplicável; não houver segredo versionado; documentação afetada estiver atualizada; PR para develop tiver sido revisado; e o comportamento estiver validado no ambiente DEV antes da promoção para HML.
