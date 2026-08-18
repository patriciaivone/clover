
const CLOVER_KEYS = {
  cart: "clover_cart",           // [{ id, qty }]
  users: "clover_users",         // [{ name, email, password }]
  session: "clover_session",     // email of logged-in user, or null
  guestProfile: "clover_guest_profile", // preference axes, when not logged in
  orders: "clover_orders"        // [{ id, email, items, total, date }]
};

function cloverRead(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function cloverWrite(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- CART ---------------- */

function cloverGetCart(){
  return cloverRead(CLOVER_KEYS.cart, []);
}

function cloverSaveCart(cart){
  cloverWrite(CLOVER_KEYS.cart, cart);
  cloverUpdateCartBadge();
}

function cloverAddToCart(id, qty = 1){
  const cart = cloverGetCart();
  const line = cart.find(l => l.id === id);
  if (line){ line.qty += qty; }
  else { cart.push({ id, qty }); }
  cloverSaveCart(cart);
}

function cloverSetQty(id, qty){
  let cart = cloverGetCart();
  if (qty <= 0){
    cart = cart.filter(l => l.id !== id);
  } else {
    const line = cart.find(l => l.id === id);
    if (line) line.qty = qty;
  }
  cloverSaveCart(cart);
}

function cloverRemoveFromCart(id){
  cloverSaveCart(cloverGetCart().filter(l => l.id !== id));
}

function cloverClearCart(){
  cloverSaveCart([]);
}

function cloverCartDetailed(){
  return cloverGetCart().map(line => {
    const p = cloverFindPerfume(line.id);
    if (!p) return null; // product removed from catalog since it was added
    return { ...p, qty: line.qty, lineTotal: +(p.price * line.qty).toFixed(2) };
  }).filter(Boolean);
}

function cloverCartCount(){
  return cloverGetCart().reduce((n, l) => n + l.qty, 0);
}

function cloverCartSubtotal(){
  return +cloverCartDetailed().reduce((sum, l) => sum + l.lineTotal, 0).toFixed(2);
}

function cloverUpdateCartBadge(){
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const n = cloverCartCount();
  badge.textContent = n;
  badge.style.display = n > 0 ? "inline-flex" : "none";
}

/* ---------------- DEMO ACCOUNT ---------------- */

function cloverGetUsers(){
  return cloverRead(CLOVER_KEYS.users, []);
}

function cloverCurrentEmail(){
  return cloverRead(CLOVER_KEYS.session, null);
}

function cloverCurrentUser(){
  const email = cloverCurrentEmail();
  if (!email) return null;
  return cloverGetUsers().find(u => u.email === email) || null;
}

/* Returns { ok: true } or { ok: false, error: "message" } */
function cloverSignUp(name, email, password){
  const users = cloverGetUsers();
  if (users.some(u => u.email === email)){
    return { ok: false, error: "An account with that email already exists." };
  }
  users.push({ name, email, password });
  cloverWrite(CLOVER_KEYS.users, users);
  cloverWrite(CLOVER_KEYS.session, email);

  // If the visitor took the preference quiz as a guest, carry that
  // profile over to their new account instead of losing it.
  const guestProfile = cloverRead(CLOVER_KEYS.guestProfile, null);
  if (guestProfile) cloverSaveProfile(guestProfile);

  return { ok: true };
}

function cloverLogIn(email, password){
  const user = cloverGetUsers().find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: "Incorrect email or password." };
  cloverWrite(CLOVER_KEYS.session, email);
  return { ok: true };
}

function cloverLogOut(){
  localStorage.removeItem(CLOVER_KEYS.session);
}

/* ---------------- PREFERENCE PROFILE ---------------- */
/* Stored per logged-in user; falls back to a guest slot so the
   quiz still works before someone creates an account. */

function cloverProfileKey(){
  const email = cloverCurrentEmail();
  return email ? `clover_profile_${email}` : CLOVER_KEYS.guestProfile;
}

function cloverGetProfile(){
  return cloverRead(cloverProfileKey(), null);
}

function cloverSaveProfile(profile){
  cloverWrite(cloverProfileKey(), profile);
}

function cloverClearProfile(){
  localStorage.removeItem(cloverProfileKey());
}

/* ---------------- ORDERS (demo) ---------------- */

function cloverPlaceOrder(){
  const items = cloverCartDetailed();
  const order = {
    id: "CLV-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    email: cloverCurrentEmail() || "guest",
    items,
    total: cloverCartSubtotal(),
    date: new Date().toISOString()
  };
  const orders = cloverRead(CLOVER_KEYS.orders, []);
  orders.push(order);
  cloverWrite(CLOVER_KEYS.orders, orders);
  cloverClearCart();
  return order;
}

function cloverGetOrders(){
  const orders = cloverRead(CLOVER_KEYS.orders, []);
  const email = cloverCurrentEmail();
  if (!email) return [];
  return orders.filter(o => o.email === email).reverse();
}

/* ---------------- COMPATIBILITY MATH ---------------- */
/* Same approach as the standalone compare demo: average the
   absolute difference across the six axes, convert to a 0–100
   match score. Returns null if no preference profile exists yet. */

function cloverCompatibility(perfume){
  const profile = cloverGetProfile();
  if (!profile) return null;
  const axes = Object.keys(profile);
  const totalDiff = axes.reduce((sum, axis) => sum + Math.abs(profile[axis] - perfume.axes[axis]), 0);
  const avgDiff = totalDiff / axes.length;
  return Math.round(Math.max(0, Math.min(100, 100 - avgDiff * 10)));
}

/* ---------------- RUN ON EVERY PAGE ---------------- */
function cloverHighlightActiveNav(){
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".header nav a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === current);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cloverUpdateCartBadge();
  cloverHighlightActiveNav();
});