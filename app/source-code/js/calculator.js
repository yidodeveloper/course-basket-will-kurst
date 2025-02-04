const grade = JSON.parse(sessionStorage.getItem('selectedGrade')) || "1";

// List of lectures which user selected
const pickedLectures = JSON.parse(sessionStorage.getItem('pickedLectures')) || [];

// Elements
const safeTable = document.getElementById('tablesafe').getElementsByTagName('tbody')[0];
const warningTable = document.getElementById('tablewarning').getElementsByTagName('tbody')[0];
const dangerTable = document.getElementById('tabledanger').getElementsByTagName('tbody')[0];

// Create the HTML row for a lecture with competition rate
function createLectureRow(lecture) {
    // Get the allowed and actual values for the selected grade
    const allowed = Number(lecture[`allowed_${grade}`]);  // The number of students allowed by grade
    const actual = Number(lecture[`actual_${grade}`]);    // The number of applicants allowed by grade
    const competitionRate = allowed ? (actual / allowed) : 0;  // Calculate competition rate

    // Convert the competition rate to a percentage
    const competitionRatePercentage = competitionRate.toFixed(2);  // Keep it 2 decimal places

    let status = 'safe'; // Default to safe
    if (competitionRate >= 3) {
        status = 'danger';  // Danger
    } else if (competitionRate > 1) {
        status = 'warning';  // Warning
    }

    // Return the row with competition rate and status
    return `
        <td>${lecture.name}</td>
        <td>${lecture.time}</td>
        <td class="${status}">${competitionRatePercentage}%</td>
    `;
}

// Filter and render lectures into the respective tables based on competition rate
function renderLectures() {
    // Clear the tables
    safeTable.innerHTML = '';
    warningTable.innerHTML = '';
    dangerTable.innerHTML = '';

    // Separate lectures into safe, warning, and danger categories
    pickedLectures.forEach(lecture => {
        // Get the allowed and actual values for the selected grade
        const allowed = Number(lecture[`allowed_${grade}`]);
        const actual = Number(lecture[`actual_${grade}`]);
        const competitionRate = allowed ? (actual / allowed) : 0;

        if (competitionRate < 1) {
            safeTable.insertRow().innerHTML = createLectureRow(lecture);  // Safe
        } else if (competitionRate >= 1 && competitionRate < 3) {
            warningTable.insertRow().innerHTML = createLectureRow(lecture);  // Warning
        } else {
            dangerTable.insertRow().innerHTML = createLectureRow(lecture);  // Danger
        }
    });
}

// Initialize page rendering
const initializePage = () => {
    renderLectures();  // Call the function to render the lectures into respective tables
}

initializePage();