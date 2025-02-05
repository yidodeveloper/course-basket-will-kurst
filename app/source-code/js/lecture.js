// URL of JSON file uploaded to S3
const lecturesDataUrl = "https://course-basket-will-kurst.com.s3.ap-northeast-2.amazonaws.com/app/data/24-1.json";

// List of every lecture
let allLectures = JSON.parse(sessionStorage.getItem("allLectures")) || [];
// List of lectures which user selected
let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
let grade = sessionStorage.getItem("grade") || "";

// Elements
const pickedLecturesTable = document.getElementById("picked-lectures").getElementsByTagName("tbody")[0];
const allLecturesTable = document.getElementById("all-lectures").getElementsByTagName("tbody")[0];
const clearAllBtn = document.getElementById("clear-all-btn");
const deptFilter = document.getElementById("dept-filter");
const codeSearch = document.getElementById("code-search");
const nameSearch = document.getElementById("name-search");
const profSearch = document.getElementById("prof-search");
const submitBtn = document.getElementById("submit-btn");
const selectedGrade = document.getElementById("grade");

// Initialize the page elements
const initializeData = () => {
    if (allLectures.length === 0) {
        fetch(lecturesDataUrl)
            .then(response => response.ok ? response.json() : Promise.reject("Failed to fetch data"))
            .then(fetchedData => {
                sessionStorage.setItem("allLectures", JSON.stringify(fetchedData));
                allLectures = fetchedData;
                initializePage(allLectures); // Initialize the page with the fetched data
            })
            .catch(error => console.error("Error occurs: ", error));
    } else {
        initializePage(allLectures);
    }
}

// Initialize page elements
const initializePage = (allLectures) => {
    if (grade) {
        selectedGrade.value = grade;
    }

    setupEventListenerForClearAllBtn();
    setupEventListenerForSubmitBtn();
    populateDeptFilter(allLectures);
    setupEventListenersForFilters(allLectures);
    filterLectures(allLectures);

    renderLectures(pickedLectures, pickedLecturesTable, true);
    updateClearAllBtnState();
    updateSubmitBtnState();
}

// Set up event listener for clearAllBtn
const setupEventListenerForClearAllBtn = () => {
    clearAllBtn.addEventListener("click", () => {
        // Clear pickedLectures from sessionStorage
        sessionStorage.removeItem("pickedLectures");

        // Clear pickedLectures table
        pickedLecturesTable.innerHTML = "";

        // Update the clear all button state (disable it if no picked lectures)
        updateClearAllBtnState();
        // Update the submit button state (disable it if no picked lectures)
        updateSubmitBtnState();
    });
}

const updateClearAllBtnState = () => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];

    clearAllBtn.disabled = !(pickedLectures.length > 0);
}

// Populate department filter with unique values
const populateDeptFilter = (allLectures) => {
    const uniqueDept = [...new Set(allLectures.map(lecture => lecture.dept))];
    deptFilter.innerHTML = uniqueDept.map(dept => `<option value="${dept}">${dept}</option>`).join("");
}

// Set up event listeners for filters
const setupEventListenersForFilters = (allLectures) => {
    const filters = [deptFilter, codeSearch, nameSearch, profSearch];
    filters.forEach(filter => {
        filter.addEventListener("input", () => filterLectures(allLectures));
    });
}

// Filter lectures based on search criteria
const filterLectures = (allLectures) => {
    const dept = deptFilter.value;
    const code = codeSearch.value;
    const name = nameSearch.value;
    const prof = profSearch.value;

    const filteredLectures = allLectures.filter(lecture => {
        return (
            (dept === "" || lecture.dept.includes(dept)) &&
            (code === "" || lecture.code.includes(code)) &&
            (name === "" || lecture.name.includes(name)) &&
            (prof === "" || lecture.prof.includes(prof))
        );
    });

    // Render filtered lectures into the all lectures table
    renderLectures(filteredLectures, allLecturesTable);
}

// Render lectures into the table (shared by all and picked lectures)
const renderLectures = (lectures, targetTable, isPicked = false) => {
    targetTable.innerHTML = ""; // Clear current rows
    lectures.forEach(lecture => {
        const row = targetTable.insertRow();
        row.innerHTML = createLectureRow(lecture);

        const btn = row.querySelector(".pick-btn");
        if (isPicked) {
            btn.innerText = "제거";
            btn.addEventListener("click", () => handleRemoveLecture(lecture, row));
        } else {
            btn.addEventListener("click", () => handlePickLecture(lecture));
        }
    });
}

// Create the HTML row for a lecture
const createLectureRow = (lecture) => {
    return `
        <td><button class="pick-btn">담기</button></td>
        <td>${lecture.dept}</td>
        <td>${lecture.code}</td>
        <td>${lecture.name}</td>
        <td>${lecture.prof}</td>
        <td>${lecture.time}</td>
    `;
}

// Handle picking a lecture
const handlePickLecture = (lecture) => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];

    if (pickedLectures.some(pickedLecture => pickedLecture.code === lecture.code)) {
        alert("이 강의는 이미 담았습니다!");
    } else {
        pickedLectures.push(lecture);
        sessionStorage.setItem("pickedLectures", JSON.stringify(pickedLectures));
        renderLectures(pickedLectures, pickedLecturesTable, true);
        updateClearAllBtnState();
        updateSubmitBtnState();
    }
}

// Handle removing a picked lecture
const handleRemoveLecture = (lecture, rowFromPick) => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
    const index = pickedLectures.findIndex(pickedLecture => pickedLecture.code === lecture.code);

    if (index !== -1) {
        pickedLectures.splice(index, 1);
    }

    sessionStorage.setItem("pickedLectures", JSON.stringify(pickedLectures));
    rowFromPick.remove();
    updateClearAllBtnState();
    updateSubmitBtnState();
}

const setupEventListenerForSubmitBtn = () => {
    selectedGrade.addEventListener("change", updateSubmitBtnState);
}

// Update the state of the submit button based on the number of picked lectures and grade
const updateSubmitBtnState = () => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];

    grade = selectedGrade.value;
    sessionStorage.setItem("grade", grade);

    submitBtn.disabled = !(pickedLectures.length > 0 && grade);
}

// Initialize data and page elements
initializeData();