// Initialize score from local storage or set to default values
let score = JSON.parse(localStorage.getItem('Score_save')) || { wins: 0, losses: 0, ties: 0 };

// Messages for game results
let won_msg = `<img class="gifs" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/512.gif">
                You won
                <img class="gifs" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/512.gif">`;
let lost_msg = `<img class="gifs sad" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif">
                You lost
                <img class="gifs sad" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif">`;
let tie_msg = `<img class="gifs flags" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3f3_fe0f/512.gif">
                It's a tie
                <img class="gifs flags" src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3f3_fe0f/512.gif">`;

let computerMove;

// Function to play the game
function playGame(playerMove) {
    computerMove = pickingComputerMove();
    let result = determineResult(playerMove, computerMove);
    updateScore(result);
}

// Function to pick a random move for the computer
function pickingComputerMove() {
    let random = Math.random();
    if (random < 1 / 3) return 'Rock';
    else if (random < 2 / 3) return 'Paper';
    else return 'Scissors';
}

// Function to determine the result of the game
function determineResult(playerMove, computerMove) {
    if (playerMove === computerMove) {
        return tie_msg;
    } else if (
        (playerMove === 'Rock' && computerMove === 'Paper') ||
        (playerMove === 'Paper' && computerMove === 'Scissors') ||
        (playerMove === 'Scissors' && computerMove === 'Rock')
    ) {
        return lost_msg;
    } else {
        return won_msg;
    }
}

// Function to update the score and store it in local storage
function updateScore(result) {
    if (result === won_msg) score.wins++;
    else if (result === lost_msg) score.losses++;
    else if (result === tie_msg) score.ties++;

    localStorage.setItem('Score_save', JSON.stringify(score));
    updateScoreElement();
    document.querySelector('.js_result').innerHTML = result;
}

// Function to update the displayed score
function updateScoreElement() {
    const scoreElement = document.querySelector('.score_elem');
    let total_score = score.wins - score.losses;
    scoreElement.innerHTML = `${total_score}`;
}

// Function to reset the score
function resetScore() {
    score = { wins: 0, losses: 0, ties: 0 };
    localStorage.removeItem('Score_save');
    updateScoreElement();
}

// Function to handle the button click and initiate the game
function selectOption(clickedButton) {
    const buttons = document.querySelectorAll('button:not(.copy_button):not(.reset):not(.reset-score)');
    const newPositionPlayer = (buttons[0].offsetLeft + buttons[1].offsetLeft) / 2;
    const positionComputer = (buttons[1].offsetLeft + buttons[2].offsetLeft) / 2;
    const scores_pos = document.querySelector('.scores');

    buttons.forEach(button => {
        if (!(button.classList.contains(computerMove) || button.classList.contains(clickedButton))) button.classList.add('hidden');
        button.classList.add("disabled");
    });

    setTimeout(() => {
        buttons.forEach(button => {
            if (button.classList.contains(clickedButton)) button.style.transform = `translateX(${newPositionPlayer - button.offsetLeft}px)`;
            else if (button.classList.contains(computerMove)) button.style.transform = `translateX(${positionComputer - button.offsetLeft}px)`;
        });

        scores_pos.style.transform = `translateY(150px)`;
    }, 500);

    const jsResult = document.querySelector('.js_result');
    const jsMoves = document.querySelector('div.moves');
    const jsReset = document.querySelector('.reset');

    setTimeout(() => {
        jsResult.classList.remove("hidden");
        jsMoves.classList.remove("hidden");
        jsReset.classList.remove("hidden");
    }, 1000);

    // Function to move the div
    function move_div() {
        let target = document.querySelector('.targetDiv');
        let targetRect = target.getBoundingClientRect();
        target.style.transform = `translate(${positionComputer - targetRect.left}px, ${buttons[0].offsetTop - targetRect.top - 19}px)`;
        setTimeout(() => {
            target.classList.remove("hidden")
        }, 1000);
    }

    if (clickedButton === computerMove) {
        cloneAndReplace(`.${clickedButton}`);
        move_div();
    }
}

// Function to reset the game state
function resetGame() {
    resetPage();
    const buttons = document.querySelectorAll('button:not(.reset-score)');

    const jsResult = document.querySelector('.js_result');
    jsResult.classList.add("hidden");

    const jsMoves = document.querySelector('div.moves');
    jsMoves.classList.add("hidden");

    let target = document.querySelector('.targetDiv');
    target.style.transform = 'translate(0, 0)';
    target.classList.add("hidden");

    buttons.forEach(button => {
        button.classList.remove("disabled");
        button.style.transform = 'translateX(0)';
        const scores_pos = document.querySelector('.scores');

        setTimeout(() => {
            buttons.forEach(button => {
                if (button.classList.contains(`reset`)) {
                    button.classList.add("hidden")
                } else {
                    button.classList.remove('hidden')
                }
            });

            scores_pos.style.transform = `translateY(0)`;
        }, 500);
    });

    console.log('Game reset');
}

// Variables for cloned button and original content
var originalTargetDivContent = document.querySelector('.targetDiv').innerHTML;
var currentClonedButton;

// Function to clone and replace the target div content with a button
function cloneAndReplace(buttonClass) {
    var button = document.querySelector(buttonClass);
    var clonedButton = button.cloneNode(true);

    var targetDiv = document.querySelector('.targetDiv');

    // If there is a cloned button, replace it with the original content
    if (currentClonedButton !== null) {
        targetDiv.innerHTML = originalTargetDivContent;
    }

    // Replace the target div content with the newly cloned button
    targetDiv.innerHTML = '';
    targetDiv.appendChild(clonedButton);
    currentClonedButton = clonedButton;
}

// Function to reset the target div content to the original content
function resetPage() {
    var targetDiv = document.querySelector('.targetDiv');

    // If there is a cloned button, replace it with the original content
    if (currentClonedButton !== '') {
        targetDiv.innerHTML = originalTargetDivContent;
        currentClonedButton = '';
    }
}
