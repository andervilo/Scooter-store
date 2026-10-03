# PRD — SaaS de Gestão para Lojas e Oficinas de Mobilidade Elétrica

## 1. Visão do Produto
SaaS multiempresa para lojas e oficinas de scooters elétricas, bicicletas elétricas e outros veículos leves. A plataforma centraliza clientes, veículos, baterias, manutenções, ordens de serviço e histórico técnico.

Além do portal da oficina, cada cliente terá uma conta para consultar seus próprios veículos, ordens de serviço, histórico, bateria, valores e próximas revisões.

## 2. Problema
Pequenas oficinas frequentemente controlam atendimentos por WhatsApp, papel e planilhas, dificultando rastrear histórico, peças, baterias, revisões, valores e andamento das ordens.

## 3. Público-alvo
- Lojas e oficinas de scooters elétricas.
- Lojas e oficinas de bicicletas elétricas.
- Assistências técnicas de mobilidade elétrica.
- Pequenas frotas.

## 4. Modelo SaaS
Cada empresa é um tenant isolado. Usuários internos pertencem à empresa e clientes acessam somente dados relacionados aos próprios veículos.

## 5. Perfis
- ADMIN: administração completa da oficina.
- EMPLOYEE: operação de clientes, veículos e ordens.
- CUSTOMER: consulta de seus veículos, histórico e ordens.

## 6. Cadastro da empresa
Nome, nome fantasia, CNPJ opcional, telefone, WhatsApp, e-mail, endereço e status.

## 7. Clientes
Nome, CPF opcional, telefone, WhatsApp, e-mail, observações e data de cadastro. Um cliente pode possuir vários veículos.

## 8. Veículos
Tipo, marca, modelo, número de série, cor, potência do motor, tensão, observações e proprietário.

## 9. Baterias
Tecnologia, tensão, capacidade em Ah, fabricante, número de série, data de instalação, remoção e observações. Deve existir histórico de substituições.

## 10. Ordem de Serviço
Núcleo operacional do produto. Deve conter número, cliente, veículo, problema relatado, diagnóstico, serviços, peças, valores, datas e status.

Status iniciais: OPEN, DIAGNOSIS, WAITING_APPROVAL, WAITING_PART, IN_SERVICE, READY, DELIVERED, CANCELED.

## 11. Itens da OS
Cada item será SERVICE ou PART, com descrição, quantidade, valor unitário e total.

## 12. Histórico do veículo
A ficha do veículo deverá apresentar cronologicamente manutenções, peças substituídas, baterias e ordens de serviço. Os registros técnicos pertencem à empresa que os produziu.

## 13. Portal da Oficina
Dashboard, clientes, veículos, baterias, ordens de serviço, busca, histórico e configurações.

## 14. Portal do Cliente
O cliente autenticado poderá visualizar seus veículos, ficha técnica, bateria, OS/status, serviços, peças, valores, histórico e próxima revisão. Futuramente poderá aprovar orçamentos.

## 15. Dashboard
Indicadores de OS por status e ordens recentes.

## 16. Busca
Pesquisa por cliente, telefone, CPF, veículo, modelo, número de série e número da OS.

## 17. Próxima revisão
A oficina poderá registrar a próxima revisão. Futuramente o sistema enviará lembretes.

## 18. Arquitetura
Next.js + React + TypeScript + Tailwind CSS + Route Handlers + Turso/libSQL + Vercel + GitHub.

## 19. Multi-tenancy
Todos os dados de negócio deverão ser vinculados ao tenant. O backend obtém o tenant pela sessão autenticada.

## 20. Segurança
Magic Link ou OTP por e-mail. Segredos do banco exclusivamente no servidor.

## 21. Responsividade
Mobile-first.

## 22. Planos
Free inicialmente limitado; Pro sugerido inicialmente em R$ 39,90/mês, sujeito a validação comercial.

## 23. Evoluções
Aprovação online de orçamento, WhatsApp/e-mail/push, QR Code, fotos, assinatura, estoque, financeiro, pagamentos, PWA e prontuário digital.

## 24. Critérios de sucesso
A oficina realiza o ciclo completo cliente → veículo → bateria → OS → diagnóstico → itens → manutenção → entrega. O cliente consulta seus veículos, OS, valores, histórico e próxima revisão.

## 25. Objetivo final
Substituir papel, planilhas e WhatsApp por uma plataforma simples que centralize CLIENTE → VEÍCULO → BATERIA → MANUTENÇÕES → ORDENS DE SERVIÇO → HISTÓRICO.
