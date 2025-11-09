(function () {
    "use strict";

    let money = 0;
    let saved_money = localStorage.getItem('money_db');
    if (saved_money && !isNaN(saved_money)) {
        money = parseInt(saved_money);
    } else if (!saved_money) {
        money = 500;
    }
    let alert = 0;

    const items = [
    "7️⃣",
    "❌",
    "🍓",
    "🍋",
    "🍉",
    "🍒",
    "💵",
    "🍊",
    "🍎"
    ];
    document.querySelector(".info").textContent = items.join(" ");
    const doors = document.querySelectorAll(".door");
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", init);

    async function spin() {
        if (money < 10) {
            alert("Not enough money to spin!");
            return;
        }
        money -= 10;
        updateMoneyDisplay();
        localStorage.setItem('money_db', money);
        spinner.disabled = true;

        init(false, 1, 2);
        let finalSymbols = [];
        updateResult("Spinning...");
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 100));

            const firstBox = boxes.querySelector(".box");
            if (firstBox) {
                finalSymbols.push(firstBox.textContent);
            }
        }
        if (finalSymbols.length === 3 && 
            finalSymbols[0] === finalSymbols[1] && 
            finalSymbols[1] === finalSymbols[2]) {
            // Award 500 money for a match
            money += 500;
            alert = "Congratulations! You won 500!";
            
            // Save updated money to localStorage
            localStorage.setItem('money_db', money);
            updateMoneyDisplay();
        } else {
            alert = "You lose!";
        }
        setTimeout(() => {
            updateResult(alert);
        }, 1750);
        setTimeout(() => {
            reseter.click();
            spinner.disabled = false;
        }, 2500);
    }
    function updateMoneyDisplay() {
        document.querySelector(".moneycounter").textContent = "Money: " + money;
    }
    function updateResult(result) {
        document.querySelector(".result").textContent = result;
    }
    function init(firstInit = true, groups = 1, duration = 1) {
        document.querySelector(".moneycounter").textContent = "Money: " + money;
        document.querySelector(".result").textContent = "";
    for (const door of doors) {
        if (firstInit) {
            door.dataset.spinned = "0";
        } else if (door.dataset.spinned === "1") {
            return;
        }

        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);

        const pool = ["❓"];
        if (!firstInit) {
            const arr = [];
            for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
        }
        pool.push(...shuffle(arr));
        

        boxesClone.addEventListener(
            "transitionstart",
            function () {
                door.dataset.spinned = "1";
                this.querySelectorAll(".box").forEach((box) => {
                box.style.filter = "blur(1px)";
                });
            },
            { once: true }
        );

        boxesClone.addEventListener(
            "transitionend",
            function () {
                this.querySelectorAll(".box").forEach((box, index) => {
                box.style.filter = "blur(0)";
                if (index > 0) this.removeChild(box);
                });
            },
            { once: true }
        );
        }

        for (let i = pool.length - 1; i >= 0; i--) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.style.width = door.clientWidth + "px";
            box.style.height = door.clientHeight + "px";
            box.textContent = pool[i];
            // if(pool[0] == pool[1] && pool[1] == pool[2]){
            //     money += 500;
            //     moneycounter.placeholder = "Money: " + money;
            // }
            boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${
          door.clientHeight * (pool.length - 1)
        }px)`;
        door.replaceChild(boxesClone, boxes);
        }
    }
    

    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
        }
    return arr;
    }

    init();
})();
