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
    firstClick: false,
    // Daily limit
    dailyTapCount: 0,
    dailyTapDate: null,
    // Boosters
    tapMul: 1,
    timeBoostUntil: 0,
    // Audio
    sfxEnabled: true,
    musicEnabled: true,
    // Backend flag (future integration)
    backendRegistered: false,
};

// DOM elements
const $circle = document.querySelector('#circle') || document.querySelector('.goose-img');
const $score = document.querySelector('.score');
const $level = document.querySelector('.level');
const $progressBar = document.querySelector('.progress-bar');
const $progressText = document.querySelector('.progress-text');
const $achievementToast = document.querySelector('.achievement-toast');
// SPA/UI
const $navButtons = Array.from(document.querySelectorAll('.nav-btn'));
const $screens = {
    home: document.getElementById('screen-home'),
    rating: document.getElementById('screen-rating'),
    profile: document.getElementById('screen-profile'),
};
const $boost15 = document.getElementById('boost-15min');
const $boostTimer = document.getElementById('boost-timer');
const $mulButtons = Array.from(document.querySelectorAll('.tap-mul'));
const $toggleSfx = document.getElementById('toggle-sfx');
const $toggleMusic = document.getElementById('toggle-music');

// Initialize game
function init() {
    loadGame();
    render();
    setupEventListeners();
    setupNavigation();
    setupAudioControls();
    setupBoosters();
    startBoostTimerTicker();
    
    if (!gameState.firstClick) {
        setTimeout(() => {
            showAchievement('Добро пожаловать!', 'Кликните по гусю, чтобы начать игру');
        }, 1000);
    }

// SPA navigation
function setupNavigation() {
    $navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchScreen(btn.getAttribute('data-target')));
    });
}

function switchScreen(name) {
    Object.keys($screens).forEach(key => {
        const el = $screens[key];
        if (!el) return;
        el.classList.toggle('active', key === name);
    });
    $navButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-target') === name));
}

// Audio controls
function setupAudioControls() {
    applyAudioState();
    if ($toggleSfx) $toggleSfx.addEventListener('click', () => { gameState.sfxEnabled = !gameState.sfxEnabled; applyAudioState(); saveGame(); });
    if ($toggleMusic) $toggleMusic.addEventListener('click', () => { gameState.musicEnabled = !gameState.musicEnabled; applyAudioState(); saveGame(); });
}

function applyAudioState() {
    const sfx = !!gameState.sfxEnabled;
    const sounds = [document.getElementById('clickSound'), document.getElementById('levelUpSound'), document.getElementById('achievementSound')];
    sounds.forEach(a => { if (a) a.muted = !sfx; });
    if ($toggleSfx) $toggleSfx.textContent = sfx ? '🔊' : '🔇';
    if ($toggleMusic) $toggleMusic.textContent = gameState.musicEnabled ? '🎵' : '🚫';
}

// Boosters
function setupBoosters() {
    if ($boost15) {
        $boost15.addEventListener('click', () => {
            gameState.timeBoostUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
            saveGame();
            updateBoostTimerUI();
        });
    }
    $mulButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mul = Number(btn.getAttribute('data-mul')) || 1;
            gameState.tapMul = mul;
            $mulButtons.forEach(b => b.classList.toggle('active', b === btn));
            saveGame();
        });
        const m = Number(btn.getAttribute('data-mul')) || 1;
        if (m === Number(gameState.tapMul)) btn.classList.add('active');
    });
    updateBoostTimerUI();
}

function startBoostTimerTicker() { setInterval(updateBoostTimerUI, 1000); }

function updateBoostTimerUI() {
    if (!$boostTimer) return;
    const remain = (gameState.timeBoostUntil || 0) - Date.now();
    if (remain > 0) {
        const mm = Math.floor(remain / 60000);
        const ss = Math.floor((remain % 60000) / 1000);
        $boostTimer.textContent = `x2 активен: ${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    } else {
        $boostTimer.textContent = '';
    }
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
            firstClick: gameState.firstClick,
            dailyTapCount: gameState.dailyTapCount,
            dailyTapDate: gameState.dailyTapDate,
            tapMul: gameState.tapMul,
            timeBoostUntil: gameState.timeBoostUntil,
            sfxEnabled: gameState.sfxEnabled,
            musicEnabled: gameState.musicEnabled,
        }));
    } catch (e) {
        console.error('Failed to save game state', e);
    }
}

// Daily limit and boosters utils
function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

function ensureDailyWindow() {
    const today = todayStr();
    if (gameState.dailyTapDate !== today) {
        gameState.dailyTapDate = today;
        gameState.dailyTapCount = 0;
        saveGame();
    }
}

function canTap() {
    ensureDailyWindow();
    return gameState.dailyTapCount < 500;
}

function getEffectiveMultiplier() {
    const now = Date.now();
    const timeMul = now < (gameState.timeBoostUntil || 0) ? 2 : 1;
    return Math.max(1, Number(gameState.tapMul) || 1) * timeMul;
}

// Update score and check for level up
function addScore(points = POINTS_PER_CLICK) {
    const eff = getEffectiveMultiplier();
    gameState.score += points * eff;
    gameState.totalClicks += 1;
    gameState.dailyTapCount = (gameState.dailyTapCount || 0) + 1;
    
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
    if (achievementSound && achievementSound.querySelector('source') && achievementSound.querySelector('source').getAttribute('src')) {
        achievementSound.currentTime = 0;
        if (gameState.sfxEnabled) {
            achievementSound.play().catch(e => console.log('Audio play failed:', e));
        }
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
    renderDailyProgress();
}

// Daily progress UI
function renderDailyProgress() {
    const dailyText = document.getElementById('daily-text');
    const dailyBar = document.getElementById('daily-bar');
    if (!dailyText || !dailyBar) return;
    ensureDailyWindow();
    const used = Math.min(500, gameState.dailyTapCount || 0);
    dailyText.textContent = `Тапов сегодня: ${used}/500`;
    const pct = Math.min(100, Math.round((used / 500) * 100));
    dailyBar.style.width = pct + '%';
    // color thresholds
    if (pct >= 95) {
        dailyBar.style.background = 'linear-gradient(90deg, #ff5252, #ff1744)';
    } else if (pct >= 80) {
        dailyBar.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
    } else {
        dailyBar.style.background = 'linear-gradient(90deg, #8a8ffe, #5f63f2)';
    }
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
    if (!canTap()) {
        showAchievement('Лимит', 'Дневной лимит 500 тапов исчерпан');
        return;
    }
    
    const x = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const y = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    
    // Create visual effects
    createClickEffect(x, y);
    createParticles(x, y, PARTICLE_COUNT);
    createPlusOne(x, y);
    
    // Play click sound
    const clickSound = document.getElementById('clickSound');
    if (clickSound && clickSound.querySelector('source') && clickSound.querySelector('source').getAttribute('src')) {
        clickSound.currentTime = 0;
        if (gameState.sfxEnabled) {
            clickSound.play().catch(e => console.log('Audio play failed:', e));
        }
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
    if ($circle) {
        $circle.addEventListener('click', handleClick);
        $circle.addEventListener('touchstart', handleClick, { passive: false });
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
