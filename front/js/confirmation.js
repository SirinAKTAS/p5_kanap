// Récupération du "orderId" dans l'URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

// Insertion de l'orderId sur la page confirmation
const orderIdElement = document.getElementById("orderId")
orderIdElement.textContent = orderId
