
const checkoutContainer = document.getElementById("checkoutContainer");
const checkoutEmpty = document.getElementById("checkoutEmpty");
const checkoutConfirmation = document.getElementById("checkoutConfirmation");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");
const placeOrderBtn = document.getElementById("placeOrderBtn");

function renderSummary() {
  const items = cloverCartDetailed();

  if (items.length === 0) {
    checkoutContainer.hidden = true;
    checkoutEmpty.hidden = false;
    return false;
  }

  checkoutContainer.hidden = false;
  checkoutEmpty.hidden = true;

  const summaryItems = document.getElementById("summaryItems");
  summaryItems.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "summary-item";
    row.innerHTML = `
      <div class="summary-item-image"><img src="${item.image}" alt="${item.name}"></div>
      <div>
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty">Qty ${item.qty}</div>
      </div>
      <div class="summary-item-total">${cloverFormatRp(item.lineTotal)}</div>
    `;
    summaryItems.appendChild(row);
  });

  const subtotal = cloverCartSubtotal();
  document.getElementById("summarySubtotal").textContent = cloverFormatRp(subtotal);
  document.getElementById("summaryTotal").textContent = cloverFormatRp(subtotal);

  return true;
}

function prefillShipping() {
  const user = cloverCurrentUser();
  if (!user) return;
  document.getElementById("shipName").value = user.name || "";
  document.getElementById("shipEmail").value = user.email || "";
  document.getElementById("cardName").value = user.name || "";
}

const cardNumberInput = document.getElementById("cardNumber");
cardNumberInput.addEventListener("input", () => {
  const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
  cardNumberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

const cardExpiryInput = document.getElementById("cardExpiry");
cardExpiryInput.addEventListener("input", () => {
  let digits = cardExpiryInput.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) digits = digits.slice(0, 2) + "/" + digits.slice(2);
  cardExpiryInput.value = digits;
});

const cardCvvInput = document.getElementById("cardCvv");
cardCvvInput.addEventListener("input", () => {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 4);
});


function validateCheckout() {
  const required = [
    "shipName", "shipEmail", "shipAddress", "shipCity", "shipPostal",
    "cardName", "cardNumber", "cardExpiry", "cardCvv"
  ];

  for (const id of required) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      return `Please fill in the "${el.previousElementSibling.textContent}" field.`;
    }
  }

  const cardDigits = cardNumberInput.value.replace(/\D/g, "");
  if (cardDigits.length !== 16) {
    return "Card number should be 16 digits (this is a demo — any 16 digits work).";
  }

  if (!/^\d{2}\/\d{2}$/.test(cardExpiryInput.value)) {
    return "Expiry date should be in MM/YY format.";
  }

  if (cardCvvInput.value.length < 3) {
    return "CVV should be 3 or 4 digits.";
  }

  return null;
}

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkoutError.textContent = "";

  const errorMsg = validateCheckout();
  if (errorMsg) {
    checkoutError.textContent = errorMsg;
    return;
  }

  const shipName = document.getElementById("shipName").value.trim();

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing payment…";

  setTimeout(() => {
    const order = cloverPlaceOrder();
    showConfirmation(order, shipName);
  }, 1100);
});

function showConfirmation(order, shipName) {
  checkoutContainer.hidden = true;
  checkoutEmpty.hidden = true;
  checkoutConfirmation.hidden = false;

  document.getElementById("confirmName").textContent = shipName ? `, ${shipName}` : "";
  document.getElementById("confirmOrderId").textContent = order.id;
  document.getElementById("confirmTotal").textContent = cloverFormatRp(order.total);
}

/* ---------- Init ---------- */
const hadItems = renderSummary();
if (hadItems) prefillShipping();