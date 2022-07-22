import { localStorageHas, localStorageSave, localStorageGet,  addProduct, getNumberOfProduct, getTotalPrice, changeQuantityFromCart, removeFromCart, } from './localstorage.js';
const params = new URLSearchParams(window.location.search);
const id = params.get('_id');
