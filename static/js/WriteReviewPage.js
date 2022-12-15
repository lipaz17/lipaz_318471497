if(!isLoggedIn()){
    window.location.href = "LoginPage.html";
}

var showname = new URL(location.href).searchParams.get('show');
var category = new URL(location.href).searchParams.get('category');

var title_html = document.querySelector("#title");
var select_html = document.querySelector("#select-container");
var show_select= false;

if(showname == null){
    showname = db["shows"][0].ref;
    show_select = true;
}

function updateTitle(){
    if (title_html && showname && db && db["reviews"] && db["reviews"][showname]) {
        title_html.innerHTML = db["reviews"][showname].name;
    }
}

updateTitle();

if(show_select && select_html){
    var options = "";
    db["shows"].forEach((show)=>{options=options+`<option value="${show.ref}">${show.name}</option>`})
    select_html.innerHTML = `
    <select name="shows" id="shows-selector" onchange="showname = this.value;updateTitle();">
    ${options}         
          </select>
    `;
}


document.getElementById("addReviewBtn").addEventListener("click", () => {
    event.preventDefault();

    var ratingInput = document.getElementById("ratingInput");
    var titleInput = document.getElementById("titleInput");
    var contentInput = document.getElementById("contentInput");

    if(ratingInput.value == ''){
        alert("נא להזין דירוג עבור הסקירה");
        return;
    }

    if(titleInput.value.length < 3){
        alert("אורך כותרת הדירוג חייב להיות לפחות 3");
        return;
    }

    if(contentInput.value.length < 3){
        alert("אורך תוכן הדירוג חייב להיות לפחות 3");
        return;
    }

    var url = 'OnReviewSubmittedPage.html';
    const review = {
        title: titleInput.value,
        description: contentInput.value,
        rating: +ratingInput.value
    }
    addReview(showname, review)

    window.location.href = url;
}); 


document.getElementById("backBtn").addEventListener("click", () => {
    event.preventDefault();
    window.history.go(-1);
}); 


document.getElementById("ratingInput").addEventListener("change", function() {
    let v = parseInt(this.value);
    if (v < 0) this.value = 0;
    if (v > 5) this.value = 5;
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    event.preventDefault();
    document.location.href = "LandingPage.html";
});