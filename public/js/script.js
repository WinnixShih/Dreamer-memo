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

// * for changing display in the front end, default is showing id input box
document.getElementById('deleteType').addEventListener('change',function() {
    // * using function() to use the <this> attribute
    const deleteType = this.value;
    // * showing the require input box
    if (deleteType === 'id') {
        document.getElementById('deleteIdBox').style.display = 'block';
        document.getElementById('deleteDateBox').style.display = 'none';
    } else if (deleteType === 'date') {
        document.getElementById('deleteIdBox').style.display = 'none';
        document.getElementById('deleteDateBox').style.display = 'block';
    }
});

const deleteDream = async () => {
    // * get the type of deletion
    const deleteType = document.getElementById('deleteType').value;
    console.log(deleteType);
    // * 2 ways to delete data, id or date
    if (deleteType === 'date') {
        const targetDate = document.getElementById('deleteDateInput').value;
        if (!targetDate) {
            alert("No input date to delete");
            return;
        }

        try {
            // ? fetch the url and use the endpoint
            const response = await fetch(`http://localhost:3000/delete?date=${encodeURIComponent(targetDate)}`, {
                method: 'DELETE',
            });
            responseReply(response);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    } else {
        const targetId = document.getElementById('deleteIdInput').value;
        if (!targetId) {
            alert("No input id to delete");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/delete?id=${encodeURIComponent(targetId)}`, {
                method: 'DELETE',
            });
            responseReply(response);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }
}

const responseReply = (response) => {
    if (response.ok) {
        console.log('Deleted dream successfully')
    } else {
        alert('Error during deleting');
    }
    return;
}