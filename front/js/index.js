// appel fetch pour récupérer les produits de l'api
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

// insertion des éléments de l'api sur la page accueil, création d'un template du DOM pour chaque produit présent dans l'api
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


// Fonction de création des produits de manière dynamique

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