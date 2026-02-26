// build deck of cards
cards = new Array("◆A", "◆K", "◆Q", "◆J", "◆10", "◆9", "◆8", "◆7", "◆6", "◆5", "◆4", "◆3", "◆2",
    "♣A", "♣K", "♣Q", "♣J", "♣10", "♣9", "♣8", "♣7", "♣6", "♣5", "♣4", "♣3", "♣2",
    "♠A", "♠K", "♠Q", "♠J", "♠10", "♠9", "♠8", "♠7", "♠6", "♠5", "♠4", "♠3", "♠2",
    "♥A", "♥K", "♥Q", "♥J", "♥10", "♥9", "♥8", "♥7", "♥6", "♥5", "♥4", "♥3", "♥2");

    player_cards = new Array();
    banker_cards = new Array();
    empty = new Array("(..)");


    // cards values variables
    let max = 51;
    let min = 0;
    let count = 0;
    let count_banker = 0;
    let card_banker = 0;
    let playerCards = 0;
    let bankerCards = 0;
    let suit = "";
    let result = 0;
    let image_value = '';
    let image_value_banker = '';

    // logic with display
    let cards_elem = document.querySelector('.cards-display');
    let player_elem = document.getElementById("player-sum");
    let banker_elem = document.getElementById("banker-sum");
    let result_elem = document.getElementById("results");
    let banker = document.querySelector('.banker');
    let player = document.querySelector('.player');
    let reset_game = document.querySelector('.reset-game');
    let banker_cards_display = document.getElementById('banker-cards');
    let player_cards_display = document.getElementById('player-cards');

    // money variables
    let saved_money = localStorage.getItem('money_db');
    let money = 0;
    let betError = document.getElementById("betError");
    let bet = 0;

    if (saved_money && !isNaN(saved_money)) {
        money = parseInt(saved_money);
    } else if (!saved_money) {
        money = 500;
    }
    console.log(saved_money);
    document.getElementById("myText").placeholder = "Money: " + money; 
    // user choice variable 
    let userChoice = null;

    // reset button variable
    const reset = document.getElementById("reset");

    // disable reset so user can't use it before game
    reset.disabled = true;


    /*
    First event listener will ensure script runs after html is loaded
    If statements check if button are not null
    If not null adds a event listener to listen for a click
    */
    document.addEventListener("DOMContentLoaded", () => {

        // button variables
        const bankerButton = document.getElementById("bankerButton");
        const playerButton = document.getElementById("playerButton");
        const tieButton = document.getElementById("tieButton");

        /*
            buttons to start game
        */
        bankerButton.addEventListener("click", () => {
            bet = parseInt(myText.value);
            console.log("Bet: " + bet);
            if (isNaN(bet) || bet <= 0) {
                betError.innerHTML = "Invalid bet! Try again";
                return;
            }
            console.log("Banker button clicked"); 
            userChoice = "banker";
            if ((money - bet) >= 0){
                disableButtons();
                startGame();
            }else{
                document.getElementById("myText").value = "";
                betError.innerHTML = "Out of money! Try again."
            }
        });

        playerButton.addEventListener("click", () => {
            bet = parseInt(myText.value);
            if (isNaN(bet) || bet <= 0) {
                betError.innerHTML = "Invalid bet! Try again";
                return;
            } 
            console.log("Player button clicked");
            userChoice = "player";
            if ((money - bet) >= 0){
                disableButtons();
                startGame();
            }else{
                document.getElementById("myText").value = "";
                betError.innerHTML = "Out of money! Try again."
            }
        });

        tieButton.addEventListener("click", () => {
            bet = parseInt(myText.value);
            if (isNaN(bet) || bet <= 0) {
                betError.innerHTML = "Invalid bet! Try again";
                return;
            }
            console.log("Tie button clicked"); 
            userChoice = "tie";
            if ((money - bet) >= 0){
                disableButtons();
                startGame();
            }else {
                document.getElementById("myText").value = "";
                betError.innerHTML = "Out of money! Try again."
            }
        });
    })
    
    document.addEventListener("DOMContentLoaded", () => {
            // reset button logic
        reset.addEventListener("click", () => { 
            if (money <= 0) {
                result_elem.innerHTML = "Received 50 credit bail-out bonus.";
                money += 50;
            }
            enableButtons();
            count = 0;
            count_banker = 0;
            result = 0;
            card = 0;
            card_value = 0;
            card_value_banker = 0;
            playerCards = 0;
            bankerCards = 0;
            banker_cards_display.innerHTML = '';
            player_cards_display.innerHTML = '';
            result_elem.innerHTML = "";
            userChoice = "";
            //draw.disabled = true;
            reset.disabled = true;
            
            updateScore();

        });
    })


    // game logic
    function startGame() {

        reset.disabled = false;

        money -= bet;
        myText.placeholder = "Money: "+money;
        document.getElementById("myText").value = "";

        /*
            For loops draw the cards for the banker and player
        */
        for(let i =0; i<2; ++i){
            let cardImg = document.createElement("img");
            drawCard_player(min, max);
            cardImg.src = "./images/cards/" + image_value + "-" + suit + ".png";
            console.log(cardImg);
            document.getElementById("player-cards").append(cardImg);
            ++playerCards;

        }
        for(let i =0; i<2; ++i){
            let cardImg = document.createElement("img");
            drawCard_banker(min, max);
            cardImg.src = "./images/cards/" + image_value_banker + "-" + suit + ".png";
            console.log(cardImg);
            document.getElementById("banker-cards").append(cardImg);
            ++bankerCards;
        }

        // update score after cards are dealt
        updateScore();
        setTimeout(()=>{
        // can't deal cards if banker already has 3 cards or score is 5+
        if (count_banker <= 5 && bankerCards < 3){
            let cardImg = document.createElement("img");
            drawCard_banker(min, max);
            cardImg.src = "./images/cards/" + image_value_banker + "-" + suit + ".png";
            console.log(cardImg);
            document.getElementById("banker-cards").append(cardImg);
            ++bankerCards;
        }
        // can't deal cards if player already has 3 cards or score is 5+
        if (count <= 5 && playerCards < 3){
            let cardImg = document.createElement("img");
            drawCard_player(min, max);
            cardImg.src = "./images/cards/" + image_value + "-" + suit + ".png";
            console.log(cardImg);
            document.getElementById("player-cards").append(cardImg);
            ++playerCards;
        }
        // update score after new cards are dealt
        updateScore();
        }, 3000);

        
        /* 
            uses drawClicked to see if game over or checks if scores are 5+
            after 3 seconds to give user time to see the cards drawn
        */
        setTimeout(() => {
            if (playerCards > 2 || (count > 5 && count_banker > 5)
                || bankerCards > 2){
            getResult(count, count_banker);
            myText.placeholder = "Money: "+money;
            localStorage.setItem('money_db', money);
            }
        }, 5000)





    }

    // draws a card for the player
    function drawCard_player(min, max) {

        let rand = getRandomInt(min, max);
        card = cards[rand];

        console.log("Player card: ", card);

        card = card.toString();
        player_cards.push(card);

        // finds the suit 
        if (card.charAt(0) == '◆'){
            suit = "D";
        }else if (card.charAt(0) == '♣'){
            suit = "C";
        }else if (card.charAt(0) == '♠'){
            suit = "S";
        }else if (card.charAt(0) == '♥'){
            suit = "H";
        }

        // builds the card image and value
        image_value = card.charAt(1);
        let card_value = card.charAt(1);
        if (card_value == 1) {
            card_value = 0;
            image_value = 10;
        } else if (card_value == 'K' || card_value == 'Q' || card_value == 'J') {
            card_value = 0;
            if (image_value == 'K'){
                image_value = 'K';
            }else if (image_value == 'Q'){
                image_value = 'Q';
            }else if (image_value == 'J'){
                image_value = 'J';
            }
        } else if (card_value == 'A') {
            card_value = 1;
            image_value = 'A';
        }

        //records player value
        count += parseInt(card_value);
        count %= 10;
        console.log("Player hand count: " + parseInt(count));
        
    
        if (cards[1] == undefined) {
            console.log("done!");
        }
    }
    

    // draws a card for the banker
    function drawCard_banker(min, max) {
    
        let rand = getRandomInt(min, max);
        let card_banker = cards[rand];
        
        console.log("Banker card: ", card_banker);

        card_banker = card_banker.toString();
        banker_cards.push(card_banker);

        // finds suit of drawn card
        if (card_banker.charAt(0) == '◆'){
            suit = "D";
        }else if (card_banker.charAt(0) == '♣'){
            suit = "C";
        }else if (card_banker.charAt(0) == '♠'){
            suit = "S";
        }else if (card_banker.charAt(0) == '♥'){
            suit = "H";
        }

        //Builds the image value and value of cards
        image_value_banker = card_banker.charAt(1);
        let card_value_banker = card_banker.charAt(1);
        if (card_value_banker == 1) {
            card_value_banker = 0;
            image_value_banker = 10;
        } else if (card_value_banker == 'K' || card_value_banker == 'Q' || card_value_banker == 'J') {
            card_value_banker = 0;
            if (image_value_banker == 'K'){
                image_value_banker = 'K';
            }else if (image_value_banker == 'Q'){
                image_value_banker = 'Q';
            }else if (image_value_banker == 'J'){
                image_value_banker = 'J';
            }
        } else if (card_value_banker == 'A') {
            card_value_banker = 1;
            image_value_banker = 'A';
        }

        //records banker value
        count_banker += parseInt(card_value_banker);
        count_banker %= 10;
        console.log("Banker count: " + count_banker); // Debug log

    }

    // function to find a random card
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
 
    // outputs the result based on the scores
    function getResult(player, banker) {
        console.log("getResult called with:", player, banker); 
        
        let player_score = parseInt(player);
        let banker_score = parseInt(banker);

        console.log("Player Score:", player_score, "Banker Score:", banker_score);
        
        if (player_score > banker_score) {
            result = "The player hand wins.";
            if (userChoice == "player"){
                money += (bet*2)
            }
        } else if (player_score < banker_score) {
            result = "Banker hand wins!";
            if (userChoice == "banker"){
                money += (bet*2);
            }
        } else {
            result = "Tie!";
            if (userChoice == "tie"){
                money += (bet*8);
            }
        }
        console.log("Result before update:", result);

        result_elem.innerHTML = result;
    }

    // disables buttons
    function disableButtons() {
        bankerButton.disabled = true;
        playerButton.disabled = true;
        tieButton.disabled = true;
    }

    // enables buttons 
    function enableButtons(){
        bankerButton.disabled = false;
        playerButton.disabled = false;
        tieButton.disabled = false;
    }

    //updates score
    function updateScore(){
        player_elem.innerHTML = count;
        banker_elem.innerHTML = count_banker;
    }

