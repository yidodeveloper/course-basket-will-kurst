// Active and inactive the button based on grade selection
function validateGrade() {
    const gradeSelect = document.getElementById("grade");
    const submitButton = document.getElementById("submitButton");
    
    // Store the selected grade in sessionStorage
    sessionStorage.setItem("selectedGrade", gradeSelect.value);

    // Check if the selected value is not empty (i.e., user has made a selection)
    if (gradeSelect.value !== "") {
        submitButton.disabled = false;  // Activate button
    } else {
        submitButton.disabled = true;   // Inactivate button
    }
}

// Load the selected grade from sessionStorage on page load
window.onload = function() {
    const gradeSelect = document.getElementById("grade");
    const submitButton = document.getElementById("submitButton");

    // Check if there's a saved grade in sessionStorage
    const savedGrade = sessionStorage.getItem("selectedGrade");

    // If there's a saved grade, set it in the dropdown and enable the button
    if (savedGrade) {
        gradeSelect.value = savedGrade;
        submitButton.disabled = false;  // Activate button
    } else {
        submitButton.disabled = true;   // Inactivate button if no grade is saved
    }
}