// Game constants
const LEVELS = [
    { score: 0, title: 'Курсант', image: 'assets/Goose.png' },
    { score: 100, title: 'Лейтенант Гусь', image: 'assets/Goose2.png' },
    { score: 1000, title: 'Капитан Пернатый', image: 'assets/Goose3.png' },
    { score: 5000, title: 'Галактический Командор', image: 'assets/Goose4.png' },
];

// Goose images for visual change every 30 points
const GOOSE_IMAGES = [
    'assets/Goose.png',
    'assets/Goose2.png',
    'assets/Goose3.png',
    'assets/Goose4.png',
];

const ACHIEVEMENTS = [
    { id: 'first_click', title: 'Первый шаг!', description: 'Сделайте первое нажатие' },
    { id: 'level_1', title: 'Новичок', description: 'Достигните 1 уровня' },
    { id: 'level_2', title: 'Бывалый', description: 'Достигните 2 уровня' },
    { id: 'level_3', title: 'Профессионал', description: 'Достигните 3 уровня' },
    { id: 'level_4', title: 'Легенда', description: 'Достигните 4 уровня' },
    { id: 'hundred_clicks', title: 'Сто разок', description: 'Сделайте 100 нажатий' },
    { id: 'thousand_clicks', title: 'Тысячник', description: 'Сделайте 1000 нажатий' },
];

// Game state
let gameState = {
    score: 0,
    level: 0,
    achievements: [],
    totalClicks: 0,
    firstClick: false,
    backendRegistered: false
};

// DOM elements
const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $level = document.querySelector('#level');
const $achievementToast = document.querySelector('#achievement-toast');
const $achievementText = $achievementToast ? $achievementToast.querySelector('.achievement-text') : null;

// Audio elements
const clickSound = document.getElementById('clickSound');
const levelUpSound = document.getElementById('levelUpSound');
const achievementSound = document.getElementById('achievementSound');

// Initialize game
function init() {
    loadGame();
    render();
    setupEventListeners();
}

// Load game state from localStorage
function loadGame() {
    const savedState = localStorage.getItem('cosmoGooseGame');
    if (savedState) {
        try {
            gameState = { ...gameState, ...JSON.parse(savedState) };
        } catch (e) {
            console.error('Failed to load game state', e);
        }
    }
}

// Save game state to localStorage
function saveGame() {
    try {
        localStorage.setItem('cosmoGooseGame', JSON.stringify({
            score: gameState.score,
            level: gameState.level,
            achievements: gameState.achievements,
            totalClicks: gameState.totalClicks,
            firstClick: gameState.firstClick,
            backendRegistered: gameState.backendRegistered
        }));
    } catch (e) {
        console.error('Failed to save game state', e);
    }
}

// Try to get user context from Telegram WebApp or URL params
function getUserContext() {
    try {
        const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            return { userId: user.id, username: user.username || (user.first_name + '_' + (user.last_name || '')) };
        }
    } catch (e) {
        console.warn('Telegram WebApp context not available', e);
    }
    // Fallback to query params: ?userId=..&username=..
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const username = params.get('username');
    if (userId) {
        return { userId: Number(userId), username: username || 'guest' };
    }
    return null;
}

// Register first tap on backend if possible (idempotent on client-side)
async function registerFirstTapIfNeeded() {
    if (gameState.backendRegistered) return;
    const ctx = getUserContext();
    if (!ctx || !ctx.userId) return;
    try {
        const url = `/game/tap/${encodeURIComponent(ctx.userId)}?username=${encodeURIComponent(ctx.username || 'guest')}`;
        const res = await fetch(url, { method: 'POST' });
        if (res.ok) {
            gameState.backendRegistered = true;
            saveGame();
        } else {
            console.warn('Backend tap registration failed', res.status);
        }
    } catch (e) {
        console.warn('Backend tap registration error', e);
    }
}

// Update score and check for level up
function addScore(points = 1) {
    gameState.score += points;
    gameState.totalClicks += 1;
    
    // Check for level up
    const newLevel = getCurrentLevel();
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        levelUp();
    }
    
    // Check for achievements
    checkAchievements();
    
    saveGame();
    render();
}

// Get current level based on score
function getCurrentLevel() {
    let level = 0;
    for (let i = 0; i < LEVELS.length; i++) {
        if (gameState.score >= LEVELS[i].score) {
            level = i;
        } else {
            break;
        }
    }
    return level;
}

// Handle level up
function levelUp() {
    const currentLevel = LEVELS[gameState.level];
    showAchievement(`Уровень ${gameState.level + 1} разблокирован!`, currentLevel.title);
    
    // Play level up sound
    if (levelUpSound) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Update goose image
    if ($circle) {
        $circle.setAttribute('src', currentLevel.image);
    }
    
    // Add level achievement
    const achievementId = `level_${gameState.level}`;
    if (!hasAchievement(achievementId)) {
        addAchievement(achievementId);
    }
}

// Check for new achievements
function checkAchievements() {
    // First click achievement
    if (!gameState.firstClick) {
        gameState.firstClick = true;
        addAchievement('first_click');
        // fire-and-forget backend registration
        registerFirstTapIfNeeded();
    }
    
    // Click count achievements
    if (gameState.totalClicks === 100 && !hasAchievement('hundred_clicks')) {
        addAchievement('hundred_clicks');
    } else if (gameState.totalClicks === 1000 && !hasAchievement('thousand_clicks')) {
        addAchievement('thousand_clicks');
    }
}

function addAchievement(achievementId) {
    if (hasAchievement(achievementId)) return;
    
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;
    
    gameState.achievements.push(achievementId);
    showAchievement('Достижение разблокировано!', achievement.title);
    
    // Play achievement sound
    if (achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    saveGame();
}

// Check if achievement is already earned
function hasAchievement(achievementId) {
    return gameState.achievements.includes(achievementId);
}

// Show achievement toast
function showAchievement(title, description) {
    if (!$achievementToast || !$achievementText) return;
    
    $achievementText.textContent = `${title} ${description}`;
    $achievementToast.classList.add('show');
    
    setTimeout(() => {
        $achievementToast.classList.remove('show');
    }, 3000);
}

// Update UI
function render() {
    if ($score) $score.textContent = gameState.score;
    if ($level) $level.textContent = gameState.level + 1;
    
    // Update goose image based on level
    if ($circle) {
        // Change image every 30 points, capped by available images
        const idx = Math.min(Math.floor(gameState.score / 30), GOOSE_IMAGES.length - 1);
        $circle.setAttribute('src', GOOSE_IMAGES[idx]);
    }
}

// Handle click/tap on goose
function handleClick(event) {
    // Play click sound
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Add tilt animation
    const rect = $circle.getBoundingClientRect();
    let clientX = event.clientX;
    let clientY = event.clientY;
    // Touch support
    if (clientX == null || clientY == null) {
        if (event.touches && event.touches[0]) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else if (event.changedTouches && event.changedTouches[0]) {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
        }
    }
    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;
    const DEG = 20;
    
    $circle.style.setProperty('--tiltX', `${(offsetY / rect.height) * DEG}deg`);
    $circle.style.setProperty('--tiltY', `${(offsetX / rect.width) * -DEG}deg`);
    
    setTimeout(() => {
        $circle.style.setProperty('--tiltX', '0deg');
        $circle.style.setProperty('--tiltY', '0deg');
    }, 200);
    
    // Add +1 popup
    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one');
    plusOne.textContent = '+1';
    plusOne.style.left = `${(clientX ?? rect.left + rect.width/2) - rect.left}px`;
    plusOne.style.top = `${(clientY ?? rect.top + rect.height/2) - rect.top}px`;
    
    $circle.parentNode.appendChild(plusOne);
    
    setTimeout(() => {
        plusOne.remove();
    }, 1500);
    
    // Add score
    addScore(1);
}

// Set up event listeners
function setupEventListeners() {
    if ($circle) {
        $circle.addEventListener('click', handleClick);
    }
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Handle touch events for mobile
    if ('ontouchstart' in window) {
        $circle.addEventListener('touchstart', handleClick, { passive: true });
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);