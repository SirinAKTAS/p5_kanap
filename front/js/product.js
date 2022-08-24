const key = 'Products';

// Récupération de l'id présent dans l'url après avoir cliquer sur un produit sur la page index
const params = new URLSearchParams(window.location.search);
const id = params.get('_id');

const couleurOption = document.getElementById('color-select');

// Fonction qui permet dans un premier temps de récupérer et afficher les produits
(function init() {
    const colors = document.getElementById('color-select');
    const button = document.getElementById('addToCart');
    const itemQuantity = document.getElementById('itemQuantity');
    const productName = document.getElementById('title');
    const description = document.getElementById('description');

    // Appelle fetch pour récupérer le produit par rapport à son id qui est présent dans l'url de la page
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            if(res.ok){
                return res.json();
            }
        })
        .then(function(product) {
            displayProductData(product);
        })
        .catch(function(err){
            // Une erreur est survenue
        });

    // Event de type change pour disable ou non le bouton pour ajouter au panier si y a une couleur de sélectionner
    colors.addEventListener('change', function () {
        const colorsValue = this.value;
        const quantityValue = Number(itemQuantity.value);

        if (colorsValue && quantityValue !== 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    // Event de type change pour disable ou non le bouton pour ajouter au panier si y a une quantité de sélectionner
    itemQuantity.addEventListener('change', function () {
        const colorsValue = colors.value;
        const quantityValue = Number(this.value);

        if (colorsValue && quantityValue !== 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    // Event de type clik pour créé un object avec les valeurs dont on a besooin puis d'ajouter l'object dans le localstorage
    button.addEventListener('click', () => {
        const image = document.getElementById('image');

        let object = {
            id: id,
            quantity: Number(itemQuantity.value),
            colors: colors.value,
            name: productName.innerHTML,
            description: description.innerHTML,
            imageUrl: image.src,
            altTxt: image.alt
        }

        processLocalStorage(object);
        alert('Votre Kanap a bien été ajouté au panier !');
    });
})();

/**
 * Fonction pour l'affiche du produit présent dans l'url
 * @param {Object} product - Désignation du produit présent dans l'url
 */
function displayProductData(product) {
    let imageAlt = document.querySelector("article div.item__img");
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let price = document.getElementById('price');

    imageAlt.innerHTML = `<img id="image" src="${product.imageUrl}" alt="${product.altTxt}">`;
    title.textContent = `${product.name}`;
    price.textContent = `${product.price}`;
    description.textContent = `${product.description}`;

    for(let couleur of product.colors) {
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
    }
}

// Fonction pour récupérer les éléments du localstorage, si il est vide on créé un tableau vide
function getCart(){
    let cart = localStorage.getItem(key);
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

/**
 * Fonction pour permettre d'ajouter un élément dans le localstorage, si le produit que nous voulons
 * Ajouter au localstorage existe déjà ( même ID et même COULEUR ) on modifie alors sa quantité,
 * Sinon on créé un nouveau produit dans le tableau présent dans le localstorage
 * @param {Object} object - Désignation du produit présent dans le localStorage
 */
function processLocalStorage(object) {
    let cart = getCart();
    let sortedArray = Array.from(cart).find(product => product.id === object.id && product.colors === object.colors);

    if (cart && sortedArray) {
        sortedArray.quantity += object.quantity;
        localStorage.setItem(key, JSON.stringify(cart));
    } else {
        cart.push(object);
        localStorage.setItem(key, JSON.stringify(cart));
    }

}