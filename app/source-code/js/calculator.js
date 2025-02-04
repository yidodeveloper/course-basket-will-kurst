const grade = JSON.parse(sessionStorage.getItem('selectedGrade')) || "1";

// List of lectures which user selected
const pickedLectures = JSON.parse(sessionStorage.getItem('pickedLectures')) || [];
const lecturesData = JSON.parse(sessionStorage.getItem('lecturesData')) || [];

// Elements
const tables = {
    safe: document.getElementById('tablesafe').getElementsByTagName('tbody')[0],
    warning: document.getElementById('tablewarning').getElementsByTagName('tbody')[0],
    danger: document.getElementById('tabledanger').getElementsByTagName('tbody')[0],
    alternative: document.getElementById('tablealternative').getElementsByTagName('tbody')[0],
};

// Helper function to calculate competition rate
function calculateCompetitionRate(lecture) {
    const allowed = Number(lecture[`allowed_${grade}`]);
    const actual = Number(lecture[`actual_${grade}`]);
    return allowed ? (actual / allowed) : 0;
}

// Create the HTML row for a lecture with competition rate
function createLectureRow(lecture, competitionRate) {
    const competitionRatePercentage = competitionRate.toFixed(2);  // Keep it 2 decimal places
    let status = 'safe';  // Default to safe

    if (competitionRate >= 3) status = 'danger';  // Danger
    else if (competitionRate > 1) status = 'warning';  // Warning

    return `
        <td>${lecture.name}</td>
        <td>${lecture.time}</td>
        <td class="${status}">${competitionRatePercentage}</td>
    `;
}

// Find alternative lectures for a given lecture with competition rate less than 3
function findAlternativeLectures(lecture) {
    const competitionRateThreshold = 3;
    return lecturesData.filter(l => {
        const competitionRate = calculateCompetitionRate(l);
        return (
            l.name === lecture.name &&  // Same subject
            l.code !== lecture.code &&      // Different course code
            !pickedLectures.some(pl => pl.code === l.code) && // Not already picked
            competitionRate < competitionRateThreshold        // Competition rate < 3
        );
    });
}

// Render lectures into the specified table
function renderLecturesForTable(lectures, tableElement) {
    lectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);
        tableElement.insertRow().innerHTML = createLectureRow(lecture, competitionRate);
    });
}

// Render alternative lectures into the alternative table
function renderAlternativeLectures() {
    tables.alternative.innerHTML = '';  // Clear the alternative table
    let foundAlternatives = false;

    pickedLectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);
        if (competitionRate >= 3) {
            const alternatives = findAlternativeLectures(lecture);
            if (alternatives.length > 0) {
                foundAlternatives = true;
                renderLecturesForTable(alternatives, tables.alternative);
            }
        }
    });

    // If no alternatives found, add a message
    if (!foundAlternatives) {
        tables.alternative.insertRow().innerHTML = `<td colspan="3">대체 가능한 과목이 없습니다.</td>`;
    }
}

// Categorize lectures into safe, warning, and danger based on competition rate
function categorizeLectures() {
    const safeLectures = [];
    const warningLectures = [];
    const dangerLectures = [];

    pickedLectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);

        if (competitionRate < 1) {
            safeLectures.push(lecture);  // Safe
        } else if (competitionRate >= 1 && competitionRate < 3) {
            warningLectures.push(lecture);  // Warning
        } else {
            dangerLectures.push(lecture);  // Danger
        }
    });

    return { safeLectures, warningLectures, dangerLectures };
}

// Render all lectures into their respective tables
function renderLectures() {
    // Clear all tables
    Object.values(tables).forEach(table => table.innerHTML = '');

    const { safeLectures, warningLectures, dangerLectures } = categorizeLectures();

    // Render lectures into their respective tables
    renderLecturesForTable(safeLectures, tables.safe);
    renderLecturesForTable(warningLectures, tables.warning);
    renderLecturesForTable(dangerLectures, tables.danger);

    // Now render the alternative lectures for the dangerous ones
    renderAlternativeLectures();
}

// Initialize page rendering
const initializePage = () => {
    renderLectures();  // Call the function to render the lectures into respective tables
}

initializePage();