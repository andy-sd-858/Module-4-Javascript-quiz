var timer = document.getElementById("timer");

var secondsLeft = 80;

var scoresDiv = document.getElementById("scores-div");

var buttonsDiv = document.getElementById("buttons")

var viewScoresBtn = document.getElementById("view-scores")

var startButton = document.getElementById("start-button");
    startButton.addEventListener("click", setTime);

var questionDiv = document.getElementById("question-div");

var choices = document.getElementById("choices");

var results = document.getElementById("results");

var emptyArray = [];

var questionCount = 0;

var score = 0

var storedArray = JSON.parse(window.localStorage.getItem("highScores"));

function setTime() {
  displayQuestions();
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

function displayQuestions() {
  removeEls(startButton);

  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      var el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation();

        if (el.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 5;
          secondsLeft = secondsLeft - 10;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
  }
}


function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  var initialsInput = document.createElement("input");
  var postScoreBtn = document.createElement("input");

  results.innerHTML = `You scored ${score} points. Enter initials: `;
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score.");
  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var scoresArray = defineScoresArray(storedArray, emptyArray);

    var initials = initialsInput.value;
    var userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (var el of els) el.remove();
}

function displayAllScores() {
  removeEls(timer, startButton, results);
  var scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    var initials = obj.initials;
    var storedScore = obj.score;
    var resultsP = document.createElement("p");
    resultsP.innerText = `${initials}: ${storedScore}`;
    scoresDiv.append(resultsP);
  });
}

function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
    goBackBtn();
  });
}

function clearScoresBtn() {    
  var clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scoresDiv);
    window.localStorage.removeItem("highScores");
  })
  scoresDiv.append(clearBtn)
}

function goBackBtn() {
  var backBtn = document.createElement("input");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("value", "Go Back");
  backBtn.addEventListener("click", function(event){
    event.preventDefault();
    window.location.reload();
  })
  buttonsDiv.append(backBtn)
}

viewScores();