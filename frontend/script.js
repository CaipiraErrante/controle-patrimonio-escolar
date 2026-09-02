const API_URL = 'http://localhost:8080/api';

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (response.ok) {
        window.location.href = 'inventario.html';
      } else {
        alert('Usuário ou senha inválidos.');
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
    
    // Buscar dados existentes
    fetch(`${API_URL}/patrimonios/${editId}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('numero-patrimonio').value = data.numeroPatrimonio;
        document.getElementById('descricao-bem').value = data.descricao;
        document.getElementById('localizacao').value = data.localizacao;
        document.getElementById('estado-conservacao').value = data.estado.toLowerCase();
        document.getElementById('responsavel').value = data.responsavel;
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
      let response;
      if (editId) {
        patrimonio.id = parseInt(editId);
        response = await fetch(`${API_URL}/patrimonios/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patrimonio)
        });
      } else {
        response = await fetch(`${API_URL}/patrimonios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patrimonio)
        });
      }

      if (response.ok) {
        alert(editId ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!');
        window.location.href = 'inventario.html';
      } else {
        alert('Erro ao salvar o patrimônio.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
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
      await fetch(`${API_URL}/patrimonios/${id}`, { method: 'DELETE' });
      loadInventario();
    }
  };

  const loadInventario = async () => {
    try {
      const response = await fetch(`${API_URL}/patrimonios`);
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
            <td>${item.estado}</td>
            <td>${item.responsavel}</td>
            <td>
              <a href="cadastro.html?id=${item.id}" style="color:#3874D8; margin-right:8px; text-decoration:none;"><i class="ti ti-pencil"></i></a>
              <a href="#" onclick="deletarPatrimonio(${item.id}); return false;" style="color:#e24b4a; text-decoration:none;"><i class="ti ti-trash"></i></a>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    } catch (error) {}
  };

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', loadInventario);
  }
  
  loadInventario();
}