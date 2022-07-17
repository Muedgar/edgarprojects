document.getElementById("rules-open-button").addEventListener('click',() => {
    document.querySelector(".rules-modal-container").style.display = "block";
})

document.getElementById("rules-close-button").addEventListener('click',() => {
    document.querySelector(".rules-modal-container").style.display = "none";
})


// game logic starts below:

let picked = false;
let userPick = null;
let computerPick = null;
let winner = null;

function receivePick() {
    if(picked) return;
    console.log("running receivePick()");
    console.log("calling processPick()");
    picked = true;
    processPick();
}

let arr = ["paper","rock","scissor"];

function processPick() {
    let rand = Math.floor(Math.random() * 3);

    if(rand == 0) {
        rand = 2;
    }else if(rand == 2) {
        rand = 1;
    }
    
    computerPick = arr[rand];
    console.log("running processPick()");
    console.log("calling chooseWinner()");
    chooseWinner(userPick,computerPick);
}

document.getElementById("paper").addEventListener("click",() => {
    console.log("clicked paper");
    userPick = "paper";
    receivePick();
    
    
});

document.getElementById("rock").addEventListener("click",() => {
    console.log("clicked rock");
    userPick = "rock";
    receivePick();
    
});

document.getElementById("scissor").addEventListener("click",() => {
    console.log("clicked scissor");
    userPick = "scissor";
    receivePick();
    
});

function chooseWinner(userPick,computerPick) {
    console.log(userPick,computerPick);
    if(userPick == "rock") {
        if(computerPick == "rock") {
            winner = "none";
            printWinner();
            return;
        }
        if(computerPick == "paper") {
            winner = "computer";
            printWinner();
            return;
        }
        if(computerPick == "scissor") {
            winner = "user";
            printWinner();
            return;
        }
    }else if(userPick == "paper") {
        if(computerPick == "rock") {
            winner = "user";
            printWinner();
            return;
        }
        if(computerPick == "paper") {
            winner = "none";
            printWinner();
            return;
        }
        if(computerPick == "scissor") {
            winner = "computer";
            printWinner();
            return;
        }
    }else if(userPick == "scissor") {
        if(computerPick == "rock") {
            winner = "computer";
            printWinner();
            return;
        }
        if(computerPick == "paper") {
            winner = "user";
            printWinner();
            return;
        }
        if(computerPick == "scissor") {
            winner = "none";
            printWinner();
            return;
        }
    }else {
        return;
    }
}
let message = null;
function printWinner() {
    // set display styles to visible
    console.log("running printWinner()");
    console.log(winner);
    if(winner=="user") {
        message = `You are the winner, because computer picked: "${computerPick}" while you picked: "${userPick}" waiting to restart game in ... `;
        // update game score
        document.getElementById("gamescore").innerHTML = Number(document.getElementById("gamescore").innerHTML) + 1;
        document.getElementById("infoMessage").innerHTML = message;
    }
    if(winner=="computer") {
        message = `Computer is the winner, because computer picked: "${computerPick}" while you picked: "${userPick}" waiting to restart game in ... `;
        document.getElementById("infoMessage").innerHTML = message;
    }
    if(winner == "none") {
        message = `No winner, because computer picked: "${computerPick}" while you picked: "${userPick}" waiting to restart game in ... `;
        document.getElementById("infoMessage").innerHTML = message;
    }

    let count = 10;
    
    let timerId = setInterval(() => {
        document.getElementById("infoCounter").innerHTML = count;
        count--;
        if(count == -1) {
            clearInterval(timerId);
            
            picked = false;
            document.getElementById("infoMessage").innerHTML = "";
            document.getElementById("infoCounter").innerHTML = "";
        }
    }, 1000);
}; 

async function getPage(page) {

    if(page == "one") {
  
      // await fetch("/one").then(d=>d).catch(e=>new Error(e.message));
      window.location = "/one";
  
      return;
    }
  
    if(page == "two") {
  
      // await fetch("/two").then(d=>d).catch(e=>new Error(e.message));
      window.location = "/two";
      return;
    }
  
  }