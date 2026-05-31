let days = document.querySelectorAll('#days li');

let schedule = {
    "Понеділок": { classes: [], homework: {} },
    "Вівторок": { classes: [], homework: {} },
    "Середа": { classes: [], homework: {} },
    "Четвер": { classes: [], homework: {} },
    "П'ятниця": { classes: [], homework: {} }
};

let cookies = document.cookie.split('; ');
for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split('=');
    if (cookie[0] === 'schedule') {
        schedule = JSON.parse(cookie[1]);
    }
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}

function highlightActiveDay(active) {
    days.forEach(d => d.classList.remove('active'));
    active.classList.add('active');
}

function updateClassList(day) {
    document.querySelector('#day-name').textContent = day;

    let classList = document.querySelector('#classes');
    classList.innerHTML = '';

    let subjectSelect = document.querySelector('#subject-select');
    subjectSelect.innerHTML = '<option disabled selected>Виберіть предмет</option>';

    schedule[day].classes.forEach((item, i) => {
        classList.innerHTML += `<li>${i + 1}. ${item}</li>`;
        subjectSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

function updateHomeworkList(day) {
    let homeworkList = document.querySelector('#homework-list');
    homeworkList.innerHTML = '';

    for (let subject in schedule[day].homework) {
        let hw = schedule[day].homework[subject];

        homeworkList.innerHTML += `
            <li>
                <input type="checkbox" ${hw.completed ? "checked" : ""}>
                ${subject}: ${hw.description}
            </li>
        `;
    }
}

let currentDay = "Понеділок";

days.forEach(dayEl => {
    dayEl.addEventListener('click', () => {
        currentDay = dayEl.textContent;

        highlightActiveDay(dayEl);
        updateClassList(currentDay);
        updateHomeworkList(currentDay);
    });
});

document.querySelector('#add-class-button').addEventListener('click', () => {
    let input = document.querySelector('#new-class');

    if (!input.value.trim()) return;

    schedule[currentDay].classes.push(input.value);
    input.value = "";

    updateClassList(currentDay);
    setCookie("schedule", JSON.stringify(schedule), 14);
});

document.querySelector('#add-homework').addEventListener('click', () => {
    let subject = document.querySelector('#subject-select').value;
    let input = document.querySelector('#new-homework');

    if (!subject || !input.value.trim()) return;

    schedule[currentDay].homework[subject] = {
        description: input.value,
        completed: false
    };

    input.value = "";

    updateHomeworkList(currentDay);
    setCookie("schedule", JSON.stringify(schedule), 14);
});
