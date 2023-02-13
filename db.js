var mysql = require('mysql2')
const dbConfig = require("./db.config.js");

var db_connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});


if(db_connection.state){
    db_connection.connect(error => {
        if (error) {
            console.error(error.message)
            throw new Error("Could not connect to the database!");
        }
    
        console.log("Successfully connected to the database.");
    });
}
else{
    console.log("state is undefined");
}

module.exports = db_connection;