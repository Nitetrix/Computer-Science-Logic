// Variables for both pages
let A = false;
let B = false;
let score = 0;
let timeRemaining = 60;
let timerInterval;
let currentOperation = 'AND';
let lastPuzzle = '';
let lastA = null;
let lastB = null;

// Function to set variables (used in the home page)
function setVariable(variable, value) {
    if (variable === 'A') {
        A = value;
        document.getElementById('valueA').innerText = A;
    } else if (variable === 'B') {
        B = value;
        document.getElementById('valueB').innerText = B;
    }
}

// Function to perform operations (used in the home page)
function performOperation(operation) {
    let result;
    switch (operation) {
        case 'AND':
            result = A && B;
            break;
        case 'OR':
            result = A || B;
            break;
        case 'NOT_A':
            result = !A;
            break;
        case 'NOT_B':
            result = !B;
            break;
    }
    document.getElementById('operationResult').innerText = `Result: ${result}`;
}

// Function to generate a truth table row (used in the home page)
function generateTruthTableRow() {
    const truthTable = document.getElementById('truthTable');
    const row = truthTable.insertRow(-1);

    row.insertCell(0).innerText = A;
    row.insertCell(1).innerText = B;
    row.insertCell(2).innerText = A && B;
    row.insertCell(3).innerText = A || B;
    row.insertCell(4).innerText = A && !B;
    row.insertCell(5).innerText = A || !B;
    row.insertCell(6).innerText = (A || B) && !(A && B);
    row.insertCell(7).innerText = (A && B) || !(A || B);
}

// Function to start the game (used in the game page)
function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.querySelector('.game-info').style.display = 'block';
    document.querySelector('.variable-control').style.display = 'block';
    document.getElementById('puzzleSection').style.display = 'block';
    document.getElementById('puzzleQuestion').style.display = 'block';
    document.getElementById('answerButtons').style.display = 'block';

    generateNewPuzzle();
    startTimer();
}

// Function to start the countdown timer (used in the game page)
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timeRemaining').innerText = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Function to generate a new puzzle with random values for A and B (used in the game page)
function generateNewPuzzle() {
    let newPuzzle;
    do {
        A = Math.random() < 0.5;
        B = Math.random() < 0.5;

        while (A === lastA && B === lastB) {
            A = Math.random() < 0.5;
            B = Math.random() < 0.5;
        }

        const operations = ['AND', 'OR', 'NOT A', 'NOT B'];
        currentOperation = operations[Math.floor(Math.random() * operations.length)];
        newPuzzle = `${A}-${B}-${currentOperation}`;
    } while (newPuzzle === lastPuzzle);

    lastPuzzle = newPuzzle;
    lastA = A;
    lastB = B;

    document.getElementById('valueA').innerText = A;
    document.getElementById('valueB').innerText = B;
    document.getElementById('puzzleQuestion').innerText = `What is the result of ${currentOperation}?`;
}

// Function to check the user's answer and update the score (used in the game page)
function checkAnswer(userAnswer) {
    let correctAnswer;
    switch (currentOperation) {
        case 'AND':
            correctAnswer = A && B;
            break;
        case 'OR':
            correctAnswer = A || B;
            break;
        case 'NOT A':
            correctAnswer = !A;
            break;
        case 'NOT B':
            correctAnswer = !B;
            break;
    }

    const feedbackElement = document.getElementById('feedback');
    if (userAnswer === correctAnswer) {
        score += 5;
        feedbackElement.innerText = "Correct! Well done!";
        feedbackElement.style.color = "green";
    } else {
        score -= 10;
        feedbackElement.innerText = `Incorrect. The correct answer was: ${correctAnswer}`;
        feedbackElement.style.color = "red";
    }

    document.getElementById('score').innerText = score;
    generateNewPuzzle();
}

// Function to handle the end of the game and update the leaderboard (used in the game page)
function endGame() {
    const playerName = prompt("Time's up! Enter your name for the leaderboard:");
    if (playerName) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: playerName, score: score });

        // Sort the leaderboard from highest to lowest score
        leaderboard.sort((a, b) => b.score - a.score);

        // Save the updated leaderboard to localStorage
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboardDisplay();
    }

    resetGameState();
}

// Function to reset the game state for a new round
function resetGameState() {
    score = 0;
    timeRemaining = 60;
    document.getElementById('score').innerText = score;
    document.getElementById('timeRemaining').innerText = timeRemaining;
    document.getElementById('startButton').style.display = 'block';

    document.querySelector('.game-info').style.display = 'none';
    document.querySelector('.variable-control').style.display = 'none';
    document.getElementById('puzzleSection').style.display = 'none';
    document.getElementById('puzzleQuestion').style.display = 'none';
    document.getElementById('answerButtons').style.display = 'none';
}

// Function to update the leaderboard display
function updateLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = '';

    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.innerText = `${entry.name} - ${entry.score} points`;
        leaderboardList.appendChild(listItem);
    });
}

// Function to redirect to the home page
function goToHomePage() {
    window.location.href = 'index.html'; // Replace with the correct path if necessary
}

// Call this function on page load to ensure the leaderboard is displayed correctly
updateLeaderboardDisplay();
