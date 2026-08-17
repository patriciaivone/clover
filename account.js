/* =========================================================
   ACCOUNT PAGE
   Three things live here: demo sign in/up (store.js), order
   history for the logged-in user, and the preference quiz
   that powers match % everywhere else on the site.
========================================================= */

/* ---------- Auth tabs ---------- */
document.querySelectorAll(".auth-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab === "signin" ? "signinForm" : "signupForm2").classList.add("active");
  });
});

document.getElementById("signinForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("siEmail").value.trim();
  const password = document.getElementById("siPassword").value;
  const result = cloverLogIn(email, password);
  if (!result.ok){
    document.getElementById("signinError").textContent = result.error;
    return;
  }
  refreshAccountView();
});

document.getElementById("signupForm2").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("suName").value.trim();
  const email = document.getElementById("suEmail").value.trim();
  const password = document.getElementById("suPassword").value;
  const result = cloverSignUp(name, email, password);
  if (!result.ok){
    document.getElementById("signupError").textContent = result.error;
    return;
  }
  refreshAccountView();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  cloverLogOut();
  refreshAccountView();
});

/* ---------- Signed-in / signed-out view + order history ---------- */
function refreshAccountView(){
  const user = cloverCurrentUser();
  document.getElementById("loggedOutView").style.display = user ? "none" : "block";
  document.getElementById("loggedInView").style.display = user ? "block" : "none";

  if (user){
    document.getElementById("acctName").textContent = user.name;
    document.getElementById("acctEmail").textContent = user.email;
    renderOrderHistory();
  }
  renderQuizArea(); // profile key changes between guest/user, so re-render
}

function renderOrderHistory(){
  const orders = cloverGetOrders();
  const el = document.getElementById("orderHistory");
  if (orders.length === 0){
    el.innerHTML = `<p class="muted">No orders yet — they'll show up here after a demo checkout.</p>`;
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-row">
      <div>
        <div>${o.items.map(i => i.name).join(", ")}</div>
        <div class="oid">${o.id} · ${new Date(o.date).toLocaleDateString()}</div>
      </div>
      <strong>${cloverFormatRp(o.total)}</strong>
    </div>
  `).join("");
}

/* Each question targets exactly one of the six axes used by
   perfume.axes in products.js (fresh, sweet, woody, floral,
   spicy, intensity), scored 1-9 to match that same scale.
   That way the finished quiz *is* a compatibility profile —
   no separate mapping step needed before saving it. */
const questions = [
  {
    axis: "fresh",
    question: "How fresh and clean do you want your fragrance to feel?",
    answers: [
      {text:"Not fresh at all — I prefer warm, cozy scents", value:1},
      {text:"Just a little freshness is nice", value:3},
      {text:"Balanced — some freshness works", value:5},
      {text:"Pretty fresh and crisp", value:7},
      {text:"Very fresh, like a cool breeze", value:9}
    ]
  },
  {
    axis: "woody",
    question: "Do you gravitate toward woody, earthy scents?",
    answers: [
      {text:"Not really my thing", value:1},
      {text:"A subtle woody base is nice", value:3},
      {text:"A moderate woody feel", value:5},
      {text:"I love a strong woody presence", value:7},
      {text:"Give me deep, resinous wood", value:9}
    ]
  },
  {
    axis: "floral",
    question: "How floral do you want your fragrance to be?",
    answers: [
      {text:"No florals for me", value:1},
      {text:"A touch of flowers is fine", value:3},
      {text:"A balanced floral heart", value:5},
      {text:"I want it noticeably floral", value:7},
      {text:"Full bouquet, very floral", value:9}
    ]
  },
  {
    axis: "spicy",
    question: "Do you enjoy warm, spicy notes?",
    answers: [
      {text:"Not spicy at all", value:1},
      {text:"Just a whisper of spice", value:3},
      {text:"A moderate amount of spice", value:5},
      {text:"I like it noticeably spicy", value:7},
      {text:"Bold and fiery spice", value:9}
    ]
  },
  {
    axis: "gourmand",
    question: "How strong do you want the fragrance to project?",
    answers: [
      {text:"Very subtle, barely there", value:1},
      {text:"Light and soft", value:3},
      {text:"Noticeable but not overwhelming", value:5},
      {text:"Strong, I want it to last", value:7},
      {text:"Maximum intensity", value:9}
    ]
  }
];

const AXIS_ORDER = ["fresh", "woody", "floral", "spicy", "gourmand"];

let currentQuestionIndex = 0;
let score = {};

/* Called on load and whenever login state changes. If a profile
   is already saved (guest or logged-in), show it instead of
   forcing a restart; otherwise start the quiz fresh. */
function renderQuizArea() {
  const existingProfile = cloverGetProfile();
  if (existingProfile) {
    showResult(existingProfile);
  } else {
    startQuiz();
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = {};
  displayQuestion();
}

function displayQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question-text").textContent = q.question;

  const answerContainer = document.getElementById("answer-buttons");
  answerContainer.classList.remove("results-list");
  answerContainer.innerHTML = "";

  q.answers.forEach(function(answer) {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.addEventListener("click", function() {
      selectAnswer(q.axis, answer.value);
    });
    answerContainer.appendChild(button);
  });
}

function selectAnswer(axis, value) {
  score[axis] = value;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    cloverSaveProfile(score);
    showResult(score);
  }
}

function showResult(profile) {
  document.getElementById("question-text").textContent = "Your scent profile";

  const answerContainer = document.getElementById("answer-buttons");
  answerContainer.innerHTML = "";
  answerContainer.classList.add("results-list");

  AXIS_ORDER.forEach(axis => {
    const val = profile[axis] ?? 0;
    const pct = Math.round((val / 9) * 100);
    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
      <div class="result-row-top">
        <span class="result-label">${axis}</span>
        <span class="result-count">${val}/9</span>
      </div>
      <div class="result-bar-track">
        <div class="result-bar-fill" style="width:${pct}%"></div>
      </div>
    `;
    answerContainer.appendChild(row);
  });

  const retakeBtn = document.createElement("button");
  retakeBtn.type = "button";
  retakeBtn.className = "btn btn-ghost btn-small retake-btn";
  retakeBtn.textContent = "Retake test";
  retakeBtn.addEventListener("click", startQuiz);
  answerContainer.appendChild(retakeBtn);
}

refreshAccountView();