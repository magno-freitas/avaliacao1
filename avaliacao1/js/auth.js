// Função para carregar usuários do localStorage ou usar padrão
function loadUsers() {
    try {
        const savedUsers = localStorage.getItem('systemUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
    
    // Usuários padrão
    const defaultUsers = {
        'admin': { password: '123', role: 'Administrador', status: 'Ativo' },
        'editor': { password: '123', role: 'Editor', status: 'Ativo' },
        'leitor': { password: '123', role: 'Leitor', status: 'Ativo' }
    };
    
    try {
        localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
    } catch (error) {
        console.error('Erro ao salvar usuários padrão:', error);
    }
    
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
        const sanitizedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        alertContainer.innerHTML = `<div class="alert alert-${type}">${sanitizedMessage}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

// Função de login
function handleLogin(event) {
    event.preventDefault();
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    if (!usernameField || !passwordField) {
        showAlert('Erro: Campos de login não encontrados.', 'error');
        return;
    }
    
    const username = usernameField.value.trim();
    const password = passwordField.value;
    
    if (!username || !password) {
        showAlert('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
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
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.classList.add('loading');
                setTimeout(() => {
                    loginForm.classList.remove('loading');
                    loginAttempts = 0;
                }, 5000);
            }
            return;
        }
        
        showAlert(`Credenciais inválidas. Tentativa ${loginAttempts} de ${maxAttempts}`, 'error');
        return;
    }
    
    // Login bem-sucedido
    try {
        localStorage.setItem('user', username);
        localStorage.setItem('role', users[username].role);
        showAlert('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Erro ao salvar dados de login:', error);
        showAlert('Erro interno. Tente novamente.', 'error');
    }
}

// Função para mostrar seções do dashboard
function showSection(sectionName) {
    try {
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
        } else {
            showAlert('Seção não encontrada.', 'error');
        }
    } catch (error) {
        console.error('Erro ao mostrar seção:', error);
        showAlert('Erro ao carregar seção.', 'error');
    }
}

// Função para visualizar documento
function viewDocument(docId) {
    const documentMap = {
        'manual': 'manual.html',
        'security': 'plano-seguranca.html'
    };
    
    if (documentMap[docId]) {
        window.open(documentMap[docId], '_blank');
        showAlert('Documento visualizado com sucesso!', 'success');
    } else {
        showAlert('Documento não encontrado.', 'error');
    }
}

// Função para editar documento
function editDocument(docId) {
    try {
        const role = localStorage.getItem('role');
        if (role === 'Leitor') {
            showAlert('Acesso negado. Você não tem permissão para editar documentos.', 'warning');
            return;
        }
        
        const editMap = {
            'manual': 'edit-manual.html',
            'security': 'edit-security.html'
        };
        
        if (editMap[docId]) {
            window.location.href = editMap[docId];
            showAlert('Abrindo documento para edição...', 'success');
        } else {
            showAlert('Documento não encontrado.', 'error');
        }
    } catch (error) {
        console.error('Erro ao editar documento:', error);
        showAlert('Erro ao abrir documento para edição.', 'error');
    }
}

// Função para editar usuário
function editUser(username) {
    try {
        const role = localStorage.getItem('role');
        if (role !== 'Administrador') {
            showAlert('Acesso negado. Apenas administradores podem editar usuários.', 'warning');
            return;
        }
        window.location.href = `edit-user.html?user=${encodeURIComponent(username)}`;
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        showAlert('Erro ao abrir edição de usuário.', 'error');
    }
}

// Função para ativar/desativar usuário
function toggleUser(username) {
    try {
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
    } catch (error) {
        console.error('Erro ao alterar status do usuário:', error);
        showAlert('Erro ao alterar status do usuário.', 'error');
    }
}

// Função para salvar alterações do usuário
function saveUserChanges() {
    try {
        const usernameField = document.getElementById('username');
        const newRoleField = document.getElementById('userRole');
        const newPasswordField = document.getElementById('newPassword');
        const newStatusField = document.getElementById('userStatus');
        
        if (!usernameField || !newRoleField || !newStatusField) {
            showAlert('Erro: Campos obrigatórios não encontrados.', 'error');
            return;
        }
        
        const username = usernameField.value;
        const newRole = newRoleField.value;
        const newPassword = newPasswordField ? newPasswordField.value : '';
        const newStatus = newStatusField.value;
        
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
    } catch (error) {
        console.error('Erro ao salvar alterações do usuário:', error);
        showAlert('Erro ao salvar alterações.', 'error');
    }
}

// Função para salvar documento editado
function saveDocument() {
    try {
        const role = localStorage.getItem('role');
        if (role === 'Leitor') {
            showAlert('Acesso negado. Você não tem permissão para salvar alterações.', 'warning');
            return;
        }
        
        // Identifica qual documento está sendo editado pela URL
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'edit-manual.html') {
            // Salva dados do manual
            const manualData = {
                intro: document.getElementById('intro')?.value || '',
                profiles: document.getElementById('profiles')?.value || '',
                security: document.getElementById('security')?.value || '',
                lastModified: new Date().toLocaleString('pt-BR'),
                modifiedBy: localStorage.getItem('user')
            };
            localStorage.setItem('manualContent', JSON.stringify(manualData));
            
        } else if (currentPage === 'edit-security.html') {
            // Salva dados do plano de segurança
            const securityData = {
                users: document.getElementById('users')?.value || '',
                logic: document.getElementById('logic')?.value || '',
                attempts: document.getElementById('attempts')?.value || '',
                lastModified: new Date().toLocaleString('pt-BR'),
                modifiedBy: localStorage.getItem('user')
            };
            localStorage.setItem('securityContent', JSON.stringify(securityData));
        }
        
        showAlert('Documento salvo com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        console.error('Erro ao salvar documento:', error);
        showAlert('Erro ao salvar documento.', 'error');
    }
}

// Função de logout
function logout() {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = 'index.html';
    }
}

// Função para carregar conteúdo salvo dos documentos
function loadDocumentContent() {
    try {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'edit-manual.html') {
            const savedContent = localStorage.getItem('manualContent');
            if (savedContent) {
                const data = JSON.parse(savedContent);
                const introField = document.getElementById('intro');
                const profilesField = document.getElementById('profiles');
                const securityField = document.getElementById('security');
                
                if (introField) introField.value = data.intro || introField.value;
                if (profilesField) profilesField.value = data.profiles || profilesField.value;
                if (securityField) securityField.value = data.security || securityField.value;
            }
        } else if (currentPage === 'edit-security.html') {
            const savedContent = localStorage.getItem('securityContent');
            if (savedContent) {
                const data = JSON.parse(savedContent);
                const usersField = document.getElementById('users');
                const logicField = document.getElementById('logic');
                const attemptsField = document.getElementById('attempts');
                
                if (usersField) usersField.value = data.users || usersField.value;
                if (logicField) logicField.value = data.logic || logicField.value;
                if (attemptsField) attemptsField.value = data.attempts || attemptsField.value;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar conteúdo do documento:', error);
    }
}

// Função para atualizar tabela de usuários no dashboard
function updateUserTable() {
    try {
        const users = loadUsers();
        
        Object.keys(users).forEach(username => {
            const statusElement = document.getElementById(`status-${username}`);
            const roleElement = document.getElementById(`role-${username}`);
            const btnElement = document.getElementById(`btn-${username}`);
            
            if (statusElement) {
                statusElement.textContent = users[username].status;
            }
            if (roleElement) {
                roleElement.textContent = users[username].role;
            }
            if (btnElement) {
                if (users[username].status === 'Ativo') {
                    btnElement.textContent = 'Desativar';
                    btnElement.className = 'btn btn-danger';
                } else {
                    btnElement.textContent = 'Ativar';
                    btnElement.className = 'btn btn-success';
                }
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar tabela de usuários:', error);
    }
}

// Função para verificar autenticação em páginas protegidas
function checkAuth() {
    try {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        
        if (!user || !role) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = 'index.html';
        return false;
    }
}

// Função para verificar permissões específicas
function hasPermission(requiredPermission) {
    try {
        const role = localStorage.getItem('role');
        if (!role || !permissions[role]) {
            return false;
        }
        return permissions[role].includes(requiredPermission);
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return false;
    }
}

// Função para limpar dados de teste (opcional)
function resetSystem() {
    try {
        localStorage.removeItem('systemUsers');
        localStorage.removeItem('manualContent');
        localStorage.removeItem('securityContent');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        showAlert('Sistema resetado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Erro ao resetar sistema:', error);
        showAlert('Erro ao resetar sistema.', 'error');
    }
}

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Se estiver na página de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Carrega conteúdo salvo se estiver em página de edição
        loadDocumentContent();
        
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
            welcomeElement.textContent = `Bem-vindo, ${user} (${role})`;
            
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
            
            // Atualiza status dos usuários na tabela do dashboard
            updateUserTable();
        }
        
        // Se estiver na página de edição de usuário
        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            const user = localStorage.getItem('user');
            const role = localStorage.getItem('role');
            
            // Redireciona se não estiver logado ou não for admin
            if (!user || !role || role !== 'Administrador') {
                window.location.href = 'index.html';
                return;
            }
        }
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});

// Adiciona proteção contra acesso direto às páginas
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('edit-') ||
    window.location.pathname.includes('manual.html') ||
    window.location.pathname.includes('plano-seguranca.html')) {
    
    // Verifica autenticação apenas se não estiver na página de login
    if (!window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('login.html')) {
        
        try {
            const user = localStorage.getItem('user');
            const role = localStorage.getItem('role');
            
            if (!user || !role) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Erro na proteção de páginas:', error);
            window.location.href = 'index.html';
        }
    }
}

// Inicialização do sistema
(function initSystem() {
    try {
        // Garante que os usuários padrão existam
        loadUsers();
    } catch (error) {
        console.error('Erro na inicialização do sistema:', error);
    }
})();

// Expor funções globalmente para uso nos HTMLs
window.handleLogin = handleLogin;
window.showSection = showSection;
window.viewDocument = viewDocument;
window.editDocument = editDocument;
window.editUser = editUser;
window.toggleUser = toggleUser;
window.saveUserChanges = saveUserChanges;
window.saveDocument = saveDocument;
window.logout = logout;
window.showAlert = showAlert;
window.resetSystem = resetSystem;