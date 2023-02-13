if (isLoggedIn()) {
    window.location.href = "SearchPage";
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}

document.getElementById("registerBtn").addEventListener("click", () => {
    event.preventDefault();

    const password = document.getElementById("passwordInput").value;
    const name = document.getElementById("nameInput").value;
    const datebirth = document.getElementById("dateInput").value;
    const email = document.getElementById("emailInput").value;

    if (name == null || password == null || datebirth == null || email == null || password == "" || name == "" || datebirth == "") {
        alert("אחד מהשדות ריקים! אנא מלא את כל השדות ונסה שוב.");
        return;
    }

    if (!ValidateEmail(email)) {
        alert("כתובת מייל לא תקינה! אנא נסה שוב.");
        return;
    }

    if(password.length < 6){
        alert("הסיסמה צריכה להיות באורך של 6 תווים לפחות! אנא נסה שוב.");
        return;
    }

    tryRegister(email, password, name, datebirth).then(registered => {
        console.log(registered)
        if (!registered) {
            alert("מייל זה כבר תפוס! אולי אתה כבר רשום?");
        } else {
            alert("נרשמת בהצלחה - מועבר לעמוד התחברות...!");
            document.location.href = "LoginPage";
        }    
    }).catch(err => {
        if(err.message){
            err = err.message;
        }
        alert(err)
    })
    
});

// const registered = tryRegister(email, password, name, datebirth);
// if(!registered){
//     alert("email already registered!");
// }
// else{
//     alert("email successfully registered!");
// }