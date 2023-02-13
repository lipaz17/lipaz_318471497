

if(isLoggedIn()){
    window.location.href = "SearchPage";
}
document.getElementById("loginBtn").addEventListener("click", async () => {
    event.preventDefault();

    const password =  document.getElementById("passwordInput").value;
    const email =   document.getElementById("emailInput").value;

    const loggedIn = await tryLogin(email, password);

    if(!loggedIn){
        alert("ההתחברות נכשלה!");
    }
    else{
        alert("התחברת בהצלחה!");
        setCurrentUserToLocalStorage({"email":email});

        document.location.href = "SearchPage";
    }
}); 