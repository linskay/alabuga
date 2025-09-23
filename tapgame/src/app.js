const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');

function start() {
    setScore(getScore());
    setImage();
}

function setScore(score) {
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function setImage() {
    const score = getScore();
    if (score % 40 === 0) {
        $circle.setAttribute('src', 'assets/Goose2.png');
    } else if (score % 20 === 0) {
        $circle.setAttribute('src', 'assets/Goose.png');
    }
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0; // ?? 0 тоже работает, но || 0 короче
}

function addOne() {
    setScore(getScore() + 1);
    setImage();
}

$circle.addEventListener('click', (event) => {
    const rect = $circle.getBoundingClientRect(); // ✅ добавлено!

    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const DEG = 40;

    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG; // ✅ offsetX, а не offsetY!

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
        $circle.style.setProperty('--tiltX', '0deg');
        $circle.style.setProperty('--tiltY', '0deg');
    }, 300);

    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one'); // ✅ исправлено на kebab-case
    plusOne.textContent = '+1';
    plusOne.style.left = `${event.clientX - rect.left}px`; // ✅ добавлено =
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentNode.appendChild(plusOne);

    addOne();

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

start();