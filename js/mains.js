const gridContainer = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProducts(itemsToRender) {

    gridContainer.innerHTML = '';

    itemsToRender.forEach(item => {

        const card = document.createElement('article');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 4px; margin-bottom: 1rem; object-fit: cover; aspect-ratio: 1/1;">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p class="product-price">$${item.price.toFixed(2)}</p>
            <button class="submit-btn" style="width: 100%; background-color: var(--text-color);">Lo quiero</button>
        `;

        gridContainer.appendChild(card);
    }); 
}

renderProducts(products);

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const category = e.target.getAtrribute('data-category');

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

    if (nameInput.ariaValueMax.trim() === '') {
        nameError.textContent = 'Por favor, ingresa tu nombre completo.';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Por favor, ingresa tu correo electrónico.';
        isValid = false;
    }

    if (itemInput.value.trim() === '') {
        itemError.textContent = 'Por favor, ingresa el nombre del producto que deseas reservar.';
        isValid = false;
    }

    if (isValid) {
        alert('¡Gracias por tu reserva! Nos pondremos en contacto contigo pronto.');
        form.reset();
    }
});

