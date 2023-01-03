/**
 * Attention, do you like Typescript?
 * Just rename this file from .js to .ts and enjoy Type Safety.
 */

import "./styles/reset.css";
import "./styles/main.css";
import { getCheckout } from "./getCheckout";

/**
 * @description Object to handle business logic on the checkout.
 */
let checkout;
const superLiteVirtualDOM = {};

/**
 * @description Setup the checkout object. Taking values from query params to easy debug.
 */
function init() {
  ({ checkout } = getCheckout());
  const queryParams = new URLSearchParams(window.location.search);

  // Scan only the items in the cart
  queryParams.forEach((value, key) => {
    const [id] = key.split('_');
    const quantity = Number(value || '0');

    checkout.scan(id, quantity);
  });
}

function render(element, value, attr = 'innerHTML') {
  if (superLiteVirtualDOM[element] === value) {
    return;
  }

  const $element = document.getElementById(element)
  if ($element) {
    $element[attr] = value
    superLiteVirtualDOM[element] = value
  }
}

/**
 * @description Update all the cart
 * and checkout data
 */
 function updateCheckout() {
  updateCartRows();
  updateTotalWithDiscount();
  updateDiscounts();
  updateTotal();
}

function updateCartRows() {
  const cartProducts = checkout.getCartItems();

  cartProducts.forEach(({ id, total, quantity }) => {
    render(`${id}_total`, total + " €")
    render(`${id}_quantity`, quantity?.toString(), 'value')
  })
}

function updateTotalWithDiscount() {
  render('checkout_finalTotal', checkout.total() + " €")
}

function updateDiscounts() {
  const cartProducts = checkout.getCartItems();
  const productsWithDiscount = cartProducts.filter(({ totalDiscount }) => totalDiscount > 0)

  if (productsWithDiscount.length > 0) {
    const discountContent = productsWithDiscount.map(({ id, quantity, name, totalDiscount }) => {
      return `<li>
      <span>x${quantity} ${name} offer</span>
      <span id="${id}_discount">- ${totalDiscount} €</span>
      </li>`
    }).join('')
    const newContent = `
      <h2>Discounts</h2>
      <ul>${discountContent}</ul>
    `;
    render('checkout_discounts', newContent)
  } else {
    render('checkout_discounts', '')
  }
}

/**
 * @description Update total HTML nodes to display quantity 
 *  selected and total price before promotions
 */
 function updateTotal() {
  render('checkout_total', checkout.totalGross() + " €")
  render('checkout_quantity', checkout.totalQuantities() + " Items")
}

/**
 * @description Bind UI buttons
 */
function bindButtons() {
  
  const cartProducts = checkout.getCartItems();

  // Bind only using products from the cart
  cartProducts.forEach(({ id }) => {
    // Bind substract button.
    document
      .getElementById(`${id}_substract`)
      ?.addEventListener("click", substract);

    // Bind add button.
    document.getElementById(`${id}_add`)?.addEventListener("click", add);

    
    // Bind quantity input.
    document
    .getElementById(`${id}_quantity`)
    ?.addEventListener("change", onChangeInput);

    // Bind see more link.
    document.getElementById(`${id}_detail`)?.addEventListener("click", detail);

  })

  // Bind close product.
  document.getElementById('product-detail-close')?.addEventListener("click", close);

  function detail(event) {
    event.preventDefault();
    
    const currentTarget = event.currentTarget;
    const [id] = currentTarget?.id.split("_");
    const { price, name } = checkout.getCartItems().find(product => product.id === id);

    const $container = document.getElementById('product-detail-container')
    const $productImage = document.getElementById('product-image')

    render('product-detail-code', id, 'innerText')
    render('product-detail-price', `${price}€`, 'innerText')
    render('product-detail-name', name, 'innerText')
    $container.style.display = 'flex'
    $productImage.style.backgroundImage = `url(/${id}.jpg)`
  }

  function close(event) {
    event.preventDefault();
    const $container = document.getElementById('product-detail-container')
    $container.style.display = 'none'
  }

  function substract(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const [id] = currentTarget?.id.split("_");
    const input = document.getElementById(`${id}_quantity`)
    const quantity = Number(input?.value);
    if (quantity > 1) {
      checkout.scan(id, quantity - 1)
      updateCheckout();
    }
  }
  
  function add(event) {
    event.preventDefault();
    const target = event.target;
    const [id] = target?.id.split("_");
  
    checkout.scan(id)
    updateCheckout();
  }

  function onChangeInput(event) {
    const currentTarget = event.currentTarget;
  
    const [id] = currentTarget.id.split("_");
    checkout.scan(id, Number(currentTarget.value))
    updateCheckout();
  }
}

/**
 * @description Run the application.
 */
function run() {
  // Init values
  init();

  // Put values
  updateCheckout();

  // Bind buttons
  bindButtons();
}

run();
