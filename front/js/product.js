const key = 'Products';
const params = new URLSearchParams(window.location.search);
const id = params.get('_id');
const couleurOption = document.getElementById('colors');

function init() {
    const colors = document.getElementById('colors');
    const button = document.getElementById('addToCart');
    const itemQuantity = document.getElementById('quantity');
    const productName = document.getElementById('title');
    const description = document.getElementById('description');

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
}

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

function getCart(){
    let cart = localStorage.getItem(key);
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

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

init();