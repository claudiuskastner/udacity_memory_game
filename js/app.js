/*
* Create a list that holds all of your cards
*/

// Global variables
var cardDeck = [];
var drawCounter = 0;
var startTime = 0;
var endTime = 0;
var currentRating = 3;

var deckElement = document.getElementById("cardlist");
var refreshButton = document.getElementById("restart");
var modalRefreshButton = document.getElementById("modal__restart");
var modalClose = document.getElementById("modal__close");
var cardSymbols = [
    "fa-gem",
    "fa-paper-plane",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
    "fa-gem",
    "fa-paper-plane",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb"
];

shuffle(cardSymbols);

// Create the deck and add event listeners
for (let i = 0; i < deckElement.children.length; i++) {
    cardDeck.push(deckElement.children[i]);
    cardDeck[i].children[0].classList.add(cardSymbols[i]);
    cardDeck[i].addEventListener("click", clickEvent);

}

// Add event listener to the refresh buttons
refreshButton.addEventListener("click", refreshEvent);
modalRefreshButton.addEventListener("click", refreshEvent);
modalClose.addEventListener("click", refreshEvent);

// Modal from W3Schools https://www.w3schools.com/howto/howto_css_modals.asp
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

//show modal and display game stats
function showModal(time, draws, rating) {
    modal.style.display = "block";
    document.getElementById("modal__time").innerHTML = time + " seconds";
    document.getElementById("modal__draws").innerHTML = draws;

    for(let i = 0; i < rating; i++) {
        document.getElementById("modal__rating").children[i].children[0].classList.remove("far");
        document.getElementById("modal__rating").children[i].children[0].classList.add("fas");
    }
}


// When the user clicks on <span> (x), close the modal
span.onclick = closeModal();

function closeModal() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function matchCard(card1, card2) {

    if (card1.firstChild.nextSibling.classList[1] == card2.firstChild.nextSibling.classList[1]) {
        card1.classList.add("match");
        card2.classList.add("match");
        card1.classList.remove("open");
        card1.classList.remove("show");
        card2.classList.remove("open");
        card2.classList.remove("show");
        let matchedCards = document.getElementsByClassName("match");

        if(matchedCards.length == 16) {
            //if last match, show modal and calculate time
            let date = new Date();
            clearInterval(currentTime);
            endTime = document.getElementById("timer").innerHTML;
            showModal(endTime, drawCounter, currentRating);
        }
    }
}


function unmatchCard(openedCards) {
    // hide cards if no match
    let card1 = openedCards[0];
    let card2 = openedCards[1];
    card1.classList.remove("open");
    card1.classList.remove("show");
    card2.classList.remove("open");
    card2.classList.remove("show");
}

function updateCounter() {
    // update the displayed counter
    let counter = document.getElementsByClassName("moves");
    counter[0].innerHTML = drawCounter;
    console.log("set draw counter")
}

function clickEvent(e) {
    let currentElement = e.currentTarget;
    let openedCards = document.getElementsByClassName("open show");

    // set start time on first draw
    if (drawCounter === 0) {
        let date = new Date();
        startTime = date.getTime();
        currentTime = setInterval(updateTimer, 10)
    }

    // open a card
    if (openedCards.length < 2 && currentElement.className != "card open show" && currentElement.className != "card match") {
        // show clicked card
        currentElement.classList.add("open");
        currentElement.classList.add("show");
        drawCounter += 1;
        updateCounter();
        updateRating();

    } else if (openedCards.length == 2) {
        // close not matching cards
        unmatchCard(openedCards);
    }

    openedCards = document.getElementsByClassName("open show");
    if (openedCards.length == 2) {
        let card1 = openedCards[0];
        let card2 = openedCards[1];
        // check if cards are matching
        matchCard(card1, card2)
    }
}

function refreshEvent(e) {
    let openedCards = document.getElementsByClassName("open show");
    let matchedCards = document.getElementsByClassName("match");
    let countOpenedCards = openedCards.length;
    let countMatchedCards = matchedCards.length;

    clearInterval(currentTime);
    document.getElementById("timer").innerHTML = 0;
    closeModal();

    // remove show and open classes from cards
    for (let i = 0; i < countOpenedCards; i++) {
        openedCards[0].classList.remove("show", "open");
    }

    //remove match classes from cards
    for (let i = 0; i < countMatchedCards; i++) {
        matchedCards[0].classList.remove("match");
    }

    //remove card symbols
    for (let i = 0; i < deckElement.children.length; i++) {
        cardDeck[i].children[0].classList.remove(cardSymbols[i]);
    }
    // shuffle card symbols
    shuffle(cardSymbols);

    // add new card symbols
    for (let i = 0; i < deckElement.children.length; i++) {
        cardDeck[i].children[0].classList.add(cardSymbols[i]);
    }

    // reset counter
    drawCounter = 0;
    updateCounter();

    let starContainer = document.getElementsByClassName("stars")[0];
    // reset star rating
    for(let i = 0; i < starContainer.children.length; i++) {
        starContainer.children[i].children[0].classList.remove("far");
        starContainer.children[i].children[0].classList.add("fas");
    }
}

function updateRating() {

    let starContainer = document.getElementsByClassName("stars")[0];

    if(drawCounter == 20) {
        starContainer.children[starContainer.children.length -1].children[0].classList.remove("fas");
        starContainer.children[starContainer.children.length -1].children[0].classList.add("far");
        currentRating = 2;
    }

    if(drawCounter == 30) {
        starContainer.children[starContainer.children.length -2].children[0].classList.remove("fas");
        starContainer.children[starContainer.children.length -2].children[0].classList.add("far");
        currentRating = 1;
    }

    if(drawCounter == 45) {
        starContainer.children[starContainer.children.length -3].children[0].classList.remove("fas");
        starContainer.children[starContainer.children.length -3].children[0].classList.add("far");
        currentRating = 0;
    }
}

function updateTimer() {
    let timer_container = document.getElementById("timer");
    let date = new Date();
    timer.innerHTML = (date.getTime() - startTime) / 1000 ;
}