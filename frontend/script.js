const API_URL = '/api/bens_moveis/';
const AUTH_API_URL = '/_allauth/browser/v1';

function readCsrfToken() {
  const csrfCookie = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('csrftoken='));

  return csrfCookie
    ? decodeURIComponent(csrfCookie.slice('csrftoken='.length))
    : null;
}

async function getCsrfToken() {
  let csrfToken = readCsrfToken();
  if (csrfToken) return csrfToken;

  const response = await fetch(`${AUTH_API_URL}/config`, {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Não foi possível obter o token de segurança (${response.status}).`);
  }

  csrfToken = readCsrfToken();
  if (!csrfToken) {
    throw new Error('O servidor não forneceu o token de segurança.');
  }
  return csrfToken;
}

async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    headers.set('X-CSRFToken', await getCsrfToken());
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include'
  });
}

async function throwApiError(response) {
  const body = await response.text();
  let detail = body;
  if ((response.headers.get('content-type') || '').includes('application/json')) {
    const data = JSON.parse(body);
    if (data.detail) {
      detail = data.detail;
    } else if (data && typeof data === 'object') {
      detail = Object.entries(data)
        .map(([field, errors]) => `${field}: ${[].concat(errors).join(', ')}`)
        .join('; ') || body;
    }
  }

  throw new Error(`Erro do servidor (${response.status})${detail ? `: ${detail}` : '.'}`);
}

// --- Login Page ---
const btnEntrar = document.getElementById('btn-entrar');
if (btnEntrar) {
  const toggleBtn  = document.getElementById('toggle-pass');
  const passInput  = document.getElementById('pass-input');
  const userInput  = document.getElementById('user-input');
  const userError  = document.getElementById('user-error');
  const passError  = document.getElementById('pass-error');
  const card       = document.getElementById('login-card');

  let passwordVisible = false;

  toggleBtn.addEventListener('click', () => {
    passwordVisible = !passwordVisible;
    passInput.type = passwordVisible ? 'text' : 'password';
    toggleBtn.querySelector('i').className = passwordVisible ? 'ti ti-eye-off' : 'ti ti-eye';
  });

  function clearErrors() {
    userInput.classList.remove('error');
    passInput.classList.remove('error');
    userError.style.display = 'none';
    passError.style.display = 'none';
  }

  userInput.addEventListener('input', clearErrors);
  passInput.addEventListener('input', clearErrors);

  btnEntrar.addEventListener('click', async () => {
    clearErrors();

    const user = userInput.value.trim();
    const pass = passInput.value.trim();
    let hasError = false;

    if (!user) {
      userInput.classList.add('error');
      userError.style.display = 'block';
      hasError = true;
    }

    if (!pass) {
      passInput.classList.add('error');
      passError.style.display = 'block';
      hasError = true;
    }

    if (hasError) {
      card.classList.remove('shake');
      void card.offsetWidth; 
      card.classList.add('shake');
      return;
    }

    btnEntrar.textContent = 'Entrando...';
    btnEntrar.disabled = true;

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.is_authenticated) {
          window.location.href = 'inventario.html';
        } else {
          alert('Não foi possível concluir o login.');
        }
      } else if (response.status === 409) {
        window.location.href = 'inventario.html';
      } else if (response.status === 400) {
        alert('Usuário ou senha inválidos.');
      } else {
        alert(`Erro do servidor ao entrar (${response.status}).`);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      btnEntrar.textContent = 'Entrar';
      btnEntrar.disabled = false;
    }
  });
}

// --- Cadastro Page ---
const btnCadastrar = document.getElementById('btn-cadastrar');
if (btnCadastrar) {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');

  if (editId) {
    document.querySelector('.login-title').textContent = 'Editar Patrimônio';
    btnCadastrar.textContent = 'Atualizar';
    
    apiFetch(`${API_URL}${encodeURIComponent(editId)}/`)
      .then(async response => {
        if (!response.ok) await throwApiError(response);
        return response.json();
      })
      .then(data => {
        document.getElementById('numero-patrimonio').value = data.numeroPatrimonio;
        document.getElementById('descricao-bem').value = data.descricao;
        document.getElementById('localizacao').value = data.localizacao;
        document.getElementById('estado-conservacao').value = data.estado.toLowerCase();
        document.getElementById('responsavel').value = data.responsavel;
      })
      .catch(error => {
        alert(`Não foi possível carregar o patrimônio: ${error.message}`);
      });
  }

  btnCadastrar.addEventListener('click', async () => {
    const patrimonio = {
      numeroPatrimonio: document.getElementById('numero-patrimonio').value.trim(),
      descricao: document.getElementById('descricao-bem').value.trim(),
      localizacao: document.getElementById('localizacao').value.trim(),
      estado: document.getElementById('estado-conservacao').value,
      responsavel: document.getElementById('responsavel').value.trim()
    };

    if (!patrimonio.numeroPatrimonio || !patrimonio.descricao) {
      alert('Preencha pelo menos o Número e a Descrição.');
      return;
    }

    btnCadastrar.disabled = true;

    try {
      const response = await apiFetch(
        editId ? `${API_URL}${encodeURIComponent(editId)}/` : API_URL,
        {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patrimonio)
        }
      );

      if (response.ok) {
        alert(editId ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!');
        window.location.href = 'inventario.html';
      } else {
        await throwApiError(response);
      }
    } catch (error) {
      alert(`Erro ao salvar o patrimônio: ${error.message}`);
    } finally {
      btnCadastrar.disabled = false;
    }
  });
}

// --- Inventário Page ---
const btnAtualizar = document.getElementById('btn-atualizar');
if (btnAtualizar || document.getElementById('inventory-card')) {
  
  window.deletarPatrimonio = async (id) => {
    if (confirm('Tem certeza que deseja excluir este patrimônio?')) {
      try {
        const response = await apiFetch(`${API_URL}${encodeURIComponent(id)}/`, {
          method: 'DELETE'
        });
        if (!response.ok) await throwApiError(response);
        await loadInventario();
      } catch (error) {
        alert(`Erro ao excluir o patrimônio: ${error.message}`);
      }
    }
  };

  const loadInventario = async () => {
    try {
      const response = await apiFetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const tbody = document.querySelector('.inventory-table tbody');
        
        // Verifica se a tabela tem a coluna Ações, se não tiver a gente adiciona no thead
        const theadTr = document.querySelector('.inventory-table thead tr');
        if (theadTr && theadTr.children.length === 5) {
            const th = document.createElement('th');
            th.textContent = 'Ações';
            theadTr.appendChild(th);
        }

        tbody.innerHTML = '';
        data.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.numeroPatrimonio}</td>
            <td>${item.descricao}</td>
            <td>${item.localizacao}</td>
            <td>${item.estado.charAt(0).toUpperCase()}${item.estado.slice(1)}</td>
            <td>${item.responsavel}</td>
            <td>
              <a href="cadastro.html?id=${item.id}" style="color:#3874D8; margin-right:8px; text-decoration:none;"><i class="ti ti-pencil"></i></a>
              <a href="#" onclick="deletarPatrimonio(${item.id}); return false;" style="color:#e24b4a; text-decoration:none;"><i class="ti ti-trash"></i></a>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        await throwApiError(response);
      }
    } catch (error) {
      alert(`Erro ao carregar o inventário: ${error.message}`);
    }
  };

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', loadInventario);
  }
  
  loadInventario();
}
// Endpoints das duas APIs do projeto
const API_AUTH_URL = "http://localhost:8000/api/auth/login/"; // API 1: Autenticação
const API_DADOS_URL = "http://localhost:8000/api/patrimonio/";  // API 2: Dados do Negócio

// 1. Função para realizar o LOGIN (API 1)
const formLogin = document.getElementById("form-login");
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const msgErro = document.getElementById("msg-erro");

        try {
            const response = await fetch(API_AUTH_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Guarda o Token retornado pela API no armazenamento local
                localStorage.setItem("token", data.token || data.access);
                
                // Redireciona para a tela do inventário após o login bem-sucedido
                window.location.href = "inventario.html";
            } else {
                if (msgErro) msgErro.style.display = "block";
            }
        } catch (error) {
            console.error("Erro ao comunicar com a API de Autenticação:", error);
            alert("Não foi possível conectar com o servidor de autenticação.");
        }
    });
}

// 2. Função para carregar os DADOS DO INVENTÁRIO (API 2)
// 2. Função para carregar os DADOS DO INVENTÁRIO (API 2)
async function carregarInventario() {
    const tabela = document.getElementById("tabela-inventario");
    if (!tabela) return; // Só executa se estiver na página inventario.html

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redireciona para o login se não houver token
        return;
    }

    try {
        const response = await fetch(API_DADOS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            }
        });

        if (response.ok) {
            const itens = await response.json();
            tabela.innerHTML = ""; // Limpa a tabela antes de preencher
            
            itens.forEach(item => {
                tabela.innerHTML += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.nome || item.descricao}</td>
                        <td>${item.codigo || item.tombo}</td>
                        <td>${item.status || 'Ativo'}</td>
                    </tr>
                `;
            });
        } else if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Erro ao carregar dados do patrimônio:", error);
    }
}

// Executa a busca de dados ao carregar a página do inventário
document.addEventListener("DOMContentLoaded", carregarInventario);
