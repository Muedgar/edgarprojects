var socket = io();
let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win;

// const document.querySelector("#score") = document.querySelector("#score");
// const document.querySelector("#topleft") = document.querySelector("#document.querySelector("#topleft")");
// const document.querySelector("#topright") = document.querySelector("#document.querySelector("#topright")");
// const document.querySelector("#bottomleft") = document.querySelector("#document.querySelector("#bottomleft")");
// const document.querySelector("#bottomright") = document.querySelector("#document.querySelector("#bottomright")");
// const strictButton = document.querySelector("#strict");
// const document.querySelector("#on") = document.querySelector("#on");
// const document.querySelector("#start") = document.querySelector("#start");

document.getElementById("strict").addEventListener('click', (event) => {
  if (document.querySelector("#strict").checked === true) {
    strict = true;
  } else {
    strict = false;
  }
});

document.querySelector("#on").addEventListener('click', (event) => {
  if (document.querySelector("#on").checked === true) {
    on = true;
    document.querySelector("#score").innerHTML = "-";
  } else {
    on = false;
    document.querySelector("#score").innerHTML = "";
    clearColor();
    clearInterval(intervalId);
  }
});

document.querySelector("#start").addEventListener('click', (event) => {
  if (on || win) {
    play();
  }
});

function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  document.querySelector("#score").innerHTML = 1;
  good = true;
  for (var i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }
  compTurn = true;

  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash === turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      if (order[flash] === 1) one();
      if (order[flash] === 2) two();
      if (order[flash] === 3) three();
      if (order[flash] === 4) four();
      flash++;
    }, 200);
  }
}

function one() {
  if (noise) {
    let audio = document.getElementById("clip1");
    audio.play();
  }
  noise = true;
  document.querySelector("#topleft").style.backgroundColor = "lightgreen";
}

function two() {
  if (noise) {
    let audio = document.getElementById("clip2");
    audio.play();
  }
  noise = true;
  document.querySelector("#topright").style.backgroundColor = "tomato";
}

function three() {
  if (noise) {
    let audio = document.getElementById("clip3");
    audio.play();
  }
  noise = true;
  document.querySelector("#bottomleft").style.backgroundColor = "yellow";
}

function four() {
  if (noise) {
    let audio = document.getElementById("clip4");
    audio.play();
  }
  noise = true;
  document.querySelector("#bottomright").style.backgroundColor = "lightskyblue";
}

function clearColor() {
  document.querySelector("#topleft").style.backgroundColor = "darkgreen";
  document.querySelector("#topright").style.backgroundColor = "darkred";
  document.querySelector("#bottomleft").style.backgroundColor = "goldenrod";
  document.querySelector("#bottomright").style.backgroundColor = "darkblue";
}

function flashColor() {
  document.querySelector("#topleft").style.backgroundColor = "lightgreen";
  document.querySelector("#topright").style.backgroundColor = "tomato";
  document.querySelector("#bottomleft").style.backgroundColor = "yellow";
  document.querySelector("#bottomright").style.backgroundColor = "lightskyblue";
}

document.querySelector("#topleft").addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(1);
    check();
    one();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

document.querySelector("#topright").addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(2);
    check();
    two();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

document.querySelector("#bottomleft").addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(3);
    check();
    three();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

document.querySelector("#bottomright").addEventListener('click', (event) => {
  if (on) {
    playerOrder.push(4);
    check();
    four();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
})

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false;

  if (playerOrder.length === 3 && good) {
    winGame();
  }

  if (good === false) {
    flashColor();
    document.querySelector("#score").innerHTML = "NO!";
    setTimeout(() => {
      document.querySelector("#score").innerHTML = turn;
      clearColor();

      if (strict) {
        play();
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);

    noise = false;
  }

  if (turn === playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    document.querySelector("#score").innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

async function winGame() {
  flashColor();
  document.querySelector("#score").innerHTML = "WIN!";
  on = false;
  win = true;

  let name = prompt("Enter User Name (for each win 40 points will be added to leaderboard):");
  // while(name!=null) {
  //   name = prompt("Enter User Name (for each win 40 points will be added to leaderboard):");
  // }
  console.log(name);
  if(name==null) {
    return;
  }
  // send data to db;
  let points = 40;
  try {
    await fetch(`/name/${name}/points/${points}`).then(d=> {
    updateTable();
    // use socket io to broadcast to other nodes to update there tables
    socket.emit('messageUpdate', "update view users table");
  }).catch(e=>new Error(e));
  } catch (error) {
    console.log("Error"+error.message);
  }
}

async function updateTable() {
  try {
    await fetch(`/users`)
    .then(d=>d.json()).then(d=>{
      populateTable(d);
    }).catch(e=>new Error(e));
  } catch (error) {
    console.log("Error"+error.message);
  }
}


function populateTable(data) {
  let table = document.getElementById("usersTable");
  

 while (table.firstChild) {
     table.removeChild(table.firstChild);
  }

  let thead = document.createElement("thead");
  let th1 = document.createElement("th");
      th1.innerHTML = "Name";
  let th2 = document.createElement("th");
      th2.innerHTML = "Points";

      //tr.appendChild(th1);
      thead.appendChild(th1);
      thead.appendChild(th2);

      table.appendChild(thead);

      // sort based on points

      if(data.length>1) {
        for(let i=0;i<data.length;i++) {
          for(let j=i+1;j<data.length;j++) {
            if(data[i].points < data[j].points) {
              let temp = data[j];
              data[j] = data[i];
              data[i] = temp;
            }
          }
        }
      }


      // display in table.
      for(let i=0;i<data.length;i++) {
        const {name,points} = data[i];
        
       
    
          let tr = document.createElement("tr");
    
          let td1 = document.createElement("td");
          td1.setAttribute("data-th", "Name");
          td1.innerHTML = `${name}`;
    
          let td2 = document.createElement("td");
          td2.setAttribute("data-th", "Points");
          td2.innerHTML = `${points}`;
    
    
    
          tr.appendChild(td1);
          tr.appendChild(td2);
    
          table.appendChild(tr);
      }
}

socket.on('updateYourTable', function(msg) {
  updateTable();
});

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