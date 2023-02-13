if(!isLoggedIn()){
    window.location.href = "LoginPage";
}

async function SearchShows(name, category) {
    const url = `/api/getshows?name=${name}&category=${category}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


var shows = db["shows"];

var search_name = new URL(location.href).searchParams.get('name');
var search_category = new URL(location.href).searchParams.get('category');
let cards_container = document.getElementById("cards-container");

const api_shows = SearchShows(search_name,search_category).then(shows => {
    console.log(shows);
    return shows;
})

if(search_name != undefined){
    shows = shows.filter(show => show.name.includes(search_name) || search_name.includes(show.name));
}
if(search_category != undefined){
    shows = shows.filter(show => show.category.includes(search_category));
}

if(shows.length == 0){
    alert("לא נמצאו הצגות!")
    window.location.replace("SearchPage");
}

fetchAndCreateShows()
// shows.forEach((show) => {
//     let li = document.createElement("div");
//     li.classList.add("card");
//     li.innerHTML = createShowCardObject(show);
//     cards_container.appendChild(li);
    
// })
async function fetchAndCreateShows(){
    const api_shows = await SearchShows(search_name,search_category);
    api_shows.forEach((show) => {
        let li = document.createElement("div");
        li.classList.add("card");
        li.innerHTML = createShowCardObject(show);
        cards_container.appendChild(li);
        
    })
}

function createShowCardObject(show) {
    const base_html = `
        <img src=" ${show.imageurl}" class="show-img">
        <h2>  ${show.name}</h2>
        <div class="button-padding"><a class="light-btn" href="ReviewListPage?show=${show.name}"> צפייה בביקורת</a></div>
        <div  class="button-padding"><a  class="light-btn" href="WriteReviewPage?show=${show.name}"> הוספת בביקורת</a></div>
    `
    return base_html;
}
