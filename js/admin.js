// Credenciales de administrador (en producción irían a BD)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Verificar si ya hay sesión activa
document.addEventListener('DOMContentLoaded', () => {
    const isLogged = sessionStorage.getItem('adminLogged');
    if (isLogged === 'true') {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('dashboardPanel').style.display = 'block';
        loadDashboardData();
        loadProductsManagement();
    } else {
        document.getElementById('loginPanel').style.display = 'flex';
        document.getElementById('dashboardPanel').style.display = 'none';
    }
});

// Manejo del login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    
    // Validación de credenciales
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLogged', 'true');
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('dashboardPanel').style.display = 'block';
        loadDashboardData();
        loadProductsManagement();
        showNotification('Inicio de sesión exitoso', 'success');
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
        document.getElementById('adminPass').value = '';
    }
});

// Cerrar sesión
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('adminLogged');
    document.getElementById('loginPanel').style.display = 'flex';
    document.getElementById('dashboardPanel').style.display = 'none';
    document.getElementById('loginForm').reset();
    showNotification('Sesión cerrada correctamente', 'success');
});

// Cargar datos del dashboard
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    document.getElementById('totalProducts').textContent = products.length;
}

// Cargar productos para gestión
function loadProductsManagement() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const container = document.getElementById('productsManagement');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay productos registrados</p>';
        return;
    }
    
    container.innerHTML = products.map((product, index) => `
        <div class="product-item" data-index="${index}">
            <div class="product-item-info">
                <img src="${product.imagen}" alt="${product.nombre}" onerror="this.src='https://via.placeholder.com/50'">
                <div>
                    <strong>${product.nombre}</strong>
                    <p>$${parseInt(product.precio).toLocaleString()} - ${product.categoria || 'Sin categoría'}</p>
                </div>
            </div>
            <button class="delete-product" onclick="deleteProduct(${index})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `).join('');
}

// Agregar nuevo producto
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        nombre: document.getElementById('prodNombre').value,
        precio: parseFloat(document.getElementById('prodPrecio').value),
        imagen: document.getElementById('prodImagen').value,
        descripcion: document.getElementById('prodDescripcion').value,
        categoria: document.getElementById('prodCategoria').value,
        fecha: new Date().toISOString()
    };
    
    // Validar campos
    if (!newProduct.nombre || !newProduct.precio || !newProduct.imagen || !newProduct.descripcion) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Guardar en localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(newProduct);
    localStorage.setItem('products', products);
    
    // Limpiar formulario
    e.target.reset();
    
    // Actualizar interfaces
    loadDashboardData();
    loadProductsManagement();
    
    // Sincronizar con página principal (si está abierta en otra pestaña)
    localStorage.setItem('productsUpdated', Date.now().toString());
    
    showNotification('Producto agregado exitosamente', 'success');
});

// Eliminar producto
window.deleteProduct = (index) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.splice(index, 1);
        localStorage.setItem('products', products);
        loadDashboardData();
        loadProductsManagement();
        localStorage.setItem('productsUpdated', Date.now().toString());
        showNotification('Producto eliminado correctamente', 'success');
    }
};

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const modal = document.getElementById('notificationModal');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = message;
    modalMessage.style.color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066B3';
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

// Cerrar modal
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('notificationModal').style.display = 'none';
});

// Escuchar cambios en localStorage desde otras pestañas
window.addEventListener('storage', (e) => {
    if (e.key === 'productsUpdated') {
        loadDashboardData();
        loadProductsManagement();
    }
});