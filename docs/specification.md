# Specification — SaaS de Gestão para Lojas e Oficinas de Mobilidade Elétrica

## 1. Objetivo
MVP multi-tenant com portal da oficina e portal do cliente.

Stack: Next.js, React, TypeScript, Tailwind CSS, Route Handlers, Turso/libSQL, Vercel e GitHub.

## 2. Arquitetura
Monólito modular full-stack em Next.js. Browser → Next.js (UI + API) → Service → Repository → Turso/libSQL.

## 3. Multi-tenancy
Company é o tenant. Toda consulta interna deve ser limitada ao companyId obtido da sessão. Nunca confiar em companyId do frontend.

## 4. Perfis
ADMIN, EMPLOYEE e CUSTOMER.

## 5. Autenticação
Magic Link ou OTP. A sessão recupera userId, email, role, companyId e/ou customerId.

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
Derivado inicialmente de Service Orders, itens e baterias.

## 8. Portal da Oficina
/app, /app/clientes, /app/clientes/[id], /app/veiculos, /app/veiculos/[id], /app/ordens, /app/ordens/[id], /app/configuracoes.

## 9. Portal do Cliente
/cliente, /cliente/veiculos, /cliente/veiculos/[id], /cliente/ordens, /cliente/ordens/[id], /cliente/perfil.

## 10. API
/api/auth/*, /api/company/*, /api/customers/*, /api/vehicles/*, /api/batteries/*, /api/service-orders/*, /api/dashboard/*.
/api/me, /api/me/vehicles, /api/me/vehicles/[id], /api/me/service-orders, /api/me/service-orders/[id].

## 11. Autorização
Centralizar requireUser(), requireCompany(), requireRole(), requireCustomer(), requireVehicleAccess() e requireServiceOrderAccess().

## 12. Organização
src/app, src/components, src/modules/{auth,companies,customers,vehicles,batteries,service-orders}, src/lib/{db,auth,permissions}, src/types.

## 13. Banco
Produção Turso/libSQL; desenvolvimento SQLite/libSQL local. TURSO_DATABASE_URL e TURSO_AUTH_TOKEN somente no servidor.

## 14. IDs
Preferir UUID/ULID externamente; número da OS sequencial por empresa.

## 15. Índices
users.email; customers.company_id/cpf/phone; vehicles.company_id/customer_id/serial_number; batteries.vehicle_id; service_orders.company_id/customer_id/vehicle_id/status/number.

## 16. Auditoria
created_at/updated_at e created_by na OS; ampliar futuramente.

## 17. Responsividade
Mobile-first.

## 18. Testes
Priorizar isolamento entre empresas/clientes, OS, cálculos, status, associações e autorização.

## 19. Fluxo da oficina
Login → Dashboard → Cliente → Veículo → OS → Diagnóstico → Serviços/peças → Manutenção → Pronta → Entregue.

## 20. Fluxo do cliente
Login → Portal → Meus veículos → Veículo → OS atual → Histórico → Próxima revisão.

## 21. Evoluções
Orçamento online, prontuário digital, QR Code, notificações, PWA, estoque, financeiro e assinatura.

## 22. Aceite
Autenticação, isolamento, perfis, clientes, veículos, baterias, OS, itens, cálculos, status, histórico, portal cliente, dashboard, responsividade, Vercel/Turso e testes críticos funcionando.
