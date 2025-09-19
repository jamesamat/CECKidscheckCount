let currentCount = 0;
let selectedCategory = '';
const maxCount = 999;

// Track totals for each category
const categoryTotals = {
    'toddler': 0,
    'preschool': 0,
    'school': 0,
    'teen': 0,
    'adult': 0
};

const categoryNames = {
    'toddler': 'Toddler (1-3 years)',
    'preschool': 'Preschool (4-5 years)', 
    'school': 'School Age (6-12 years)',
    'teen': 'Teen (13-17 years)',
    'adult': 'Adult (18+ years)'
};

// Load totals from localStorage
function loadTotals() {
    const storedTotals = localStorage.getItem('categoryTotals');
    if (storedTotals) {
        const parsedTotals = JSON.parse(storedTotals);
        Object.keys(categoryTotals).forEach(cat => {
            if (typeof parsedTotals[cat] === 'number') categoryTotals[cat] = parsedTotals[cat];
        });
    }
}

function saveTotals() {
    localStorage.setItem('categoryTotals', JSON.stringify(categoryTotals));
}

function selectCategory(category) {
    selectedCategory = category;

    // Update visual selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('border-green-400', 'bg-opacity-100');
        btn.classList.add('border-transparent');
    });

    const selectedBtn = document.getElementById(category + '-btn');
    selectedBtn.classList.add('border-green-400');
    selectedBtn.classList.remove('border-transparent');

    // Update category display
    document.getElementById('categoryDisplay').textContent = categoryNames[category];
    clearStatus();
    updateCheckInButton();
}

function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = currentCount;

    // Add animation when count changes
    display.classList.remove('pulse-animation');
    void display.offsetWidth; // Trigger reflow
    display.classList.add('pulse-animation');
    updateCheckInButton();
}

function addGuests(number) {
    if (selectedCategory === '') {
        showStatus('Please select an age category first!', 'error');
        return;
    }

    const newCount = currentCount + number;

    if (newCount > maxCount) {
        showStatus(`Maximum ${maxCount} guests allowed!`, 'error');
        return;
    }

    currentCount = newCount;
    updateDisplay();
    clearStatus();
}

function clearCounter() {
    currentCount = 0;
    updateDisplay();
    clearStatus();
}

function submitGuests() {
    if (selectedCategory === '') {
        showStatus('Please select an age category first!', 'error');
        return;
    }

    if (currentCount === 0) {
        showStatus('Please add guests first!', 'error');
        return;
    }

    // Add to category total
    categoryTotals[selectedCategory] += currentCount;
    updateSummary();
    saveTotals();

    // Show success message
    showStatus(`✅ ${currentCount} ${categoryNames[selectedCategory]} guest(s) checked in!`, 'success');

    // Auto-clear after 3 seconds
    setTimeout(() => {
        clearCounter();
        clearStatus();
    }, 3000);
}

function updateSummary() {
    // Update each category total
    for (const category in categoryTotals) {
        document.getElementById(`summary-${category}`).textContent = categoryTotals[category];
    }

    // Calculate and update grand total
    const total = Object.values(categoryTotals).reduce((sum, count) => sum + count, 0);
    document.getElementById('summary-total').textContent = total;
}

function showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;

    if (type === 'success') {
        statusElement.className = 'mt-4 text-center text-sm font-semibold h-6 text-green-600';
    } else if (type === 'error') {
        statusElement.className = 'mt-4 text-center text-sm font-semibold h-6 text-red-600';
    } else if (type === 'processing') {
        statusElement.className = 'mt-4 text-center text-sm font-semibold h-6 text-purple-600';
    }
}

function clearStatus() {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = '';
}

function updateCheckInButton() {
    const btn = document.getElementById('checkin-btn');
    btn.disabled = selectedCategory === '' || currentCount === 0;
    if (btn.disabled) {
        btn.classList.add('opacity-50');
    } else {
        btn.classList.remove('opacity-50');
    }
}

function clearAllTotals() {
    if (confirm("Are you sure you want to reset today's summary?")) {
        for (let cat in categoryTotals) categoryTotals[cat] = 0;
        updateSummary();
        saveTotals();
        showStatus('All totals cleared!', 'success');
    }
}

// Initialize display and summary on load
window.addEventListener('DOMContentLoaded', () => {
    loadTotals();
    updateSummary();
    updateDisplay();
    updateCheckInButton();
});