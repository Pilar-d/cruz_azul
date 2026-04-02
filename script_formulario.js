 
        // Array para almacenar productos
        let productos = [
            {
                id: 1,
                nombre: "Vitamina C 1000mg",
                precio: 4990,
                imagen: "https://placehold.co/200x200/eef5fc/0a4b7a?text=Vitamina+C",
                badge: "-30%"
            },
            {
                id: 2,
                nombre: "Paracetamol 500mg",
                precio: 990,
                imagen: "https://placehold.co/200x200/eef5fc/0a4b7a?text=Paracetamol",
                badge: "-20%"
            },
            {
                id: 3,
                nombre: "Protector Solar FPS 50",
                precio: 12500,
                imagen: "https://placehold.co/200x200/eef5fc/0a4b7a?text=Protector+Solar",
                badge: "Envío rápido"
            },
            {
                id: 4,
                nombre: "Alcohol Gel 500ml",
                precio: 2400,
                imagen: "https://placehold.co/200x200/eef5fc/0a4b7a?text=Alcohol+Gel",
                badge: "Oferta"
            }
        ];

        let nextId = 5;

        // Función para mostrar notificación temporal
        function showNotification(message, isError = false) {
            const notification = document.createElement('div');
            notification.className = 'toast-notification';
            notification.style.background = isError ? '#e74c3c' : '#2ecc71';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2500);
        }

        // Función para renderizar productos (con filtro opcional)
        function renderProducts(filterText = '') {
            const container = document.getElementById('productsContainer');
            if (!container) return;

            let filteredProducts = productos;
            if (filterText.trim() !== '') {
                filteredProducts = productos.filter(p => 
                    p.nombre.toLowerCase().includes(filterText.toLowerCase())
                );
            }

            if (filteredProducts.length === 0) {
                container.innerHTML = `<div class="empty-message">😕 No se encontraron productos. ¡Agrega uno nuevo!</div>`;
                return;
            }

            container.innerHTML = filteredProducts.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <div class="discount-badge">${product.badge}</div>
                    <img class="product-img" src="${product.imagen}" alt="${product.nombre}" onerror="this.src='https://placehold.co/200x200/eef5fc/0a4b7a?text=Producto'">
                    <h3>${product.nombre}</h3>
                    <div class="price">${formatPrice(product.precio)}</div>
                    <button class="btn-add" onclick="addToCart('${product.nombre}')">➕ Agregar al carro</button>
                    <button class="btn-add btn-delete" onclick="deleteProduct(${product.id})">🗑️ Eliminar</button>
                </div>
            `).join('');
        }

        // Formateador de precios
        function formatPrice(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        // Función para agregar producto al carrito (simulación)
        function addToCart(productName) {
            showNotification(`✓ ${productName} agregado al carrito`, false);
        }

        // Función para eliminar producto
        function deleteProduct(id) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                productos = productos.filter(p => p.id !== id);
                renderProducts(document.getElementById('searchInput')?.value || '');
                showNotification('✅ Producto eliminado correctamente', false);
            }
        }

        // Función para filtrar productos
        function filterProducts() {
            const searchTerm = document.getElementById('searchInput')?.value || '';
            renderProducts(searchTerm);
        }

        // Función para agregar nuevo producto desde el formulario
        function addNewProduct(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('productName');
            const priceInput = document.getElementById('productPrice');
            const imageInput = document.getElementById('productImage');
            const badgeSelect = document.getElementById('productBadge');
            
            const nombre = nameInput.value.trim();
            const precio = parseFloat(priceInput.value);
            let imagen = imageInput.value.trim();
            const badge = badgeSelect.value;
            
            // Validaciones
            if (!nombre) {
                showNotification('❌ El nombre del producto es obligatorio', true);
                return;
            }
            
            if (isNaN(precio) || precio <= 0) {
                showNotification('❌ Ingresa un precio válido mayor a 0', true);
                return;
            }
            
            // Si no hay imagen, usar placeholder genérico
            if (!imagen) {
                imagen = `https://placehold.co/200x200/eef5fc/0a4b7a?text=${encodeURIComponent(nombre.substring(0, 15))}`;
            }
            
            // Crear nuevo producto
            const nuevoProducto = {
                id: nextId++,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                badge: badge
            };
            
            productos.push(nuevoProducto);
            
            // Limpiar formulario
            nameInput.value = '';
            priceInput.value = '';
            imageInput.value = '';
            badgeSelect.value = 'Oferta';
            
            // Refrescar vista y mantener filtro actual
            const searchTerm = document.getElementById('searchInput')?.value || '';
            renderProducts(searchTerm);
            
            showNotification(`🎉 "${nombre}" agregado exitosamente`, false);
            
            // Scroll suave al listado
            document.querySelector('.section-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Event listener para el formulario
        document.getElementById('productForm')?.addEventListener('submit', addNewProduct);
        
        // Event listener para búsqueda en tiempo real (opcional)
        document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
        
        // Render inicial
        renderProducts();
        
        // Exponer funciones globalmente para los botones onclick
        window.addToCart = addToCart;
        window.deleteProduct = deleteProduct;
        window.filterProducts = filterProducts;
