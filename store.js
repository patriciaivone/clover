
const CLOVER_KEYS = {
  cart: "clover_cart",   
  users: "clover_users",        
  session: "clover_session",   
  guestProfile: "clover_guest_profile", 
  orders: "clover_orders"        
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

function cloverReadSession(key, fallback){
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function cloverWriteSession(key, value){
  sessionStorage.setItem(key, JSON.stringify(value));
}


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

function cloverSignUp(name, email, password){
  const users = cloverGetUsers();
  if (users.some(u => u.email === email)){
    return { ok: false, error: "An account with that email already exists." };
  }
  users.push({ name, email, password });
  cloverWrite(CLOVER_KEYS.users, users);
  cloverWrite(CLOVER_KEYS.session, email);

  const guestProfile = cloverReadSession(CLOVER_KEYS.guestProfile, null);
  if (guestProfile) {
    cloverSaveProfile(guestProfile);
    sessionStorage.removeItem(CLOVER_KEYS.guestProfile);
  }

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

function cloverGetProfile(){
  const email = cloverCurrentEmail();
  if (email) return cloverRead(`clover_profile_${email}`, null);
  return cloverReadSession(CLOVER_KEYS.guestProfile, null);
}

function cloverSaveProfile(profile){
  const email = cloverCurrentEmail();
  if (email) {
    cloverWrite(`clover_profile_${email}`, profile);
  } else {
    cloverWriteSession(CLOVER_KEYS.guestProfile, profile);
  }
}

function cloverClearProfile(){
  const email = cloverCurrentEmail();
  if (email) {
    localStorage.removeItem(`clover_profile_${email}`);
  } else {
    sessionStorage.removeItem(CLOVER_KEYS.guestProfile);
  }
}

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

function cloverCompatibility(perfume){
  const profile = cloverGetProfile();
  if (!profile) return null;
  const axes = Object.keys(profile);
  const totalDiff = axes.reduce((sum, axis) => sum + Math.abs(profile[axis] - perfume.axes[axis]), 0);
  const avgDiff = totalDiff / axes.length;
  return Math.round(Math.max(0, Math.min(100, 100 - avgDiff * 10)));
}

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