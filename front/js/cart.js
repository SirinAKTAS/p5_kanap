// ************* Affichage Produit ***********
let cart = JSON.parse(localStorage.getItem("Products"));
console.log(cart);
const zoneProducts = document.getElementById('cart__items');
const cartPageName = document.getElementById('cartPageName');

if(cart === null){
    cartPageName.innerHTML = "Votre panier est vide, merci d'ajouter au moins un kanap.";
} else {
    cartPageName.innerHTML = "Votre panier"
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

