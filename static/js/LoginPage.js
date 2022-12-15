
if(isLoggedIn()){
    window.location.href = "SearchPage.html";
}
document.getElementById("loginBtn").addEventListener("click", () => {
    event.preventDefault();

    const password =  document.getElementById("passwordInput").value;
    const email =   document.getElementById("emailInput").value;

    const loggedIn = tryLogin(email, password);
    if(!loggedIn){
        alert("ההתחברות נכשלה!");
    }
    else{
        alert("התחברת בהצלחה!");
        document.location.href = "SearchPage.html";
    }
}); 