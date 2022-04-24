String.prototype.count=function(c) { 
  var result = 0, i = 0;
  for(i;i<this.length;i++)if(this[i]==c)result++;
  return result;
};


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

  resetBtn.addEventListener('click', () => resetGame());
  resetBtn.addEventListener('dblclick', () => resetGame(true));
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
    resetGame();
  }

  function resetGame(fullReset) {
    clearMatrix();
    cellsModule.resetFieldStyle();
    cellsModule.renderField();
    resetBtn.classList.remove('winnerIs');
    gameOver = false;
    resetBtn.textContent = 'Restart (Reset on double click)';
    round++;
    console.log(fullReset);
    if (fullReset) {
      console.log(1);
      round = 0;
      resetScore();
    }
    activePlayer = selectFirstPlayer();
    colorActivePlayer();
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

  function selectFirstPlayer() {
    return round % 2 === 0 ? p1 : p2;
  }

  function changeActivePlayer() {
    if (activePlayer.getNumber() === 1) {
      activePlayer = p2;
    } else {
      activePlayer = p1;
    }
    colorActivePlayer();
  }

  function colorActivePlayer() {
    setTimeout(makeAiShoot, 500);
    if (activePlayer.getNumber() === 1) {
      player2.classList.remove('selected');
      player1.classList.add('selected');
    } else {
      player1.classList.remove('selected');
      player2.classList.add('selected');
    }
  }

  function makeAiShoot() {
    if (mode === 'cpu' && activePlayer.getNumber() === 2) {
      point = aiModule.whereToShoot();
      i = point[0];
      j = point[1];
      setTimeout(makeShootInField, 500, i, j);
    }
  }

  function renderScore(needIncrease=true) {
    if (needIncrease) activePlayer.increaseScore();
    player1Score.textContent = p1.getScore();
    player2Score.textContent = p2.getScore();
  }

  function matrixIsFull() {
    result = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result += matrix[i][j] !== '' ? 1 : 0;
      }
    }
    return result === 9;
  }

  function colorResetBtn() {
    resetBtn.classList.add('winnerIs');
  }

  function gameOverStyle() {
    gameOver = true;
    colorResetBtn();
    player1.classList.remove('selected');
    player2.classList.remove('selected');
  }

  function checkGameOver() {
    let winner = checkWinnerModule.weHaveAWinner();
    if (winner.length > 0) {
      cellsModule.colorWinner(winner);
      let name = document.querySelector(`#player${activePlayer.getNumber()} input`).value || `Player ${activePlayer.getNumber()}`
      resetBtn.textContent = `${name} win! Restart!`
      renderScore();
      gameOverStyle();
      return true;
    } else if (matrixIsFull()) {
      resetBtn.textContent = 'Tie game! Restart!';
      gameOverStyle();
      return true;
    }
  }

  function makeShootInField(i, j) {
    if (matrix[i][j] === '' && !gameOver) {
      const sign = activePlayer.getSign();
      matrix[i][j] = sign;
      cellsModule.renderField();
      if (!checkGameOver()) {
        changeActivePlayer();
      }
    }
  }

  function insertSign() {
    const id = this.id;
    const i = id.split('-')[1];
    const j = id.split('-')[2];
    if (mode !== 'cpu' || activePlayer.getNumber() === 1) makeShootInField(i, j);
  }

  colorActivePlayer();

  return {insertSign, matrix};
})();


const cellsModule = (function() {
  const cells = document.querySelectorAll('.cells');
  const winnerLines = {
    h1: [[0, 0], [0, 1], [0, 2]],
    h2: [[1, 0], [1, 1], [1, 2]],
    h3: [[2, 0], [2, 1], [2, 2]],
    v1: [[0, 0], [1, 0], [2, 0]],
    v2: [[0, 1], [1, 1], [2, 1]],
    v3: [[0, 2], [1, 2], [2, 2]],
    d1: [[0, 0], [1, 1], [2, 2]],
    d2: [[0, 2], [1, 1], [2, 0]]
  }
  
  cells.forEach(cell => {
    cell.addEventListener('click', gameModule.insertSign);
  })

  function renderField() {
    let cell;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        id = `cell-${i}-${j}`;
        cell = document.getElementById(id);
        cell.textContent = gameModule.matrix[i][j];
      }
    }
  }

  function resetFieldStyle() {
    cells.forEach(cell => {
      cell.classList.remove('colorWinnerCell');
    })
  }

  function colorWinner(winner) {
    const line = winnerLines[winner[0]];
    for (let cell of line) {
      let i = cell[0];
      let j = cell[1];
      needToColor = document.getElementById(`cell-${i}-${j}`);
      needToColor.classList.add('colorWinnerCell');
    }
  }

  return {renderField, colorWinner, resetFieldStyle, winnerLines};
})();


const checkWinnerModule = (function() {
  let h1, h2, h3, v1, v2, v3, d1, d2, allLines;

  function updateLines() {
    h1 = [gameModule.matrix[0][0], gameModule.matrix[0][1], gameModule.matrix[0][2]];
    h2 = [gameModule.matrix[1][0], gameModule.matrix[1][1], gameModule.matrix[1][2]];
    h3 = [gameModule.matrix[2][0], gameModule.matrix[2][1], gameModule.matrix[2][2]];
    v1 = [gameModule.matrix[0][0], gameModule.matrix[1][0], gameModule.matrix[2][0]];
    v2 = [gameModule.matrix[0][1], gameModule.matrix[1][1], gameModule.matrix[2][1]];
    v3 = [gameModule.matrix[0][2], gameModule.matrix[1][2], gameModule.matrix[2][2]];
    d1 = [gameModule.matrix[0][0], gameModule.matrix[1][1], gameModule.matrix[2][2]];
    d2 = [gameModule.matrix[0][2], gameModule.matrix[1][1], gameModule.matrix[2][0]];
    allLines = {h1, h2, h3, v1, v2, v3, d1, d2};
  }

  function checkingForEquals(list) {
    return list[0] === list[1] && list[1] === list[2] && list[0] !== '';
  }

  function weHaveAWinner() {
    updateLines();
    const result = [];
    for (let line in allLines) {
      if (checkingForEquals(allLines[line])) {
        result.push(line);
      }
    }
    return result;
  }

  return {weHaveAWinner};
})();


const aiModule = (function() {
  function mainBrain(step) {
    let CoordsToShoot = [];
    let preResult = [];
    let lines = getLines();
    for (let line of lines) {
      let lineText = line.cellA + line.cellB + line.cellC;
      let quantityX = lineText.count('X');
      let quantityO = lineText.count('O');
      if (step(quantityX, quantityO)) {
        if (line.cellA === '') preResult.push(line.cellACoords);
        if (line.cellB === '') preResult.push(line.cellBCoords);
        if (line.cellC === '') preResult.push(line.cellCCoords);
        CoordsToShoot = CoordsToShoot.concat(preResult);
        preResult = [];
      }
    }
    return CoordsToShoot;
  }

  function step1Win(quantityX, quantityO) {
    return quantityX === 0 && quantityO === 2;
  }

  function step2DontLose(quantityX, quantityO) {
    return quantityX === 2 && quantityO === 0;
  }

  function step3ContinueLine(quantityX, quantityO) {
    return quantityX === 0 && quantityO === 1;
  }

  function step4StartFreeLine(quantityX, quantityO) {
    return quantityX === 0 && quantityO === 0;
  }

  function step5FinishGameByRandom(quantityX, quantityO) {
    return true;
  }

  function getLines() {
    const result = []
    for (let lineName in cellsModule.winnerLines) {
      let lineCoords = cellsModule.winnerLines[lineName];
      let cellA = gameModule.matrix[lineCoords[0][0]][lineCoords[0][1]];
      let cellB = gameModule.matrix[lineCoords[1][0]][lineCoords[1][1]];
      let cellC = gameModule.matrix[lineCoords[2][0]][lineCoords[2][1]];
      let cellACoords = [lineCoords[0][0], lineCoords[0][1]];
      let cellBCoords = [lineCoords[1][0], lineCoords[1][1]];
      let cellCCoords = [lineCoords[2][0], lineCoords[2][1]];
      result.push({lineName, cellA, cellB, cellC, cellACoords, cellBCoords, cellCCoords});
    }
    return result;
  }

  function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
  }
  
  function whereToShoot() {
    let ShootHere = mainBrain(step1Win);
    if (ShootHere.length > 0) return randomChoice(ShootHere);
    ShootHere = mainBrain(step2DontLose);
    if (ShootHere.length > 0) return randomChoice(ShootHere);
    ShootHere = mainBrain(step3ContinueLine);
    if (ShootHere.length > 0) return randomChoice(ShootHere);
    ShootHere = mainBrain(step4StartFreeLine);
    if (ShootHere.length > 0) return randomChoice(ShootHere);
    ShootHere = mainBrain(step5FinishGameByRandom);
    if (ShootHere.length > 0) return randomChoice(ShootHere);
  }

  return {whereToShoot};
})();