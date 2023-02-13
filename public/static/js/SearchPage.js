

if(!isLoggedIn()){
    window.location.href = "LoginPage";
}


document.getElementById("searchBtn").addEventListener("click", () => {
    event.preventDefault();

    var categoryInput = document.getElementById("categoryTextInput");
    var nameInput = document.getElementById("nameTextInput");

    var name = nameInput.value == "" ? undefined : nameInput.value;
    var category = categoryInput.value == "" ? undefined : categoryInput.value;

    var url = 'SearchResultsPage';

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

   
    var url = 'RecommendedForMe';

    window.location.href = url;
});
recommendedBtn