//fetch to api/login
function login(username,password) {
    return fetch('/api/loginuser?username=' + username + '&password=' + password)
        .then(response => response.json())
        .then(data => {
            if (data.length == 0) {
                alert("Incorrect username or password");
            }
            else {
                alert("CORRECT!");

                window.location.href = "SearchPage";
            }
        })
}

export { login};