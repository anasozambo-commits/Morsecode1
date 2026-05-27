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
};

// ---------------- TRANSLATOR ----------------

window.textToMorse = function(){

  const text =
    document.getElementById("input")
    .value
    .toUpperCase();

  const result =
    text
      .split("")
      .map(c => morse[c] || "/")
      .join(" ");

  document.getElementById("output")
    .textContent = result;
};

window.morseToText = function(){

  const codes =
    document.getElementById("input")
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

  document.getElementById("output")
    .textContent = result;
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

//------------------ SOUND --------------------
 
  function beep(ms){

  try {

    const ctx =
      new (window.AudioContext ||
      window.webkitAudioContext)();

    const osc =
      ctx.createOscillator();

    osc.frequency.value = 800;

    osc.connect(ctx.destination);

    osc.start();

    setTimeout(() => {

      osc.stop();
      ctx.close();

    }, ms);

  } catch(err) {

    console.log(err);
  }
}

function wait(ms){

  return new Promise(r =>
    setTimeout(r, ms));
}

window.playMorse = async function(){

  const text =
    document.getElementById("output")
    .textContent;

  for(let s of text){

    if(s === "."){

      beep(100);

      await wait(200);
    }

    else if(s === "-"){

      beep(300);

      await wait(400);
    }
  }
};
  window.playLetter = async function(letter){

  const code = morse[letter];

  for(let s of code){

    if(s === "."){

      beep(100);

      await wait(200);
    }

    else if(s === "-"){

      beep(300);

      await wait(400);
    }
  }
};
  // ---------------- GAME ----------------

let xp = 0;
let level = 1;
let lives = 3;
let combo = 0;
let answer = "";

function randomLetter(){

  const keys =
    Object.keys(morse);

  return keys[
    Math.floor(Math.random() * keys.length)
  ];
}

function generate(){

  let q = "";

  if(level === 1){

    answer = randomLetter();

    q = morse[answer];
  }

  else if(level === 2){

    answer =
      randomLetter() +
      randomLetter();

    q =
      answer
      .split("")
      .map(x => morse[x])
      .join(" / ");
  }

  else {

    answer =
      randomLetter() +
      randomLetter() +
      randomLetter();

    q =
      answer
      .split("")
      .map(x => morse[x])
      .join(" / ");
  }

  document
    .getElementById("question")
    .textContent = q;
}

window.check = function(){

  const val =
    document
      .getElementById("answer")
      .value
      .trim()
      .toUpperCase();

  if(val === answer){

    xp += 10;
    combo++;

    document
      .getElementById("result")
      .textContent =
        "Correct 🎉";

    if(combo % 3 === 0){
      level++;
    }

  } else {

    lives--;
    combo = 0;

   document
      .getElementById("result")
      .textContent =
        "Wrong 😭";
  }

  document
    .getElementById("xp")
    .textContent = xp;

  document
    .getElementById("level")
    .textContent = level;

  document
    .getElementById("combo")
    .textContent = combo;

  document
    .getElementById("lives")
    .textContent = lives;

  document
    .getElementById("answer")
    .value = "";

  if(lives <= 0){

    alert("Game Over 💀");

    xp = 0;
    level = 1;
    combo = 0;
    lives = 3;
  }

  generate();
};

generate();

};
