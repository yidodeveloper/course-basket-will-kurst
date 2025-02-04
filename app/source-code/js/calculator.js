const grade = JSON.parse(sessionStorage.getItem('selectedGrade')) || "1";

// List of lectures which user selected
const pickedLectures = JSON.parse(sessionStorage.getItem('pickedLectures')) || [];

// Elements
const safeTable = document.getElementById('tablesafe').getElementsByTagName('tbody')[0];
const warningTable = document.getElementById('tablewarning').getElementsByTagName('tbody')[0];
const dangerTable = document.getElementById('tabledanger').getElementsByTagName('tbody')[0];

// Render safe lectures into the table
function renderSafeLectures(pickedLectures) {
    safeTable.innerHTML = ''; // Clear current rows
    pickedLectures.forEach(lecture => {
        const row = safeTable.insertRow();
        row.innerHTML = createLectureRow(lecture);
    });
}

// Render warning lectures into the table
function renderWarningLectures(pickedLectures) {
    warningTable.innerHTML = ''; // Clear current rows
    pickedLectures.forEach(lecture => {
        const row = warningTable.insertRow();
        row.innerHTML = createLectureRow(lecture);
    });
}

// Render danger lectures into the table
function renderDangerLectures(pickedLectures) {
    dangerTable.innerHTML = ''; // Clear current rows
    pickedLectures.forEach(lecture => {
        const row = dangerTable.insertRow();
        row.innerHTML = createLectureRow(lecture);
    });
}

// Create the HTML row for a lecture with competition rate
function createLectureRow(lecture) {
    // Get the allowed and actual values for the selected grade
    const allowed = Number(lecture[`allowed_${grade}`]);  // The number of students allowed by grade
    const actual = Number(lecture[`actual_${grade}`]);    // The number of applicants allowed by grade
    const competitionRate = allowed ? (actual / allowed) : 0;  // Calculate competition rate

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
        <td class="${status}">${(competitionRate * 100).toFixed(2)}%</td>
    `;
}

// Initialize page rendering
const initializePage = () => {
    renderSafeLectures(pickedLectures);  // Safe lectures
    renderWarningLectures(pickedLectures);  // Warning lectures
    renderDangerLectures(pickedLectures);  // Danger lectures
}

initializePage();