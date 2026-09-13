const gridContainer = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProducts(itemsToRender) {

    gridContainer.innerHTML = '';

    itemsToRender.forEach(item => {

        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(item.price);

        const card = document.createElement('article');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 4px; margin-bottom: 1rem; object-fit: cover; aspect-ratio: 1/1;">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p class="product-price">${precioFormateado}</p>
            <button class="card-btn">Lo quiero</button>
        `;

        gridContainer.appendChild(card);
    }); 
}

renderProducts(products);

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.getAttribute('data-category');
        console.log("Filtrando por:", category);

        if (category === 'Todos') {
            renderProducts(products); 
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }
    });
});

const form = document.getElementById('reservation-form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    let isValid = true;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const itemInput = document.getElementById('item');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const itemError = document.getElementById('item-error');

    nameError.textContent = '';
    emailError.textContent = '';
    itemError.textContent = '';

    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Por favor, ingresa tu nombre completo.';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'El correo electrónico es obligatorio.';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Ingresa un correo válido.';
        isValid = false;
    }

    if (itemInput.value.trim() === '') {
        itemError.textContent = 'Indícanos qué equipo o vinilo buscas.';
        isValid = false;
    }

    if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('¡Solicitud enviada! Revisa tu correo.');
                form.reset(); 
            } else {
                alert('Error al enviar. ¿Pusiste tu Access Key de Web3Forms en el HTML?');
            }
        })
        .catch(error => {
            alert('Error de red. Revisa tu conexión.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
});

const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Modo Claro';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = 'Modo Claro';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = 'Modo Oscuro';
    }
});

function showToast(mensaje) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = mensaje;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}