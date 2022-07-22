/**
 *
 * On vérifie que la clé existe dans le localStorage
 *
 * @param {String} key
 * @return {Boolean}
 */
 function localStorageHas(key) {
    const item = localStorage.getItem(key);
    return ( item !== null );
}

/**
 *
 * On enregistre les valeurs dans le localStorage
 *
 * @param {String} key
 * @param {any} value
 */
function localStorageSave(key, value) {
    if (value === undefined) throw new Error("Can't store undefined value");

    if (typeof(value) === 'object') {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
    console.log('Object has been added to LS!')
}

/**
 *
 * On récupère un objet du localStorage.
 *
 * @param {String} key
 * @return {Object}
 */
function localStorageGet(key) {
    const product = localStorage.getItem(key);

    if (!product) return;
    if ( product[0] === '{' || product[0] === '[' ) return JSON.parse(product);

    return product;
}


/**
 * 
 * On ajoute le produit au panier
 * 
 */
function addProduct(product){
    let cart = localStorageGet();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined){
        foundProduct.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorageSave(key, value);
}


/**
 * 
 * On supprime le produit du panier
 * 
 */
function removeFromCart(product){
    let cart = localStorageGet();
    cart = cart.filter(p => p.id != product.id);
    localStorageSave(key, value);
}


/**
 * 
 * On modifie la quantity d'un produit du panier
 * 
 */
function changeQuantityFromCart(product){
    let cart = localStorageGet();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined){
        foundProduct.quantity += quantity;
        if(foundProduct.quantity <= 0){
            removeFromCart(product);
        } else {
            localStorageSave(key, value);
        }
    }
}


/**
 * 
 * On récupère le nombre de produit dans le panier 
 * 
 */
function getNumberOfProduct(){
    let cart = localStorageGet();
    let number = 0;
    for (let product of cart){
        number += product.quantity;
    }
    return number;
}


/**
 * 
 * On calcule le prix total
 * 
 */
function getTotalPrice(){
    let cart = localStorageGet();
    let total = 0;
    for (let product of cart){
        total += product.quantity * product.price;
    }
    return total;
}


/**
 *
 * On exporte les fonctions
 *
 */
export { localStorageHas, localStorageSave, localStorageGet, addProduct, getNumberOfProduct, getTotalPrice, changeQuantityFromCart, removeFromCart, };
