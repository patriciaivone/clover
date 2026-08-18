
const noteCards = document.querySelectorAll('.note-card');
const noteFamily = document.getElementById('noteFamily');
const noteName = document.getElementById('noteName');
const noteDesc = document.getElementById('noteDesc');

function showNote(card) {
  noteCards.forEach((c) => c.classList.remove('is-active'));
  card.classList.add('is-active');
  noteFamily.textContent = card.dataset.family || 'Fragrance Note';
  noteName.textContent = card.dataset.name || '';
  noteDesc.textContent = card.dataset.desc || '';
}

noteCards.forEach((card) => {
  card.addEventListener('mouseenter', () => showNote(card));
  card.addEventListener('focus', () => showNote(card));
  card.addEventListener('click', () => showNote(card));
});

const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

const signupForm = document.getElementById('signupForm');
const signupNote = document.getElementById('signupNote');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    if (email) {
      signupNote.textContent = `Thanks — we'll be in touch at ${email}.`;
      signupForm.reset();
    }
  });
}

const filterEls = document.querySelectorAll('[data-filter]');
const productCards = document.querySelectorAll('.product-card');
const catalogEmpty = document.getElementById('catalogEmpty');

function applyFilter(filter) {
  filterEls.forEach((el) => el.classList.remove('is-active'));
  document.querySelectorAll(`[data-filter="${filter}"]`).forEach((el) => el.classList.add('is-active'));

  let visibleCount = 0;
  productCards.forEach((card) => {
    const tags = (card.dataset.tags || '').split(' ');
    const show = filter === 'all' || tags.includes(filter);
    card.style.display = show ? '' : 'none';
    if (show) visibleCount += 1;
  });

  if (catalogEmpty) {
    catalogEmpty.hidden = visibleCount !== 0;
  }
}

if (filterEls.length && productCards.length) {
  filterEls.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') e.preventDefault();
      applyFilter(el.dataset.filter);
    });
  });

  applyFilter('all');
}
