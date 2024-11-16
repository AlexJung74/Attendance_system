document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    // Submit 버튼 요소를 찾습니다.
    const submitButton = document.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error('Submit button not found');
        return; // 버튼을 찾지 못하면 이후 코드 실행을 멈춥니다.
    }
    console.log('Submit button found');

    // 모든 DOM 요소 확인 및 로그 출력
    let semesterElement = document.getElementById('semester');
    let courseElement = document.getElementById('course');
    let classElement = document.getElementById('class');

    if (!semesterElement) {
        console.error('Semester element not found');
    } else {
        console.log('Semester element found');
    }

    if (!courseElement) {
        console.error('Course element not found');
    } else {
        console.log('Course element found');
    }

    if (!classElement) {
        console.error('Class element not found');
    } else {
        console.log('Class element found');
    }

    // 메시지 표시 함수
    function showMessage(message) {
        const messageContainer = document.querySelector('.message-container');
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        }
    }

    // 폼이 제출되었을 때 필수 필드가 모두 선택되었는지 확인
    submitButton.addEventListener('click', function (event) {
        let semesterSelected = semesterElement ? semesterElement.value : '';
        let courseSelected = courseElement ? courseElement.value : '';
        let classSelected = classElement ? classElement.value : '';

        // 모든 필드가 선택되지 않은 경우 메시지 표시
        if (!semesterSelected || !courseSelected || !classSelected) {
            event.preventDefault(); // 폼 제출 막기
            showMessage("Please select all fields (Semester, Course, and Class) before submitting.");
            return;
        }
    });

    // Semester 변경 시 Course와 Class 초기화 및 데이터 로드
    if (semesterElement) {
        semesterElement.addEventListener('change', function () {
            let semesterId = this.value;
            console.log(`Semester selected: ${semesterId}`);
            let courseSelect = document.getElementById('course');
            let classSelect = document.getElementById('class');

            // 기존 데이터 초기화
            if (courseSelect) {
                courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
                courseSelect.disabled = true;
            }

            if (classSelect) {
                classSelect.innerHTML = '<option value="">-- Select Class --</option>';
                classSelect.disabled = true;
            }

            if (semesterId && courseSelect) {
                console.log(`Fetching courses for semester ID: ${semesterId}`);
                fetch(`/get-courses/${semesterId}/`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Courses data received:', data);
                        if (data.courses && data.courses.length > 0) {
                            data.courses.forEach(course => {
                                const option = document.createElement('option');
                                option.value = course.id;
                                option.textContent = course.name;
                                courseSelect.appendChild(option);
                            });
                            courseSelect.disabled = false;
                        } else {
                            courseSelect.disabled = true;
                        }
                    })
                    .catch(error => console.error('Error fetching courses:', error));
            }
        });
    }

    // Course 변경 시 Class 초기화 및 데이터 로드
    if (courseElement) {
        courseElement.addEventListener('change', function () {
            let semesterId = semesterElement.value;
            let courseId = this.value;
            console.log(`Course selected: ${courseId} for semester: ${semesterId}`);
            let classSelect = document.getElementById('class');

            if (classSelect) {
                classSelect.innerHTML = '<option value="">-- Select Class --</option>';
                classSelect.disabled = true;
            }

            if (semesterId && courseId && classSelect) {
                console.log(`Fetching classes for semester ID: ${semesterId}, course ID: ${courseId}`);
                fetch(`/get-classes/${semesterId}/${courseId}/`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Classes data received:', data);
                        if (data.classes && data.classes.length > 0) {
                            data.classes.forEach(classItem => {
                                const option = document.createElement('option');
                                option.value = classItem.id;
                                option.textContent = `Class ${classItem.number}`;
                                classSelect.appendChild(option);
                            });
                            classSelect.disabled = false;
                        } else {
                            classSelect.disabled = true;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching classes:', error);
                    });
            }
        });
    }

    // Reset 버튼 클릭 시 폼 초기화
    const resetButton = document.querySelector('button[type="button"]');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            console.log("Resetting form selection");
            if (semesterElement) {
                semesterElement.value = '';
            }
            if (courseElement) {
                courseElement.innerHTML = '<option value="">-- Select Course --</option>';
                courseElement.disabled = true;
            }
            if (classElement) {
                classElement.innerHTML = '<option value="">-- Select Class --</option>';
                classElement.disabled = true;
            }
        });
    }
});
