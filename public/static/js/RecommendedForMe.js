if (!isLoggedIn()) {
    window.location.href = "LoginPage";
}

var search_name = new URL(location.href).searchParams.get('name');
var search_category = new URL(location.href).searchParams.get('category');
let cards_container = document.getElementById("cards-container");

fetch(`/api/getshowsforme?email=${getCurrentUserFromLocalStorage().email}`).then(response=> response.json()).then(shows => {
    if (shows.length == 0) {
        alert("לא נמצאו הצגות!")
        window.location.replace("SearchPage");
    }

    shows.forEach((show) => {
        let li = document.createElement("div");
        li.classList.add("card");
        li.innerHTML = createShowCardObject(show);
        cards_container.appendChild(li);
    })
})

function createShowCardObject(show) {
    const base_html = `
        <img src=" ${show.imageurl}" class="show-img">
        <h2>  ${show.name}</h2>
        <div class="button-padding"><a class="light-btn" href="ReviewListPage?show=${show.ref}"> צפייה בביקורת</a></div>
        <div  class="button-padding"><a  class="light-btn" href="WriteReviewPage?show=${show.ref}"> הוספת בביקורת</a></div>
    `
    return base_html;
}