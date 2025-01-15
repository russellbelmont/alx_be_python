// Function to check the user's answer
function checkAnswer() {
    // The correct answer is 4
    const correctAnswer = "4";
    
    // Get the selected radio button
    const selectedRadio = document.querySelector('input[name="quiz"]:checked');
    
    // If no radio button is selected, display an error message
    if (!selectedRadio) {
        document.getElementById("feedback").textContent = "Please select an answer.";
        return;
    }
    
    // Get the value of the selected radio button
    const userAnswer = selectedRadio.value;
    
    // Compare the user's answer with the correct answer
    if (userAnswer === correctAnswer) {
        document.getElementById("feedback").textContent = "Correct! Well done.";
    } else {
        document.getElementById("feedback").textContent = "That's incorrect. Try again.";
    }
}

// Add event listener to the submit button
document.getElementById("submit-answer").addEventListener("click", checkAnswer);
