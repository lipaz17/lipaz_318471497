function getDbFromLocalStorage() {
    if (localStorage) {
        return JSON.parse(localStorage.getItem('db'));
    } else {
        throw new Error('localStorage is not available');
    }
}

function setDbToLocalStorage(db) {
    if (localStorage) {
        return localStorage.setItem('db', JSON.stringify(db));
    } else {
        throw new Error('localStorage is not available');
    }
}

function getCurrentUserFromLocalStorage() {
    if (localStorage) {
        return JSON.parse(localStorage.getItem('currentUser'));
    } else {
        throw new Error('localStorage is not available');
    }
}

function setCurrentUserToLocalStorage(currentUser) {
    if (localStorage) {
        return localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        throw new Error('localStorage is not available');
    }
}

var db = getDbFromLocalStorage();
var currentUser = getCurrentUserFromLocalStorage();

if (db == null) {
    db = {
        "shows": [{
                name: "מאמא מיה",
                imageUrl: "../static/images/shows/mamamia.jpg",
                ref: "מאמא מיה",
                category: ["דרמה", "מחזמר"],
                min_age_recommendation: 30,
                max_age_recommendation: 50

            },
            {
                name: "קזבלן",
                imageUrl: "../static/images/shows/kazablan.jfif",
                ref: "קזבלן",
                category: ["אימה"],
                min_age_recommendation: 50,
                max_age_recommendation: 70
            },
            {
                name: "מרי לו",
                imageUrl: "../static/images/shows/merilu.jpg",
                ref: "מרי לו",
                category: ["מחזמר"],
                min_age_recommendation: 50,
                max_age_recommendation: 70
            },
            {
                name: "חבדניקים",
                imageUrl: "../static/images/shows/chabadnikim.jpg",
                ref: "חבדניקים",
                category: ["קומדיה"],
                min_age_recommendation: 10,
                max_age_recommendation: 30
            },
            {
                name: "סוס אחד",
                imageUrl: "../static/images/shows/susehad.jpg",
                ref: "סוס אחד",
                category: ["דרמה"],
                min_age_recommendation: 70,
                max_age_recommendation: 90
            }
        ],
        "reviews": {
            "מאמא מיה": {
                name: "מאמא מיה",
                reviews: [{
                    title: "מופע ממש טוב!",
                    description: "גוף",
                    rating: 3.5
                }, {
                    title: "מופע מצוין!",
                    description: " 2 גוף",
                    rating: 4.5
                }, {
                    title: "מופע מדהים",
                    description: "3 גוף",
                    rating: 5
                }]
            },
            "מרי לו": {
                name: "מרי לו",
                reviews: [{
                    title: "מופע ממש מרגש!",
                    description: "גוף",
                    rating: 3.5
                }, {
                    title: "מופע מרהיב!",
                    description: " 2 גוף",
                    rating: 4.5
                }, {
                    title: "מופע מדהים",
                    description: "3 גוף",
                    rating: 5
                }]
            },
            "חבדניקים": {
                name: "חבדניקים",
                reviews: [{
                    title: "מופע ממש מרגש!",
                    description: "גוף",
                    rating: 3.5
                }, {
                    title: "מופע מרהיב!",
                    description: " 2 גוף",
                    rating: 4.5
                }, {
                    title: "מופע מדהים",
                    description: "3 גוף",
                    rating: 5
                }]
            },
            "סוס אחד": {
                name: "סוס אחד",
                reviews: [{
                    title: "מופע ממש גרוע!",
                    description: "גוף",
                    rating: 0.5
                }, {
                    title: "מופע לא טוב ופחות מכך!",
                    description: " 2 גוף",
                    rating: 0
                }, {
                    title: "לא התחברתי",
                    description: "3 גוף",
                    rating: 0.001
                }]
            },
            "קזבלן": {
                name: "קזבלן",
                reviews: [{
                    title: "לא משהו!",
                    description: "גוף",
                    rating: 1.5
                }, {
                    title: "מופע ככה ככה!",
                    description: " 2 גוף",
                    rating: 0.5
                }, {
                    title: "מופע סביר",
                    description: "3 גוף",
                    rating: 0
                }]
            }
        },
        "users": {
            'lipazshi5@gmail.com': {
                name: 'Lipaz Schieber',
                password: 'LipazWeb17',
                datebirth: "17-5-1998",
            },
            'Noamla@gmail.com': {
                name: 'Noam Lalin',
                password: 'Noamlalala',
                datebirth: "12-12-1992",
            },
            'lino@gmail.com': {
                name: 'Lino Lee',
                password: 'LinoLee',
                datebirth: "12-12-1996"
            }
        },
        "users_messages": []
    }
    setDbToLocalStorage(db);
}



function addReview(show, review) {

    return fetch('/api/addreview',{method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({showname:show,review:review})
    }).then(async function (response) {
        if (response.ok) {
            return true;
        }
    })
    // if (db.reviews[show]) {
    //     db.reviews[show].reviews.push(review);
    //     setDbToLocalStorage(db);
    // }
   
}

function addUserMessage(msg) {
    db["users_messages"].push(msg);
    setDbToLocalStorage(db);
}

async function tryRegister(email, password, name, datebirth) {
    var newUser = {
        email:email,
        name: name,
        password: password,
        dateofbirth: datebirth
    };
    return await fetch('/api/createnewuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    }).then(async function (response) {
        if (response.ok) {
            return true;
        } else {
            if(response.status == 400){
                throw await response.text();

            }
            return false;
        }

    }, function (error) {
        throw error;
    })
}


async function tryLogin(username, password) {

    const loggedIn = await fetch('/api/loginuser?username=' + username + '&password=' + password)
        .then(function (response) {
            if (response.ok) {
                return true;
            } else {
                return false;
            }

        }, function (error) {
            return false;
        }).catch(function (err) {
            return false;
        })

    if (loggedIn) {
        setCurrentUserToLocalStorage({
            "email": username,
            "data": db.users[username]
        });
    }
    return loggedIn;
}

function logout() {
    setCurrentUserToLocalStorage(null);
    location.reload();
}

function isLoggedIn() {
    return getCurrentUserFromLocalStorage() != null;
}