const key = 'Products';
const itemsContainer = document.getElementById('cart__items');

let someProducts = []
let products = JSON.parse(localStorage.getItem(key));
let productsFromApi = []

// ************* Affichage Produit, localstorage vide ***********

if(!products){
    showWhenEmpty();
} else {
    init();
}

async function init() {
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

    // Modifier la quantité depuis le panier
    const itemsQuantity = document.querySelectorAll('.itemQuantity');
    itemsQuantity.forEach((itemQuantity, i) => {
        // event de type change sur la quantité pour permettre une modification de la quantité du produit
        // depuis la page panier, puis on enregistre la nouvelle valeur dans le localstorage
        itemQuantity.addEventListener('change', (e) => {
            // si la valeur n'est pas un nomber ou inférieur ou égale à 0 alors la valeur par défaut se met à 1
            if (isNaN(itemQuantity.value) || itemQuantity.value <= 0){
                itemQuantity.value = 1;
            }

            products[i].quantity = Number(itemQuantity.value);

            computeTotalPrice();
            computeTotalQuantity();
            localStorage.setItem(key, JSON.stringify(products));
        })
    });

    // on récupère tout les ".deleteItem" puis on utilise un event de type click pour pouvoir supprimer l'article le plus proche du bouton
    // selon l'id et la couleur grâce à la méthode filter
    const deleteItems = document.querySelectorAll('.deleteItem');
    deleteItems.forEach((deleteItem) => {
        deleteItem.addEventListener("click", () => {
            const article = deleteItem.closest('article');
            let totalProducts = products.length;

            if (totalProducts == 1){
                article.remove();
                showWhenEmpty();
                return localStorage.removeItem(key)
            } else {
                products = products.filter(product => {
                    if (deleteItem.dataset.id != product.id || deleteItem.dataset.colors != product.colors){
                        article.remove();
                        return true
                    }
                })

                localStorage.setItem(key, JSON.stringify(products));

            }
            computeTotalPrice();
            computeTotalQuantity();
    
        });

    });

    computeTotalPrice();
    computeTotalQuantity();
}

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

// calcul du prix total du panier, on récupère d'abord dans un tableau les prix de chaque produit (selon leurs quantité)
// présent sur la page panier, puis avec la méthode reduce on calcule les valeurs qu'on a récupérer
function computeTotalPrice() {
    let getCartTotalPrice = [];

    for ( let i = 0; i < products.length; i++){
        let cartPrice = productsFromApi[i].price * products[i].quantity;
        getCartTotalPrice.push(cartPrice);
    }

    const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;
    const totalPrice = getCartTotalPrice.reduce(reducerPrice, 0);

    let showTotalPrice = document.getElementById('totalPrice');
    showTotalPrice.textContent = totalPrice;
}

// calcul de la quantité total du panier, on récupère d'abord dans un tableau les quantité de chaque produit
// présent sur la page panier, puis avec la méthode reduce on calcule les valeurs qu'on a récupérer
function computeTotalQuantity() {
    let array = [];

    for ( let i = 0; i < products.length; i++ ){
        let totalCart = products[i].quantity;
        array.push(totalCart);
    }

    const reducerQuantity = (accumulator, currentValue) => accumulator + currentValue;

    let showTotalQuantity = document.getElementById('totalQuantity');
    showTotalQuantity.textContent = array.reduce(reducerQuantity, 0);
}

// fonction pour afficher ce qui doit être afficher lorsque le localstorage est vide
function showWhenEmpty(){
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

// event de type change qui fais appel à une fonction lors du changement de la value du champ
form.firstName.addEventListener('change', function() {
    validFirstName(this);
});

// fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
// message d'erreur ou non lorsque le champ est correct ou non
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

// event de type change qui fais appel à une fonction lors du changement de la value du champ
form.lastName.addEventListener('change', function() {
    validLastName(this);
});

// fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
// message d'erreur ou non lorsque le champ est correct ou non
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

// event de type change qui fais appel à une fonction lors du changement de la value du champ
form.address.addEventListener('change', function() {
    validAddress(this);
});

// fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
// message d'erreur ou non lorsque le champ est correct ou non
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

// event de type change qui fais appel à une fonction lors du changement de la value du champ
form.city.addEventListener('change', function() {
    validCity(this);
});

// fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
// message d'erreur ou non lorsque le champ est correct ou non
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

// event de type change qui fais appel à une fonction lors du changement de la value du champ
form.email.addEventListener('change', function() {
    validEmail(this);
});

// fonction avec une expression régulière qui permet d'appliquer des conditions pour que le champs soit valide
// message d'erreur ou non lorsque le champ est correct ou non
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

// event de type clic qui permet d'envoyer les données avec la méthode POST et en mm temps supprimer les éléments du localstorage
buttonOrder.addEventListener('click', (e) => {
    localStorage.removeItem(key);
    e.preventDefault();

    submitButton();
});

// fonction lors du click du bouton "Commander"
// le bouton ne fonction pas si le panier est vide et que les valeurs des champs du formulaire sont incorrect
function submitButton() {
    const body = sendOrder();
    if (cart.length === 0 || validEmail() === false || validCity() === false || validAddress() === false || validFirstName() === false || validLastName() === false) {
        alert('le panier est vide et/ou un champ du formulaire n\'est pas bien remplis');
    } else {

// envoi des données avec fetch et la méthode POST
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
// après l'envoi des données on récupère l'orderId qu'on nous fournis grâce à la méthode POST puis on est redirigés
// sur la page de confirmation avec l'orderId présent dans l'url
                const orderId = data.orderId;
                window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId;
            })

    }
}

// fonction qui créé un object contenant les valeurs dont on a besoin, càd les valeurs du formulaire et les produits présent dans le panier
function sendOrder(){
    return {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: getIdFromLocal()
    };
}

// fonction qui permet de récupérer les id de chaque produit présent dans le panier puis de les enregistrer dans un array
function getIdFromLocal(){
    const ids = [];

    for (let i = 0; i < products.length; i++){
        const key = products[i].id;
        ids.push(key);
    }

    return ids;
}