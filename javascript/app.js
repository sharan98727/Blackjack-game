//defining an object blackjack game
let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    //used for mapping a particular string to its integer value
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'isStand': false,
    'turnsOver': false,
}
const YOU = blackjackGame['you']; ////making it easier to access the stuff later
const DEALER = blackjackGame['dealer'];
const HITSOUND = new Audio('./sounds/swish.m4a');
const WINSOUND = new Audio('./sounds/win.mp3');
const LOSTSOUND = new Audio('./sounds/aww.mp3');
const DRAWSOUND = new Audio('./sounds/draw.mp3');

//accessing an id and adding event listener to each button
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-Stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-Deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) //checking if you player turn is finished or not
    {
        let card = randomCard();
        console.log(card);
        UpdateScore(card, YOU); //updates the score backend
        showCard(card, YOU); //calling the showcard function passing its arguements
        console.log(YOU['score']);
        showScore(YOU); //calling the showscore function which shows the score of the activeplayer frontend

    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    //here we are accessing random index of cards array in blackjackobject
    return blackjackGame['cards'][randomIndex]; //returns the number present in the specific index
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img'); //creating an image element and accessing it
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage); //making the new child in that div
        HITSOUND.play();
    }
}
//gets executed once we click on deal
function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        //stores all the images as an array
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        console.log(yourImages);
        //removing all the images to reset everything
        for (let i = 0; i < yourImages.length; i++) {

            yourImages[i].remove();

        }
        for (let i = 0; i < dealerImages.length; i++) {

            dealerImages[i].remove();
        }
        //resetting the score present and all the values to predefined values.
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';

        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = false;
        blackjackGame['isStand'] = false;
    }
}

function UpdateScore(card, activePlayer) {
    if (card === 'A') {
        //if adding 11 keeps me below 21 then add 11, otherwise 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}
// showing the score on screen in the place  span
function showScore(activePlayer) {
    //checkiing the conditions for A
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function dealerLogic() {
    blackjackGame['isStand'] = true; //making isStand= true so that we can deactivate the hit button
    let card = randomCard();
    showCard(card, DEALER);
    UpdateScore(card, DEALER);
    showScore(DEALER);

    if (DEALER['score'] > 16) {
        blackjackGame['turnsOver'] = true; //here we are deactivating the dealer stand option once he gets 16
        let winner = computeWinner();
        showResult(winner);
    }
}
//computes  who wins and just return who has won
//update the wins,losses,draws

function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        //condition: Higher score than dealer or when the dealer busts but you are under 21
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            console.log('you won!');
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            console.log('You lost');
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            console.log('draw!');
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('you lost!');
        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log('draw');
    }
    console.log('winner is ', winner);
    return winner;
}
// we are showing the result on the screen using this function
function showResult(winner) {
    let message, messageColor; //defining 2 variables to store the result

    if (blackjackGame['turnsOver'] === true) {

        if (winner === YOU) {
            message = 'You won!';
            messageColor = 'rgb(18, 87, 4)';
            WINSOUND.play();
        } else if (winner === DEALER) {
            message = 'You lost!'
            messageColor = 'red';
            LOSTSOUND.play();
        } else {
            message = 'draw!';
            messageColor = 'black';
            DRAWSOUND.play();
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;

    }
}