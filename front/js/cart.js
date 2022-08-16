const key = 'Products';
const itemsContainer = document.getElementById('cart__items');

let products = JSON.parse(localStorage.getItem(key));
let productsFromApi = [];

// ************* Affichage Produit, localstorage vide ***********

if (!products || (products && products.length === 0)) {
    showWhenEmpty();
} else {
    init();
}

/**
 *
 */
async function init() {
    await displayProducts(products);

    // Modifier la quantité depuis le panier
    const itemsQuantity = document.querySelectorAll('.itemQuantity');
    itemsQuantity.forEach((itemQuantity) => {
        /**
        *   Event de type change sur la quantité pour permettre une modification de la quantité du produit
        *   Depuis la page panier, puis on enregistre la nouvelle valeur dans le localstorage 
        */
        itemQuantity.addEventListener('change', (e) => {
            const article = itemQuantity.closest('article');
            const id = article.dataset.id;
            const colors = article.dataset.colors;
            const object = products.find(product => product.id === id && product.colors === colors);

            // Si la valeur n'est pas un nombre ou inférieur ou égale à 0, alors on set la valeur à 1
            if (isNaN(itemQuantity.value) || itemQuantity.value <= 0){
                itemQuantity.value = 1;
            }

            if (!!object) {
                object.quantity = Number(itemQuantity.value);

                localStorage.setItem(key, JSON.stringify(products));
                computeTotalQuantity();
                computeTotalPrice();
            }
        })
    });

    /** 
    * On récupère tout les ".deleteItem" puis on utilise un event de type click pour pouvoir supprimer l'article 
    * Le plus proche du bouton
    * Selon l'id et la couleur grâce à la méthode filter 
    */
    const deleteItems = document.querySelectorAll('.deleteItem');
    deleteItems.forEach((deleteItem, i) => {
        deleteItem.addEventListener("click", () => {
            const article = deleteItem.closest('article');

            products = products.filter(product => {
                if (deleteItem.dataset.id !== product.id || deleteItem.dataset.colors !== product.colors) {
                    article.remove();
                    return true;
                }
            });
            productsFromApi.splice(i, 1);
            localStorage.setItem(key, JSON.stringify(products));

            if (products.length === 0) {
                showWhenEmpty();
            }

            computeTotalPrice();
            computeTotalQuantity();
        });
    });

    computeTotalPrice();
    computeTotalQuantity();
}

/**
 * Fonction qui permet d'éxécuter l'affichage des produits du localStorage sur la page panier
 * @param products - Tableau des produits stockés en localStorage
 */
async function displayProducts(products) {
    // On a besoin de récupérer la donnée des éléments situés dans le panier
    const arrayIds = products.map(product => product.id);
    const fragment = document.createDocumentFragment();

    productsFromApi = await Promise.all(
        arrayIds.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
    );

    for (let i = 0; i < products.length; i++) {
        const element = createProduct(i);
        fragment.appendChild(element);
    }

    itemsContainer.appendChild(fragment);
}

/**
 * Fonction pour créer un template du DOM pour chaque produit présent dans le localStorage
 * @param {number} i - Désignation de chaque produit présent dans le localStorage
 */
function createProduct(i) {
    const template = document.createElement('template');
    template.innerHTML = `
        <article class="cart__item" data-id="${products[i].id}" data-colors="${products[i].colors}" data-price="${productsFromApi[i].price}">
            <div class="cart__item__img">
              <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${products[i].name}</h2>
                <p>${products[i].colors}</p>
                <p>${productsFromApi[i].price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${products[i].quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem" data-id="${products[i].id}" data-colors="${products[i].colors}">Supprimer</p>
                </div>
              </div>
            </div>
          </article>
    `;

    return template.content.firstElementChild;
}

/**  
 * Calcul du prix total du panier, on récupère d'abord dans un tableau les prix de chaque produit (selon leurs quantité) 
 * Présent sur la page panier, puis avec la méthode reduce on calcule les valeurs qu'on a récupérer 
 */
function computeTotalPrice() {
    let getCartTotalPrice = [];

    for (let i = 0; i < products.length; i++){
        let cartPrice = productsFromApi[i].price * products[i].quantity;
        getCartTotalPrice.push(cartPrice);
    }

    const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;
    const totalPrice = getCartTotalPrice.reduce(reducerPrice, 0);

    let showTotalPrice = document.getElementById('totalPrice');
    showTotalPrice.textContent = totalPrice;
}

/**
 * Calcul de la quantité total du panier, on récupère d'abord dans un tableau les quantité de chaque produit 
 * Présent sur la page panier, puis avec la méthode reduce on calcule les valeurs qu'on a récupérer 
 */
function computeTotalQuantity() {
    let array = [];

    for (let i = 0; i < products.length; i++){
        let totalCart = products[i].quantity;
        array.push(totalCart);
    }

    const reducerQuantity = (accumulator, currentValue) => accumulator + currentValue;

    let showTotalQuantity = document.getElementById('totalQuantity');
    showTotalQuantity.textContent = array.reduce(reducerQuantity, 0);
}

// Fonction pour afficher ce qui doit être afficher lorsque le localstorage est vide
function showWhenEmpty() {
    itemsContainer.innerHTML = ` 
        <div class="cartAndFormContainer">
            <h2>Votre panier est vide, merci d'ajouter au moins un kanap.</h2>
        </div>
    `;

    let showTotalPrice = document.getElementById('totalPrice');
    showTotalPrice.textContent = '0';
    let showTotalQuantity = document.getElementById('totalQuantity');
    showTotalQuantity.textContent = '0';
}








// *************** Formulaire ***************/

let form = document.querySelector('#formOrder');
// **************** Validation Prenom ****************

// Event de type change qui fais appel à une fonction lors du changement de la value du champ
form.firstName.addEventListener('change', function() {
    validFirstName(this);
});

/**
 * Fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide 
 * Message d'erreur ou non lorsque le champ est correct ou non 
 */
const validFirstName = function() {
    let firstNameRegExp = /^[a-zA-Z\-]+$/;
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

    if (firstNameRegExp.test(form.firstName.value)) {
        firstNameErrorMsg.innerHTML ='Prenom correct';
        firstNameErrorMsg.classList.remove('msg-invalide');
        firstNameErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        firstNameErrorMsg.innerHTML ='Prenom incorrect (attention aux chiffres et/ou caractère spéciaux)';
        firstNameErrorMsg.classList.remove('msg-valide');
        firstNameErrorMsg.classList.add('msg-invalide');
        return false;
    }
};

// **************** Validation Nom ****************

// Event de type change qui fais appel à une fonction lors du changement de la value du champ
form.lastName.addEventListener('change', function() {
    validLastName(this);
});

/** 
 * Fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
 * Message d'erreur ou non lorsque le champ est correct ou non
 */
const validLastName = function() {
    let lastNameRegExp = /^[a-zA-Z\-]+$/;
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

    if (lastNameRegExp.test(form.lastName.value)) {
        lastNameErrorMsg.innerHTML ='Nom correct';
        lastNameErrorMsg.classList.remove('msg-invalide');
        lastNameErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        lastNameErrorMsg.innerHTML ='Nom incorrect (attention aux chiffres et/ou caractère spéciaux)';
        lastNameErrorMsg.classList.remove('msg-valide');
        lastNameErrorMsg.classList.add('msg-invalide');
        return false;
    }
};

// **************** Validation Adresse ****************

// Event de type change qui fais appel à une fonction lors du changement de la value du champ
form.address.addEventListener('change', function() {
    validAddress(this);
});

/**
 * Fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide 
 * Message d'erreur ou non lorsque le champ est correct ou non
 */ 
const validAddress = function() {
    let addressRegExp = /(\d+) [a-zA-Z\d\s]+(\.)? [a-zA-Z]+?/;
    let addressErrorMsg = document.getElementById('addressErrorMsg');

    if (addressRegExp.test(form.address.value)) {
        addressErrorMsg.innerHTML ='Adresse correct';
        addressErrorMsg.classList.remove('msg-invalide');
        addressErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        addressErrorMsg.innerHTML ='Adresse incorrect';
        addressErrorMsg.classList.remove('msg-valide');
        addressErrorMsg.classList.add('msg-invalide');
        return false;
    }
};
// **************** Validation Ville ****************

// Event de type change qui fais appel à une fonction lors du changement de la value du champ
form.city.addEventListener('change', function() {
    validCity(this);
});

/** 
 * Fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide 
 * Message d'erreur ou non lorsque le champ est correct ou non
 */
const validCity = function() {
    let cityRegExp = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    let cityErrorMsg = document.getElementById('cityErrorMsg');

    if (cityRegExp.test(form.city.value)) {
        cityErrorMsg.innerHTML ='Ville correct';
        cityErrorMsg.classList.remove('msg-invalide');
        cityErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        cityErrorMsg.innerHTML ='Ville incorrect';
        cityErrorMsg.classList.remove('msg-valide');
        cityErrorMsg.classList.add('msg-invalide');
        return false;
    }
};

// **************** Validation Email ******************

// Event de type change qui fais appel à une fonction lors du changement de la value du champ
form.email.addEventListener('change', function() {
    validEmail(this);
});

/**
 * Fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide 
 * Message d'erreur ou non lorsque le champ est correct ou non
 */
const validEmail = function() {
    let emailRegExp = /^[a-zA-Z\d.-_]+@[a-zA-Z\d.-_]+[.][a-z]{2,10}$/;
    let emailErrorMsg = document.getElementById('emailErrorMsg');

    if (emailRegExp.test(form.email.value)) {
        emailErrorMsg.innerHTML ='Adresse email valide';
        emailErrorMsg.classList.remove('msg-invalide');
        emailErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        emailErrorMsg.innerHTML ='Adresse email non valide';
        emailErrorMsg.classList.remove('msg-valide');
        emailErrorMsg.classList.add('msg-invalide');
        return false;
    }
};

// **************** Passer la commande ******************
const buttonOrder = document.getElementById('order');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

// Event de type clic qui permet d'envoyer les données avec la méthode POST et en mm temps supprimer les éléments du localstorage
buttonOrder.addEventListener('click', (e) => {
    localStorage.removeItem(key);
    e.preventDefault();

    submitButton();
});

/**
 * Fonction lors du click du bouton "Commander" 
 * Le bouton ne fonction pas si le panier est vide et que les valeurs des champs du formulaire sont incorrect
 */
function submitButton() {
    if (!products || (products && products.length === 0)) return alert('le panier est vide');

    const body = sendOrder();

    if (products.length === 0       || 
        validEmail() === false      || 
        validCity() === false       || 
        validAddress() === false    ||
        validFirstName() === false  || 
        validLastName() === false) {
        alert('le panier est vide et/ou un champ du formulaire n\'est pas bien rempli');
    } else {
        // Envoi des données avec fetch et la méthode POST
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                // après l'envoi des données on récupère l'orderId qu'on nous fournis grâce à la méthode POST puis on est redirigés
                // sur la page de confirmation avec l'orderId présent dans l'url
                const orderId = data.orderId;
                window.location.href = "confirmation.html" + "?orderId=" + orderId;
            })

    }
}

// Fonction qui créé un object contenant les valeurs dont on a besoin, càd les valeurs du formulaire et les produits présent dans le panier
function sendOrder() {
    return {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: products.map(product => product.id)
    };
}