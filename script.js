// --- Data Configuration ---
const topNotes = ["Strawberry", "Coconut", "Whipped Cream", "Sweet Mango", "Blood Orange", "Green Apple", "Grapefruit", "Pink Pepper", "Lemon", "Passion Fruit"];
const middleNotes = ["Marshmallow", "Orange Blossom", "Water Lily", "Pine", "Saffron", "Cardamom", "Lavender", "Sandalwood"];
const baseNotes = ["Vanilla", "Musk", "Coffee", "Blueberry", "Chocolate"];

// Ingredients that cost extra
const premiumIngredients = ["Saffron", "Sandalwood", "Musk"]; 

// --- State Management ---
let cart = {
    bottleName: null,
    bottlePrice: 0,
    size: null,
    sizePrice: 0,
    topNote: null,
    midNote: null,
    baseNote: null,
    extraCost: 0
};

// --- Rendering Functions ---
function renderBubbles(list, containerId, category) {
    const container = document.getElementById(containerId);
    list.forEach(item => {
        const isPremium = premiumIngredients.includes(item);
        
        // Premium Cost (INR)
        const premiumCostINR = 99;

        const div = document.createElement('div');
        div.className = 'option-card';
        
        // Tag logic
        const premiumTag = isPremium ? `<div class="premium-tag">+₹${premiumCostINR}</div>` : '';
        
        // Placeholder Image Logic (Using text for now)
        const imgSrc = `https://placehold.co/100x100/orange/white?text=${item.substring(0,3)}`;

        div.innerHTML = `
            ${premiumTag}
            <img src="${imgSrc}" class="bubble-img" alt="${item}">
            <div class="option-name">${item}</div>
        `;
        
        const cost = isPremium ? premiumCostINR : 0;
        div.onclick = () => selectNote(category, item, cost, div);
        container.appendChild(div);
    });
}

// Initialize UI on Load
document.addEventListener('DOMContentLoaded', () => {
    renderBubbles(topNotes, 'top-notes-container', 'topNote');
    renderBubbles(middleNotes, 'middle-notes-container', 'midNote');
    renderBubbles(baseNotes, 'base-notes-container', 'baseNote');
});

// --- Selection Logic ---

function selectBottle(name, price, element) {
    cart.bottleName = name;
    cart.bottlePrice = price; 
    highlightSelection(element);
    updateTotal();
}

function selectQty(size, price, element) {
    cart.size = size;
    cart.sizePrice = price; 
    
    // Remove selected class from all quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('selected-btn'));
    // Add to clicked button
    element.classList.add('selected-btn');
    
    updateTotal();
}

function selectNote(category, name, cost, element) {
    cart[category] = { name: name, cost: cost }; 
    highlightSelection(element);
    updateTotal();
}

function highlightSelection(element) {
    // Remove 'selected' from siblings
    const siblings = element.parentElement.children;
    for (let sib of siblings) sib.classList.remove('selected');
    // Add to clicked element
    element.classList.add('selected');
}

// --- Calculation Engine ---
function updateTotal() {
    // 1. Calculate Base in INR
    let totalINR = cart.sizePrice + cart.bottlePrice;

    // 2. Add Ingredient Costs (INR)
    if (cart.topNote) totalINR += cart.topNote.cost;
    if (cart.midNote) totalINR += cart.midNote.cost;
    if (cart.baseNote) totalINR += cart.baseNote.cost;

    // 3. Convert to USD just for reference (Approx 86 rate)
    let totalUSD = (totalINR / 86).toFixed(2);

    // 4. Update UI
    const formatINR = (num) => num.toLocaleString('en-IN');

    document.getElementById('total-price-inr').innerText = "₹" + formatINR(totalINR);
    document.getElementById('total-price-usd').innerText = "(approx $" + totalUSD + ")";
    
    // Update Summary Text
    document.getElementById('summ-bottle').innerText = cart.bottleName ? `Bottle: ${cart.bottleName}` : "Bottle: -";
    document.getElementById('summ-qty').innerText = cart.size ? `Size: ${cart.size}ml` : "Size: -";
    
    let notesCount = 0;
    if (cart.topNote) notesCount++;
    if (cart.midNote) notesCount++;
    if (cart.baseNote) notesCount++;
    document.getElementById('summ-notes').innerText = `Notes: ${notesCount}/3`;
}

function checkout() {
    if (!cart.size || !cart.bottleName || !cart.topNote || !cart.midNote || !cart.baseNote) {
        alert("Please complete all 5 steps to create your perfume!");
        return;
    }
    const finalPrice = document.getElementById('total-price-inr').innerText;
    alert(`Order Placed!\n\nBlend: ${cart.size}ml ${cart.bottleName}\nTop Note: ${cart.topNote.name}\nHeart Note: ${cart.midNote.name}\nBase Note: ${cart.baseNote.name}\n\nTotal Cost: ${finalPrice}`);
}