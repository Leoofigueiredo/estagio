// Dados em memória persistidos via localStorage
let expenses = JSON.parse(localStorage.getItem('fynance_expenses')) || [
    { id: 1, desc: 'Restaurante', category: 'Alimentação', payment: 'Nubank', amount: 156.00, status: 'Pago' },
    { id: 2, desc: 'Curso React', category: 'Educação', payment: 'Itaú', amount: 297.00, status: 'Pendente' }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderApp();
});

// Salvar no localStorage do navegador
function saveState() {
    localStorage.setItem('fynance_expenses', JSON.stringify(expenses));
    renderApp();
}

// Abrir/Fechar Menu Mobile
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('mobile-active');
    overlay.classList.toggle('active');
}

// Alternar abas do sistema web
function switchTab(viewId, navElement) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navElement) navElement.classList.add('active');

    document.querySelectorAll('.view-section').forEach(section => section.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const titles = {
        'visao-geral': 'Visão Geral',
        'despesas': 'Gerenciamento de Despesas',
        'categorias': 'Categorias de Gastos',
        'cartoes': 'Cartões e Formas de Pagamento',
        'perfil': 'Configurações do Sistema Web'
    };
    
    // Atualiza o título no Header e na Aba do Navegador Web
    const titleText = titles[viewId] || 'Fynance';
    document.getElementById('page-title').innerText = titleText;
    document.title = `Fynance | ${titleText}`;

    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('mobile-active')) {
        toggleMobileMenu();
    }
}

// Renderizar componentes da aplicação web
function renderApp() {
    renderTable();
    renderMetrics();
    renderCategories();
}

function renderTable() {
    const tbody = document.getElementById('expenses-table-body');
    const recentList = document.getElementById('recent-list');
    
    tbody.innerHTML = '';
    recentList.innerHTML = '';

    expenses.forEach(item => {
        // Tabela principal
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${item.desc}</td>
            <td>${item.category}</td>
            <td>${item.payment}</td>
            <td style="font-weight: 700;">R$ ${item.amount.toFixed(2)}</td>
            <td>
                <span class="badge-status ${item.status === 'Pago' ? 'badge-pago' : 'badge-pendente'}" onclick="toggleStatus(${item.id})">
                    ${item.status}
                </span>
            </td>
            <td><button class="action-btn-danger" onclick="deleteExpense(${item.id})">Remover</button></td>
        `;
        tbody.appendChild(tr);

        // Lançamentos recentes na home
        const recent = document.createElement('div');
        recent.style.cssText = "display: flex; justify-content: space-between; margin-bottom: 12px; gap: 8px;";
        recent.innerHTML = `
            <div>
                <div style="font-weight:600; font-size:13px;">${item.desc}</div>
                <div style="font-size:11px; color:var(--text-muted);">${item.category}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:700; font-size:13px;">R$ ${item.amount.toFixed(2)}</div>
                <span class="badge-status ${item.status === 'Pago' ? 'badge-pago' : 'badge-pendente'}">${item.status}</span>
            </div>
        `;
        recentList.appendChild(recent);
    });
}

function renderMetrics() {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pendente = expenses.filter(i => i.status === 'Pendente').reduce((acc, curr) => acc + curr.amount, 0);
    const pago = expenses.filter(i => i.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);

    document.getElementById('dash-total').innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById('dash-pendente').innerText = `R$ ${pendente.toFixed(2)}`;
    document.getElementById('dash-pago').innerText = `R$ ${pago.toFixed(2)}`;
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';

    const categoriesMap = {};
    expenses.forEach(e => {
        categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
    });

    for (const [cat, val] of Object.entries(categoriesMap)) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="font-size: 14px; color: var(--text-muted);">${cat}</div>
            <div style="font-size: 20px; font-weight: 700; margin-top: 8px;">R$ ${val.toFixed(2)}</div>
        `;
        grid.appendChild(card);
    }
}

// Ações do usuário
function toggleStatus(id) {
    expenses = expenses.map(item => {
        if (item.id === id) {
            item.status = item.status === 'Pago' ? 'Pendente' : 'Pago';
        }
        return item;
    });
    saveState();
}

function deleteExpense(id) {
    expenses = expenses.filter(item => item.id !== id);
    saveState();
}

// Modal Controls
function openModal() { document.getElementById('expense-modal').classList.add('active'); }
function closeModal() { document.getElementById('expense-modal').classList.remove('active'); }

document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newExpense = {
        id: Date.now(),
        desc: document.getElementById('desc').value,
        category: document.getElementById('category').value,
        payment: document.getElementById('payment').value,
        amount: parseFloat(document.getElementById('amount').value),
        status: 'Pendente'
    };

    expenses.push(newExpense);
    saveState();
    closeModal();
    e.target.reset();
});