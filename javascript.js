class Players {
  constructor(number, sign) {
    this.number = number;
    this.sign = sign;
    this.score = 0;
  }

  getNumber() {
    return this.number;
  }

  getScore() {
    return this.score;
  }

  increaseScore() {
    this.score++;
  }

  resetScore() {
    this.score = 0;
  }

  getSign() {
    return this.sign;
  }
}


const p1 = new Players(1, 'X');
const p2 = new Players(2, 'O');


const game = (function() {
  const cells = document.querySelectorAll('.cells');
  const resetBtn = document.querySelector('#resetBtn');
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');
  const player1Score = document.querySelector('#player1Score');
  const player2Score = document.querySelector('#player2Score');
  let round = 0;
  let gameOver = false;
  let activePlayer = selectFirstPlayer();
  const matrix = [
    ['', '', ''], 
    ['', '', ''], 
    ['', '', '']
  ];

  cells.forEach(cell => {
    cell.addEventListener('click', insertSign);
  })
  resetBtn.addEventListener('click', resetGame);
  resetBtn.addEventListener('dblclick', () => {
    resetGame();
    resetScore();
    round = 0;
  })

  function resetGame() {
    clearMatrix();
    clearField();
    gameOver = false;
    resetBtn.textContent = 'Restart (Reset on double click)';
    round++;
    activePlayer = selectFirstPlayer();
    colorActivePlayer(activePlayer);
  }

  function resetScore() {
    p1.resetScore();
    p2.resetScore();
    renderScore(false);
  }

  function clearMatrix() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        matrix[i][j] = '';
      }
    }
  }

  function clearField() {
    cells.forEach(cell => {
      cell.textContent = '';
    })
  }

  function selectFirstPlayer() {
    return round % 2 === 0 ? p1 : p2;
  }

  function changeActivePlayer() {
    if (activePlayer.getNumber() === 1) {
      activePlayer = p2;
    } else {
      activePlayer = p1;
    }
    colorActivePlayer(activePlayer);
  }

  function colorActivePlayer(player) {
    if (player.getNumber() === 1) {
      player2.classList.remove('selected');
      player1.classList.add('selected');
    } else {
      player1.classList.remove('selected');
      player2.classList.add('selected');
    }
  }

  function renderScore(needIncrease=true) {
    if (needIncrease) activePlayer.increaseScore();
    player1Score.textContent = p1.getScore();
    player2Score.textContent = p2.getScore();
  }

  function checkGameOver() {
    for (let i = 0; i < 3; i++) {
      if (
      ((matrix[i][0] === matrix[i][1] && matrix[i][0] === matrix[i][2] && matrix[i][0] === activePlayer.getSign()) || 
      (matrix[0][i] === matrix[1][i] && matrix[0][i] === matrix[2][i] && matrix[0][i] === activePlayer.getSign()) ||
      (matrix[0][0] === matrix[1][1] && matrix[0][0] === matrix[2][2] && matrix[1][1] === activePlayer.getSign()) ||
      (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) && matrix[1][1] === activePlayer.getSign())
      ) {
        let name = document.querySelector(`#player${activePlayer.getNumber()} input`).value || `Player ${activePlayer.getNumber()}`
        resetBtn.textContent = `${name} win! Restart!`
        gameOver = true;
        renderScore();
        return true;
      }
    }
  }

  function insertSign() {
    const id = this.id;
    const i = id.split('-')[1];
    const j = id.split('-')[2];
    if (matrix[i][j] === '' && !gameOver) {
      const sign = activePlayer.getSign();
      const cell = document.getElementById(id);
      cell.textContent = sign;
      matrix[i][j] = sign;
      if (!checkGameOver()) {
        changeActivePlayer();
      }
      
    }
  }

  colorActivePlayer(activePlayer);
})();