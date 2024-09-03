const db = require('../routes/queries');

const todayDate = new Date().toLocaleDateString();
document.getElementById('date').textContent = todayDate;

const userName = 'Chuan';
document.getElementById('userName').textContent = userName;

// * input field
const searchPeople = () => {
    const form = document.getElementById('searchForm');
    const people = form.people.value;
    console.log(people);
}