import { localStorageHas, localStorageSave, localStorageGet,  addProduct, getNumberOfProduct, getTotalPrice, changeQuantityFromCart, removeFromCart, } from './localstorage.js';
const params = new URLSearchParams(window.location.search);
const id = params.get('_id');
const couleurOption = document.getElementById('colors');

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

    colors.addEventListener('change', function() {
        if (this.value) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    button.addEventListener('click', () => {
        let objectJSON = {
            _id: id,
            quantity: itemQuantity.value,
            colors: colors.value,
            price: price.value,
        }
        localStorageSave("Products", objectJSON);
        console.log(localStorageSave);
        // Ajouter l'object dans le localstorage
    });
}

init();

