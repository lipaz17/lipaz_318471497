if(!isLoggedIn()){
    window.location.href = "LoginPage";
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
    title_html.innerHTML = showname;
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


document.getElementById("addReviewBtn").addEventListener("click", async () => {
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

    var url = 'OnReviewSubmittedPage';
    const review = {
        title: titleInput.value,
        description: contentInput.value,
        rating: +ratingInput.value
    }

    await addReview(showname, review).then((response) => {
        if(response){
            alert("הסקירה נוספה בהצלחה!");
            ratingInput.value = '';
            titleInput.value = '';
            contentInput.value = '';
        }
    });
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
    document.location.href = "LandingPage";
});