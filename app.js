/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
let cards = document.getElementsByClassName("card");
const cardDeck = [...cards];

//list of open cards
let shownCards = [];

//list for matched cards
let matchesMade = [];

//increases counter
let counter = 0;

//star icons & number of stars
const stars = document.querySelector(".stars").children;
let starNum = 3;

function changeCounter() {
  counter++;
  document.querySelector(".moves").innerText = counter;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//creates a new shuffled deck
function newDeck() {
  //shuffles the deck
  shuffle(cardDeck);
  //loops through newly shuffled deck and appends to html
  for (let i = 0; i < cardDeck.length; i++) {
    let newCardClass = cardDeck[i];
    deck.appendChild(newCardClass);
  }
}

window.onload = newDeck();

//if cards match, move into matches list and disable
function cardsMatch() {
  matchesMade.push(shownCards);
  for (let i = 0; i < shownCards.length; i++) {
    shownCards[i].classList.remove("open", "show");
    shownCards[i].classList.add("match");
  }
  shownCards.splice(0, 2);
}

//if cards don't match, flip th em over
function cardsDontMatch() {
  for (let i = 0; i < shownCards.length; i++) {
    shownCards[i].classList.remove("open", "show");
  }
  shownCards.splice(0, 2);
}

//check to see if cards are a match
function checkForMatch() {
  if (shownCards.length === 1) {
    shownCards[0].style.pointerEvents = "none";
  }
  if (shownCards.length === 2) {
    if (
      shownCards[0].querySelector("i").classList.value ===
      shownCards[1].querySelector("i").classList.value
    ) {
      cardsMatch();
    } else {
      setTimeout(cardsDontMatch, 1000);
      shownCards[0].style.pointerEvents = "auto";
    }
    changeCounter();
  }
}

//when all matches made, modal pops up and timer stops
function gameWon() {
  if (matchesMade.length === 8) {
    modal();
    stopTimer();
  }
}

//timer function from http://logicalmoon.com/2015/05/using-javascript-to-create-a-timer/
let timer;

function startTimer() {
  let seconds = 0;
  timer = setInterval(function() {
    seconds++;
    const secDisplay = document.querySelector(".seconds");
    const minDisplay = document.querySelector(".minutes");
    let secs = seconds % 60;
    let mins = parseInt(seconds / 60);
    let displayTime = ("00" + secs).slice(-2);
    secDisplay.innerHTML = displayTime;
    minDisplay.innerHTML = mins;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  seconds = 0;
}

//decreases stars
function changeStars() {
  if (counter === 15) {
    starNum = 2;
    stars[0].style.display = "none";
  } else if (counter === 20) {
    starNum = 1;
    stars[1].style.display = "none";
  }
}

//reset the game
function resetGame() {
  cardsDontMatch(); //flips all cards over
  newDeck();

  //reset timer to zero, add new event listener to start timer
  stopTimer();
  document.querySelector(".seconds").innerHTML = 0;
  document.querySelector(".minutes").innerHTML = 0;

  //reset counter to 0
  counter = 0;
  document.querySelector(".moves").innerText = 0;

  //reset stars by showing them again
  stars[0].style.display = "inline-block";
  stars[1].style.display = "inline-block";

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("match");
  }

  //close modal
  document.querySelector(".modal").style.display = "none";

  //reset matchesMade array
  while (matchesMade.length > 0) {
    matchesMade.splice(0, 1);
  }

  //reattach timer listener
  deck.addEventListener("click", startTimer, { once: true });
}

//adds pop-up upon winning game displaying end game stats
function modal() {
  const modal = document.querySelector(".modal");
  const winTime = document.querySelector(".win-time");
  const winMoves = document.querySelector(".win-moves");
  const winStars = document.querySelector(".win-stars");
  modal.style.display = "block";
  winTime.innerText = document.querySelector(".timer").innerText;
  winMoves.innerText = counter;
  winStars.innerText = starNum;
}

//start timer on first click within deck
deck.addEventListener("click", startTimer, { once: true });

//Add event listener for when cards are clicked
deck.addEventListener("click", function(e) {
  if (e.target.nodeName === "LI") {
    //when two cards are showing, do nothing
    if (shownCards.length === 2) {
      return;
    }
    if (e.target.classList.contains("match")) {
      return;
    }
    e.target.classList.add("open", "show");
    shownCards.push(e.target);
  }

  changeStars();
  checkForMatch();
  gameWon();
});
//resets the game with the restart icon
const resetBtn = document.querySelector(".restart");
resetBtn.addEventListener("click", function(e) {
  resetGame();
});

const endGameReset = document.querySelector(".modal-restart");
endGameReset.addEventListener("click", function(e) {
  resetGame();
});
