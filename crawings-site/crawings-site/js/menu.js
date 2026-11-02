/* Crawings menu data — transcribed from the printed menu. Prices in INR.
   sizes: [{label, price}] ; price:null means "MRP" (billed at restaurant). */
window.CRAWINGS_MENU = [
  { id: "tacos", name: "Tacos", icon: "🌮", items: [
    { id: "fish-taco", name: "Fish Taco", sizes: [{ label: "Regular", price: 180 }] },
    { id: "chicken-taco", name: "Chicken Taco", sizes: [{ label: "Regular", price: 150 }] },
    { id: "chicken-crispy-taco", name: "Chicken Crispy Taco", sizes: [{ label: "Regular", price: 250 }] },
    { id: "chicken-cheese-burst-taco", name: "Chicken Cheese Burst Taco", sizes: [{ label: "Regular", price: 200 }] }
  ]},
  { id: "burger", name: "Burger", icon: "🍔", items: [
    { id: "chicken-zinger-burger", name: "Chicken Zinger Burger", sizes: [{ label: "Regular", price: 130 }] },
    { id: "chicken-cream-cheese-burger", name: "Chicken Cream Cheese Burger", sizes: [{ label: "Regular", price: 150 }] },
    { id: "chicken-cheese-burst-burger", name: "Chicken Cheese Burst Burger", sizes: [{ label: "Regular", price: 200 }] },
    { id: "double-chicken-burger", name: "Double Chicken Burger", sizes: [{ label: "Regular", price: 200 }] },
    { id: "fish-burger", name: "Fish Burger", sizes: [{ label: "Regular", price: 180 }] },
    { id: "double-decker-open-burger", name: "Double Decker / Open Burger", sizes: [{ label: "Regular", price: 200 }] },
    { id: "double-decker-cheese-burst", name: "Double Decker Cheese Burst", sizes: [{ label: "Regular", price: 280 }] },
    { id: "fish-cheese-burst-burger", name: "Fish Cheese Burst Burger", sizes: [{ label: "Regular", price: 270 }] }
  ]},
  { id: "wrap", name: "Wrap", icon: "🌯", items: [
    { id: "chicken-wrap-roll", name: "Chicken Wrap Roll", sizes: [{ label: "Regular", price: 160 }] },
    { id: "fish-wrap-roll", name: "Fish Wrap Roll", sizes: [{ label: "Regular", price: 180 }] },
    { id: "ccb-wrap", name: "C.C.B Wrap", sizes: [{ label: "Regular", price: 200 }] }
  ]},
  { id: "bowl", name: "Bowl", icon: "🥣", items: [
    { id: "cheese-nugget-bowl", name: "Cheese Nugget", sizes: [{ label: "Regular", price: 160 }] },
    { id: "cheese-popcorn-bowl", name: "Cheese Popcorn", sizes: [{ label: "Regular", price: 160 }] },
    { id: "nugget-chips-bowl", name: "Nugget & Chips Bowl", sizes: [{ label: "Regular", price: 220 }] },
    { id: "popcorn-chips-bowl", name: "Popcorn & Chips Bowl", sizes: [{ label: "Regular", price: 220 }] },
    { id: "fish-chips-bowl", name: "Fish & Chips Bowl", sizes: [{ label: "Regular", price: 350 }] },
    { id: "crawings-special-bowl", name: "Crawings Special Bowl", sizes: [{ label: "Regular", price: 350 }] }
  ]},
  { id: "fries", name: "Fries", icon: "🍟", items: [
    { id: "salted-fries", name: "Salted Fries", sizes: [{ label: "Medium", price: 80 }, { label: "Large", price: 160 }] },
    { id: "peri-peri-fries", name: "Peri Peri Fries", sizes: [{ label: "Medium", price: 80 }, { label: "Large", price: 160 }] },
    { id: "cheese-fries", name: "Cheese Fries", sizes: [{ label: "Medium", price: 130 }, { label: "Large", price: 250 }] }
  ]},
  { id: "quick-bite", name: "Quick Bite", icon: "🍗", items: [
    { id: "chicken-nuggets", name: "Chicken Nuggets", sizes: [{ label: "Medium (6 pcs)", price: 120 }, { label: "Large (12 pcs)", price: 240 }] },
    { id: "chicken-popcorn", name: "Chicken Popcorn", sizes: [{ label: "Medium (12 pcs)", price: 110 }, { label: "Large (24 pcs)", price: 220 }] },
    { id: "fish-nuggets", name: "Fish Nuggets", sizes: [{ label: "Medium (6 pcs)", price: 200 }, { label: "Large (12 pcs)", price: 400 }] },
    { id: "fish-fillet", name: "Fish Fillet", sizes: [{ label: "Regular", price: 300 }] },
    { id: "chicken-fillet", name: "Chicken Fillet", sizes: [{ label: "Regular", price: 100 }] },
    { id: "prawns", name: "Prawns", sizes: [{ label: "Regular", price: 320 }] }
  ]},
  { id: "extras", name: "Extras", icon: "🧀", items: [
    { id: "cheese-coin", name: "Cheese Coin", sizes: [{ label: "Medium (6 pcs)", price: 100 }, { label: "Large (12 pcs)", price: 200 }] },
    { id: "cheese-patty", name: "Cheese Patty (100 grm)", sizes: [{ label: "Regular", price: 80 }] },
    { id: "cheese-ring", name: "Cheese Ring", sizes: [{ label: "Regular", price: 70 }] },
    { id: "cheesy-dip", name: "Cheesy Dip", sizes: [{ label: "Regular", price: 20 }] },
    { id: "cheese-slice", name: "Cheese Slice", sizes: [{ label: "Regular", price: 20 }] },
    { id: "schezwan-dip", name: "Schezwan Dip", sizes: [{ label: "Regular", price: 10 }] },
    { id: "garlic-dip", name: "Garlic Dip", sizes: [{ label: "Regular", price: 10 }] },
    { id: "water-bottle", name: "Water Bottle", sizes: [{ label: "MRP", price: null }] },
    { id: "cold-drink", name: "Cold Drink", sizes: [{ label: "MRP", price: null }] }
  ]}
];

/* Add-ons offered in the customise sheet (prices from the Extras menu). */
window.CRAWINGS_ADDONS = [
  { id: "cheese-slice", name: "Cheese Slice", price: 20 },
  { id: "cheesy-dip", name: "Cheesy Dip", price: 20 },
  { id: "schezwan-dip", name: "Schezwan Dip", price: 10 },
  { id: "garlic-dip", name: "Garlic Dip", price: 10 },
  { id: "cheese-patty", name: "Cheese Patty (100 grm)", price: 80 }
];
window.CRAWINGS_ADDON_CATEGORIES = ["tacos", "burger", "wrap", "bowl", "fries", "quick-bite"];
window.CRAWINGS_SPICE = ["Regular", "Medium spicy", "Extra spicy"];
window.CRAWINGS_CONFIG = {
  whatsapp: "919898307771",
  phoneDisplay: "+91 98983 07771",
  instagram: "crawings_burger",
  address: "Popatiya Waad, Dariyapur, Ahmedabad"
};
