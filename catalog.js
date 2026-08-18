/* =========================================================
   CATALOG PAGE
   Renders each product's match % (from the preference quiz
   on account.html) and wires the Add to cart buttons.
   Requires products.js and store.js to be loaded first.
========================================================= */

function renderMatchBadges(){
  const hasProfile = !!cloverGetProfile();
  document.querySelectorAll(".product-match").forEach(el => {
    const id = el.dataset.matchFor;
    const perfume = cloverFindPerfume(id);
    if (!perfume) return;

    if (!hasProfile){
      el.innerHTML = `<a href="account.html">Take the preference test</a> to see your match`;
      el.classList.add("product-match--empty");
      return;
    }

    const score = cloverCompatibility(perfume);
    el.classList.remove("product-match--empty");
    el.innerHTML = `<span class="match-dot"></span>${score}% match`;
    el.classList.toggle("product-match--high", score >= 75);
  });
}

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    cloverAddToCart(btn.dataset.addId, 1);
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });
});

renderMatchBadges();