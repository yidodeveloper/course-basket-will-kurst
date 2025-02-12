// URL of JSON file uploaded to S3
const lecturesDataUrl = "https://course-basket-will-kurst.s3.ap-northeast-2.amazonaws.com/app/data/24-1.json";

// Elements
const pickedLecturesTable = document.getElementById("picked-lectures").getElementsByTagName("tbody")[0];
const allLecturesTable = document.getElementById("all-lectures").getElementsByTagName("tbody")[0];
const countOfPickedLectures = document.getElementById("count-of-picked-lectures");
const gradeSelector = document.getElementById("grade");
const clearAllBtn = document.getElementById("clear-all-btn");
const submitBtn = document.getElementById("submit-btn");
const tipMessage = document.getElementById("tip-message");
const deptFilter = document.getElementById("dept-filter");
const codeSearch = document.getElementById("code-search");
const nameSearch = document.getElementById("name-search");
const profSearch = document.getElementById("prof-search");
const searchBtn = document.getElementById("search-btn");

// Initialize the page elements
const initializeData = () => {
    let allLectures = JSON.parse(sessionStorage.getItem("allLectures")) || [];
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
    let grade = sessionStorage.getItem("grade") || "";
    if (grade) {
        gradeSelector.value = grade;
    }

    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
    populateDeptFilter(allLectures);
    filterLectures(allLectures);
    renderLectures(pickedLectures, pickedLecturesTable, true);
    updatePickedLectureCount();
    setupEventListenerForSelectingGrade();
    setupEventListenerForClearAllBtn();
    setupEventListenerForSubmitBtn();
    setupEventListenersForFilters(allLectures);
}

const updatePickedLectureCount = () => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
    countOfPickedLectures.innerText = pickedLectures.length;
}

// Handle picking a lecture
const handlePickLecture = (lecture) => {
    let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];

    // Check if the number of picked lectures exceeds the limit
    if (pickedLectures.length >= 15) {
        tipMessage.innerText = "최대 15개까지 담을 수 있습니다."; // Display the message if more than 15
        tipMessage.style.display = "block"; // Show the message
        return;
    }

    if (pickedLectures.some(pickedLecture => pickedLecture.code === lecture.code)) {
        alert("이 강의는 이미 담았습니다!");
    } else {
        pickedLectures.push(lecture);
        sessionStorage.setItem("pickedLectures", JSON.stringify(pickedLectures));
        renderLectures(pickedLectures, pickedLecturesTable, true);
        updatePickedLectureCount();
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

    // Hide the tip message when a lecture is removed
    tipMessage.style.display = "none";

    updatePickedLectureCount();
}

// Create the HTML row for a lecture
const createLectureRow = (lecture) => {
    return `
        <td align=center valign=middle style="font-size: 0.9rem; white-space: nowrap;"><button class="btn btn-light" id="pick-btn" style="font-size: 0.9rem; white-space: nowrap;">담기</button></td>
        <td align=center valign=middle style="font-size: 0.9rem; white-space: nowrap;">${lecture.code}</td>
        <td align=center valign=middle style="font-size: 0.9rem;">${lecture.name}</td>
        <td align=center valign=middle style="font-size: 0.9rem;">${lecture.prof}</td>
        <td align=center valign=middle style="font-size: 0.9rem;">${lecture.time}</td>
    `;
}

// Render lectures into the table (shared by all and picked lectures)
const renderLectures = (lectures, targetTable, isPicked = false) => {
    targetTable.innerHTML = ""; // Clear current rows
    lectures.forEach(lecture => {
        const row = targetTable.insertRow();
        row.innerHTML = createLectureRow(lecture);

        const btn = row.querySelector("#pick-btn");
        if (isPicked) {
            btn.innerText = "제거";
            btn.addEventListener("click", () => handleRemoveLecture(lecture, row));
        } else {
            btn.addEventListener("click", (event) => {
                handlePickLecture(lecture);
                resetTipMessage(event);
            });
        }
    });
}

// Populate department filter with unique values and an additional fixed option
const populateDeptFilter = (allLectures) => {
    const uniqueDept = [...new Set(allLectures.map(lecture => lecture.dept))];
    const fixedOption = `<option value="">전체</option>`;
    deptFilter.innerHTML = fixedOption + uniqueDept.map(dept => `<option value="${dept}">${dept}</option>`).join("");
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

const setupEventListenerForSelectingGrade = () => {
    gradeSelector.addEventListener("change", (event) => {
        sessionStorage.setItem("grade", event.target.value);
    });
    gradeSelector.addEventListener("change", resetTipMessage);
}

const setupEventListenerForClearAllBtn = () => {
    clearAllBtn.addEventListener("click", () => {
        // Clear pickedLectures from sessionStorage
        sessionStorage.removeItem("pickedLectures");

        // Clear pickedLectures table
        pickedLecturesTable.innerHTML = "";
        updatePickedLectureCount();

        // Hide the tip message
        tipMessage.style.display = "none";
    });
}

const setupEventListenerForSubmitBtn = () => {
    submitBtn.addEventListener("click", () => {
        let pickedLectures = JSON.parse(sessionStorage.getItem("pickedLectures")) || [];
        let grade = gradeSelector.value;

        // Check if both pickedLectures and grade are valid
        if (!grade) {
            tipMessage.innerText = "학년을 선택해주세요"; // Tip message
            tipMessage.style.display = "block"; // Show the message
        } else if (pickedLectures.length === 0) {
            tipMessage.innerText = "강의를 하나 이상 담아주세요"; // Tip message
            tipMessage.style.display = "block"; // Show the message
        } else {
            // Navigate to result.html if the conditions are met
            window.location.href = "./result.html";
        }
    });
}

const setupEventListenersForFilters = (allLectures) => {
    searchBtn.addEventListener("click", () => filterLectures(allLectures))
}

const resetTipMessage = (event) => {
    if (event.target.id === "grade" && tipMessage.innerText === "학년을 선택해주세요") {
        tipMessage.style.display = "none"; // Hide the message
    }
    if (event.target.id === "pick-btn" && tipMessage.innerText === "강의를 하나 이상 담아주세요") {
        tipMessage.style.display = "none"; // Hide the message
    }
};

// Initialize data and page elements
initializeData();