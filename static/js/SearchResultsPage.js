if(!isLoggedIn()){
    window.location.href = "LoginPage.html";
}
var shows = db["shows"];

var search_name = new URL(location.href).searchParams.get('name');
var search_category = new URL(location.href).searchParams.get('category');
let cards_container = document.getElementById("cards-container");

if(search_name != undefined){
    shows = shows.filter(show => show.name.includes(search_name) || search_name.includes(show.name));
}
if(search_category != undefined){
    shows = shows.filter(show => show.category.includes(search_category));
}

if(shows.length == 0){
    alert("לא נמצאו הצגות!")
    window.location.replace("SearchPage.html");
}

shows.forEach((show) => {
    let li = document.createElement("div");
    li.classList.add("card");
    li.innerHTML = createShowCardObject(show);
    cards_container.appendChild(li);
    
})


function createShowCardObject(show) {
    const base_html = `
        <img src=" ${show.imageUrl}" class="show-img">
        <h2>  ${show.name}</h2>
        <div class="button-padding"><a class="light-btn" href="ReviewListPage.html?show=${show.ref}"> צפייה בביקורת</a></div>
        <div  class="button-padding"><a  class="light-btn" href="WriteReviewPage.html?show=${show.ref}"> הוספת בביקורת</a></div>
    `
    return base_html;
}
