// Game constants
const COLORS = ['#8a8ffe', '#5f63f2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96f2d7'];
const PARTICLE_COUNT = 10;

const LEVELS = [
    { score: 0, title: 'Курсант', image: '../assets/Goose.png' },
    { score: 100, title: 'Лейтенант Гусь', image: '../assets/Goose2.png' },
    { score: 1000, title: 'Капитан Пернатый', image: '../assets/Goose3.png' },
    { score: 5000, title: 'Галактический Командор', image: '../assets/Goose4.png' },
];

// Goose images for visual change every 30 points
const GOOSE_IMAGES = [
    '../assets/Goose.png',
    '../assets/Goose2.png',
    '../assets/Goose3.png',
    '../assets/Goose4.png',
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
const $progressBar = document.querySelector('#progressBar');
const $progressText = document.querySelector('#progressText');
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

// Register first tap on backend if needed
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
    const newLevel = getCurrentLevel();
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        levelUp();
    }
    updateProgressBar();
    checkAchievements();
    saveGame();
    render();
}

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

function getNextLevelScore() {
    const nextLevel = Math.min(gameState.level + 1, LEVELS.length - 1);
    return LEVELS[nextLevel].score;
}

function updateProgressBar() {
    if (!$progressBar || !$progressText) return;

    const currentLevel = gameState.level;
    const currentScore = gameState.score;
    const currentLevelScore = LEVELS[currentLevel].score;
    const nextLevelScore = currentLevel < LEVELS.length - 1 ? LEVELS[currentLevel + 1].score : currentLevelScore;

    // Если это максимальный уровень, показываем 100%
    if (currentLevel >= LEVELS.length - 1) {
        $progressBar.style.width = '100%';
        $progressText.textContent = 'MAX';
        return;
    }

    const progress = (currentScore - currentLevelScore) / (nextLevelScore - currentLevelScore) * 100;
    const roundedProgress = Math.min(100, Math.max(0, Math.round(progress * 10) / 10));

    $progressBar.style.width = `${roundedProgress}%`;
    $progressText.textContent = `${currentScore - currentLevelScore}/${nextLevelScore - currentLevelScore}`;

    // Меняем цвет в зависимости от заполненности
    if (roundedProgress > 70) {
        $progressBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
    } else if (roundedProgress > 30) {
        $progressBar.style.background = 'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)';
    } else {
        $progressBar.style.background = 'linear-gradient(90deg, #8a8ffe 0%, #5f63f2 100%)';
    }
}

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
        
        // Add level up animation
        $circle.style.animation = 'bounce 0.5s ease-in-out';
        setTimeout(() => {
            $circle.style.animation = '';
        }, 500);
    }
    
    // Add level up achievement
    const achievementId = `level_${gameState.level}`;
    if (!hasAchievement(achievementId)) {
        addAchievement(achievementId);
    }
    
    // Create level up particles
    if ($circle) {
        const rect = $circle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Create more particles for level up
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createParticle(
                    x + (Math.random() - 0.5) * 50,
                    y + (Math.random() - 0.5) * 50
                );
            }, i * 50);
        }
    }
    
    // Update progress bar
    updateProgressBar();
}

function checkAchievements() {
    if (!gameState.firstClick) {
        gameState.firstClick = true;
        addAchievement('first_click');
        registerFirstTapIfNeeded();
    }
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
    if (achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(e => console.log('Audio play failed:', e));
    }
    saveGame();
}

function hasAchievement(achievementId) {
    return gameState.achievements.includes(achievementId);
}

function showAchievement(title, description) {
    if (!$achievementToast || !$achievementText) return;
    $achievementText.textContent = `${title} ${description}`;
    $achievementToast.classList.add('show');
    setTimeout(() => {
        $achievementToast.classList.remove('show');
    }, 3000);
}

function render() {
    if ($score) $score.textContent = gameState.score.toLocaleString();
    if ($level) $level.textContent = gameState.level + 1;
    if ($circle) {
        const idx = Math.min(Math.floor(gameState.score / 30), GOOSE_IMAGES.length - 1);
        $circle.setAttribute('src', GOOSE_IMAGES[idx]);
    }
    updateProgressBar();
}

function createParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        createParticle(x, y);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 3 and 8 pixels
    const size = Math.random() * 5 + 3;
    
    // Random color from our palette
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Set particle styles
    Object.assign(particle.style, {
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
        animationDuration: `${Math.random() * 0.5 + 0.5}s`,
        opacity: Math.random() * 0.5 + 0.5
    });
    
    // Add to DOM
    document.body.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    
    Object.assign(effect.style, {
        left: `${x}px`,
        top: `${y}px`
    });
    
    document.body.appendChild(effect);
    
    // Remove after animation completes
    setTimeout(() => {
        effect.remove();
    }, 500);
}

function animateGoose() {
    if ($circle) {
        $circle.classList.add('goose-click');
        
        // Remove the class after animation completes
        setTimeout(() => {
            $circle.classList.remove('goose-click');
        }, 300);
    }
}

function handleClick(event) {
    // Prevent default to avoid any unwanted behavior
    event.preventDefault();
    
    // Get click position
    const x = event.clientX;
    const y = event.clientY;
    
    // Create visual effects
    createClickEffect(x, y);
    createParticles(x, y, PARTICLE_COUNT);
    animateGoose();
    
    // Play click sound
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Add score
    addScore(1);
    
    // Create +1 text effect
    createPlusOne(x, y);
}

function createPlusOne(x, y) {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = '+1';
    
    // Random position around the click
    const offsetX = (Math.random() - 0.5) * 50;
    const offsetY = (Math.random() - 0.5) * 50;
    
    Object.assign(plusOne.style, {
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
        fontSize: `${Math.random() * 10 + 16}px`,
        opacity: 0.8 + Math.random() * 0.2
    });
    
    document.body.appendChild(plusOne);
    
    // Remove after animation completes
    setTimeout(() => {
        plusOne.remove();
    }, 1500);
}

function setupEventListeners() {
    if ($circle) {
        $circle.addEventListener('click', handleClick);
    }
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    if ('ontouchstart' in window) {
        $circle.addEventListener('touchstart', handleClick, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', init);
