// Game data
const games = [
    {
        id: "free-fire",
        name: "Free Fire",
        icon: "fas fa-gun",
        color: "orange",
    },
    {
        id: "bgmi",
        name: "BGMI",
        icon: "fas fa-tank",
        color: "yellow",
    },
    {
        id: "cod",
        name: "Call of Duty",
        icon: "fas fa-crosshairs",
        color: "red",
    },
    {
        id: "valorant",
        name: "Valorant",
        icon: "fas fa-shield",
        color: "pink",
    }
];

// In-memory storage for listings
let listings = [];
let currentListingId = 1;
let currentGameFilter = 'all';

// Navigation
function navigateTo(section, gameId = null) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    if (section === 'browse') {
        if (gameId) {
            currentGameFilter = gameId;
            updateGameFilters();
        }
        loadListings();
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Initialize theme from localStorage
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.remove('dark');
}

// Update game filters
function updateGameFilters() {
    document.querySelectorAll('.game-filter').forEach(filter => {
        filter.classList.toggle('active', filter.dataset.game === currentGameFilter);
    });

    const game = currentGameFilter === 'all' ? null : games.find(g => g.id === currentGameFilter);
    document.getElementById('browse-title').textContent = game ? game.name + ' Accounts' : 'All Games';
}

// Format price to INR
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Load and render listings
function loadListings() {
    const listingsContainer = document.getElementById('listings-container');
    const minLevel = parseInt(document.getElementById('min-level').value);
    const maxLevel = parseInt(document.getElementById('max-level').value);

    const filteredListings = listings.filter(listing => 
        listing.active &&
        (currentGameFilter === 'all' || listing.game === currentGameFilter) &&
        listing.level >= minLevel &&
        listing.level <= maxLevel
    );

    listingsContainer.innerHTML = filteredListings.map(listing => {
        const game = games.find(g => g.id === listing.game);
        return `
            <div class="game-card listing-card">
                <div class="game-card-title">
                    <i class="${game.icon}" style="color: ${game.color}"></i>
                    ${listing.title}
                </div>
                <p class="listing-description">${listing.description}</p>
                <div class="listing-details">
                    <span class="level">Level ${listing.level}</span>
                    <span class="price">${formatPrice(listing.price)}</span>
                </div>
                <button class="primary-btn" onclick="purchaseListing(${listing.id})">
                    Purchase
                </button>
            </div>
        `;
    }).join('');

    if (filteredListings.length === 0) {
        listingsContainer.innerHTML = `
            <div class="no-listings">
                <p>No listings found matching your criteria.</p>
            </div>
        `;
    }
}

// Apply filters
function applyFilters() {
    loadListings();
}

// Handle sell form submission
function handleSellSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listing = {
        id: currentListingId++,
        title: formData.get('title'),
        description: formData.get('description'),
        game: formData.get('game'),
        price: parseInt(formData.get('price')),
        level: parseInt(formData.get('level')),
        active: true
    };

    listings.push(listing);
    alert('Listing created successfully!');
    event.target.reset();
    navigateTo('browse');
}

// Purchase listing
function purchaseListing(id) {
    const listing = listings.find(l => l.id === id);
    if (listing && listing.active) {
        listing.active = false;
        alert('Purchase successful! The seller will contact you with the details.');
        loadListings();
    }
}

// Initialize game filter buttons
function initGameFilters() {
    document.querySelectorAll('.game-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            currentGameFilter = filter.dataset.game;
            updateGameFilters();
            loadListings();
        });
    });
}

// Initialize the application
function init() {
    initGameFilters();
    updateGameFilters();

    // Add sample listings
    if (listings.length === 0) {
        listings.push({
            id: currentListingId++,
            title: "Level 50 Free Fire Account",
            description: "Rare skins and items included",
            game: "free-fire",
            price: 2500,
            level: 50,
            active: true
        });
        listings.push({
            id: currentListingId++,
            title: "Pro BGMI Account",
            description: "Multiple legendary items",
            game: "bgmi",
            price: 3500,
            level: 75,
            active: true
        });
    }

    loadListings();
}
