# Arquitetura Técnica e Planejamento do Projeto — Sistema de Gestão de Condomínios

> Documento de referência técnica: stack escolhida, estrutura do frontend, requisitos, papéis de usuário, módulos, roadmap de sprints, fluxo de trabalho com Git e arquitetura em camadas.

---

## 1. Stack do Frontend

**Escolha:** React + Vite + TypeScript.

### Justificativa técnica

- **Mercado e ecossistema:** React é o padrão de mercado para interfaces complexas (dashboards administrativos) e possui um ecossistema gigantesco de bibliotecas de componentes (TailwindCSS, Material UI etc.) que aceleram a construção de telas.
- **Paradigma de componentização:** React força pensar em componentes isolados com responsabilidades únicas, o que mapeia bem para os conceitos de Orientação a Objetos e SOLID que serão aprofundados no backend.
- **Por que Vite e não Next.js:** Next.js é excelente, mas introduz conceitos de SSR e um backend próprio (Node.js). Como o foco principal é construir uma API REST robusta em Java com Spring Boot, um frontend SPA puro consumindo essa API evita confusões arquiteturais. Vite oferece um ambiente de desenvolvimento ultrarrápido.
- **TypeScript:** essencial para tipar os dados no frontend (interfaces e types), garantindo que o que o frontend envia é exatamente o que o backend em Java espera — reduzindo erros de comunicação.

### Alternativas descartadas

- **Angular:** ótimo para sistemas corporativos, mas tem curva de aprendizado inicial íngreme e é bastante opinativo.
- **Vue.js:** ótima ferramenta, mas o React tem maior tração no mercado corporativo atual para integrações com ecossistemas Java.

---

## 2. Arquitetura de Pastas do Frontend

Organização **baseada em Features (Domínios)**, não por "tipo de arquivo". A lógica é que o código que muda junto, mora junto.

| Pasta | Responsabilidade |
|---|---|
| `src/assets/` | Imagens, ícones e fontes |
| `src/components/` | Componentes globais e "burros" (Botões, Inputs, Modais) — não conhecem regra de negócio, reutilizáveis em qualquer lugar |
| `src/features/` | Coração da aplicação. Separado por módulo do sistema (ex.: `portaria/`, `financeiro/`, `moradores/`), cada um com seus próprios componentes, integrações com API e estados |
| `src/services/` | Configuração do cliente HTTP (Axios/Fetch) e interceptadores (onde entrará o token JWT futuramente) |
| `src/pages/` | Apenas a montagem das telas, importando as features |
| `src/routes/` | Configuração de roteamento |
| `src/utils/` | Funções auxiliares genéricas (formatadores de data, moeda etc.) |

---

## 3. Requisitos Funcionais (RF) e Não Funcionais (RNF)

### Requisitos Funcionais — o que o sistema FAZ

| ID | Descrição |
|---|---|
| RF01 | Gestão completa (CRUD) de moradores, funcionários e unidades (apartamentos/blocos) |
| RF02 | Registro de entrada e saída de visitantes e prestadores de serviço |
| RF03 | Reserva de áreas comuns pelos moradores (churrasqueira, salão de festas) |
| RF04 | Registro de recebimento e retirada de encomendas |
| RF05 | Abertura, acompanhamento e resolução de ocorrências (manutenção/reclamações) |

### Requisitos Não Funcionais — como o sistema SE COMPORTA

| ID | Categoria | Descrição |
|---|---|---|
| RNF01 | Segurança | Acesso autenticado; rotas da API protegidas por JWT (JSON Web Token) |
| RNF02 | Autorização | Controle de Acesso Baseado em Roles (RBAC) — ex.: morador não vê dados financeiros |
| RNF03 | Responsividade | Painel de porteiro/síndico focado em desktop; interface do morador precisa funcionar bem em dispositivos móveis |
| RNF04 | Rastreabilidade | Ações críticas (excluir morador, aprovar despesa) devem registrar logs de auditoria (quem fez e quando) |

---

## 4. Tipos de Usuários e Permissões (Atores)

Quatro perfis principais, garantindo encapsulamento das regras de segurança:

- **Síndico (Admin):** acesso total. Configura o sistema, aprova cadastros, vê relatórios financeiros e gerencia funcionários.
- **Porteiro / Segurança:** foco operacional. Registra visitantes, gerencia encomendas e acessa lista de moradores/placas de veículos. Sem acesso a finanças ou ocorrências internas.
- **Morador:** acesso restrito aos próprios dados. Abre ocorrências, reserva áreas comuns, libera visitantes e é notificado de encomendas.
- **Zelador / Equipe de Manutenção:** acesso focado em "Ocorrências" e ordens de serviço.

---

## 5. Módulos Iniciais (Contextos Delimitados)

| Módulo | Problema que resolve | Funcionalidades |
|---|---|---|
| **Identidade & Acesso** | Saber quem é quem e o que pode fazer | Login, recuperação de senha, gestão de perfis (Roles) |
| **Cadastros Base (Core)** | Estruturar física e socialmente o condomínio | Gestão de Blocos, Apartamentos, Moradores, Veículos e Pets |
| **Portaria (Controle de Acesso)** | Segurança e fluxo de quem entra e sai | Check-in/Check-out de visitantes, lista de esperados, alerta de prestadores bloqueados |
| **Logística (Encomendas)** | Caos na portaria com entregas | Registro de chegada, notificação automática ao morador, assinatura digital de retirada |
| **Convivência & Facilities** | Conflitos por uso de espaços e comunicação ineficiente | Agenda de reservas (evitando conflito de horários), mural de avisos, enquetes/assembleias virtuais |

---

## 6. Navegação do Sistema (Proposta de Telas)

Interface de **Dashboard administrativo** (menu lateral + área de conteúdo central), adaptando-se ao perfil do usuário logado.

### Visão do Síndico (Administrador)
- **Início:** resumo (cards com total de moradores, inadimplência, ocorrências abertas)
- **Cadastros:** Moradores, Unidades, Funcionários
- **Financeiro:** Livro Caixa (entradas, saídas, saldo)
- **Comunicação:** enviar avisos, mural

### Visão da Portaria (Operacional)
- **Início:** painel rápido de controle de acesso (registrar entrada imediata)
- **Visitantes:** lista de autorizados do dia, histórico de acessos
- **Logística:** registrar nova encomenda, lista de pendentes de retirada

### Visão do Morador (Autoatendimento)
- **Início:** meus avisos, minhas encomendas pendentes
- **Minha Unidade:** meus dependentes, meus veículos
- **Áreas Comuns:** calendário de reservas (salão de festas, churrasqueira)
- **Ocorrências:** abrir chamado de manutenção ou reclamação

---

## 7. IDEs Recomendadas

### Frontend — Visual Studio Code (VS Code)
Ferramenta dominante no ecossistema JavaScript/TypeScript: leve, rápida, suporte nativo impecável ao TypeScript, e com ecossistema de extensões para React (Prettier, ESLint, Tailwind CSS IntelliSense) que acelera a construção de interfaces. Garante o mesmo ambiente usado pelas principais equipes de desenvolvimento web do mercado.

### Backend Java — IntelliJ IDEA Community Edition
Referência do mercado corporativo Java: melhor inteligência de análise de código da categoria, sugerindo refatorações, apontando violações de boas práticas e facilitando a navegação entre classes complexas. Boa integração com ferramentas de build (Maven/Gradle) e, mais adiante, com o ecossistema Spring.

---

## 8. Roadmap de Desenvolvimento

### 8.1 Versão inicial (organizada por conceito técnico)

| Sprint | Objetivo |
|---|---|
| 1 | Modelagem de Domínio e Fundamentos de POO — criar as entidades base do condomínio usando Classes, Atributos, Encapsulamento e Construtores em memória |
| 2 | Estruturas de Dados e Associações — relacionar moradores com apartamentos usando Collections (List, Set) |
| 3 | Comportamentos, Herança e Polimorfismo — implementar os diferentes tipos de usuários e regras de negócio usando Classes Abstratas e Interfaces |
| 4 | Robustez e Tratamento de Exceções — criar exceções customizadas (ex.: "Apartamento já ocupado", "Saldo insuficiente") |
| 5 | Persistência e Banco de Dados — abandonar dados em memória, introduzir JDBC, Repository Pattern e SQL |
| 6 | O Poder do Framework — migrar para Spring Boot, entendendo Injeção de Dependências e Inversão de Controle |
| 7 | Comunicação Web (API REST) — expor funcionalidades para o frontend via Controllers e verbos HTTP |
| 8 | Segurança e Autenticação — proteger a API com Spring Security e JWT |
| 9 | Integração Front x Back — conectar React com a API Java e testar o fluxo completo |
| 10 | Docker e Deploy — empacotar sistema e banco de dados, simulando produção |

> **Nota:** esta primeira versão do roadmap foi posteriormente revisada e substituída pela estratégia de **Vertical Slices** abaixo (seção 8.2), que entrega funcionalidades completas ponta a ponta a cada sprint, em vez de organizar por conceito técnico isolado.

### 8.2 Versão atual — Roadmap por Vertical Slices

Cada sprint entrega uma funcionalidade completa (ponta a ponta) com um alvo claro de aprendizado no backend.

**Sprint 1 — O Alicerce: Cadastro de Unidades (Blocos e Apartamentos)**
- Funcionalidade: estrutura física do condomínio — interface de cadastro, API de persistência e listagem na tela.
- Foco de aprendizado: Classes, Objetos, Atributos e Construtores; Encapsulamento (Getters, Setters, validação de estado interno); Arquitetura em Camadas (Controller → Service → Repository); Spring Boot básico e verbos HTTP (GET e POST).

**Sprint 2 — Relacionamentos: Gestão de Moradores**
- Funcionalidade: cadastrar moradores e vinculá-los aos respectivos apartamentos.
- Foco de aprendizado: Estruturas de Dados/Collections (List e Set); Associações entre objetos (1 para N); Herança (classe base abstrata `Pessoa` da qual `Morador` herda); queries para buscar moradores por unidade.

**Sprint 3 — Regras de Negócio e Robustez: Reserva de Áreas Comuns**
- Funcionalidade: morador solicita reserva do salão de festas; sistema bloqueia se a data já estiver ocupada ou fora de horário permitido.
- Foco de aprendizado: Tratamento de Exceções (try/catch e exceptions customizadas, ex.: `DataIndisponivelException`); manipulação de tempo (`java.time.LocalDateTime`); Clean Code (métodos curtos, responsabilidade única nas validações do Service).

**Sprint 4 — Contratos e Abstração: Controle de Portaria (Visitantes)**
- Funcionalidade: porteiro registra entrada de visitante; sistema valida regras de acesso diferentes para prestadores de serviço e convidados.
- Foco de aprendizado: Interfaces (contrato `EstrategiaAcesso` implementado de formas diferentes); Polimorfismo (Service chama `liberarAcesso()` sem saber o tipo de visitante); SOLID (Princípio Aberto/Fechado, preparando terreno para futura integração com biometria).

**Sprint 5 — Escalabilidade e Tipagem Segura: Controle de Encomendas**
- Funcionalidade: registro de pacotes com atualização de status (Aguardando, Retirado).
- Foco de aprendizado: Enums (status da encomenda); Generics (classe de resposta padrão da API, ex.: `ApiResponse<T>`); paginação de dados no banco e no React.

**Sprint 6 — Segurança: Autenticação e Autorização**
- Funcionalidade: tela de login; porteiro não pode acessar o menu de relatórios do síndico.
- Foco de aprendizado: autenticação e geração de JWT; filtros de requisição e Spring Security; gerenciamento de estado de usuário no frontend.

**Sprint 7 — O Mundo Real: Docker e Deploy**
- Funcionalidade: empacotar tudo em um ambiente simulado de produção.
- Foco de aprendizado: conteinerização (Docker); variáveis de ambiente e separação de configurações.

---

## 9. Controle de Versão (Git e Fluxo de Trabalho)

### Estratégia de branches

Variação ágil do Git Flow (GitHub Flow adaptado às sprints):

- **`main`:** espelho da produção. Sempre estável, testado e pronto para uso. Nunca se codifica diretamente na main.
- **`develop`:** branch de integração. Todas as funcionalidades finalizadas passam por aqui antes de irem para produção.
- **`feature/...`:** uma branch por sprint (vertical slice), saindo da `develop`. Exemplo: `feature/sprint1-cadastro-unidades`.

### Convenção de commits (Conventional Commits)

Não são aceitas mensagens genéricas como "arrumando bug". Padrão adotado:

- `feat:` adiciona formulário de cadastro de bloco *(novas funcionalidades)*
- `fix:` corrige erro de validação no campo de data *(correção de bugs)*
- `refactor:` melhora encapsulamento da classe Morador *(mudanças que não adicionam feature nem corrigem bug)*
- `docs:` atualiza documentação da API no Swagger *(documentação)*

### Organização e entregas

Ao final de cada sprint, não há merge automático. Simula-se a criação de um **Pull Request (PR)**: a branch da feature "pede permissão" para entrar na `develop`, momento em que ocorre o **Code Review**, apontando melhorias de SOLID e Clean Code antes da integração.

---

## 10. Ferramentas e Bibliotecas (Stack Tecnológico)

### Frontend

| Categoria | Ferramenta | Justificativa |
|---|---|---|
| Gerenciador de pacotes | **npm** | Padrão absoluto e nativo do ecossistema Node (mesmo o pnpm sendo mais rápido/eficiente em espaço) |
| Build tool | **Vite** | Usa ES Modules nativos do navegador em vez de ler todo o projeto antes de iniciar (como bundlers antigos); servidor de dev inicia em milissegundos |
| Estilização | **TailwindCSS** | Classes utilitárias direto nos componentes em vez de CSS gigante; acelera desenvolvimento e mantém design system consistente |
| Cliente HTTP | **Axios** | Tratamentos automáticos de JSON e facilidade para criar interceptadores (usados na Sprint 6 para injetar token JWT) |
| Roteamento | **React Router DOM** | Padrão de mercado para navegação em SPA |
| Qualidade de código | **ESLint + Prettier** | ESLint identifica más práticas; Prettier formata automaticamente ao salvar |

### Backend

| Categoria | Ferramenta | Justificativa |
|---|---|---|
| Gerenciador de dependências/build | **Maven** | Padrão mais consolidado em sistemas corporativos Java (bancos, grandes corporações); aprender seu ciclo de vida (clean, compile, test, package) é um rito de passagem |
| Banco de dados | **PostgreSQL** | Banco relacional open-source robusto, escalável e compatível com a complexidade futura do domínio de condomínios |
| Comunicação com o banco (inicial) | **JDBC puro** (driver PostgreSQL) | Início com SQL manual para entender o "porquê" das coisas; migração futura para Spring Data JPA após sentir a dor da repetição de código |
| Testes | **JUnit 5 + Mockito** | JUnit executa os testes; Mockito simula comportamentos (ex.: testar regra de negócio do Controller sem bater no banco real) |
| Documentação da API | **Springdoc OpenAPI (Swagger)** | Gera automaticamente a documentação dos endpoints, parâmetros e formatos JSON a partir do código Java — o "contrato" entre frontend e backend |

---

## 11. Arquitetura Geral do Projeto (Visão Macro — Camadas)

Separação em "Camadas de Responsabilidade" (*Separation of Concerns*), de forma que uma futura migração (ex.: app mobile) não exija alteração na lógica de negócio do backend.

1. **Presentation Layer (Frontend / React)**
   Exibe dados e captura interação do usuário. Não toma decisões críticas de negócio — apenas avisa o backend sobre a intenção do usuário. Permite que a experiência de interface evolua de forma independente.

2. **Controller Layer (porta de entrada da API — Spring Boot)**
   Recebe a requisição HTTP, valida o formato do JSON (validação sintática) e repassa para a camada de serviço. Empacota a resposta em um código HTTP adequado (ex.: `201 Created`, `400 Bad Request`).
   *Regra de ouro: Controllers nunca contêm lógica de negócio.*

3. **Service Layer (coração do sistema)**
   Onde moram as regras de negócio (ex.: "este apartamento já tem morador titular?", "o horário da reserva é permitido?").
   *Regra de ouro: o Service não sabe que está na internet (não conhece HTTP, JSON ou React) e não sabe qual banco de dados está em uso — trabalha puramente com lógica orientada a objetos.*

4. **Repository Layer (acesso a dados / DAO)**
   Fala com o banco de dados, traduzindo objetos Java em queries SQL.
   *Regra de ouro: trocar o banco (ex.: PostgreSQL → Oracle) afeta apenas o Repository — Service e Controller não ficam sabendo.*

5. **Database (PostgreSQL)**
   Persistência definitiva dos dados, garantindo integridade (constraints, foreign keys) e segurança.

---

## 12. Próximo Ponto de Decisão

Para a Sprint 1 (o Alicerce — Cadastro de Unidades/Blocos/Apartamentos, ponta a ponta), o próximo passo definido foi decidir entre:
- Mapear os requisitos visuais da tela e desenhar a estrutura de pastas do React; **ou**
- Discutir primeiro quais atributos uma "Unidade" precisa ter no mundo real (o que foi aprofundado no documento de modelagem de domínio).
