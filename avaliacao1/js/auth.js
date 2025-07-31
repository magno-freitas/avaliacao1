// Função para carregar usuários do localStorage ou usar padrão
function loadUsers() {
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    }
    // Usuários padrão
    const defaultUsers = {
        'admin': { password: '123', role: 'Administrador', status: 'Ativo' },
        'editor': { password: '123', role: 'Editor', status: 'Ativo' },
        'leitor': { password: '123', role: 'Leitor', status: 'Ativo' }
    };
    localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
}

// Carrega usuários do sistema
let users = loadUsers();

// Contador de tentativas de login
let loginAttempts = 0;
const maxAttempts = 3;

// Permissões por perfil
const permissions = {
    'Administrador': ['Visualizar', 'Editar', 'Gerenciar usuários', 'Configurar sistema'],
    'Editor': ['Visualizar', 'Editar'],
    'Leitor': ['Visualizar']
};

// Função para mostrar alertas
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

// Função de login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Recarrega usuários do localStorage
    users = loadUsers();
    
    // Verifica se usuário existe e está ativo
    if (!users[username] || users[username].status === 'Inativo') {
        loginAttempts++;
        showAlert(`Usuário não encontrado ou inativo. Tentativa ${loginAttempts} de ${maxAttempts}`, 'error');
        return;
    }
    
    // Verifica senha
    if (users[username].password !== password) {
        loginAttempts++;
        
        if (loginAttempts >= maxAttempts) {
            showAlert(`Acesso bloqueado após ${maxAttempts} tentativas inválidas. Tente novamente em 5 minutos.`, 'error');
            document.getElementById('loginForm').classList.add('loading');
            setTimeout(() => {
                document.getElementById('loginForm').classList.remove('loading');
                loginAttempts = 0;
            }, 5000);
            return;
        }
        
        showAlert(`Credenciais inválidas. Tentativa ${loginAttempts} de ${maxAttempts}`, 'error');
        return;
    }
    
    // Login bem-sucedido
    localStorage.setItem('user', username);
    localStorage.setItem('role', users[username].role);
    showAlert('Login realizado com sucesso!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Função para mostrar seções do dashboard
function showSection(sectionName) {
    const role = localStorage.getItem('role');
    if (sectionName === 'users' && role !== 'Administrador') {
        showAlert('Acesso negado. Apenas administradores podem gerenciar usuários.', 'warning');
        return;
    }
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Função para visualizar documento
function viewDocument(docId) {
    if (docId === 'manual') {
        window.open('manual.html', '_blank');
    } else if (docId === 'security') {
        window.open('plano-seguranca.html', '_blank');
    }
    showAlert('Documento visualizado com sucesso!', 'success');
}

// Função para editar documento
function editDocument(docId) {
    const role = localStorage.getItem('role');
    if (role === 'Leitor') {
        showAlert('Acesso negado. Você não tem permissão para editar documentos.', 'warning');
        return;
    }
    
    if (docId === 'manual') {
        window.location.href = 'edit-manual.html';
    } else if (docId === 'security') {
        window.location.href = 'edit-security.html';
    }
    showAlert('Abrindo documento para edição...', 'success');
}

// Função para editar usuário
function editUser(username) {
    const role = localStorage.getItem('role');
    if (role !== 'Administrador') {
        showAlert('Acesso negado. Apenas administradores podem editar usuários.', 'warning');
        return;
    }
    window.location.href = `edit-user.html?user=${username}`;
}

// Função para ativar/desativar usuário
function toggleUser(username) {
    const role = localStorage.getItem('role');
    if (role !== 'Administrador') {
        showAlert('Acesso negado. Apenas administradores podem gerenciar usuários.', 'warning');
        return;
    }
    
    // Carrega usuários atuais
    users = loadUsers();
    
    const statusElement = document.getElementById(`status-${username}`);
    const btnElement = document.getElementById(`btn-${username}`);
    
    if (statusElement && btnElement) {
        if (statusElement.textContent === 'Ativo') {
            statusElement.textContent = 'Inativo';
            btnElement.textContent = 'Ativar';
            btnElement.className = 'btn btn-success';
            users[username].status = 'Inativo';
            showAlert(`Usuário ${username} desativado com sucesso!`, 'warning');
        } else {
            statusElement.textContent = 'Ativo';
            btnElement.textContent = 'Desativar';
            btnElement.className = 'btn btn-danger';
            users[username].status = 'Ativo';
            showAlert(`Usuário ${username} ativado com sucesso!`, 'success');
        }
        
        // Salva no localStorage
        localStorage.setItem('systemUsers', JSON.stringify(users));
    }
}

// Função para salvar alterações do usuário
function saveUserChanges() {
    const username = document.getElementById('username').value;
    const newRole = document.getElementById('userRole').value;
    const newPassword = document.getElementById('newPassword').value;
    const newStatus = document.getElementById('userStatus').value;
    
    // Carrega usuários atuais
    users = loadUsers();
    
    // Atualiza dados do usuário
    if (users[username]) {
        users[username].role = newRole;
        users[username].status = newStatus;
        if (newPassword && newPassword.trim() !== '') {
            users[username].password = newPassword;
        }
        
        // Salva no localStorage
        localStorage.setItem('systemUsers', JSON.stringify(users));
        
        showAlert('Usuário atualizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert('Erro ao atualizar usuário!', 'error');
    }
}

// Função para salvar documento editado
function saveDocument() {
    const role = localStorage.getItem('role');
    if (role === 'Leitor') {
        showAlert('Acesso negado. Você não tem permissão para salvar alterações.', 'warning');
        return;
    }
    showAlert('Documento salvo com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Função de logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Se estiver no dashboard
    const welcomeElement = document.getElementById('welcome');
    if (welcomeElement) {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        
        // Redireciona se não estiver logado
        if (!user || !role) {
            window.location.href = 'index.html';
            return;
        }
        
        // Atualiza informações do usuário
        welcomeElement.innerText = `Bem-vindo, ${user} (${role})`;
        
        // Adiciona classe CSS baseada no perfil
        document.body.classList.add(role.toLowerCase());
        
        // Exibe permissões
        const permissionElement = document.getElementById('permission');
        if (permissionElement && permissions[role]) {
            let html = '<ul>';
            permissions[role].forEach(p => {
                html += `<li>${p}</li>`;
            });
            html += '</ul>';
            permissionElement.innerHTML = html;
        }
        
        // Oculta seções baseadas em permissões
        if (role !== 'Administrador') {
            const userNav = document.querySelector('a[onclick="showSection(\'users\')"]');
            if (userNav) {
                userNav.style.display = 'none';
            }
        }
        
        // Carrega dados salvos dos usuários
        loadUserData();
    }
});

// Função para carregar dados salvos dos usuários
function loadUserData() {
    users = loadUsers();
    
    Object.keys(users).forEach(username => {
        const userData = users[username];
        
        // Atualiza role se existir
        const roleElement = document.getElementById(`role-${username}`);
        if (roleElement && userData.role) {
            roleElement.textContent = userData.role;
        }
        
        // Atualiza status se existir
        const statusElement = document.getElementById(`status-${username}`);
        const btnElement = document.getElementById(`btn-${username}`);
        
        if (statusElement && btnElement && userData.status) {
            statusElement.textContent = userData.status;
            
            if (userData.status === 'Inativo') {
                btnElement.textContent = 'Ativar';
                btnElement.className = 'btn btn-success';
            } else {
                btnElement.textContent = 'Desativar';
                btnElement.className = 'btn btn-danger';
            }
        }
    });
}