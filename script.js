window.onload = () => {

const morse = {
  A: ".-", B: "-...", C: "-.-.", D: "-..",
  E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",

  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----."
};

// ---------------- NAVIGATION ----------------

window.show = function(id){

  document
    .querySelectorAll(".section")
    .forEach(sec => sec.style.display = "none");

  document
    .getElementById(id)
    .style.display = "block";

  document
    .querySelectorAll(".menu button")
    .forEach(btn => btn.classList.remove("activeButton"));

  event.target.classList.add("activeButton");
};

// ---------------- TRANSLATOR ----------------

window.textToMorse = function(){

  const text =
    document
      .getElementById("input")
      .value
      .toUpperCase();

  const result =
    text
      .split("")
      .map(c => morse[c] || "/")
      .join(" ");

  document
    .getElementById("output")
    .textContent = result;
};

window.morseToText = function(){

  const codes =
    document
      .getElementById("input")
      .value
      .trim()
      .split(" ");

  let result = "";

  codes.forEach(code => {

    for(let key in morse){

      if(morse[key] === code){
        result += key;
      }
    }
  });

  document
    .getElementById("output")
    .textContent = result;
};

// ---------------- SOUND SYSTEM ----------------

function beep(ms){

  try {

    const ctx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

    const osc =
      ctx.createOscillator();

    osc.frequency.value = 800;

    osc.connect(ctx.destination);

    osc.start();

    setTimeout(() => {

      osc.stop();
      ctx.close();

    }, ms);

  } catch(err){

    console.log(err);
  }
}

function wait(ms){

  return new Promise(resolve =>
    setTimeout(resolve, ms));
}

window.playMorse = async function(){

  const text =
    document
      .getElementById("output")
      .textContent;

  for(let symbol of text){

    if(symbol === "."){

      beep(100);

      await wait(200);
    }

    else if(symbol === "-"){

      beep(300);

      await wait(400);
    }
  }
};

// ---------------- PLAY LETTER ----------------

window.playLetter = async function(letter){

  const code = morse[letter];

  for(let symbol of code){

    if(symbol === "."){

      beep(100);

      await wait(200);
    }

    else if(symbol === "-"){

      beep(300);

      await wait(400);
    }
  }
};

// ---------------- ALPHABET ----------------

const list =
  document.getElementById("alphabetList");

for(let key in morse){

  list.innerHTML += `

    <div class="letterBox"
         onclick="playLetter('${key}')">

      ${key} = ${morse[key]}

    </div>

  `;
}

// ---------------- GAME SYSTEM ----------------

let xp = 0;
let level = 1;
let lives = 3;
let combo = 0;
let answer = "";
let timer;
let time = 20;

// ---------------- RANDOM LETTER ----------------

function randomLetter(){

  const keys =
    Object.keys(morse);

  return keys[
    Math.floor(
      Math.random() * keys.length
    )
  ];
}

// ---------------- GENERATE QUESTION ----------------

function generate(){

  let question = "";

  // LEVEL 1
  if(level === 1){

    answer = randomLetter();

    question = morse[answer];
  }

  // LEVEL 2
  else if(level === 2){

    answer =
      randomLetter() +
      randomLetter();

    question =
      answer
        .split("")
        .map(x => morse[x])
        .join(" / ");
  }

  // LEVEL 3
  else if(level === 3){

    answer =
      randomLetter() +
      randomLetter() +
      randomLetter();

    question =
      answer
        .split("")
        .map(x => morse[x])
        .join(" / ");
  }

  // LEVEL 4+
  else {

    const words = [
      "HELLO",
      "WORLD",
      "MORSE",
      "CODE",
      "SPACE",
      "RADIO",
      "TRAIN",
      "SIGNAL",
      "GAME",
      "LEVEL"
    ];

    answer =
      words[
        Math.floor(
          Math.random() * words.length
        )
      ];

    question =
      answer
        .split("")
        .map(x => morse[x])
        .join(" / ");
  }

  document
    .getElementById("question")
    .textContent = question;

  resetTimer();
}

// ---------------- TIMER ----------------

function resetTimer(){

  clearInterval(timer);

  time = 20;

  updateTimer();

  timer = setInterval(() => {

    time--;

    updateTimer();

    if(time <= 0){

      lives--;

      combo = 0;

      document
        .getElementById("result")
        .textContent =
          "Too Slow ⏱️";

      beep(80);

      if(lives <= 0){

        gameOver();

      } else {

        generate();
      }

      updateUI();
    }

  },1000);
}

function updateTimer(){

  const timeEl =
    document.getElementById("time");

  timeEl.textContent = time;

  if(time <= 3){

    timeEl.classList.add("lowTime");

  } else {

    timeEl.classList.remove("lowTime");
  }
}

// ---------------- CHECK ANSWER ----------------

window.check = function(){

  const value =
    document
      .getElementById("answer")
      .value
      .trim()
      .toUpperCase();

  if(value === answer){

    xp += 10;

    combo++;

    beep(200);

    document
      .getElementById("result")
      .textContent =
        "Correct 🎉";

    // LEVEL UP
    if(combo % 3 === 0){

      level++;
    }

  } else {

    lives--;

    combo = 0;

    beep(80);

    document
      .getElementById("result")
      .textContent =
        "Wrong 😭";
  }

  document
    .getElementById("answer")
    .value = "";

  if(lives <= 0){

    gameOver();

  } else {

    generate();
  }

  updateUI();
};

// ---------------- GAME OVER ----------------

function gameOver(){

  clearInterval(timer);

  alert(
    "Game Over 💀\n" +
    "Final XP: " + xp
  );

  xp = 0;
  level = 1;
  lives = 3;
  combo = 0;

  updateUI();

  generate();
}

// ---------------- UPDATE UI ----------------

function updateUI(){

  document
    .getElementById("xp")
    .textContent = xp;

  document
    .getElementById("level")
    .textContent = level;

  document
    .getElementById("lives")
    .textContent = lives;

  document
    .getElementById("combo")
    .textContent = combo;

  const percent =
    (xp % 30) * 3.33;

  document
    .getElementById("barFill")
    .style.width =
      percent + "%";
}

// ---------------- START GAME ----------------

generate();

updateUI();

};
