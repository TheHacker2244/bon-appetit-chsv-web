document.addEventListener("DOMContentLoaded", function() {
    // 1. VERIFICACIÓN DE IMAGEN DE FONDO (Efecto Cristal)
    const bgUrl = 'img/banerburguer3.jpg--'; // Cambia esto por el nombre de tu imagen si deseas
    const imgChecker = new Image();
    
    imgChecker.onload = function() {
        document.body.classList.add('has-bg-image');
        console.log("✅ Imagen de fondo encontrada. ¡Efecto cristal activado!");
    };
    
    imgChecker.onerror = function() {
        console.log("ℹ️ Imagen de fondo no encontrada. Usando estilo sólido blanco.");
    };
    
    imgChecker.src = bgUrl;

    // 2. LÓGICA DE LOGIN / REGISTRO (Adaptada para Bon Appetit)
    let users = JSON.parse(localStorage.getItem('bonAppetitUsers')) || [];
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const toggleMode = document.getElementById('toggleMode');
    const toggleText = document.getElementById('toggle-text');
    const mensaje = document.getElementById('mensaje');
    let isRegisterMode = false;

    // Si el usuario hizo clic en "Regístrate aquí"
    toggleMode.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            submitBtn.textContent = "Registrarme";
            toggleText.innerHTML = `¿Ya tienes cuenta? <a href="#" id="toggleMode">Inicia sesión aquí</a>`;
            document.querySelector('.login-box h2').textContent = "Crear cuenta";
            document.querySelector('.subtitulo').textContent = "Regístrate para dejar reseñas";
        } else {
            submitBtn.textContent = "Iniciar Sesión";
            toggleText.innerHTML = `¿No tienes cuenta? <a href="#" id="toggleMode">Regístrate aquí</a>`;
            document.querySelector('.login-box h2').textContent = "¡Bienvenido!";
            document.querySelector('.subtitulo').textContent = "Regístrate para calificar y dejar reseñas";
        }
        mensaje.textContent = "";
        // Re-asignar evento al nuevo enlace generado
        document.getElementById('toggleMode').addEventListener('click', arguments.callee);
    });

    // Enviar formulario (Login o Register)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mensaje.textContent = "Completa todos los campos";
            mensaje.style.color = "red";
            return;
        }

        const userExists = users.find(u => u.email === email);

        if (isRegisterMode) {
            // Registrar
            if (userExists) {
                mensaje.textContent = "Este correo ya está registrado";
                mensaje.style.color = "red";
                return;
            }
            users.push({ email, password });
            localStorage.setItem('bonAppetitUsers', JSON.stringify(users));
            mensaje.textContent = "Usuario registrado con éxito. ¡Ahora inicia sesión!";
            mensaje.style.color = "green";
            toggleMode.click(); // Cambia automáticamente a modo Login
        } else {
            // Iniciar Sesión
            if (userExists && userExists.password === password) {
                localStorage.setItem('bonAppetitSession', JSON.stringify({ email }));
                mensaje.textContent = "¡Bienvenido/a! Redirigiendo...";
                mensaje.style.color = "green";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                mensaje.textContent = "Correo o contraseña incorrectos";
                mensaje.style.color = "red";
            }
        }
    });
});