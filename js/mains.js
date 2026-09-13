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

