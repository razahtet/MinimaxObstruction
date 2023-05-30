//Id elements
var twoPlayerButton = document.getElementById("twoPlayerButton");
var computerButton = document.getElementById("computerButton");
var backButton = document.getElementById("backButton");
var chooseBelow = document.getElementById("chooseBelow");
var board = document.getElementById("board");
var message = document.getElementById("message");
var computerFirstButton = document.getElementById("computerFirstButton");
var restartButton = document.getElementById("restartButton");
var whoX = document.getElementById("whoX");
var whoO = document.getElementById("whoO");
var boxes = document.querySelectorAll("div>div>div");
var resultsDiv = document.getElementById("resultsDiv");
var widthPar = document.getElementById("widthPar");
var lengthPar = document.getElementById("lengthPar");
var submitButton = document.getElementById("submitButton");
var howPlay = document.getElementById("howPlay");

//classes
var row = document.querySelectorAll(".row");
var chooseO = document.querySelectorAll(".chooseO");
var levelsC = document.querySelectorAll(".levelsC");
var parInput = document.querySelectorAll(".parInput");
let theT = "";
let theS = 0;

//event listeners (variables)
computerButton.addEventListener("click", showLevels);
computerFirstButton.addEventListener("click", computeFirst);
twoPlayerButton.addEventListener("click", twoPlayerTime);
restartButton.addEventListener("click", cleanBoard);
backButton.addEventListener("click", goBackMain);
submitButton.addEventListener("click", submitSides);

//event listeners (for loops)
for (var i = 0; i < parInput.length; i++) {
  parInput[i].addEventListener("input", changeRating);
}

for (var i = 0; i < chooseO.length; i++) {
  chooseO[i].addEventListener("click", proceedThat);
}

for (var i = 0; i < levelsC.length; i++) {
  levelsC[i].addEventListener("click", proceedThat);
}

for (var i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener("click", placeLetter);
  boxes[i].numB = i;
  boxes[i].classList.add("noClick");
}

//elements
var gameO = false;
var levelState = "";
var playersTurn = 0;
var computerTurnA = false;
var computerO = true;
var boardArray = [
  "", "", "", "", "", "",
  "", "", "", "", "", "",
  "", "", "", "", "", "",
  "", "", "", "", "", "",
  "", "", "", "", "", "",
  "", "", "", "", "", ""
];
var turnV = ""; //x o for who wins - board full checking part

//functions
function proceedThat() {
  var idK = this.getAttribute("id");
  idK = idK.split("Button");
  var goK = true;
  if (idK[0] != "computer") {
    showHideLevels("none", false);
    goK = false;
  }
  startGame(idK[0], goK);
}

function startGame(level, bnm) {
  levelState = level;
  computerO = true;
  resetValues();
  if (!bnm && levelState != "twoPlayer") {
    computerFirstButton.innerHTML = "Let Computer Go First";
    changeXO(true);
  }
}

function placeLetter() {
  if (this.innerHTML == "" && !this.classList.contains("xText") && !this.classList.contains("oText") && message.innerHTML == "" && !this.classList.contains("xClass") && !this.classList.contains("oClass")) {
    if (levelState == "twoPlayer") {
      if (playersTurn == 0) {
        this.classList.add("xText");
        this.innerHTML = "X";
        playersTurn = 1;
        turnV = "X";
        fillAr("X", this.numB);
      } else {
        this.classList.add("oText");
        this.innerHTML = "O";
        playersTurn = 0;
        turnV = "O";
        fillAr("O", this.numB);
      }
      boardArray[this.numB] = this.innerHTML;
      checkState();
    } else {
      if (!computerTurnA) {
        if (computerO) {
          this.classList.add("xText");
          this.innerHTML = "X";
          turnV = "X";
          fillAr("X", this.numB);
        } else {
          this.classList.add("oText");
          this.innerHTML = "O";
          turnV = "O";
          fillAr("O", this.numB);
        }
        boardArray[this.numB] = this.innerHTML;
        startTimer();
        doComputerMove();
      }
    }
  }
}

function startTimer() {
  theS = 0;
  message.innerHTML = "Calculating...";
  theT = setInterval(function() {
    theS += 0.1;
    message.innerHTML = "Calculating..." + theS + "s";
  }, 100)
  
}

function endTimer() {
  clearInterval(theT);
  message.innerHTML = "";
}

function doComputerMove() {
  var gameFinished = checkState();
  if (!gameFinished) {
    computerTurnA = true;
    var allN = nextMoves(boardArray.slice(), computerO, []);
    var scoreObj = [];
    var theXO;
    if (computerO) {
      theXO = "O";
    } else {
      theXO = "X";
    }
    turnV = theXO;
    var checkIfG = leftOverSpaces(boardArray);
    var emK;
    if (row.length < 6 && row[0].children.length < 6) {
      emK = 25;
    } else if (row.length > 7 && row[0].children.length > 7) {
      emK = 15;
    } else {
      emK = 20;
    }
    if (checkIfG < emK) {
      for (var i = 0; i < allN.length; i++) {
        var toS = score(allN[i], true, theXO);
        scoreObj.push({
          elScore: toS,
          nextP: allN[i]
        });
      }
      var mostUp = getMax(scoreObj, levelState);
      var pRand = Math.floor(Math.random() * mostUp.length);
      boardArray = mostUp[pRand];
    } else {
      boardArray = allN[Math.floor(Math.random() * allN.length)];
    }
    
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] == "O") {
        boxes[i].classList.add("oText");
        boxes[i].innerHTML = boardArray[i];
      } else if (boardArray[i] == "X") {
        boxes[i].classList.add("xText");
        boxes[i].innerHTML = boardArray[i];
      } else if (boardArray[i] == "XFilled") {
           boxes[i].classList.add("xClass");
      } else if (boardArray[i] == "OFilled") {
           boxes[i].classList.add("oClass");
      }
      
    }

    computerTurnA = false;
    endTimer();
    checkState();
  }
}

function getMax(object, mode) {
  var leastS = {};
  leastS.moves = [];
  if (mode == "impossible") {
    leastS.score = -Infinity;
  } else if (mode == "easy") {
    leastS.score = Infinity;
  }
  var alreadyChecked = [];
  for (var i = 0; i < object.length; i++) {
    var greaterT = false;

    if (mode == "easy") {
      if (object[i].elScore < leastS.score) {
        greaterT = true;
        leastS.moves = [];
        leastS.score = object[i].elScore;
      }
    } else if (mode == "impossible") {
      if (object[i].elScore > leastS.score) {
        greaterT = true;
        leastS.moves = [];
        leastS.score = object[i].elScore;
      }
    }
    if (object[i].elScore == leastS.score || mode == "medium") {
      greaterT = true;
    }
    if (greaterT) {
      leastS.moves.push(object[i].nextP);
    }
  }

  return leastS.moves;
}

function nextMoves(array, kCond, allK) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "") {
      var arrayN = array.slice();
      if (kCond) {
        arrayN[i] = "O";
      } else {
        arrayN[i] = "X";
      }

      var fillIns = getAllAround(i);

      for (var j = 0; j < fillIns.length; j++) {
        let newB = fillIns[j];
        if (newB != null && arrayN[newB.numB] == "") {
          arrayN[newB.numB] = arrayN[i] + "Filled";
        }
      }

      allK.push(arrayN);
    }
    
  }
  return allK;
}

function score(move, computerTurn, recentV) {
  var bestScore;
  var scoreK;
  var checkG = gameOver(move, recentV);

  if (checkG.condition) {
    var scoreR; //there is no way that there can be a tie
    if (checkG.playerWon == "X") {
      if (computerO) {
        scoreR = -10;
      } else {
        scoreR = 10;
      }
    } else if (checkG.playerWon == "O") {
      if (computerO) {
        scoreR = 10;
      } else {
        scoreR = -10;
      }
    }
    return scoreR;
  } else {
      
    var elC;
    if (computerTurn) {
      if (computerO) {
        elC = true;
      } else {
        elC = false;
      }
    } else {
      if (computerO) {
        elC = false;
      } else {
        elC = true;
      }
    }
    var nextMovesK = nextMoves(move, elC, []);
    var nextTurn;
    if (recentV == "X") {
      nextTurn = "O";
    } else {
      nextTurn = "X";
    }
    if (computerTurn) {
      bestScore = Infinity;
      for (var i = 0; i < nextMovesK.length; i++) {
        scoreK = score(nextMovesK[i], false, nextTurn);
        bestScore = Math.min(scoreK, bestScore);
      }

      // for each possible next move:
      //     score = score(nextMove, false)
      //     bestScore = min(score, bestScore)

      return bestScore;
    } else {
      bestScore = -Infinity;
      for (var i = 0; i < nextMovesK.length; i++) {
        scoreK = score(nextMovesK[i], true, nextTurn);
        bestScore = Math.max(scoreK, bestScore);
      }

      // for each possible next move:
      //     score = score(nextMove, true)
      //     bestScore = max(score, bestScore)

      return bestScore;
    }
  }
}

function getAllAround(number) {
  var squareToLeft = getSquareToLeft(boxes[number]); // will be null if square is on left edge
  var squareToRight = getSquareToRight(boxes[number]); // will be null if square is on right edge
  var squareAbove = getSquareAbove(boxes[number]); // will be null if square is in first row
  var squareBelow = getSquareBelow(boxes[number]); // will be null if square is in last row
  var squareUpLeftDia = getSquareUpLeftDia(boxes[number]);
  var squareDownLeftDia = getSquareDownLeftDia(boxes[number]);
  var squareUpRightDia = getSquareUpRightDia(boxes[number]);
  var squareDownRightDia = getSquareDownRightDia(boxes[number]);
  var toSeeArray = [squareToLeft, squareToRight, squareAbove, squareBelow, squareUpLeftDia, squareDownLeftDia,
    squareDownRightDia, squareUpRightDia];

  return toSeeArray;
}

function fillAr(letter, number) {
  var aroundP = getAllAround(number);
  var colorF;
  if (letter == "X") {
    colorF = "x";
  } else {
    colorF = "o";
  }
  for (var i = 0; i < aroundP.length; i++) {
    if (aroundP[i] != null && boardArray[aroundP[i].numB] == "") {
      aroundP[i].classList.add(colorF + "Class");
      boardArray[aroundP[i].numB] = colorF.toUpperCase() + "Filled";
    }
  }
}

function gameOver(move, recentM) {
  var winCond = {
    "playerWon": recentM,
    "condition": false
  }

  if (boardIsFull(move)) {
    winCond.condition = true;
  }

  return winCond;
}

function checkState() {
  endTimer();
  if (boardIsFull(boardArray)) {
    message.innerHTML = turnV + " Wins!";
    gameO = true;
  }

  return gameO;
}

function computeFirst() {
  if (computerO) {
    computerO = false;
    this.innerHTML = "Let Yourself Go First";
    changeXO(false);
  } else {
    computerO = true;
    this.innerHTML = "Let Computer Go First";
    changeXO(true);
  }
    
  cleanBoard();
}

function boardIsFull(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "") {
      return false;
    }
  }

  return true;
}

function leftOverSpaces(array) {
  var spacesLeft = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "") {
      spacesLeft++;
    }
  }

  return spacesLeft;
}

function twoPlayerTime() {
  hideButtons();
  chooseBelow.style.display = "none";
  levelState = "twoPlayer";
  cleanBoard();
  board.style.display = "block";
  restartButton.style.display = "block";
  whoX.innerHTML = "Player 1 is X";
  whoO.innerHTML = "Player 2 is O";
  whoX.style.marginRight = "177px";
}

function showLevels() {
  hideButtons();
  showHideLevels("inline-block", true);
}

function goBackMain() {
  twoPlayerButton.style.display = "inline-block";
  computerButton.style.display = "inline-block";
  this.style.display = "none";

  showHideLevels("none", true);
}

function hideButtons() {
  twoPlayerButton.style.display = "none";
  computerButton.style.display = "none";
  backButton.style.display = "block";
}

function showHideLevels(text, cond) {
  for (var i = 0; i < levelsC.length; i++) {
    levelsC[i].style.display = text;
  }

  if (cond) {
    levelState = "none";
    chooseBelow.style.display = "block";
    howPlay.style.display = "block";
    board.style.display = "none";
    computerFirstButton.style.display = "none";
    restartButton.style.display = "none";
    whoO.innerHTML = "";
    whoX.innerHTML = "";
    resultsDiv.style.display = "none";
  } else {
    chooseBelow.style.display = "none";
    board.style.display = "inline-block";
    howPlay.style.display = "none";
    if (levelState != "twoPlayer") {
      computerFirstButton.style.display = "inline-block";
    }
    resultsDiv.style.display = "inline-block";
    restartButton.style.display = "inline-block";
  }
    
  resetPlayers();
  cleanBoard();
}

function changeXO(condition) {
  whoX.style.marginRight = "104px";
  if (condition) {
    whoX.innerHTML = "You are X";
    whoO.innerHTML = "Computer is O";
  } else {
    whoX.innerHTML = "You are O";
    whoO.innerHTML = "Computer is X";
  }
}

function cleanBoard() {
  gameO = false;
  resetPlayers();
  message.innerHTML = "";
    
  for (var i = 0; i < boardArray.length; i++) {
    boardArray[i] = "";
    boxes[i].innerHTML = "";
    boxes[i].classList.remove("xClass");
    boxes[i].classList.remove("oClass");
    boxes[i].classList.remove("xText");
    boxes[i].classList.remove("oText");
  }
    
  if (!computerO && levelState != "twoPlayer") {
    doComputerMove();
  }
}

function resetPlayers() {
  if (levelState == "twoPlayer") {
    playersTurn = 0;
    whoX.style.marginRight = "60px";
    whoX.innerHTML = "Player 1 is X";
    whoO.innerHTML = "Player 2 is O";
  }
}

function changeRating() {
  if (this.getAttribute("id") == "lengthInput") {
    lengthPar.innerHTML = this.value;
  } else {
    widthPar.innerHTML = this.value;
  }
}

function submitSides() {
  boardArray = [];
  board.innerHTML = "";
  for (var i = 0; i < lengthInput.value; i++) {
    var rowD = document.createElement("div");
    rowD.classList.add("row");
    rowD.setAttribute("index", i);
    board.appendChild(rowD);
    for (var j = 0; j < widthInput.value; j++) {
      var indexD = document.createElement("div");
      indexD.setAttribute("index", j);
      rowD.appendChild(indexD);
      boardArray.push("");
    }
  }
  setBoxes();
}

function setBoxes() {
  row = document.querySelectorAll(".row");
  boxes = document.querySelectorAll("div>div>div");
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", placeLetter);
    boxes[i].numB = i;
    boxes[i].classList.add("noClick");
  }
  cleanBoard();
  resetPlayers();
}

function resetValues() {
  parInput[0].value = 6;
  parInput[1].value = 6;
  widthPar.innerHTML = 6;
  lengthPar.innerHTML = 6;
  submitSides();
}

function getSquareUpLeftDia(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowAbove = rowK.previousElementSibling; // get the row above the square

  if (rowAbove == null) {
    return null; // square is in first row, so there is no square above
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowAbove.children[x - 1]; // return the square in the row above with the same x coordinate
  }
}

function getSquareDownLeftDia(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowAbove = rowK.nextElementSibling; // get the row above the square

  if (rowAbove == null) {
    return null; // square is in first row, so there is no square above
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowAbove.children[x - 1]; // return the square in the row above with the same x coordinate
  }
}

function getSquareUpRightDia(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowAbove = rowK.previousElementSibling; // get the row above the square

  if (rowAbove == null) {
    return null; // square is in first row, so there is no square above
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowAbove.children[x + 1]; // return the square in the row above with the same x coordinate
  }
}

function getSquareDownRightDia(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowAbove = rowK.nextElementSibling; // get the row above the square

  if (rowAbove == null) {
    return null; // square is in first row, so there is no square above
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowAbove.children[x + 1]; // return the square in the row above with the same x coordinate
  }
}

function getSquareToLeft(square) {
  return square.previousElementSibling;
}

function getSquareToRight(square) {
  return square.nextElementSibling;
}

function getSquareAbove(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowAbove = rowK.previousElementSibling; // get the row above the square

  if (rowAbove == null) {
    return null; // square is in first row, so there is no square above
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowAbove.children[x]; // return the square in the row above with the same x coordinate
  }
}

function getSquareBelow(square) {
  var rowK = square.parentElement; // get the row of the square
  var rowBelow = rowK.nextElementSibling; // get the row below the square

  if (rowBelow == null) {
    return null; // square is in last row, so there is no square below
  }
  else {
    var x = square.getAttribute("index"); // get the x coordinate of the square
    x = parseInt(x, 10); // convert x from a string to an integer

    return rowBelow.children[x]; // return the square in the row below with the same x coordinate
  }
}
