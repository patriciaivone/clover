/* =========================================================
   CLOVER — PRODUCT DATABASE
   Single source of truth for every perfume: price, notes, and
   the same six axes used by the preference quiz (account.js).
   cloverCompatibility() in store.js reads perfume.axes and
   compares it to the customer's saved profile, so every
   product below needs a value (0-10) on all six axes:
   fresh, sweet, woody, floral, spicy, intensity.

   cloverFindPerfume(id) is used by store.js (cart) and
   catalog.js (match %), so this file must load before both.
========================================================= */

const CLOVER_PERFUMES = [
  {
    id: "jasmine-veil",
    name: "Jasmine Veil",
    price: 850000,
    image: "img/jasmine veil.png",
    notes: "Top Bergamot · Heart Jasmine · Base Sandalwood",
    tags: "female floral popular female-floral popular-floral",
    axes: { fresh: 5, woody: 5, floral: 8, spicy: 1, gourmand: 5 }
  },
  {
    id: "rose-noir",
    name: "Rose Noir",
    price: 920000,
    image: "img/Rose noir.png",
    notes: "Top Citrus · Heart Rose · Base Vanilla",
    tags: "female floral new female-floral new-floral",
    axes: { fresh: 4, woody: 2, floral: 9, spicy: 2, gourmand: 6 }
  },
  {
    id: "sandalwood-reserve",
    name: "Sandalwood Reserve",
    price: 1150000,
    image: "img/sandalwood reserve.png",
    notes: "Top Bergamot · Heart Lavender · Base Sandalwood",
    tags: "male woody popular male-woody popular-woody",
    axes: { fresh: 4, woody: 9, floral: 2, spicy: 2, gourmand: 7 }
  },
  {
    id: "bergamot-bay",
    name: "Bergamot & Bay",
    price: 780000,
    image: "img/bergamot bay.png",
    notes: "Top Bergamot · Heart Green Tea · Base Cinnamon",
    tags: "male fresh new male-fresh new-fresh",
    axes: { fresh: 9, woody: 3, floral: 1, spicy: 4, gourmand: 4 }
  },
  {
    id: "lavender-fields",
    name: "Lavender Fields",
    price: 690000,
    image: "img/Lavender fields.png",
    notes: "Top Lemon · Heart Lavender · Base Sandalwood",
    tags: "female floral popular female-floral popular-floral",
    axes: { fresh: 7, woody: 4, floral: 6, spicy: 1, gourmand: 3 }
  },
  {
    id: "chamomile-hush",
    name: "Chamomile Hush",
    price: 730000,
    image: "img/chamomile hush.png",
    notes: "Top Green Tea · Heart Chamomile · Base Vanilla",
    tags: "female gourmand new female-gourmand new-gourmand",
    axes: { fresh: 6, woody: 2, floral: 4, spicy: 1, gourmand: 2 }
  },
  {
    id: "green-tea-study",
    name: "Green Tea Study",
    price: 810000,
    image: "img/Green tea study.png",
    notes: "Top Green Tea · Heart Lavender · Base Cinnamon",
    tags: "male fresh popular male-fresh popular-fresh",
    axes: { fresh: 8, woody: 3, floral: 3, spicy: 3, gourmand: 3 }
  },
  {
    id: "vanilla-amber",
    name: "Vanilla Amber",
    price: 970000,
    image: "img/Vanilla p.png",
    notes: "Top Citrus · Heart Jasmine · Base Vanilla",
    tags: "female gourmand popular female-gourmand popular-gourmand",
    axes: { fresh: 3, woody: 3, floral: 5, spicy: 2, gourmand: 6 }
  },
  {
    id: "lemon-spice",
    name: "Lemon Spice",
    price: 760000,
    image: "img/Lemon spice.png",
    notes: "Top Lemon · Heart Rose · Base Cinnamon",
    tags: "male spicy new male-spicy new-spicy",
    axes: { fresh: 7, woody: 2, floral: 3, spicy: 7, gourmand: 5 }
  },
  {
    id: "cinnamon-ember",
    name: "Cinnamon Ember",
    price: 890000,
    image: "img/Cinnamon ember.png",
    notes: "Top Bergamot · Heart Chamomile · Base Cinnamon",
    tags: "male spicy popular male-spicy popular-spicy",
    axes: { fresh: 3, woody: 5, floral: 2, spicy: 9, gourmand: 7 }
  },
  {
    id: "citrus-bloom",
    name: "Citrus Bloom",
    price: 705000,
    image: "img/Citrus bloom.png", 
    notes: "Top Citrus · Heart Rose · Base Sandalwood",
    tags: "female fruity new female-fruity new-fruity",
    axes: { fresh: 8, woody: 3, floral: 5, spicy: 1, gourmand: 3 }
  }
];

function cloverAllPerfumes(){
  return CLOVER_PERFUMES;
}

function cloverFindPerfume(id){
  return CLOVER_PERFUMES.find(p => p.id === id) || null;
}

function cloverFormatRp(amount){
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}
