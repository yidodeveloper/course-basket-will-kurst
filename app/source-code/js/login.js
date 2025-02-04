// Active and inactive the button based on grade selection
function validateGrade() {
    const gradeSelect = document.getElementById("grade");
    const submitButton = document.getElementById("submitButton");
    
    // Check if the selected value is not empty (i.e., user has made a selection)
    if (gradeSelect.value !== "") {
        submitButton.disabled = false;  // Activate button
    } else {
        submitButton.disabled = true;   // Inactivate button
    }
}