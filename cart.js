function renderCart() {
  const items = cloverCartDetailed();
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p class='cart-empty'>Your cart is empty.</p>";
    document.getElementById("cart-total").textContent = "";
    return;
  }

  items.forEach(function(item) {
    const card = document.createElement("article");
    card.className = "cart-card";

    card.innerHTML = `
      <div class="cart-card-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-card-info">
        <h3 class="cart-card-name">${item.name}</h3>
        <p class="cart-card-notes">${item.notes}</p>
        <p class="cart-card-price">${cloverFormatRp(item.price)}</p>
      </div>

      <div class="cart-card-controls">
        <div class="qty-stepper">
          <button class="qty-btn qty-decrease" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>

      <p class="cart-card-linetotal">${cloverFormatRp(item.lineTotal)}</p>
    `;

    container.appendChild(card);
  });

  document.getElementById("cart-total").textContent =
    "Total: " + cloverFormatRp(cloverCartSubtotal());
}

container_events();

function container_events() {
  const container = document.getElementById("cart-items");

  container.addEventListener("click", function(e) {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("remove-btn")) {
      cloverRemoveFromCart(id);
      renderCart();
    }

    if (e.target.classList.contains("qty-increase")) {
      const currentQty = cloverGetCart().find(l => l.id === id).qty;
      cloverSetQty(id, currentQty + 1);
      renderCart();
    }

    if (e.target.classList.contains("qty-decrease")) {
      const currentQty = cloverGetCart().find(l => l.id === id).qty;
      cloverSetQty(id, currentQty - 1);
      renderCart();
    }
  });
}

renderCart();