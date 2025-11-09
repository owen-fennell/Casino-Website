cards = new Array("◆A", "◆K", "◆Q", "◆J", "◆10", "◆9", "◆8", "◆7", "◆6", "◆5", "◆4", "◆3", "◆2",
                        "♣A", "♣K", "♣Q", "♣J", "♣10", "♣9", "♣8", "♣7", "♣6", "♣5", "♣4", "♣3", "♣2",
                        "♠A", "♠K", "♠Q", "♠J", "♠10", "♠9", "♠8", "♠7", "♠6", "♠5", "♠4", "♠3", "♠2",
                        "♥A", "♥K", "♥Q", "♥J", "♥10", "♥9", "♥8", "♥7", "♥6", "♥5", "♥4", "♥3", "♥2");
user_cards = new Array();
dealer_cards = new Array();

let max = 51;
let min = 0;
let count = 0;
let count_dealer = 0;
let card_dealer = 0;
let result = 0;
let money = 500;
let bet = 0;
let doubledown = false;
//let cards_elem = document.querySelector('.cards-display');
let hit_card = document.getElementById('hit');
let stand_card = document.getElementById('stand');
let doubledown_card = document.getElementById('double');
let count_elem = document.getElementById('your-sum');
let dealer_elem = document.getElementById('dealer-sum');
let result_elem = document.getElementById('results');
let place_bet = document.getElementById('bet');
let reset_game = document.getElementById('reset');
//let user_cards_display = document.querySelector('.user-cards-images') || document.createElement('div');
//let dealer_cards_display = document.querySelector('.dealer-cards-images') || document.createElement('div');
let user_cards_display = document.getElementById('your-cards');
let dealer_cards_display = document.getElementById('dealer-cards');
//let cards_status_elem = document.querySelector('.card-status-display');
const back = createCard(`images/cards/back.png`);

hit_card.disabled = true;
stand_card.disabled = true;
doubledown_card.disabled = true;
let saved_money = localStorage.getItem('money_db');
if (saved_money && !isNaN(saved_money)) {
    money = parseInt(saved_money);
} else if (!saved_money) {
    money = 500;
}

document.getElementById("myText").placeholder = "Money: "+money; 

function cardToImage(card) {
    let suit = card.charAt(0);
    let value = card.charAt(1);
    let suit_code = 0;
    switch (suit) {
        case '◆':
            suit_code = 'D';
            break;
        case '♣':
            suit_code = 'C';
            break;
        case '♠':
            suit_code = 'S';
            break;
        case '♥':
            suit_code = 'H';
            break;
    }
    if (value == '1') {
        value = '10';
    }
    
    let path = `images/cards/${value}-${suit_code}.png`; 
    console.log(path);
    return path;

}

function createCard(card) {
    const img = document.createElement('img');
    img.src = cardToImage(card);
    img.alt = card;
    img.className = 'card-image';
    img.style.height = '120px';
    img.style.margin = '0 5px';
    return img;
} 

hit_card.addEventListener("click",()=>{
    if (max > 0) {
        drawCard(min, max);
        max = max-1;
        updateDisplay();
    }
})

stand_card.addEventListener("click", ()=>{
    stand_card.disabled = true;
    count = count + " | User Stands";
    hit_card.disabled = true;
    updateDisplay();
    if (max > 0){
        console.log("Stand clicked: Starting dealer draw");
        drawCard_dealer(min, max);
        max = max - 1;
    }
});

doubledown_card.addEventListener("click",()=>{
    doubledown = true;
    money -= bet;
    if (max > 0) {
        drawCard(min, max);
        max = max - 1;
        updateDisplay();
    }
    count = count + " | Double Down!"
    hit_card.disabled = true;
    stand_card.disabled = true;
    doubledown_card.disabled = true;
    if (!count.includes("Bust")) {
        setTimeout(() => {
            drawCard_dealer(min, max);
            max = max - 1;
        }, 1000);
    } else {
        getResult(count, count_dealer);
    }
});

place_bet.addEventListener("click",()=>{
    bet = parseInt(myText.value);
    if (isNaN(bet) || bet <= 0) {
        myText.placeholder = "Invalid bet! Try again";
        return;
    }
    console.log("Bet:", bet);
    if ((money-bet) >= 0) {
        hit_card.disabled = true;
        stand_card.disabled = true;
        doubledown_card.disabled = true;     
        money -= bet;
        myText.placeholder = "Money: "+money;
        place_bet.disabled = true;
        if (money < bet) {
            doubledown_card.disabled = true;
        }
        if (user_cards.length == 0 && dealer_cards.length == 0) {
            setTimeout(() => {
                drawCard(min, max);
                max = max-1;
                updateDisplay();
                
                setTimeout(() => {
                    drawCard(min, max);
                    max = max-1;
                    updateDisplay();
                    if (doubledown) {
                        count = count + " | Double Down!";
                    }
                    if (user_cards.length == 2 && parseInt(count) == 21) {
                        count = count + " | Blackjack!";
                        updateDisplay();
                        disableButtons();
                        setTimeout(() => {
                            console.log("Player got blackjack - Starting dealer draw to check for push"); 
                            drawCard_dealer(min, max);
                        }, 1000);
                    }
                }, 1000);
                setTimeout(() => {
                    drawCard_initial_dealer(min, max);
                    max = max-1;
                    updateDisplay(); // Update display after dealer card
                    hit_card.disabled = false;
                    stand_card.disabled = false;
                    doubledown_card.disabled = false;                   
                }, 2000);
            }, 1000)
            }
    } else {
        myText.placeholder = "Out of money! Try again."
    }
    document.getElementById("myText").value = "";
})

reset_game.addEventListener("click", ()=>{
    if (money <= 0) {
        result_elem.innerHTML = "Received 50 credit bail-out bonus.";
        money += 50;
    }
    myText.placeholder = "Money: " + money;
    place_bet.disabled = false;
    count = 0;
    count_dealer = 0;
    result = 0;
    card = 0;
    card_value = 0;
    card_dealer = 0;
    doubledown = false;
    max = 51;
    min = 0;
    user_cards = [];
    dealer_cards = [];  
    user_cards_display.innerHTML = '<img id="hidden" src="images/cards/back.png">';
    dealer_cards_display.innerHTML = '<img id="hidden" src="images/cards/back.png">';
    //reset deck
    cards = new Array("◆A", "◆K", "◆Q", "◆J", "◆10", "◆9", "◆8", "◆7", "◆6", "◆5", "◆4", "◆3", "◆2",
        "♣A", "♣K", "♣Q", "♣J", "♣10", "♣9", "♣8", "♣7", "♣6", "♣5", "♣4", "♣3", "♣2",
        "♠A", "♠K", "♠Q", "♠J", "♠10", "♠9", "♠8", "♠7", "♠6", "♠5", "♠4", "♠3", "♠2",
        "♥A", "♥K", "♥Q", "♥J", "♥10", "♥9", "♥8", "♥7", "♥6", "♥5", "♥4", "♥3", "♥2");
    updateDisplay();
    updateDisplay_dealer();
    //cards_elem.innerHTML = "(..)";
    count_elem.innerHTML = "";
    dealer_elem.innerHTML = "";
});

function drawCard_dealer(min, max) {
    if (max <= 0) {
        console.log("No cards left to draw");
        return;
    }
    
    let rand = getRandomInt(min, max);
    let card_dealer = cards[rand];
    let card_value = card_dealer.charAt(1);
    dealer_cards.push(card_dealer);

    console.log("charat1: "+card_dealer.charAt(1));
    console.log("Dealer draws: " + card_dealer); // Debug log
    if (card_value == 1) {
        card_value = 10;
    } else if (card_value == 'K' || card_value == 'Q' || card_value == 'J') {
        card_value = 10;
    } else if (card_value == 'A') {
        card_value = 11;
    }
    count_dealer += parseInt(card_value);
    console.log("Dealer count: " + count_dealer); // Debug log
    updateDisplay();
    
    cards.splice(rand, 1);
    dealer_elem.innerHTML = count_dealer; 

    if (parseInt(count_dealer) > 21) {
        count_dealer = count_dealer + " | Dealer Busts!";
        updateDisplay();
        setTimeout(() => {
            getResult(count, count_dealer);
        }, 1000);
    }
    else if (parseInt(count_dealer) >= 17 && parseInt(count_dealer) <= 20) {
        setTimeout(() => {
            count_dealer = count_dealer + " | Dealer Stands";
            updateDisplay();
            setTimeout(() => {
                getResult(count, count_dealer);
            }, 1000);
        }, 1000);
    } else if (parseInt(count_dealer) == 21) {
        setTimeout(() => {
            count_dealer = count_dealer + " | Blackjack!";
            updateDisplay();
            setTimeout(() => {
                getResult(count, count_dealer);
            }, 1000);
        }, 1000);
    } else {
        setTimeout(() => {
            drawCard_dealer(min, max - 1);
        }, 1000);
    }
    if (cards[1] == undefined) {
        console.log("done!");
    }
}

function drawCard_initial_dealer(min, max) {
    if (max <= 0) {
        console.log("No cards left to draw");
        return;
    }
    
    let rand = getRandomInt(min, max);
    let card_dealer = cards[rand];
    let card_value = card_dealer.charAt(1);
    dealer_cards.push(card_dealer);

    if (card_value == 1) {
        card_value = 10;
    } else if (card_value == 'K' || card_value == 'Q' || card_value == 'J') {
        card_value = 10;
    } else if (card_value == 'A') {
        card_value = 11;
    }
    count_dealer += parseInt(card_value);
    console.log("Dealer initial card: " + card_dealer);
    console.log("Dealer initial count: " + count_dealer);
    
    cards.splice(rand, 1);
    updateDisplay();
}

function drawCard(min, max) {
    let rand = getRandomInt(min, max);
    let card = cards[rand];
    let card_value = card.charAt(1);
    user_cards.push(card);
    if (card_value == 1) {
        card_value = 10;
    } else if (card_value == 'K' || card_value == 'Q' || card_value == 'J') {
        card_value = 10;
    } else if (card_value == 'A') {
        card_value = 11;
    }
    count += parseInt(card_value);
    console.log("Player count: " + parseInt(count));
    cards.splice(rand, 1);

    if (parseInt(count) == 21) {
        count = count + " | Blackjack!";
        updateDisplay();
        disableButtons();        
        setTimeout(() => {
            console.log("Player got blackjack - Starting dealer draw"); 
            drawCard_dealer(min, max);
        }, 1000);
        return count;
    }

    if (parseInt(count) > 21) {
        count = count + " | Bust!";
        updateDisplay();
        disableButtons();        
        getResult(count, count_dealer);
    }
    if (cards[1] == undefined) {
        console.log("done!");
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getResult(player, dealer) {
    console.log("getResult called with:", player, dealer); 
    
    let player_score = parseInt(player.split(' ')[0]);
    let dealer_score = parseInt(String(dealer).split(' ')[0]);
    console.log("Player Score:", player_score, "Dealer Score:", dealer_score);
    let win = parseInt(bet);
    
    if (player_score > 21) {
        result = "Bust! You lose.";
    } else if (dealer_score > 21) {
        result = "Dealer busts. You win!";
        if (doubledown) {
            money += (win*4);
        } else {
            money += (win*2)
        }
    } else if (player_score > dealer_score) {
        result = "You beat the dealer. You win!";
        if (doubledown) {
            money += (win*4);
        } else {
            money += (win*2)
        }
    } else if (player_score < dealer_score) {
        result = "Dealer wins!";
    } else if (player_score == 21 && user_cards.length == 2) {
        result = "Blackjack! You win!";
        if (doubledown) {
            money += (win*4);
        } else {
            money += Math.floor(win*2.5)
        }
    } else {
        result = "Push!";
        if (doubledown) {
            money += (win*2);
        } else {
            money += win;
        }
    }
    console.log("Result before update:", result);
    updateDisplay();
    updateDisplay_result();
    resultReset();
}

function updateCardImages() {
    if (user_cards.length > 0) {
        user_cards_display.innerHTML = '';
        user_cards.forEach(card => {
            user_cards_display.appendChild(createCard(card));
        });    
    }
    if (dealer_cards.length > 0) {
        dealer_cards_display.innerHTML = '';
        dealer_cards.forEach(card => {
            dealer_cards_display.appendChild(createCard(card));
        });    
    }
}

function updateDisplay() {
    /** cards_status_elem.innerHTML = "Your Cards: " + user_cards.join(' ') + 
    " &nbsp;&nbsp;&nbsp;&nbsp; Dealer Cards: "
    if (dealer_cards.length > 0) {
        cards_status_elem.innerHTML = cards_status_elem.innerHTML + dealer_cards.join(' ');
    } else {
        cards_status_elem.innerHTML =  "(..)"; 
    } **/
    updateCardImages();
    count_elem.innerHTML = count;
    dealer_elem.innerHTML = count_dealer;
    myText.placeholder = "Money: "+money;
    localStorage.setItem('money_db', money);
}

function updateDisplay_dealer() {
    dealer_elem.innerHTML = count_dealer;
    updateCardImages();
}

function updateDisplay_result() {
    console.log("result_elem content before:", result_elem.innerHTML);
    result_elem.innerHTML = result;
    console.log("result_elem content after:", result_elem.innerHTML);
}

function disableButtons() {
    hit_card.disabled = true;
    stand_card.disabled = true;
    doubledown_card.disabled = true;
    place_bet.disabled = true;
}

function resultReset() {
    setTimeout(() => {
        reset_game.click();
    }, 3000);
}