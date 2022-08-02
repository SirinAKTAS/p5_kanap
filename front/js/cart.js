const key = 'Products';
let cart = JSON.parse(localStorage.getItem(key));
console.log(cart);

// ************* Affichage Produit ***********

const zoneProducts = document.getElementById('cart__items');
const arrayIds = cart.map(product => product.id);

// On a besoin de récupérer la donnée des éléments situés dans le panier
let results = await Promise.all(
    arrayIds.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
);

if(!cart || cart == 0){
    zoneProducts.innerHTML = ` 
        <div class="cartAndFormContainer">
            <h2>Votre panier est vide, merci d'ajouter au moins un article pour qu'on puisse passer à la commande.</h2>
        </div>
    `;
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
                    <p>${results[i].price*cart[i].quantity} €</p>
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


// ******************* Supprimer un Kanap du panier ***************
let deleteButton = document.querySelectorAll('.deleteItem');
console.log(deleteButton);

for (let k = 0; k < deleteButton.length; k++){

    deleteButton[k].addEventListener("click", (e) => {
        e.preventDefault();

        let deleteById = cart[k].id;
        let deleteByColors = cart[k].colors;
        console.log('ID du produit supprimé est le suivant :',deleteById);
        console.log('La couleur du produit supprimé est le suivant :',deleteByColors);
        
        cart = cart.filter( kanap => kanap.id !== deleteById || kanap.colors !== deleteByColors);
        console.log('Le nouveau panier est le suivant :',cart);

        localStorage.setItem(key, JSON.stringify(cart));
        alert('Votre Kanap a bien été supprimé !');
        window.location.href = "cart.html";
    })
};





// ******************* Modifier la quantité depuis le panier ******************

let itemQuantity = document.querySelectorAll('.itemQuantity');
console.log(itemQuantity);


itemQuantity.addEventListener("change", (e) => {

})



// ******************* Avoir le prix total du panier ***********************


let getCartTotalPrice = [];

for ( let j = 0; j < cart.length; j++ ){

    let cartPrice = results[j].price*cart[j].quantity;
    getCartTotalPrice.push(cartPrice);
    console.log('Le prix de ce produit est de :',cartPrice);
}

const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;
const totalPrice = getCartTotalPrice.reduce(reducerPrice, 0);
console.log('Le prix total est de',totalPrice);

let showTotalPrice = document.getElementById('totalPrice');
showTotalPrice.textContent = totalPrice;



// ******************* Avoir le nombre d'article total du panier ***************

let getCartTotalKanap = [];

for ( let m = 0; m < cart.length; m++ ){

    let cartTotalKanap = cart[m].quantity;
    getCartTotalKanap.push(cartTotalKanap);
    console.log('la quantité de ce produit est de :',cartTotalKanap);
}

const reducerQuantity = (accumulator, currentValue) => accumulator + currentValue;
const totalQuantity = getCartTotalKanap.reduce(reducerQuantity, 0);
console.log('la quantité Total est de', totalQuantity);

let showTotalQuantity = document.getElementById('totalQuantity');
showTotalQuantity.textContent = totalQuantity;





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
        emailErrorMsg.innerHTML ='Adresse Email Valide';
        emailErrorMsg.classList.remove('msg-invalide');
        emailErrorMsg.classList.add('msg-valide');
        return true;
    } else {
        emailErrorMsg.innerHTML ='Adresse Email Non Valide';
        emailErrorMsg.classList.remove('msg-valide');
        emailErrorMsg.classList.add('msg-invalide');
        return false;
    }
};


// **************** Passer la commande ******************


function postForm (){
    const buttonOrder = document.getElementById('order');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');

  

    /**    buttonOrder.addEventListener('click', () => {
                let contact = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    address: address.value,
                    city: city.value,
                    email: email.value
                };
    })
     **/
}