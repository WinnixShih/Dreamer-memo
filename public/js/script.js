const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const dateElement = document.getElementById('date');
if (dateElement) {
    const todayDate = new Date().toLocaleDateString();
    document.getElementById('date').textContent = todayDate;
}

const nameElement = document.getElementById('userName');
if (nameElement) {
    const userName = 'Chuan';
    document.getElementById('userName').textContent = userName;
}

// * input field
// const searchPeople = () => {
//     const form = document.getElementById('searchForm');
//     const people = form.people.value;
//     console.log(people);
// }

// * for changing display in the front end, default is showing id input box
const deleteTypeElement = document.getElementById('deleteType');
if (deleteTypeElement) {
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
}

const deleteDream = async () => {
    // * get the type of deletion
    const deleteType = document.getElementById('deleteType').value;
    const deleteTarget = (deleteType === 'date') ? document.getElementById('deleteDateInput').value : document.getElementById('deleteIdInput').value;
    // * 2 ways to delete data, id or date
    if (!deleteTarget) {
        alert("No input date to delete");
        return;
    }
    try {
        // ? fetch the url and use the endpoint
        const response = await fetch(`${BASE_URL}/delete?${deleteType}=${encodeURIComponent(deleteTarget)}`, {
            method: 'DELETE',
        });
        if (response.redirected) {
            // Redirect to the page rendered by the server (e.g., "notFound" or success page)
            window.location.href = response.url;
        } else {
            const pageContent = await response.text();
            document.body.innerHTML = pageContent;
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

const responseReply = async (response) => {
    if (response.ok) {
        alert('Deleted dream successfully')
    } else {
        const message = await response.text()
        alert(message);
    }
    return;
}
