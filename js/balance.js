const SHARED_BALANCE_KEY = 'casino_balance';

function getSharedBalance() {
    const savedMoney = localStorage.getItem(SHARED_BALANCE_KEY)
    if (savedMoney && !isNaN(savedMoney)) {
        return parseInt(savedMoney);
    } else {
        setSharedBalance(500); //if its a new player reset their balance
        return 500;
    }
}

function setSharedBalance(amount) {
    localStorage.setItem(SHARED_BALANCE_KEY, amount);
}

function updateSharedBalance(amount) {
    const startingMoney = localStorage.getItem(SHARED_BALANCE_KEY);
    const endingMoney = startingMoney + amount;
    setSharedBalance(endingMoney);
    return endingMoney;
}

function canAffordBet(betAmount) {
    const currentBalance = getSharedBalance();
    if (currentBalance - betAmount >= 0) {
        return true;
    } else {
        return false;
    }
    return false;
}