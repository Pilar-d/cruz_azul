// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupContactForm();
    setupMobileMenu();
    setupTypingAnimation();
    setupScrollAnimation();
    setupNavbarScroll();
    setupModalClose();
    
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
    
    if (!grid) return;
    
    if (products.length === 0) {
        // Productos por defecto si no hay ninguno
        const defaultProducts = [
            {
                id: 1,
                nombre: "Paracetamol 500mg",
                precio: 5990,
                imagen: "../img/paracetamol.webp",
                descripcion: "Analgésico y antipirético para el alivio del dolor leve a moderado.",
                categoria: "Medicamentos"
            },
            {
                id: 2,
                nombre: "Vitamina C 1000mg",
                precio: 8990,
                imagen: "../img/vitamina_c.png.",
                descripcion: "Refuerza el sistema inmunológico y previene resfriados.",
                categoria: "Vitaminas"
            },
            {
                id: 3,
                nombre: "Alcohol Gel Antibacterial",
                precio: 2990,
                imagen: "../img/alcohol.png",
                descripcion: "Jabón líquido antibacterial para uso diario.",
                categoria: "Cuidado Personal"
            },
            {
                id: 4,
                nombre: "Curitas Antibacterianas",
                precio: 1990,
                imagen: "https://via.placeholder.com/300x250/28a745/white?text=Curitas",
                descripcion: "Caja con 50 unidades, protección avanzada.",
                categoria: "Primeros Auxilios"
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
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay productos disponibles</p>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card fade-up">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=Producto'">
            <div class="product-info">
                <span class="product-category">${product.categoria || 'General'}</span>
                <h3 class="product-title">${escapeHtml(product.nombre)}</h3>
                <p class="product-price">$${parseInt(product.precio).toLocaleString('es-CL')}</p>
                <p class="product-description">${escapeHtml(product.descripcion.substring(0, 80))}${product.descripcion.length > 80 ? '...' : ''}</p>
                <button class="btn-buy" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Función para escapar HTML y evitar XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para agregar al carrito (simulada)
window.addToCart = (productId) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`${product.nombre} agregado al carrito`, 'success');
    }
};

// Formulario de contacto
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const telefono = document.getElementById('telefono')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value || '';
        
        // Validar campos
        if (!nombre || !email || !mensaje) {
            showNotification('Por favor complete los campos requeridos', 'error');
            return;
        }
        
        // Simular envío
        console.log('Mensaje enviado:', { nombre, email, telefono, mensaje });
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
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
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

// Animación de scroll
function setupScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0, 0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Cambiar estilo del navbar al hacer scroll
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const modal = document.getElementById('notificationModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modalMessage.style.color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066B3';
        modal.style.display = 'flex';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    } else {
        console.log(message);
    }
}

// Cerrar modal
function setupModalClose() {
    const closeBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('notificationModal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Cerrar menú móvil si está abierto
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.getElementById('mobile-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        }
    });
});