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


const gameModule = (function() {
  const resetBtn = document.querySelector('#resetBtn');
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');
  const player1Score = document.querySelector('#player1Score');
  const player2Score = document.querySelector('#player2Score');
  const modeSelector = document.querySelector('#modeSelector');
  const humanAva = document.querySelector('#humanAva');
  const cpuAva = document.querySelector('#cpuAva');
  let mode = 'cpu';
  let round = 0;
  let gameOver = false;
  let activePlayer = selectFirstPlayer();
  const matrix = [
    ['', '', ''], 
    ['', '', ''], 
    ['', '', '']
  ];

  resetBtn.addEventListener('click', resetGame);
  resetBtn.addEventListener('dblclick', () => {
    resetGame();
    resetScore();
    resetPlayer();
  })

  modeSelector.addEventListener('click', changeMode);

  function changeMode() {
    if (mode === 'cpu') {
      mode = 'human';
      humanAva.classList.remove('human');
      humanAva.classList.add('humanChecked');
      cpuAva.classList.remove('cpuChecked');
      cpuAva.classList.add('cpu');
    } else {
      mode = 'cpu';
      humanAva.classList.remove('humanChecked');
      humanAva.classList.add('human');
      cpuAva.classList.remove('cpu');
      cpuAva.classList.add('cpuChecked');
    }
  }

  function resetGame() {
    clearMatrix();
    cellsModule.clearField();
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

  function resetPlayer() {
    round = 0;
    activePlayer = selectFirstPlayer();
    colorActivePlayer(activePlayer);
  }

  function clearMatrix() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        matrix[i][j] = '';
      }
    }
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

  function matrixIsFull() {
    result = '';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result += matrix[i][j];
      }
    }
    return result.length === 9;
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
      } else if (matrixIsFull()) {
        resetBtn.textContent = 'Tie game! Restart!'
        gameOver = true;
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

  return {insertSign};
})();


const cellsModule = (function() {
  const cells = document.querySelectorAll('.cells');
  
  cells.forEach(cell => {
    cell.addEventListener('click', gameModule.insertSign);
  })

  function clearField() {
    cells.forEach(cell => {
      cell.textContent = '';
    })
  }

  return {clearField};
})();