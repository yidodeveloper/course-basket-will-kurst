const grade = JSON.parse(sessionStorage.getItem('selectedGrade')) || "1";

// List of lectures which user selected
const pickedLectures = JSON.parse(sessionStorage.getItem('pickedLectures')) || [];
const lecturesData = JSON.parse(sessionStorage.getItem('lecturesData')) || []; // 전체 강의 데이터

// Elements
const safeTable = document.getElementById('tablesafe').getElementsByTagName('tbody')[0];
const warningTable = document.getElementById('tablewarning').getElementsByTagName('tbody')[0];
const dangerTable = document.getElementById('tabledanger').getElementsByTagName('tbody')[0];
const alternativeTable = document.getElementById('tablealternative').getElementsByTagName('tbody')[0];

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
        <td class="${status}">${competitionRatePercentage}</td>
    `;
}

// Find alternative lectures for a given lecture
function findAlternativeLectures(lecture) {
    // Find all lectures with the same name but different number
    const alternatives = lecturesData.filter(l => {
        // Only consider alternative lectures with a competition rate of less than 3
        const allowed = Number(l[`allowed_${grade}`]);
        const actual = Number(l[`actual_${grade}`]);
        const competitionRate = allowed ? (actual / allowed) : 0;

        return (
            l.name === lecture.name &&  // Same subject
            l.id !== lecture.id &&      // Different course ID
            !pickedLectures.some(pl => pl.id === l.id) && // Not already picked
            competitionRate < 3        // Competition rate should be less than 3
        );
    });

    return alternatives;
}

// Render alternative lectures into the alternative table
function renderAlternativeLectures() {
    alternativeTable.innerHTML = '';  // Clear the alternative table
    let foundAlternatives = false;

    // Go through the picked lectures and check if they are danger level
    pickedLectures.forEach(lecture => {
        // Get the allowed and actual values for the selected grade
        const allowed = Number(lecture[`allowed_${grade}`]);
        const actual = Number(lecture[`actual_${grade}`]);
        const competitionRate = allowed ? (actual / allowed) : 0;

        // If the competition rate is greater than or equal to 3, find alternatives
        if (competitionRate >= 3) {
            const alternatives = findAlternativeLectures(lecture);
            if (alternatives.length > 0) {
                foundAlternatives = true;
                alternatives.forEach(alternative => {
                    // Add alternative to the alternative table
                    alternativeTable.insertRow().innerHTML = createLectureRow(alternative);
                });
            }
        }
    });

    // If no alternatives found, add a message
    if (!foundAlternatives) {
        alternativeTable.insertRow().innerHTML = `<td colspan="3">대체 가능한 과목이 없습니다.</td>`;
    }
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

    // Now render the alternative lectures for the dangerous ones
    renderAlternativeLectures();
}

// Initialize page rendering
const initializePage = () => {
    renderLectures();  // Call the function to render the lectures into respective tables
}

initializePage();