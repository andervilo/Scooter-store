# Specification — SaaS de Gestão para Lojas e Oficinas de Mobilidade Elétrica

## 1. Objetivo
Especificação técnica do MVP multi-tenant para oficinas e lojas de mobilidade elétrica, com portal da oficina e portal do cliente.

Stack: Next.js, React, TypeScript, Tailwind CSS, Route Handlers, Turso/libSQL, Vercel e GitHub.

## 2. Arquitetura
Monólito modular full-stack em Next.js.

Fluxo: Browser → Next.js (UI + API) → camada de serviços/repositórios → Turso/libSQL.

Regras de negócio não devem ficar nos componentes React ou diretamente nos Route Handlers.

## 3. Multi-tenancy
Company é o tenant. Toda consulta interna deve ser limitada ao companyId obtido da sessão autenticada.

Nunca confiar em companyId enviado pelo frontend para autorização.

## 4. Perfis
- ADMIN
- EMPLOYEE
- CUSTOMER

ADMIN gerencia empresa, funcionários e todos os recursos do tenant.
EMPLOYEE opera clientes, veículos, baterias e OS.
CUSTOMER acessa exclusivamente informações relacionadas aos próprios veículos.

## 5. Autenticação
Magic Link ou OTP por e-mail verificado.

A sessão deve permitir recuperar userId, email, role, companyId e/ou customerId.

## 6. Modelo de dados

### companies
id, name, trade_name, cnpj, email, phone, whatsapp, address, active, created_at, updated_at.

### users
id, company_id, customer_id, name, email, role, active, created_at, updated_at.

### customers
id, company_id, name, cpf, phone, whatsapp, email, notes, active, created_at, updated_at.

### vehicles
id, company_id, customer_id, type, brand, model, serial_number, color, motor_power_watts, voltage, notes, active, created_at, updated_at.

Tipos: ELECTRIC_SCOOTER, ELECTRIC_BIKE, SCOOTER, BIKE, OTHER.

### batteries
id, company_id, vehicle_id, technology, voltage, capacity_ah, manufacturer, serial_number, installed_at, removed_at, notes, active, created_at, updated_at.

Tecnologias: LEAD_ACID, LITHIUM_ION, LIFEPO4, OTHER.

### service_orders
id, company_id, customer_id, vehicle_id, number, status, problem_description, diagnosis, technical_notes, customer_notes, opened_at, completed_at, delivered_at, next_service_at, subtotal, discount, total, created_by, created_at, updated_at.

Status: OPEN, DIAGNOSIS, WAITING_APPROVAL, WAITING_PART, IN_SERVICE, READY, DELIVERED, CANCELED.

### service_order_items
id, service_order_id, type, description, quantity, unit_price, total_price, created_at, updated_at.

Tipos: SERVICE, PART.

## 7. Histórico
O histórico do veículo será inicialmente derivado de Service Orders, itens e baterias. Registros técnicos pertencem à empresa que os produziu; o cliente pode visualizá-los conforme autorização.

## 8. Portal da Oficina
Rotas sugeridas:
/app
/app/clientes
/app/clientes/[id]
/app/veiculos
/app/veiculos/[id]
/app/ordens
/app/ordens/[id]
/app/configuracoes

## 9. Portal do Cliente
Rotas sugeridas:
/cliente
/cliente/veiculos
/cliente/veiculos/[id]
/cliente/ordens
/cliente/ordens/[id]
/cliente/perfil

O cliente verá ficha técnica, bateria, OS atual, valores, histórico e próxima revisão.

## 10. API
Rotas sugeridas:
/api/auth/*
/api/company/*
/api/customers/*
/api/vehicles/*
/api/batteries/*
/api/service-orders/*
/api/dashboard/*

Portal cliente:
/api/me
/api/me/vehicles
/api/me/vehicles/[id]
/api/me/service-orders
/api/me/service-orders/[id]

Endpoints /api/me/* devem determinar customerId pela sessão, nunca por parâmetro do cliente.

## 11. Autorização
Criar camada centralizada com funções equivalentes a:
requireUser()
requireCompany()
requireRole()
requireCustomer()
requireVehicleAccess()
requireServiceOrderAccess()

Consultas devem sempre incluir o tenant ou proprietário autorizado.

## 12. Organização do projeto
src/app para rotas/UI; src/components para componentes compartilhados; src/modules para auth, companies, customers, vehicles, batteries e service-orders; src/lib para db/auth/permissions.

Fluxo backend recomendado: Route Handler → Service → Repository → Turso.

## 13. Banco
Produção: Turso/libSQL.
Desenvolvimento: SQLite/libSQL local.

Variáveis:
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN

Nunca usar NEXT_PUBLIC_ para credenciais.

## 14. Identificadores
Preferir UUID ou ULID para IDs expostos. O número visível da OS pode ser sequencial por empresa.

## 15. Índices
Indexar users.email; customers.company_id/cpf/phone; vehicles.company_id/customer_id/serial_number; batteries.vehicle_id; service_orders.company_id/customer_id/vehicle_id/status/number.

## 16. Auditoria
Entidades relevantes terão created_at e updated_at. Ordens terão created_by; futuramente updated_by e trilha de alterações.

## 17. Responsividade
Mobile-first. Cadastro de cliente/veículo, abertura e atualização de OS e consulta de histórico devem funcionar confortavelmente no celular.

## 18. Testes
Prioridade máxima para isolamento multi-tenant e ownership.

Cenários obrigatórios:
- Empresa B não acessa recurso da Empresa A.
- Cliente B não acessa veículo/OS do Cliente A.
- criação e atualização de OS;
- cálculo de subtotal/desconto/total;
- transições de status;
- associação cliente/veículo;
- autenticação e autorização.

## 19. Fluxo da oficina
Login → Dashboard → Cliente → Veículo → Abrir OS → Diagnóstico → Serviços/peças → Manutenção → Pronta → Entregue.

## 20. Fluxo do cliente
Login → Portal → Meus veículos → Veículo → OS atual → Histórico → Próxima revisão.

## 21. Evoluções
Orçamento online com aprovação/recusa, prontuário digital, QR Code, notificações, PWA, estoque, financeiro e assinatura/plano pago.

## 22. Critérios técnicos de aceite
O MVP estará apto quando autenticação, isolamento, perfis, clientes, veículos, baterias, OS, itens, cálculos, status, histórico, portal do cliente, dashboard e responsividade estiverem funcionais; testes críticos de autorização estiverem passando; aplicação estiver publicada na Vercel com Turso configurado.

## 23. Definição do MVP
Dois fluxos completos são obrigatórios:

Oficina: cadastrar cliente → veículo → bateria → OS → diagnóstico → serviços/peças → status → finalizar → entregar.

Cliente: autenticar → visualizar veículos → acompanhar OS → consultar valores → histórico → próxima revisão.
