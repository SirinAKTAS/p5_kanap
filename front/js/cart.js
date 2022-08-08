const key = 'Products';
let cart = JSON.parse(localStorage.getItem(key));

// ************* Affichage Produit, localstorage vide ***********

const zoneProducts = document.getElementById('cart__items');


showWhenEmpty();



// On a besoin de récupérer la donnée des éléments situés dans le panier
const arrayIds = cart.map(product => product.id);
console.log(arrayIds);

let results = await Promise.all(
    arrayIds.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
);

if(!cart || cart === 0){
    showWhenEmpty()
} else {
    let cartStructure = '';

    for (let i = 0; i < cart.length; i++) {
        cartStructure += `
            <article class="cart__item" data-id="${cart[i].id}" data-colors="${cart[i].colors}" data-price="${results[i].price}">
                <div class="cart__item__img">
                  <img src="${cart[i].imageUrl}" alt="${cart[i].altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${cart[i].name}</h2>
                    <p>${cart[i].colors}</p>
                    <p>${results[i].price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
        `;
    }

    zoneProducts.innerHTML = cartStructure;
}
// ******************* Modifier la quantité depuis le panier ******************

const itemsQuantity = document.querySelectorAll('.itemQuantity');
itemsQuantity.forEach((itemQuantity, i) => {
    itemQuantity.addEventListener('change', (e) => {
        if (isNaN(itemQuantity.value) || itemQuantity.value <= 0){
            itemQuantity.value = 1;
        }

        cart[i].quantity = Number(itemQuantity.value);
        localStorage.setItem(key, JSON.stringify(cart));

        computeTotalPrice();
        computeTotalQuantity();
    })
});

function computeTotalPrice() {
    let getCartTotalPrice = [];

    for ( let j = 0; j < cart.length; j++ ){
        let cartPrice = results[j].price*cart[j].quantity;
        getCartTotalPrice.push(cartPrice);
    }
    
    const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;
    const totalPrice = getCartTotalPrice.reduce(reducerPrice, 0);
    
    let showTotalPrice = document.getElementById('totalPrice');
    showTotalPrice.textContent = totalPrice;
}

function computeTotalQuantity() {
    let getCartTotalKanap = [];

    for ( let m = 0; m < cart.length; m++ ){
    
        let cartTotalKanap = cart[m].quantity;
        getCartTotalKanap.push(cartTotalKanap);
    }
    
    const reducerQuantity = (accumulator, currentValue) => accumulator + currentValue;
    const totalQuantity = getCartTotalKanap.reduce(reducerQuantity, 0);
    
    let showTotalQuantity = document.getElementById('totalQuantity');
    showTotalQuantity.textContent = totalQuantity;
}


function showWhenEmpty(){
    zoneProducts.innerHTML = ` 
        <div class="cartAndFormContainer">
            <h2>Votre panier est vide, merci d'ajouter au moins un article pour qu'on puisse passer à la commande.</h2>
        </div>
    `;
    let showTotalPrice = document.getElementById('totalPrice');
    showTotalPrice.textContent = 0;
    let showTotalQuantity = document.getElementById('totalQuantity');
    showTotalQuantity.textContent = 0;
}
// ******************* Supprimer un Kanap du panier ***************
let deleteButton = document.querySelectorAll('.deleteItem');

for (let k = 0; k < deleteButton.length; k++) {
    deleteButton[k].addEventListener("click", (e) => {
        
        const article = deleteButton[k].closest('article');

        cart = cart.filter( kanap => kanap.id !== cart[k].id || kanap.colors !== cart[k].colors);

        localStorage.setItem(key, JSON.stringify(cart));
        alert('Votre Kanap a bien été supprimé !');
        article.remove();
        
        computeTotalPrice();
        computeTotalQuantity();

    })
};


computeTotalPrice();
computeTotalQuantity();







// *************** Formulaire ***************/

let form = document.querySelector('#formOrder');
// **************** Validation Prenom ****************


form.firstName.addEventListener('change', function() {
    validFirstName(this);
});

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

form.lastName.addEventListener('change', function() {
    validLastName(this);
});

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

form.address.addEventListener('change', function() {
    validAddress(this);
});

const validAddress = function() {
    let addressRegExp = /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]+(\,)?/;
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

form.city.addEventListener('change', function() {
    validCity(this);
});

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

form.email.addEventListener('change', function() {
    validEmail(this);
});

const validEmail = function() {
    let emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
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


buttonOrder.addEventListener('click', (e) => {
    localStorage.removeItem(key);
    e.preventDefault();
    
    submitButton();
});

function submitButton() {
    const form = document.querySelector('.cart__order__form');
    const body = sendOrder();
    if (cart.length === 0) {
        alert('Le panier est vide');
    }

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        },
        })
    .then((res) => res.json())
    .then((data) => console.log(data))
    

}


function sendOrder(){
    let body = { 
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value    
            },
            products: getIdFromLocal()
        }
    return body
};

function getIdFromLocal(){
    const ids = [];
    for (let i = 0; i < cart.length; i++){
        const key = cart[i].id;
        ids.push(key);
        console.log(key);
    }
    return ids
}