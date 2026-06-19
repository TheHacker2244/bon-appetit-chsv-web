document.addEventListener("DOMContentLoaded", function() {
    let carrito = JSON.parse(localStorage.getItem('bonAppetitCart')) || [];
    const listaCarrito = document.getElementById('lista-productos-carrito');
    const totalSpan = document.getElementById('total-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const cartCount = document.getElementById('cart-count');

    function renderizarCarrito() {
        listaCarrito.innerHTML = '';

        if (carrito.length === 0) {
            carritoVacio.style.display = 'block';
            carritoContenido.style.display = 'none';
            if(cartCount) cartCount.innerText = '0';
            return;
        }

        carritoVacio.style.display = 'none';
        carritoContenido.style.display = 'block';

        let total = 0;

        carrito.forEach((item, index) => {
            // 🔥 CORRECCIÓN DE CLAVES: Acepta name O nombre, price O precio, etc.
            const nombre = item.nombre || item.name || 'Producto';
            const precio = item.precio || item.price || 0;
            const cantidad = item.cantidad || item.qty || 1;
            const descripcion = item.descripcion || item.desc || 'Sin descripción adicional';
            const img = item.img || 'img/LogoBun2.jpg';

            const subtotal = precio * cantidad;
            total += subtotal;

            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <img src="${img}" alt="${nombre}">
                <div class="info-producto">
                    <h4>${nombre}</h4>
                    <div class="descripcion">${descripcion}</div>
                </div>
                <div class="precio">$${precio.toFixed(2)}</div>
                <div class="cantidad-control">
                    <button class="restar" data-index="${index}">−</button>
                    <span>${cantidad}</span>
                    <button class="sumar" data-index="${index}">+</button>
                </div>
                <div class="eliminar-item" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </div>
            `;
            listaCarrito.appendChild(div);
        });

        totalSpan.innerText = `$${total.toFixed(2)}`;
        const totalItems = carrito.reduce((sum, item) => {
            const q = item.cantidad || item.qty || 1;
            return sum + q;
        }, 0);
        if(cartCount) cartCount.innerText = totalItems;

        // Eventos para sumar
        document.querySelectorAll('.item-carrito .sumar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                // Mantener compatibilidad al actualizar
                carrito[index].cantidad = (carrito[index].cantidad || carrito[index].qty || 1) + 1;
                guardarYRenderizar();
            });
        });

        // Eventos para restar
        document.querySelectorAll('.item-carrito .restar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                let qty = carrito[index].cantidad || carrito[index].qty || 1;
                if (qty > 1) {
                    carrito[index].cantidad = qty - 1;
                } else {
                    carrito.splice(index, 1);
                }
                guardarYRenderizar();
            });
        });

        // Eventos para eliminar
        document.querySelectorAll('.item-carrito .eliminar-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                carrito.splice(index, 1);
                guardarYRenderizar();
            });
        });
    }

    function guardarYRenderizar() {
        localStorage.setItem('bonAppetitCart', JSON.stringify(carrito));
        renderizarCarrito();
    }

    document.getElementById('btn-finalizar-compra').addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        let mensaje = "🍔 *Nuevo pedido - Bon Appetit CHSV:*\n\n";
        carrito.forEach((item, index) => {
            const nombre = item.nombre || item.name || 'Producto';
            const precio = item.precio || item.price || 0;
            const cantidad = item.cantidad || item.qty || 1;
            const descripcion = item.descripcion || item.desc || 'Sin descripción';
            
            mensaje += `${index + 1}. ${nombre} (${descripcion}) x${cantidad} = $${(precio * cantidad).toFixed(2)}\n`;
        });
        const total = carrito.reduce((sum, item) => {
            const p = item.precio || item.price || 0;
            const q = item.cantidad || item.qty || 1;
            return sum + (p * q);
        }, 0);
        mensaje += `\n*Total a pagar: $${total.toFixed(2)}*\n\n¡Gracias por tu compra! 🔥`;

        const url = `https://wa.me/50372570825?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });

    renderizarCarrito();
});