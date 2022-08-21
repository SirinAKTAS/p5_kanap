// Appel fetch pour récupérer les produits de l'api
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(products) {
        displayProducts(products);
    })
    .catch(function(err) {
        // Une erreur est survenue
    });

/**
 * Fonction qui permet d'éxécuter l'affichage des produits de l'API sur la page panier
 * @param {Array} products - Tableau des produits de l'API
 */
function displayProducts(products) {
    // On récupére l'élément items situé dans le DOM
    const itemsContainer = document.getElementById('items');
    const fragment = document.createDocumentFragment();

    for (let product of products) {
        const element = createProduct(product);
        fragment.appendChild(element);
    }

    itemsContainer.appendChild(fragment);
}


/**
 * Fonction pour créer un template du DOM pour chaque produit présent dans l'API dynamiquement
 * @param {Object} product - Un template pour chaque produit obtenu depuis l'API
 */
function createProduct(product) {
    const template = document.createElement('template');
    template.innerHTML = `
        <a href="./product.html?_id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `;

    return template.content.firstElementChild;
}