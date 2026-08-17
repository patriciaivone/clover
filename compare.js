const COMPARE_AXES = ["fresh", "woody", "floral", "spicy", "gourmand"];
const COMPARE_AXIS_MAX = 10;

const perfumeSelect1 = document.getElementById("perfume1Select");
const perfumeSelect2 = document.getElementById("perfume2Select");
const compareCard1 = document.getElementById("card1");
const compareCard2 = document.getElementById("card2");

function populatePerfumeSelect(selectEl) {
  cloverAllPerfumes().forEach(perfume => {
    const option = document.createElement("option");
    option.value = perfume.id;
    option.textContent = perfume.name;
    selectEl.appendChild(option);
  });
}

function placeholderCardHTML() {
  return `
    <div class="compare-placeholder">
        <span class="placeholder-mark">?</span>
        <p>Pick a perfume to see its profile</p>
    </div>`;
}

function filledCardHTML(perfume) {
  const profile = cloverGetProfile();
  const matchScore = profile ? cloverCompatibility(perfume) : null;

  const axisRowsHTML = COMPARE_AXES.map(axis => {
    const value = perfume.axes[axis] ?? 0;
    const percent = Math.round((value / COMPARE_AXIS_MAX) * 100);
    return `
      <div class="axis-row">
        <div class="axis-row-top">
          <span class="axis-label">${axis}</span>
          <span class="axis-value">${value}/${COMPARE_AXIS_MAX}</span>
        </div>
        <div class="axis-track"><div class="axis-fill" style="width:${percent}%"></div></div>
      </div>`;
  }).join("");

  const matchHTML = profile
    ? `<div class="compare-match">
         <span class="match-pct">${matchScore}%</span>
         <span class="match-label">match for you</span>
       </div>`
    : `<div class="compare-match compare-match--empty">
         <a href="account.html">Take the preference test</a> to see your match
       </div>`;

  return `
    <div class="compare-filled">
        <div class="compare-image"><img src="${perfume.image}" alt="${perfume.name}"></div>
        <h3 class="compare-name">${perfume.name}</h3>
        <p class="compare-notes">${perfume.notes}</p>
        <p class="compare-price">${cloverFormatRp(perfume.price)}</p>
        <div class="axis-list">${axisRowsHTML}</div>
        ${matchHTML}
    </div>`;
}

function renderCompareCard(cardEl, perfumeId) {
  const perfume = perfumeId ? cloverFindPerfume(perfumeId) : null;
  cardEl.innerHTML = perfume ? filledCardHTML(perfume) : placeholderCardHTML();
  cardEl.classList.toggle("compare-card--filled", !!perfume);
  cardEl.classList.remove("compare-card--winner");
}

function highlightBetterMatch() {
  const profile = cloverGetProfile();
  const perfume1 = cloverFindPerfume(perfumeSelect1.value);
  const perfume2 = cloverFindPerfume(perfumeSelect2.value);

  if (!profile || !perfume1 || !perfume2) return;

  const match1 = cloverCompatibility(perfume1);
  const match2 = cloverCompatibility(perfume2);

  if (match1 === match2) return;
  const winningCard = match1 > match2 ? compareCard1 : compareCard2;
  winningCard.classList.add("compare-card--winner");
}

function refreshCompareView() {
  renderCompareCard(compareCard1, perfumeSelect1.value);
  renderCompareCard(compareCard2, perfumeSelect2.value);
  highlightBetterMatch();
}

populatePerfumeSelect(perfumeSelect1);
populatePerfumeSelect(perfumeSelect2);

perfumeSelect1.addEventListener("change", refreshCompareView);
perfumeSelect2.addEventListener("change", refreshCompareView);

refreshCompareView();