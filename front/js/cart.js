const key = 'Products';
let cart = JSON.parse(localStorage.getItem(key));
console.log(cart);

// ************* Affichage Produit ***********

const zoneProducts = document.getElementById('cart__items');

if(cart === null){
    const emptyCart = ` 
    <div class="cartAndFormContainer">
    <h2>Votre panier est vide, merci d'ajouter au moins un article pour qu'on puisse passer à la commande.</h2>
    </div>`
    zoneProducts.innerHTML = emptyCart;
} else {
    let cartStructure = [];
    let i = Number;
    for ( i = 0; i < cart.length; i++ ){

        fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if(res.ok){
                return res.json();
            }
        })
        .then(function(product) {
            console.log(product);
            displayProductData(product);
        })
        .catch(function(err){
            // Une erreur est survenue
        });


        cartStructure = cartStructure + ` <article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].colors}">
        <div class="cart__item__img">
          <img src="" alt="">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${cart[i].name}</h2>
            <p>${cart[i].colors}</p>
            <p id="productPrice"></p>
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
      </article> `;
    
    console.log(cart[i].id);
    console.log(cart[i].colors);
    console.log(i);
    }

    if ( i === cart.length) {
        zoneProducts.innerHTML = cartStructure;
    }


};


function displayProductData(product) {
    let imageAlt = document.querySelector("article div.cart__item__img");
    let productPrice = document.getElementById('productPrice');

    imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productPrice.textContent = `${product.price}`;

}

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

