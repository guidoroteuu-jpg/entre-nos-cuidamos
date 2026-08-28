# entre nos

Você é um designer e desenvolvedor especialista em plataformas 

educacionais e bem-estar escolar. Crie um site responsivo chamado 

"Entre Nós" com o seguinte conceito:

OBJETIVO:

Identificar alunos em risco de exclusão social, bullying ou 

sofrimento emocional dentro da escola, de forma discreta e 

preventiva — antes que o problema se torne grave.

TECNOLOGIAS:

- Next.js (frontend e rotas)

- Supabase (banco de dados, autenticação, realtime)

- Tailwind CSS (estilização)

- Vercel (hospedagem)

- Linguagem: JavaScript

ESTRUTURA DE PÁGINAS:

/login

- Entrada por código de turma para alunos

- Login com email/senha para professores e direção

- Sem cadastro manual — escola configura as turmas

/aluno/home

- Check-in emocional diário com emoji (😊😐😢😤)

- Histórico pessoal da semana em gráfico de barras

- Acesso ao chat anônimo e ao diário privado

/aluno/chat

- Chat anônimo da turma

- Mensagens com bullying, tristeza ou assédio sinalizadas 

  automaticamente ao professor

- Nunca revela a identidade do aluno

/aluno/diario

- Espaço privado para o aluno escrever como se sente

- Análise automática de padrões emocionais ao longo do tempo

- Se detectar risco grave, alerta discreto ao orientador

/aluno/confidente

- Aluno escolhe um colega de confiança

- Confidente recebe alertas anônimos para apoiar o amigo

- Cria redes de apoio entre os próprios alunos

/professor/dashboard

- Radar visual da turma: cada aluno com uma cor

  Verde = bem / Amarelo = atenção / Vermelho = problema / Preto = grave

- Estatísticas: quantos bem, atenção, problema, grave

- Sugestões automáticas de dinâmicas de inclusão

/professor/alertas

- Lista de alertas em tempo real

- Severidade: baixa, média, alta

- Nunca identifica o aluno — só descreve o padrão detectado

- Ações sugeridas para cada alerta

/professor/relatorio

- Gráfico de humor da turma por semana e mês

- Tendências: turma melhorando ou piorando?

- Exportar PDF para reunião pedagógica

/direcao/painel

- Visão geral de todas as turmas da escola

- Clima emocional geral: porcentagem da escola bem/em risco

- Nenhum aluno identificado — apenas dados agregados

FUNCIONALIDADES TÉCNICAS:

- Realtime: alertas chegam ao professor sem precisar recarregar

- Detecção automática de palavras-chave no chat 

  (bullying, assédio, tristeza, exclusão)

- Sistema de pontuação de risco por aluno baseado em:

  participação no chat, humor dos últimos 7 dias,

  isolamento detectado em atividades em grupo

- Relatório semanal enviado por email automaticamente

- Integração com chamada: ausência + histórico negativo = alerta

- PWA (Progressive Web App): funciona offline e pode ser 

  "instalado" no celular sem loja de apps

IDENTIDADE VISUAL:

- Nome: Entre Nós

- Slogan: "Aqui, ninguém fica de fora."

- Cores principais: 

  Roxo escuro: #3C3489

  Roxo médio: #534AB7

  Roxo claro: #EEEDFE

  Branco: #FFFFFF

- Tipografia: limpa, acessível, jovem mas não infantil

- Tom: acolhedor, seguro, discreto

MODELO DE NEGÓCIO (implementar página /planos):

- Plano Escola: R$299/mês por escola — até 500 alunos

- Plano Rede: R$799/mês — escolas ilimitadas da mesma rede

- Período de teste: 30 dias grátis, sem cartão

- Diferencial: dado nenhum aluno é vendido ou compartilhado

SEGURANÇA E PRIVACIDADE:

- Nenhuma mensagem do chat é armazenada com nome

- Alunos são identificados só por ID anônimo internamente

- Dados de humor são agregados antes de chegar ao professor

- Conformidade com LGPD

- Página /privacidade explicando tudo em linguagem simples

ENTREGUE:

1. Código completo e funcional em Next.js

2. Todas as páginas listadas acima

3. Integração com Supabase configurada

4. Design responsivo (mobile + desktop)

5. README com instruções de instalação e deploy no Vercel

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://entre-nos-cuidamos.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f562642f-7ca1-44b1-87cb-1ceb224dcd85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
