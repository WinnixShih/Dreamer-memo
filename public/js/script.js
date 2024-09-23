document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('navbar-burger');
    const menu = document.getElementById('navbar-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
});


const dateElement = document.getElementById('date');
if (dateElement) {
    const todayDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').textContent = todayDate;
}


// * for changing display in the front end, default is showing id input box
const deleteTypeElement = document.getElementById('deleteType');
if (deleteTypeElement) {
    document.getElementById('deleteType').addEventListener('change',function() {
        // * using function() to use the <this> attribute
        const deleteType = this.value;
        // * showing the require input box
        if (deleteType === 'people') {
            document.getElementById('deletePeopleBox').style.display = 'block';
            document.getElementById('deleteDateBox').style.display = 'none';
        } else if (deleteType === 'date') {
            document.getElementById('deletePeopleBox').style.display = 'none';
            document.getElementById('deleteDateBox').style.display = 'block';
        }
    });
}

const deleteDream = async () => {
    // * get the type of deletion
    const deleteType = document.getElementById('deleteType').value;
    const deleteTarget = (deleteType === 'date') ? document.getElementById('deleteDateInput').value : document.getElementById('deletePeopleInput').value;
    // * 2 ways to delete data, people or date
    if (!deleteTarget) {
        alert("No input data to delete");
        return;
    }
    try {
        // ? fetch the url and use the endpoint
        const response = await fetch(`${baseUrl}/delete?${deleteType}=${encodeURIComponent(deleteTarget)}`, {
            method: 'DELETE',
        });
        if (response.redirected) {
            // * Redirect to the page rendered by the server (e.g., "notFound" or success page)
            window.location.href = response.url;
        } else {
            const pageContent = await response.text();
            document.body.innerHTML = pageContent;
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}
