const form = document.getElementById("ageForm");
const answerBox = document.getElementById("answerBox");

const fields = {
    birthDay: document.getElementById("birthDay"),
    birthMonth: document.getElementById("birthMonth"),
    birthYear: document.getElementById("birthYear"),
    ageDay: document.getElementById("ageDay"),
    ageMonth: document.getElementById("ageMonth"),
    ageYear: document.getElementById("ageYear")
};

function setFindAgeToday() {
    const today = new Date();
    fields.ageDay.value = today.getDate();
    fields.ageMonth.value = today.getMonth() + 1;
    fields.ageYear.value = today.getFullYear();
    fields.ageDay.defaultValue = fields.ageDay.value;
    fields.ageMonth.defaultValue = fields.ageMonth.value;
    fields.ageYear.defaultValue = fields.ageYear.value;
}

function readDate(dayInput, monthInput, yearInput) {
    const day = Number(dayInput.value);
    const month = Number(monthInput.value);
    const year = Number(yearInput.value);

    if (!day || !month || !year) {
        return null;
    }

    const date = new Date(year, month - 1, day);
    const isValid =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    return isValid ? date : null;
}

function getAgeParts(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}

function plural(value, word) {
    return `${value} ${word}${value === 1 ? "" : "s"}`;
}

function formatAge(parts) {
    return [
        plural(parts.years, "year"),
        plural(parts.months, "month"),
        plural(parts.days, "day")
    ].join(" ");
}

function formatLongDate(date) {
    return date
        .toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        })
        .replace(",", "");
}

function showMessage(message, className = "answer-placeholder") {
    answerBox.innerHTML = `
        <p class="answer-label">Answer:</p>
        <p class="${className}">${message}</p>
    `;
}

function calculateAge(event) {
    event.preventDefault();

    const birthDate = readDate(fields.birthDay, fields.birthMonth, fields.birthYear);
    const ageDate = readDate(fields.ageDay, fields.ageMonth, fields.ageYear);

    if (!birthDate || !ageDate) {
        showMessage("Please enter a valid day, month, and year.", "error-message");
        return;
    }

    if (birthDate > ageDate) {
        showMessage("Date of birth must be before the Find Age on date.", "error-message");
        return;
    }

    const parts = getAgeParts(birthDate, ageDate);
    const totalDays = Math.floor((ageDate - birthDate) / (1000 * 60 * 60 * 24));
    const totalMonths = parts.years * 12 + parts.months;
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingWeekDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const decimalYears = (totalDays / 365.2425).toFixed(3);

    answerBox.innerHTML = `
        <p class="answer-label">Answer:</p>
        <p class="answer-title">Age</p>
        <p class="answer-age">${formatAge(parts)}</p>
        <p class="answer-detail"><strong>Born on:</strong> ${formatLongDate(birthDate)}</p>
        <p class="answer-detail"><strong>Age on:</strong> ${formatLongDate(ageDate)}</p>
        <div class="unit-list">
            <p class="unit-heading">Age in different time units:</p>
            <p>= ${decimalYears} <em>years</em></p>
            <p>= <em>${formatAge(parts)}</em></p>
            <p>= <em>${plural(totalMonths, "month")} ${plural(parts.days, "day")}</em></p>
            <p>= <em>${plural(totalWeeks, "week")} ${plural(remainingWeekDays, "day")}</em></p>
            <p>= <em>${totalDays.toLocaleString("en-US")} days</em></p>
            <p>= <em>${totalHours.toLocaleString("en-US")} hours</em></p>
            <p>= <em>${totalMinutes.toLocaleString("en-US")} minutes</em></p>
            <p>= <em>${totalSeconds.toLocaleString("en-US")} seconds</em></p>
        </div>
    `;

    answerBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

setFindAgeToday();

form.addEventListener("submit", calculateAge);
form.addEventListener("reset", () => {
    window.setTimeout(() => {
        setFindAgeToday();
        showMessage("Enter your birth date and click Calculate.");
    }, 0);
});
