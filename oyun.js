document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const music = document.getElementById('bg-music');
    const livesText = document.getElementById('remaining-lives');
    const neededText = document.getElementById('safe-needed');

    const rows = 8;
    const cols = 8;
    const minesCount = 10;
    let revealedSafeCells = 0;
    const totalSafeNeeded = (rows * cols) - minesCount;
    let isGameOver = false;

    // Günlük Hak Kontrolü
    function checkDailyRights() {
        const today = new Date().toDateString();
        let gameStatus = JSON.parse(localStorage.getItem('bazCoffee_GameStatus')) || { date: today, count: 0 };

        if (gameStatus.date !== today) {
            gameStatus = { date: today, count: 0 };
            localStorage.setItem('bazCoffee_GameStatus', JSON.stringify(gameStatus));
        }
        return gameStatus;
    }

    function updateLivesDisplay() {
        const status = checkDailyRights();
        livesText.innerText = 2 - status.count;
        return status.count;
    }

    // Oyunu Başlat
    function init() {
        const playCount = updateLivesDisplay();
        neededText.innerText = totalSafeNeeded;

        if (playCount >= 2) {
            board.innerHTML =`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 20px; color: #d63031; background: rgba(212, 163, 115, 0.1); border-radius: 15px; border: 1px dashed #d63031; min-height: 200px;">
                <i class="fas fa-lock" style="font-size: 3rem; margin-bottom: 20px; display: block;"></i>
                <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 10px; font-size: 1.4rem;">Oyun Hakkınız Doldu</h2>
                <p style="font-size: 0.95rem; line-height: 1.6; text-align: center; margin: 0; color: #555;">
                    Günlük <strong>2 oyun hakkınız</strong> dolmuştur.<br>
                    Yarın yeni ödüller için tekrar bekleriz!
                </p>
            </div>`;
            return;
        }

        const cellsArray = Array(minesCount).fill('mine')
            .concat(Array(totalSafeNeeded).fill('safe'))
            .sort(() => Math.random() - 0.5);

        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.type = cellsArray[i];
            cell.addEventListener('click', () => handleCellClick(cell));
            board.appendChild(cell);
        }
    }

    // Tıklama Mantığı
    function handleCellClick(cell) {
        if (isGameOver || cell.classList.contains('revealed')) return;

        // Müziği çal
        if (music.paused) music.play().catch(() => { });

        if (cell.dataset.type === 'mine') {
            cell.classList.add('mine');
            cell.innerHTML = '<i class="fas fa-tint"></i>';
            finishGame(false);
        } else {
            cell.classList.add('revealed');
            cell.innerHTML = '<i class="fas fa-coffee"></i>';
            revealedSafeCells++;
            neededText.innerText = totalSafeNeeded - revealedSafeCells;

            if (revealedSafeCells === totalSafeNeeded) {
                finishGame(true);
            }
        }
    }

    //Oyun Bitimi
    function finishGame(isWin) {
        isGameOver = true;
        music.pause();

        let status = checkDailyRights();
        status.count++;
        localStorage.setItem('bazCoffee_GameStatus', JSON.stringify(status));
        updateLivesDisplay();

        if (isWin) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4A373', '#1b4532', '#52b788']
            });

            const prizes = ["Küçük Boy Kahve Hediye", "Tatlı Yanında Kahve", "2 Al 1 Öde"];
            const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
            const code = 'BAZ-' + Math.random().toString(36).substr(2, 5).toUpperCase();

            document.getElementById('reward-text').innerText = randomPrize;
            document.getElementById('promo-code').innerText = code;

            setTimeout(() => {
                document.getElementById('reward-modal').style.display = 'flex';
            }, 500);

        } else {
            setTimeout(() => {
                document.getElementById('fail-modal').style.display = 'flex';
            }, 500);
        }
    }

    init();
});

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});