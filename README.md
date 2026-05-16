# Marquei Web

Frontend do sistema de agendamento para salões, com perfis de gestor, profissional e cliente.

---

## Stack utilizada

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Sonner
- Lucide React

A stack foi escolhida por permitir o desenvolvimento de interfaces modernas, performáticas e organizadas. O Next.js facilita a estruturação da aplicação e o roteamento, enquanto o TypeScript melhora a segurança e manutenção do código. O Tailwind CSS foi utilizado para acelerar a construção da interface mantendo consistência visual.

---

## Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/leonardo-rendano/marquei-frontend.git
cd marquei-frontend
```

---

## Instale as dependências

```bash
npm install
```

---

## Configure as variáveis de ambiente

Crie o arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
```

---

## Rode o projeto

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

---

## Variáveis de ambiente

### `.env.example`

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

---

## Credenciais de teste

As credenciais podem ser criadas manualmente pela interface ou via postman/insomnia no backend.

### Gestor

```txt
E-mail: gestor@marquei.com
Senha: 123456
```

### Profissional

```txt
E-mail: profissional@marquei.com
Senha: 123456
```

### Cliente

```txt
E-mail: cliente@marquei.com
Senha: 123456
```

---

## Decisões de arquitetura

A aplicação foi organizada por rotas privadas e componentes reutilizáveis. O controle de autenticação é feito via Context API, com persistência do token no navegador e integração com Axios para envio automático do JWT nas requisições.

As permissões por perfil são tratadas através de um `RoleGuard`, permitindo renderização condicional de páginas e funcionalidades para gestor, profissional e cliente.

---

## O que ficou de fora

Algumas funcionalidades ficaram fora do escopo inicial:

- edição de registros;
- exclusão de registros;
- calendário visual;
- paginação;
- filtros avançados;
- notificações;
- recuperação de senha;
- testes automatizados;
- responsividade mobile refinada;
- deploy em produção.

---

## O que eu faria diferente com mais tempo

Com mais tempo, eu adicionaria testes automatizados, melhoraria a experiência mobile e implementaria um calendário visual para facilitar a gestão dos horários. Também adicionaria filtros, paginação e edição de registros.

Outra melhoria importante seria evoluir o sistema de permissões e adicionar tratamento global de erros, loading states mais refinados e maior componentização da interface.
