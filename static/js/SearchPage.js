if(!isLoggedIn()){
    window.location.href = "LoginPage.html";
}

document.getElementById("searchBtn").addEventListener("click", () => {
    event.preventDefault();

    var categoryInput = document.getElementById("categoryTextInput");
    var nameInput = document.getElementById("nameTextInput");

    var name = nameInput.value == "" ? undefined : nameInput.value;
    var category = categoryInput.value == "" ? undefined : categoryInput.value;

    var url = 'SearchResultsPage.html';

    if(name){
        url = url + "?name=" + name ;
    }
    if(category){
        url = url + "?category=" + category;
    }

    window.location.href = url;
}); 


document.getElementById("recommendedBtn").addEventListener("click", () => {
    event.preventDefault();

   
    var url = 'RecommendedForMe.html';

    window.location.href = url;
});
recommendedBtn