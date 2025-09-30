// Game constants
const COLORS = ['#8a8ffe', '#5f63f2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96f2d7'];
const PARTICLE_COUNT = 8;
const POINTS_PER_CLICK = 1;

const LEVELS = [
    { score: 0, title: 'Курсант', image: 'assets/Goose.png' },
    { score: 100, title: 'Лейтенант Гусь', image: 'assets/Goose2.png' },
    { score: 500, title: 'Капитан Пернатый', image: 'assets/Goose3.png' },
    { score: 2000, title: 'Командор Крякер', image: 'assets/Goose4.png' },
    { score: 5000, title: 'Генерал Гагаринский', image: 'assets/Goose5.png' },
    { score: 10000, title: 'Маршал Космических Войск', image: 'assets/Goose6.png' },
];

const ACHIEVEMENTS = [
    { id: 'first_click', title: 'Первый шаг!', description: 'Сделайте первое нажатие' },
    { id: 'level_1', title: 'Новичок', description: 'Достигните 1 уровня' },
    { id: 'level_2', title: 'Бывалый', description: 'Достигните 2 уровня' },
    { id: 'level_3', title: 'Профессионал', description: 'Достигните 3 уровня' },
    { id: 'level_4', title: 'Эксперт', description: 'Достигните 4 уровня' },
    { id: 'level_5', title: 'Легенда', description: 'Достигните 5 уровня' },
    { id: 'hundred_clicks', title: 'Сто разок', description: 'Сделайте 100 нажатий' },
    { id: 'thousand_clicks', title: 'Тысячник', description: 'Сделайте 1000 нажатий' },
    { id: 'ten_thousand_clicks', title: 'Десятитысячник', description: 'Сделайте 10000 нажатий' },
];

// Game state
let gameState = {
    score: 0,
    level: 0,
    achievements: [],
    totalClicks: 0,
    firstClick: false
};

// DOM elements
const $circle = document.querySelector('.goose-img');
const $score = document.querySelector('.score');
const $level = document.querySelector('.level');
const $progressBar = document.querySelector('.progress-bar');
const $progressText = document.querySelector('.progress-text');
const $achievementToast = document.querySelector('.achievement-toast');

// Initialize game
function init() {
    loadGame();
    render();
    setupEventListeners();
    
    if (!gameState.firstClick) {
        setTimeout(() => {
            showAchievement('Добро пожаловать!', 'Кликните по гусю, чтобы начать игру');
        }, 1000);
    }
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
            firstClick: gameState.firstClick
        }));
    } catch (e) {
        console.error('Failed to save game state', e);
    }
}

// Update score and check for level up
function addScore(points = POINTS_PER_CLICK) {
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

function updateProgressBar() {
    if (!$progressBar || !$progressText) return;
    
    const currentLevel = gameState.level;
    const currentScore = gameState.score;
    const currentLevelScore = LEVELS[currentLevel].score;
    const nextLevelScore = currentLevel < LEVELS.length - 1 ? LEVELS[currentLevel + 1].score : currentLevelScore;
    
    if (currentLevel >= LEVELS.length - 1) {
        $progressBar.style.width = '100%';
        $progressText.textContent = 'MAX';
        return;
    }
    
    const progress = ((currentScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
    const roundedProgress = Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
    
    $progressBar.style.width = `${roundedProgress}%`;
    $progressText.textContent = `${(currentScore - currentLevelScore).toLocaleString()}/${(nextLevelScore - currentLevelScore).toLocaleString()}`;
    
    if (roundedProgress > 70) {
        $progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
    } else if (roundedProgress > 30) {
        $progressBar.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
    } else {
        $progressBar.style.background = 'linear-gradient(90deg, #8a8ffe, #5f63f2)';
    }
}

function levelUp() {
    const currentLevel = LEVELS[gameState.level];
    showAchievement(`Уровень ${gameState.level + 1} разблокирован!`, currentLevel.title);
    
    if ($circle) {
        $circle.src = currentLevel.image;
        
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
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createParticle(
                    x + (Math.random() - 0.5) * 50,
                    y + (Math.random() - 0.5) * 50
                );
            }, i * 50);
        }
    }
}

function checkAchievements() {
    if (!gameState.firstClick) {
        gameState.firstClick = true;
        addAchievement('first_click');
    }
    
    if (gameState.totalClicks === 100 && !hasAchievement('hundred_clicks')) {
        addAchievement('hundred_clicks');
    } else if (gameState.totalClicks === 1000 && !hasAchievement('thousand_clicks')) {
        addAchievement('thousand_clicks');
    } else if (gameState.totalClicks === 10000 && !hasAchievement('ten_thousand_clicks')) {
        addAchievement('ten_thousand_clicks');
    }
}

function addAchievement(achievementId) {
    if (hasAchievement(achievementId)) return;
    
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;
    
    gameState.achievements.push(achievementId);
    showAchievement('Достижение разблокировано!', achievement.title);
    
    const achievementSound = document.getElementById('achievementSound');
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
    if (!$achievementToast) return;
    
    const $title = $achievementToast.querySelector('.achievement-title');
    const $text = $achievementToast.querySelector('.achievement-text');
    
    if ($title) $title.textContent = title;
    if ($text) $text.textContent = description;
    
    // Reset animation
    $achievementToast.classList.remove('show');
    void $achievementToast.offsetWidth; // Trigger reflow
    
    // Show with animation
    $achievementToast.classList.add('show');
    
    // Hide after delay
    clearTimeout($achievementToast.hideTimeout);
    $achievementToast.hideTimeout = setTimeout(() => {
        $achievementToast.classList.remove('show');
    }, 3000);
}

function render() {
    if ($score) $score.textContent = gameState.score.toLocaleString();
    if ($level) $level.textContent = gameState.level + 1;
    updateProgressBar();
}

// Particle effects
function createParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        createParticle(x, y);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 3;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
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
    
    document.body.appendChild(particle);
    
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
    
    setTimeout(() => {
        effect.remove();
    }, 500);
}

function createPlusOne(x, y) {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = `+${POINTS_PER_CLICK}`;
    
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    const rotation = (Math.random() * 30) - 15;
    
    Object.assign(plusOne.style, {
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
        fontSize: `${Math.random() * 10 + 16}px`,
        opacity: 0,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
    });
    
    document.body.appendChild(plusOne);
    
    setTimeout(() => {
        plusOne.style.opacity = '0.8';
        plusOne.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
    }, 10);
    
    setTimeout(() => {
        plusOne.style.opacity = '0';
        plusOne.style.transform = 'translate(-50%, -200%)';
        
        setTimeout(() => {
            plusOne.remove();
        }, 500);
    }, 1000);
}

function handleClick(event) {
    event.preventDefault();
    
    const x = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const y = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    
    // Create visual effects
    createClickEffect(x, y);
    createParticles(x, y, PARTICLE_COUNT);
    createPlusOne(x, y);
    
    // Play click sound
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Add score
    addScore(POINTS_PER_CLICK);
    
    // Animate goose
    if ($circle) {
        $circle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            $circle.style.transform = 'scale(1.05)';
            setTimeout(() => {
                $circle.style.transform = 'scale(1)';
            }, 50);
        }, 50);
    }
}

function setupEventListeners() {
    const $gameArea = document.querySelector('.game-area');
    if ($gameArea) {
        $gameArea.addEventListener('click', handleClick);
        $gameArea.addEventListener('touchstart', handleClick, { passive: false });
    }
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Prevent pull-to-refresh on mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        // Prevent pull-to-refresh when scrolling up from top
        if (window.scrollY <= 0 && e.touches[0].clientY > touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
