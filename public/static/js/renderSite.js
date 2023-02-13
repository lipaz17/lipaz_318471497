var path = window.location.pathname;
var currentPage = path.split("/").pop();
var navbar_container = document.querySelector("#navbar_container");

if (navbar_container) {
    navbar_container.innerHTML = createDynamicNavbar(currentPage, isLoggedIn())
} else {
    alert("Did not find navbar_container element :(")
}


function createDynamicNavbar(currentPage, loggedIn) {
    const loggedInPages = [{
        page: "LandingPage",
        text: "דף בית"
    }, {
        page: "SearchPage",
        text: "חיפוש"
    }, {
        page: "WriteReviewPage",
        text: "הוספת ביקורת"
    }, {
        page: "ContactUsPage",
        text: "יצירת קשר"
    }, {
        page: "#",
        text: "התנתקות",
        extra: "id=logoutBtn"
    }]
    const guestPages = [{
        page: "LandingPage",
        text: "דף בית"
    }, {
        page: "RegisterPage",
        text: "הרשמה"
    }, {
        page: "LoginPage",
        text: "התחברות"
    }, {
        page: "ContactUsPage",
        text: "יצירת קשר"
    }]

    var navBarHtml = "<ul>";

    const pages = loggedIn ? loggedInPages : guestPages;

    pages.forEach(function (obj) {
        var tempLi;
        if (obj.page == currentPage) {
            console.log(obj.page)
            tempLi = `<li><a class="disabled-navbar-li" href="${obj.page}" ${obj.extra}>${obj.text}</a></li>`
        } else {
            tempLi = `<li><a class="navbar-li" href="${obj.page}" ${obj.extra}>${obj.text}</a></li>`
        }

        navBarHtml = navBarHtml + tempLi;
    })

    navBarHtml = navBarHtml + "</ul>";
    return navBarHtml;
}


function createFooter() {
    var footer = document.createElement("FOOTER");
    footer.setAttribute("id", "myFooter");
    footer.innerHTML = `
        <hr class="dotted">
        <a href="https://www.facebook.com/" class="fa fa-facebook"> Facebook  |</a>
        <a href="https://twitter.com/" class="fa fa-twitter"> Twitter  |</a>
        <a href="https://www.instagram.com/" class="fa fa-instagram"> Instagram</a>
        <p>© Showtime 2022 ©</p>
    `
    document.body.appendChild(footer);

    
}
function logoutBtnListener(){
    if(document.getElementById("logoutBtn")){
        document.getElementById("logoutBtn").addEventListener("click", () => {
            if (confirm('את/ה בטוח/ה שאת/ה רוצה להתנתק?')) {
                logout();
            }
        })
    }
}
logoutBtnListener();
createFooter();
