// API Configuration
const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const startBtn = document.getElementById('startBtn');
const startLetterSelect = document.getElementById('startLetter');
const checkedCountEl = document.getElementById('checkedCount');
const availableCountEl = document.getElementById('availableCount');
const takenCountEl = document.getElementById('takenCount');
const percentageEl = document.getElementById('percentage');
const resultsList = document.getElementById('resultsList');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const checkingStatus = document.getElementById('checkingStatus');
const webhookInput = document.getElementById('webhook');
const saveWebhookBtn = document.querySelector('.btn-save');

// State
let isChecking = false;
let stats = {
    checked: 0,
    available: 0,
    taken: 0
};

// Sample usernames for demonstration
const sampleUsernames = [
    'a', 'ab', 'abc', 'test', 'user', 'admin', 'root',
    'john', 'jane', 'xyz', 'hello', 'world', 'cool',
    'ninja', 'pro', 'elite', 'dark', 'shadow'
];

// Initialize event listeners
function init() {
    startBtn.addEventListener('click', handleStartChecking);
    saveWebhookBtn.addEventListener('click', handleSaveWebhook);
    loadStats();
}

// Handle start checking button
async function handleStartChecking() {
    if (isChecking) return;

    isChecking = true;
    startBtn.disabled = true;
    startBtn.textContent = 'CHECKING...';
    checkingStatus.textContent = 'Checking...';
    checkingStatus.classList.add('checking');
    resultsList.innerHTML = '';
    resultsPlaceholder.style.display = 'none';

    try {
        const startLetter = startLetterSelect.value;
        const usernamesToCheck = filterUsernames(startLetter);

        // Check usernames
        for (const username of usernamesToCheck) {
            if (!isChecking) break; // Allow stopping

            try {
                const response = await fetch(`${API_BASE}/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                const result = await response.json();

                if (result.checked) {
                    stats.checked++;
                    if (result.available) {
                        stats.available++;
                        addResultItem(username, true);
                    } else {
                        stats.taken++;
                    }
                }

                updateStats();
                await sleep(100); // Rate limiting
            } catch (error) {
                console.error(`Error checking ${username}:`, error);
            }
        }
    } catch (error) {
        console.error('Error during checking:', error);
    } finally {
        isChecking = false;
        startBtn.disabled = false;
        startBtn.textContent = 'START CHECKING';
        checkingStatus.textContent = 'Idle';
        checkingStatus.classList.remove('checking');
    }
}

// Filter usernames by starting letter
function filterUsernames(startLetter) {
    if (!startLetter) {
        return sampleUsernames;
    }
    return sampleUsernames.filter(name => name.toLowerCase().startsWith(startLetter.toLowerCase()));
}

// Add result item to the list
function addResultItem(username, isAvailable) {
    if (!isAvailable) return;

    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `<span class="username-text">${username}</span>`;
    resultsList.appendChild(item);

    resultsPlaceholder.style.display = 'none';
}

// Update statistics display
function updateStats() {
    checkedCountEl.textContent = stats.checked;
    availableCountEl.textContent = stats.available;
    takenCountEl.textContent = stats.taken;

    const percentage = stats.checked > 0 ? ((stats.available / stats.checked) * 100).toFixed(2) : 0;
    percentageEl.textContent = percentage + '%';
}

// Load statistics from API
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const data = await response.json();
        stats = {
            checked: data.checked,
            available: data.available,
            taken: data.taken
        };
        updateStats();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Handle save webhook
function handleSaveWebhook() {
    const webhookUrl = webhookInput.value;
    if (webhookUrl) {
        localStorage.setItem('discordWebhook', webhookUrl);
        alert('Webhook URL saved!');
    }
}

// Load webhook from storage
function loadWebhook() {
    const saved = localStorage.getItem('discordWebhook');
    if (saved) {
        webhookInput.value = saved;
    }
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadWebhook();
});
