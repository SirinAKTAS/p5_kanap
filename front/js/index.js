fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(products) {
        console.log(products);
        displayProducts(products);
    })
    .catch(function(err) {
        // Une erreur est survenue
    });

function displayProducts(products) {
    let content =  '';
    let zoneProducts = document.getElementById('items');

    for (let product of products) {
        content += `<a href="./product.html?_id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
    }

    zoneProducts.innerHTML = content;
}