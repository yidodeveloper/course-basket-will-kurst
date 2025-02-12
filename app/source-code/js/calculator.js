// List of every lecture
let allLectures = JSON.parse(sessionStorage.getItem("allLectures")) || [];
// List of lectures which user selected
let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
const grade = JSON.parse(sessionStorage.getItem("grade")) || "1";

const countOfAllLectures = document.getElementById("count-of-all-lectures");
const countOfNonSafeLectures = document.getElementById("count-of-non-safe-lectures");

// Elements
const tables = {
    safe: document.getElementById("safe-lectures").getElementsByTagName("tbody")[0],
    warning: document.getElementById("warning-lectures").getElementsByTagName("tbody")[0],
    danger: document.getElementById("danger-lectures").getElementsByTagName("tbody")[0],
    alternative: document.getElementById("alternative-lectures").getElementsByTagName("tbody")[0],
};

// Helper function to calculate a competition rate
const calculateCompetitionRate = (lecture) => {
    const numberOfPeopleAllowed = Number(lecture[`allowed_${grade}`]);
    const numberOfApplicants = Number(lecture[`actual_${grade}`]);
    return numberOfPeopleAllowed ? (numberOfApplicants / numberOfPeopleAllowed).toFixed(2) : Number(0).toFixed(2);
}

// Create the HTML row for a lecture with the competition rate
const createLectureRow = (lecture, competitionRate) => {
    let status = "safe"; // Default to safe

    if (competitionRate > 2) {
        status = "danger"
    } else if (competitionRate > 1) {
        status = "warning"
    }

    return `
        <td align=center style="font-size: 0.9rem;" valign=middle>${lecture.code}</td>    
        <td align=center style="font-size: 0.9rem;" valign=middle>${lecture.name}</td>
        <td align=center style="font-size: 0.9rem;" valign=middle>${lecture.time}</td>
        <td align=center style="font-size: 0.9rem; white-space: nowrap;" valign=middle class="${status}">${competitionRate}</td>
    `;
}

// Find alternative lectures for a given lecture with the competition rate less than or equal to 1
const findAlternativeLectures = (lecture) => {
    const competitionRateThreshold = 1;
    return allLectures.filter(l => {
        const competitionRate = calculateCompetitionRate(l);
        return (
            l.name === lecture.name &&  // Same subject
            l.code !== lecture.code &&  // Different course code
            !pickedLectures.some(pl => pl.code === l.code) &&  // Not already picked
            competitionRate <= competitionRateThreshold         // Competition rate <= 1
        );
    });
}

// Render lectures into the specified table
const renderLecturesForTable = (lectures, tableElement) => {
    lectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);
        tableElement.insertRow().innerHTML = createLectureRow(lecture, competitionRate);
    });
}

// Render alternative lectures into the alternative table
const renderAlternativeLectures = () => {
    tables.alternative.innerHTML = "";  // Clear the alternative table
    let foundAlternatives = false;

    pickedLectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);
        if (competitionRate > 2) {
            const alternatives = findAlternativeLectures(lecture);
            if (alternatives.length > 0) {
                foundAlternatives = true;
                renderLecturesForTable(alternatives, tables.alternative);
            }
        }
    });

    // If no alternatives found, display a message
    if (!foundAlternatives) {
        tables.alternative.insertRow().innerHTML = `<td align=center style="font-size: 0.9rem; white-space: nowrap;" valign=middle colspan="4" align="center">경쟁률 1 이하인 동일 교과목이 없어요 😱</td>`;
    }
}

// Categorize lectures into safe, warning, and danger based on competition rate
const categorizeLectures = () => {
    const safeLectures = [];
    const warningLectures = [];
    const dangerLectures = [];

    pickedLectures.forEach(lecture => {
        const competitionRate = calculateCompetitionRate(lecture);

        if (competitionRate <= 1) {
            safeLectures.push(lecture);  // Safe
        } else if (competitionRate > 1 && competitionRate <= 2) {
            warningLectures.push(lecture);  // Warning
        } else {
            dangerLectures.push(lecture);  // Danger
        }
    });

    return { safeLectures, warningLectures, dangerLectures };
}

// Render all lectures into their respective tables
const renderLectures = () => {
    // Clear all tables
    Object.values(tables).forEach(table => table.innerHTML = "");

    const { safeLectures, warningLectures, dangerLectures } = categorizeLectures();

    // Render lectures into their respective tables
    renderLecturesForTable(safeLectures, tables.safe);
    renderLecturesForTable(warningLectures, tables.warning);
    renderLecturesForTable(dangerLectures, tables.danger);

    countOfAllLectures.innerText = safeLectures.length + warningLectures.length + dangerLectures.length;
    countOfNonSafeLectures.innerText = warningLectures.length + dangerLectures.length;

    // Now render the alternative lectures for the dangerous ones
    renderAlternativeLectures();
}

// Initialize page rendering
const initializePage = () => {
    renderLectures();  // Call the function to render the lectures into respective tables
}

initializePage();