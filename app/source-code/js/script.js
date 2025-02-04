// URL of JSON file uploaded to S3
const s3FileUrl = 'https://course-basket-will-kurst.s3.ap-northeast-2.amazonaws.com/app/data/24-2.json';

// List into which picked lectures are inserted
let pickedLectures = JSON.parse(sessionStorage.getItem('pickedLectures')) || [];

// Elements
const pickTable = document.getElementById('tablepick').getElementsByTagName('tbody')[0];
const allTable = document.getElementById('tableall').getElementsByTagName('tbody')[0];
const deptFilter = document.getElementById('dept-filter');
const codeSearch = document.getElementById('code-search');
const nameSearch = document.getElementById('name-search');
const profSearch = document.getElementById('prof-search');

// Check if data is available in sessionStorage
let data = JSON.parse(sessionStorage.getItem('lecturesData'));

if (!data) {
    // Fetch data from S3 if not in sessionStorage
    fetch(s3FileUrl)
        .then(response => response.ok ? response.json() : Promise.reject('Failed to bring data'))
        .then(fetchedData => {
            // Save fetched data to sessionStorage
            sessionStorage.setItem('lecturesData', JSON.stringify(fetchedData));
            data = fetchedData;
            initializePage(data); // Initialize the page with the fetched data
        })
        .catch(error => console.error('Error occurs: ', error));
} else {
    // Initialize the page with data from sessionStorage
    initializePage(data);
}

// Initialize page elements
function initializePage(data) {
    populateDeptFilter(data);
    setupEventListeners(data);
    filterLectures(data);
    renderPickedLectures(); // Render picked lectures from sessionStorage
}

// Populate department filter with unique values
function populateDeptFilter(data) {
    const uniqueDept = [...new Set(data.map(lecture => lecture.dept))];
    deptFilter.innerHTML = uniqueDept.map(dept => `<option value="${dept}">${dept}</option>`).join('');
}

// Set up event listeners for filters
function setupEventListeners(data) {
    deptFilter.addEventListener('change', () => filterLectures(data));
    codeSearch.addEventListener('input', () => filterLectures(data));
    nameSearch.addEventListener('input', () => filterLectures(data));
    profSearch.addEventListener('input', () => filterLectures(data));
}

// Filter lectures based on search criteria
function filterLectures(data) {
    const deptValue = deptFilter.value.toLowerCase();
    const codeValue = codeSearch.value.toLowerCase();
    const nameValue = nameSearch.value.toLowerCase();
    const profValue = profSearch.value.toLowerCase();

    const filteredLectures = data.filter(lecture => {
        return (
            (deptValue === "" || lecture.dept.toLowerCase().includes(deptValue)) &&
            (codeValue === "" || lecture.code.toLowerCase().includes(codeValue)) &&
            (nameValue === "" || lecture.name.toLowerCase().includes(nameValue)) &&
            (profValue === "" || lecture.prof.toLowerCase().includes(profValue))
        );
    });

    renderLectures(filteredLectures);
}

// Render filtered lectures into the table
function renderLectures(lectures) {
    allTable.innerHTML = ''; // Clear current rows
    lectures.forEach(lecture => {
        const row = allTable.insertRow();
        row.innerHTML = createLectureRow(lecture);
        const pickButton = row.querySelector('.pick-btn');
        pickButton.addEventListener('click', () => handlePickLecture(lecture, row));
    });
}

// Create the HTML row for a lecture
function createLectureRow(lecture) {
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
function handlePickLecture(lecture, rowAll) {
    const isDuplicated = pickedLectures.some(pickedLecture => pickedLecture.name === lecture.name);

    if (isDuplicated) {
        alert('이 강의는 이미 담았습니다!');
    } else {
        const rowPick = pickTable.insertRow();
        rowPick.innerHTML = rowAll.innerHTML;
        const removeBtn = rowPick.querySelector('.pick-btn');
        removeBtn.innerText = '제거';
        removeBtn.addEventListener('click', () => handleRemoveLecture(rowPick, lecture));

        pickedLectures.push(lecture);
        sessionStorage.setItem('pickedLectures', JSON.stringify(pickedLectures)); // Save picked lectures to sessionStorage
    }
}

// Handle removing a picked lecture
function handleRemoveLecture(rowPick, lecture) {
    rowPick.remove();
    const index = pickedLectures.findIndex(pickedLecture => pickedLecture.name === lecture.name);
    if (index !== -1) {
        pickedLectures.splice(index, 1);
        sessionStorage.setItem('pickedLectures', JSON.stringify(pickedLectures)); // Update picked lectures in sessionStorage
    }
}

// Render picked lectures from sessionStorage
function renderPickedLectures() {
    pickedLectures.forEach(lecture => {
        const rowPick = pickTable.insertRow();
        rowPick.innerHTML = createLectureRow(lecture);
        const removeBtn = rowPick.querySelector('.pick-btn');
        removeBtn.innerText = '제거';
        removeBtn.addEventListener('click', () => handleRemoveLecture(rowPick, lecture));
    });
}