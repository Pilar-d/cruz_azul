// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupContactForm();
    setupMobileMenu();
    setupTypingAnimation();
    
    // Escuchar cambios en productos desde admin
    window.addEventListener('storage', (e) => {
        if (e.key === 'productsUpdated' || e.key === 'products') {
            loadProducts();
        }
    });
});

// Cargar productos desde localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        // Productos por defecto si no hay ninguno
        const defaultProducts = [
            {
                id: 1,
                nombre: "Paracetamol 500mg",
                precio: 5990,
                imagen: "https://via.placeholder.com/300x250/0066B3/white?text=Paracetamol",
                descripcion: "Analgésico y antipirético para el alivio del dolor leve a moderado.",
                categoria: "Medicamentos"
            },
            {
                id: 2,
                nombre: "Vitamina C 1000mg",
                precio: 8990,
                imagen: "https://via.placeholder.com/300x250/00B4D8/white?text=Vitamina+C",
                descripcion: "Refuerza el sistema inmunológico y previene resfriados.",
                categoria: "Vitaminas"
            },
            {
                id: 3,
                nombre: "Jabón Antibacterial",
                precio: 2990,
                imagen: "https://via.placeholder.com/300x250/FF6B35/white?text=Jabón",
                descripcion: "Jabón líquido antibacterial para uso diario.",
                categoria: "Cuidado Personal"
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        renderProducts(defaultProducts);
    } else {
        renderProducts(products);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card fade-up">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=Producto'">
            <div class="product-info">
                <span class="product-category">${product.categoria || 'General'}</span>
                <h3 class="product-title">${product.nombre}</h3>
                <p class="product-price">$${parseInt(product.precio).toLocaleString()}</p>
                <p class="product-description">${product.descripcion.substring(0, 80)}${product.descripcion.length > 80 ? '...' : ''}</p>
                <button class="btn-buy" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Función para agregar al carrito (simulada)
window.addToCart = (productId) => {
    showNotification('Producto agregado al carrito', 'success');
};

// Formulario de contacto
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
        form.reset();
    });
}

// Menú móvil
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// Animación de texto typing
function setupTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        '¡Bienvenido a Cruz Azul!',
        'Tu salud es nuestra prioridad',
        'Los mejores precios en medicamentos',
        'Envíos a domicilio',
        'Atención personalizada 24/7'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const modal = document.getElementById('notificationModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modalMessage.style.color = type === 'success' ? '#28a745' : '#0066B3';
        modal.style.display = 'flex';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Cerrar modal
document.querySelector('.close-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('notificationModal');
    if (modal) modal.style.display = 'none';
});

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});