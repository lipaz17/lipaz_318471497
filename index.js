const express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
const crud_functions = require("./crud_functions");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
    res.render('landingPage');
    //res.sendFile(path.join(__dirname, "views/LandingPage.html"))
})

app.get('/contactuspage', (req, res) => {
    res.render('contactuspage');
    //res.sendFile(path.join(__dirname, "views/ContactUsPage.html"))
})

app.get('/LoginPage', (req, res) => {
    res.render('loginpage');
    //res.sendFile(path.join(__dirname, "views/LoginPage.html"))
})
app.get('/RegisterPage', (req, res) => {
    res.render('registerpage')
    //res.sendFile(path.join(__dirname, "views/RegisterPage.html"))
})
app.get('/SearchPage', (req, res) => {
    res.render('searchpage')
    // res.sendFile(path.join(__dirname, "views/SearchPage.html"))
})
app.get('/SearchResultsPage', (req, res) => {
    res.render('searchresultspage')
    // res.sendFile(path.join(__dirname, "views/SearchResultsPage.html"))
})
app.get('/RecommendedForMe', (req, res) => {
    res.render('recommendedforme')
    //res.sendFile(path.join(__dirname, "views/RecommendedForMe.html"))
})

app.get('/ReviewListPage', (req, res) => {
    res.render('reviewlistpage')
    // res.sendFile(path.join(__dirname, "views/ReviewListPage.html"))
})

app.get('/WriteReviewPage', (req, res) => {
    res.render('writereviewpage')
    //res.sendFile(path.join(__dirname, "views/WriteReviewPage.html"))
})
app.get('/OnReviewSubmittedPage', (req, res) => {
    res.render('onreviewsubmittedpage')
    // res.sendFile(path.join(__dirname, "views/OnReviewSubmittedPage.html"))
})

app.get('/LandingPage', (req, res) => {
    res.render('landingpage')
    //res.sendFile(path.join(__dirname, "views/LandingPage.html"))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post("/api/createnewuser", function (req, res) {
    return crud_functions.CreateNewUser(req, res);
});

app.get("/api/loginuser", function (req, res) {
    return crud_functions.LoginUser(req, res);
});

app.get("/api/reviews", function (req, res) {
    return crud_functions.GetReviews(req, res);
});

app.post("/api/addreview", function (req, res) {
    return crud_functions.AddReview(req, res);
});

app.get("/api/avgreview", function (req, res) {
    return crud_functions.GetAvgReview(req, res);
})
app.get("/api/AddContactUsMessage", function(req,res){
    return crud_functions.AddContactUsMessage(req,res);
})

app.get("/api/getshows", function (req, res) {
   return crud_functions.GetShows(req, res);
});

app.get("/api/getshowsforme", function (req, res) {
    return crud_functions.GetShowsForMe(req, res);
});

app.get("/api/createDB", async function (req, res) {
    return crud_functions.CreateDB(req, res);
});

app.get("/api/CreateAllTables", function (req, res) {
    return crud_functions.CreateAllTables(req, res);
})

app.get("/api/fillDB", function (req, res) {
    return crud_functions.FillDB(req, res);
});

app.get("/api/DropTables", function (req, res) {
    return crud_functions.DropTables(req, res);
});

app.get("/api/getUsers", function (req, res) {
    return crud_functions.GetUsers(req, res);
});

app.get("/api/createUsersTable", function (req, res) {
    return crud_functions.CreateUsersTable(req, res);
});

app.get("/api/insertIntoUsersTable", function (req, res) {
    return crud_functions.InsertIntoUsersTable(req, res);
});

app.get("/api/selectUsersTable", function (req, res) {
    return crud_functions.SelectUsersTable(req, res);
})

app.get("/api/createReviewsTable", function (req, res) {
    return crud_functions.CreateReviewsTable(req, res);
})

app.get("/api/insertIntoReviewsTable", function (req, res) {
    return crud_functions.InsertIntoReviewsTable(req, res);
})

app.get("/api/selectReviewsTable", function (req, res) {
    return crud_functions.SelectReviewsTable(req, res);
})

app.get("/api/createShowsTable", function (req, res) {
    return crud_functions.CreateShowsTable(req, res);
})

app.get("/api/insertIntoShowsTable", function (req, res) {
    return crud_functions.InsertIntoShowsTable(req, res);
})

app.get("/api/selectShowsTable", function (req, res) {
    return crud_functions.SelectShowsTable(req, res);
})

app.get("/api/createContactUsTable", function (req, res) {
    return crud_functions.CreateContactUsTable(req, res);
})
app.get("/api/insertIntoContactUsTable", function (req, res) {
    return crud_functions.InsertIntoContactUsTable(req, res);
})

app.get("/api/selectContactUsTable", function (req, res) {
    return crud_functions.SelectContactUsTable(req, res);
})

app.get("/api/createAvgReviewsTable", function (req, res) {
    return crud_functions.CreateAvgReviewsTable(req, res);
})

app.get("/api/insertIntoAvgReviewsTable", function (req, res) {
    return crud_functions.InsertIntoAvgReviewsTable(req, res);
})

app.get("/api/selectAvgReviewsTable", function (req, res) {
    return crud_functions.SelectAvgReviewsTable(req, res);
})
