import { localStorageHas, localStorageSave, localStorageGet } from './localstorage.js';

const key = 'Products';
const params = new URLSearchParams(window.location.search);
const id = params.get('_id');
const couleurOption = document.getElementById('colors');

function init() {
    const colors = document.getElementById('colors');
    const button = document.getElementById('addToCart');
    const itemQuantity = document.getElementById('quantity');
    const price = document.getElementById('price');

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

    colors.addEventListener('change', function () {
        const colorsValue = this.value;
        const quantityValue = Number(itemQuantity.value);

        if (colorsValue && quantityValue !== 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    itemQuantity.addEventListener('change', function () {
        const colorsValue = colors.value;
        const quantityValue = Number(this.value);

        if (colorsValue && quantityValue !== 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    button.addEventListener('click', () => {
        let object = {
            id: id,
            quantity: itemQuantity.value,
            colors: colors.value,
            price: Number(price.innerHTML),
        }

        processLocalStorage(object);
    });
}

function displayProductData(product) {
    let imageAlt = document.querySelector("article div.item__img");
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let price = document.getElementById('price');

    imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    title.textContent = `${product.name}`;
    price.textContent = `${product.price}`;
    description.textContent = `${product.description}`;

    for(let couleur of product.colors) {
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
    }
}

function processLocalStorage(object) {
    if (localStorageHas(key)) {
        const localStorageValue = localStorageGet(key);

        // Lorsqu'on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente la quantité du produit correspondant dans l'array
        const sortedArray = localStorageValue.find(product => product.id === object.id);

        // TODO
        // Mettre à jour la quantité dans le LS (if)
        // Mettre à jour la valeur courante en mémoire avec le nouvel object que l'on veut insérer (else)
        if (sortedArray) {
            // object.quantity
        } else {
            // push
        }

        console.log(object);
        console.log(localStorageValue);
        console.log(object.id);
    } else {
        // Ajouter l'objet dans le LS
        localStorageSave(key, [object]);
    }
}

init();