fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(products) {
        console.log(products);
        displayCartProducts(products);
    })
    .catch(function(err) {
        // Une erreur est survenue
    });

