// 1. BASE DE DATOS DEL MENÚ
const menuItems = [
    { id: 1, name: 'Monster Burger', category: 'burgers', price: 8.00, img: 'img/bigburguer2.jpg', desc: 'Doble carne, queso fundido y salsas especiales.' },
    { id: 2, name: 'Burger Jalapeño', category: 'burgers', price: 7.50, img: 'img/hamburverano.jpg', desc: 'Sabor intenso con jalapeño fresco y toque picante.' },
    { id: 3, name: 'Burger con Huevo', category: 'burgers', price: 7.00, img: 'img/Burgeralacrema1.jpg', desc: 'Carne a la parrilla, huevo estrellado y aguacate.' },
    { id: 4, name: 'Tacos Tradicionales', category: 'tacos', price: 6.50, img: 'img/tacos.jpg', desc: '3 tacos rellenos de carne, cebolla y cilantro.' },
    { id: 5, name: 'Papas Locas', category: 'sides', price: 6.00, img: 'img/Nachos.jpg', desc: 'Crujientes papas bañadas en chili y queso cheddar.' },
    { id: 6, name: 'Palitos de Queso', category: 'sides', price: 5.50, img: 'img/palitroques.jpg', desc: 'Crujientes por fuera, derretidos por dentro.' },
    { id: 7, name: 'Quesadilla Mixta', category: 'sides', price: 7.00, img: 'img/quesadilla.jpg', desc: 'Rellena de carne y queso, con salsa de la casa.' },
    { id: 8, name: 'Michelada Roja', category: 'drinks', price: 5.00, img: 'img/chela1.jpg', desc: 'Con chamoy, limón y un toque dulce.' },
    { id: 9, name: 'Tarta de Maracuyá', category: 'desserts', price: 4.00, img: 'img/pai.jpg', desc: 'Postre casero con base crujiente y crema.' }
];

let currentCategory = 'all';

// Cargar carrito desde LocalStorage
function getCart() {
    const cart = localStorage.getItem('bonAppetitCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('bonAppetitCart', JSON.stringify(cart));
    updateCartBadge();
}

// 2. RENDERIZAR MENÚ
function renderMenu() {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';
    
    const filtered = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <span class="price">$${item.price.toFixed(2)}</span>
            <button class="add-cart" onclick="addToCart(${item.id})">Agregar al pedido</button>
        `;
        grid.appendChild(div);
    });
}

// 3. FILTRAR Y BUSCAR
function filterMenu(category) {
    currentCategory = category;
    // Resaltar en el header el enlace activo si se desea
    document.querySelectorAll('.header-nav a').forEach(btn => {
        btn.style.color = ''; // reset
        btn.style.fontWeight = '600';
    });
    renderMenu();
}

function searchMenu() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('menuGrid');
    const items = grid.getElementsByClassName('menu-item');
    Array.from(items).forEach(item => {
        const name = item.querySelector('h3').innerText.toLowerCase();
        item.style.display = name.includes(query) ? 'block' : 'none';
    });
}

// 4. CARRITO
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    let cart = getCart();
    const existing = cart.find(i => i.id === id);
    
    if (existing) existing.qty++;
    else cart.push({...item, qty: 1});
    
    saveCart(cart);
    
    // Feedback visual
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✓ Agregado!";
    btn.style.background = "#4CAF50";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "#E53935";
    }, 1500);
}

function updateCartBadge() {
    const cart = getCart();
    // Leemos la cantidad real, dándole prioridad a 'cantidad' (lo que cambia el carrito)
    // y si no existe, usamos 'qty' (lo que agrega el index)
    const count = cart.reduce((sum, item) => {
        const q = item.cantidad || item.qty || 1; 
        return sum + q;
    }, 0);
    
    const badge = document.getElementById('cartCount');
    if(badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// 5. CARRUSEL AUTOMÁTICO
let slideIndex = 0;
function changeSlide(n) {
    const slides = document.getElementsByClassName("carousel-slide");
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    slides[slideIndex].classList.add('active');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartBadge();
    setInterval(() => changeSlide(1), 5000);
});