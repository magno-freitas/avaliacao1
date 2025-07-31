# Sistema SecureData TI - Avaliação Prática

## Descrição
Sistema de controle de documentos internos com autenticação e autorização baseada em perfis de usuário, desenvolvido para a avaliação prática do curso Técnico em Desenvolvimento de Sistemas.

## Funcionalidades Implementadas

### 1. Sistema de Autenticação
- Login com validação de credenciais
- Controle de tentativas inválidas (máximo 3 tentativas)
- Bloqueio temporário após tentativas excessivas
- Logout seguro

### 2. Controle de Acesso por Perfis
- **Administrador**: Acesso completo (visualizar, editar, gerenciar usuários, configurar sistema)
- **Editor**: Visualizar e editar documentos
- **Leitor**: Apenas visualizar documentos

### 3. Interface Responsiva
- Design moderno e profissional
- Adaptável a diferentes tamanhos de tela
- Animações e transições suaves
- Feedback visual para ações do usuário

### 4. Simulação de Funcionalidades
- Tentativas de acesso inválido
- Controle de permissões em tempo real
- Gerenciamento de usuários (apenas para administradores)
- Visualização e edição de documentos

## Estrutura do Projeto

```
avaliacao1/
├── css/
│   └── style.css          # Estilos completos do sistema
├── js/
│   └── auth.js           # Lógica de autenticação e controle
├── backend/
│   ├── auth.java         # Classe de autenticação (Java)
│   ├── connection.java   # Conexão com banco de dados
│   └── user.java         # Modelo de usuário
├── sql/
│   └── script.sql        # Script de criação do banco
├── index.html            # Página de login principal
├── dashboard.html        # Dashboard do sistema
├── login.html           # Página de acesso negado
├── manual.html          # Manual do usuário
└── README.md            # Documentação do projeto
```

## Usuários de Teste

| Usuário | Senha | Perfil        |
|---------|-------|---------------|
| admin   | 123   | Administrador |
| editor  | 123   | Editor        |
| leitor  | 123   | Leitor        |

## Como Executar

1. Abra o arquivo `index.html` em um navegador web
2. Use as credenciais de teste para fazer login
3. Explore as diferentes funcionalidades baseadas no perfil do usuário

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Java (simulado)
- **Banco de Dados**: SQL (simulado)
- **Design**: CSS Grid, Flexbox, Animações CSS

## Recursos de Segurança

- Validação de entrada no frontend
- Controle de sessão com localStorage
- Verificação de permissões por página
- Bloqueio automático por tentativas inválidas
- Redirecionamento seguro entre páginas

## Demonstração das Capacidades

O sistema demonstra todas as capacidades solicitadas na avaliação:

- **H11**: Configurações de serviços e segurança para instalação
- **H16**: Configurações no sistema de acordo com requisitos
- **H17**: Procedimentos de parametrização do sistema
- **H8**: Manual de usuário com especificações do sistema

## Autor
Magno Valadares de Freitas
Desenvolvido para avaliação prática - SENAI SC
Curso: Técnico em Desenvolvimento de Sistemas