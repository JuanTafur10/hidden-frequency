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

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title;
        image.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const description = document.createElement('p');
        description.textContent = item.description;

        const price = document.createElement('p');
        price.classList.add('product-price');
        price.textContent = precioFormateado;

        const reserveButton = document.createElement('button');
        reserveButton.type = 'button';
        reserveButton.classList.add('card-btn');
        reserveButton.textContent = 'Lo quiero';
        reserveButton.setAttribute('aria-label', `Solicitar ${item.title}`);
        reserveButton.addEventListener('click', () => {
            const itemInput = document.getElementById('item');
            itemInput.value = item.title;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            itemInput.focus({ preventScroll: true });
        });

        card.append(image, title, description, price, reserveButton);

        gridContainer.appendChild(card);
    }); 
}

renderProducts(products);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        const category = button.dataset.category;

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

    if (nameInput.value.trim().length < 3 === '') {
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

    if (itemInput.value.trim().length < 3 === '') {
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
