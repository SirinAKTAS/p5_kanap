const params = new URLSearchParams(window.location.search);
const id = params.get('_id');
console.log(id);

fetch("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(products){
        console.log(products);
        displayProductData(products);
    })
    .catch(function(err){
        // Une erreur est survenue
    });

function displayProductData(products){
    let imageAlt = document.querySelector("article div.item__img");
    let titre = document.getElementById('title');
    let prix = document.getElementById('price');
    let description = document.getElementById('description');
    let couleurOption = document.getElementById('colors');
    
    for(let product of products){
        if (id === product._id) {
            imageAlt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
            titre.textContent = `${product.name}`;
            prix.textContent = `${product.price}`;
            description.textContent = `${product.description}`;
        }
        for(let couleur of product.colors){
            couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
        }
    }
}