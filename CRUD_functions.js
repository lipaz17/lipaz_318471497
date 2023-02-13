const SQL = require("./db.js");
const csv = require("csvtojson");
const path = require('path');

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}
const CreateNewUser = function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const newUser = {
        "email": req.body.email,
        "name": req.body.name,
        "password": req.body.password,
        "dateofbirth": req.body.dateofbirth,
    };
    if (Object.values(newUser).includes(undefined)) {
        return res.status(400).send({
            message: "New user is missing a field!"
        });
    }

    if (!ValidateEmail(newUser.email)) {
        return res.status(400).send({
            message: "User email is invalid!"
        });
    }

    SQL.query(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [newUser.email],
        function (error, results) {
            if (error) {
                console.error("error: ", error);
                return res.status(400).send({
                    message: "error in creating user: " + error
                });
            }

            if (results[0].count > 0) {
                return res.status(400).send({
                    message: `A user with email ${newUser.email} already exists.`
                });
            } else {
                SQL.query("INSERT INTO users SET ?", newUser, (err, mysqlres) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(400).send({
                            message: "error in creating user: " + err
                        });
                    }
                    console.log("created user: ", {
                        id: mysqlres.insertId,
                        ...newUser
                    });
                    return res.send({
                        message: "new user created successfully"
                    });
                });
            }
        }
    );

};

const LoginUser = (req, res) => {

    const askedUser = {
        "email": req.query.username,
        "password": req.query.password,
    };
    SQL.query(
        'SELECT COUNT(*) as count FROM users WHERE email = ? AND password = ?',
        [askedUser.email, askedUser.password],
        function (error, results) {
            if (error) throw error;

            if (results[0].count == 0) {
                console.log(`Invalid Login details`);
                res.status(400).send(new Error(`Invalid Login details`));
            } else {
                res.send(results)
            }

        }
    );
};

const AddContactUsMessage = (req, res) => {
    if (!req.query) {
        return res.status(400).send({
            message: "query can not be empty"
        });
    }
    if (!req.query.email || !req.query.message) {
        return res.status(400).send({
            message: "email / message is missing!"
        })
    }
    const newMessage = {
        "email": req.query.email,
        "message": req.query.message,
    };
    SQL.query(
        'INSERT INTO contactus SET ?',
        [newMessage],
        function (error, results) {
            if (error) throw error;

            console.log(`Contact us message added successfully`);
            res.send(results)
        }
    );
}

const AddReview = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "content can not be empty"
        });

    }
    if (!req.body.showname) {
        return res.status(400).send({
            message: "Internal error - show name is missing!"
        })
    }
    const review = req.body.review;
    if (!review.title || !review.description || !review.rating) {
        return res.status(400).send({
            message: "review must have title, description and rating!"
        });
    }

    SQL.query("SELECT id FROM shows WHERE name = ?", [req.body.showname], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in getting show id: " + err
            });
            return;
        }
        if (mysqlres.length == 0) {
            return res.status(400).send({
                message: "Internal error - could not find show!"
            })
        }
        var showid = mysqlres[0].id;
        const newReview = {
            "title": review.title,
            "content": review.description,
            "rating": review.rating,
            "showid": showid,
        };
        SQL.query(
            'INSERT INTO reviews SET ?',
            [newReview],
            function (error, results) {
                if (error) throw error;

                console.log(`Review added successfully`);

                SQL.query("SELECT * FROM avgreviews WHERE showid = ?", [showid], (err, mysqlres) => {

                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({
                            message: "error in getting avg rating: " + err
                        });
                        return;
                    }
                    //if mysqlres is empty, create new row
                    if (mysqlres == undefined || mysqlres.length == 0) {
                        SQL.query("INSERT INTO avgreviews SET ?", {
                            showid: showid,
                            sumrating: review.rating,
                            countrating: 1
                        }, (err, mysqlres) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({
                                    message: "error in creating avg rating: " + err
                                });
                                return;
                            }
                            console.log(`avg rating created successfully`);
                        });
                    } else {
                        var count = mysqlres[0].countrating;
                        var sum = mysqlres[0].sumrating;
                        if (!count || !sum) {
                            count = 1;
                            sum = review.rating;
                        } else {
                            count++;
                            sum += review.rating;
                        }
                        SQL.query("UPDATE avgreviews SET sumrating=?, countrating = ? WHERE showid = ?", [sum, count, showid], (err, mysqlres) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({
                                    message: "error in updating avg rating: " + err
                                });
                                return;
                            }
                            console.log(`avg rating updated successfully`);
                        });
                    }


                });
                res.send(results)
            }
        )
    })


};

const GetAvgReview = (req, res) => {
    if (!req.query.showname) {
        return res.status(400).send({
            message: "Internal error - show name is missing!"
        })
    }

    SQL.query("SELECT id FROM shows WHERE name = ?", [req.query.showname], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in getting show id: " + err
            });
            return;
        }
        if (mysqlres.length == 0) {
            return res.status(400).send({
                message: "Internal error - could not find show!"
            })
        }
        var showid = mysqlres[0].id;
        SQL.query("SELECT * FROM avgreviews WHERE showid = ?", [showid], (err, mysqlres2) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({
                    message: "error in selecting avgreviews table: " + err
                });
            }
            if (mysqlres2.length == 0) {
                return res.send({
                    countrating: 0,
                    id: 0,
                    showid: 0,
                    sumrating: 0
                });
            }
            res.send(mysqlres2[0]);
        })
    })
}
const GetReviews = (req, res) => {
    const showName = req.query.showname;
    if (showName == null) {
        return res.status(400).send({
            message: "showname query parm is null"
        });

    }
    //find show id by name and then get reviews in same query
    SQL.query("SELECT * FROM shows where name = ?", [showName], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in getting show name: " + err
            });
        }
        if (mysqlres.length == 0) {
            return res.status(400).send({
                message: "Internal error - could not find show!"
            })
        }
        var showId = mysqlres[0].id;
        SQL.query("SELECT * FROM reviews WHERE showid = ?", [showId], (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({
                    message: "error in getting reviews: " + err
                });
            }
            return res.send(mysqlres);
        });
    })

};

const GetShows = (req, res) => {
    const category = req.query.category == 'null' ? undefined : req.query.category;
    const name = req.query.name == 'null' ? undefined : req.query.name;

    let query = 'SELECT * FROM shows';
    let values = [];

    if (category) {
        query += ' WHERE category = ?';
        values.push(category);
    }

    if (name) {
        query += (values.length > 0) ? ' AND' : ' WHERE';
        query += ' name LIKE ?';
        values.push(`%${name}%`);
    }

    SQL.query(query, values, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in getting reviews: " + err
            });
            return;
        }

        res.send(mysqlres);
        return;
    });
};

const GetShowsForMe = (req, res) => {
    const getAge = function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    const email = req.query.email;

    if (email == null) {
        return res.status(400).send({
            message: "cannot GetShowsForMe - email is null"
        });
    }

    //Get user object from users table
    var users, user;
    return SQL.query("SELECT * FROM users WHERE email = ?", [email], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in getting reviews: " + err
            });
        }
        console.log(`got user ${JSON.stringify(mysqlres)}`);
        users = mysqlres;

        if (users == undefined || users.length == 0) {
            return res.status(400).send({
                message: "cannot find user"
            });
        }
        user = users[0];
        console.log(`got user ${user}`);

        //Get age of user from dateofbirth field in user object
        var age = getAge(user.dateofbirth);
        console.log(`user age is ${age}`);

        //Get shows from shows table where age is between minage and maxage
        SQL.query("SELECT * FROM shows WHERE minage <= ? AND maxage >= ?", [age, age], (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({
                    message: "error in getting reviews: " + err
                });
                return;
            }
            console.log(`got shows ${mysqlres}`);
            res.send(mysqlres);
            return;
        });
    })


}

const GetUsers = (req, res) => {
    SQL.query("SELECT * FROM users", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in getting reviews: " + err
            });
            return;
        }
        console.log(`got users`);
        res.send(mysqlres);
        return;
    });
}
const CreateAllTables = (req, res) => {
    SQL.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), dateofbirth DATE)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in creating users table: " + err
            });
        }
        console.log(`created users table`);
    })
    SQL.query("CREATE TABLE IF NOT EXISTS shows (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), minage INT, maxage INT, imageurl VARCHAR(255))", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating shows table: " + err
            });
            return;
        }
        console.log(`created shows table`);
    })

    SQL.query("CREATE TABLE IF NOT EXISTS reviews (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), content VARCHAR(255), rating INT, showid INT, userid INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating reviews table: " + err
            });
            return;
        }
        console.log(`created reviews table`);
    })
    SQL.query("CREATE TABLE IF NOT EXISTS contactus (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), message VARCHAR(255))", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating contactus table: " + err
            });
            return;
        }
        console.log(`created contactus table`);
    });
    SQL.query("CREATE TABLE IF NOT EXISTS avgreviews (id INT AUTO_INCREMENT PRIMARY KEY, showid INT, sumrating INT, countrating INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating avgreviews table: " + err
            });
            return;
        }
        console.log(`created avgreviews table`);

    });
    //CreateUsersTable(req, res);
    //CreateShowsTable(req, res);
    //CreateReviewsTable(req, res);
    //CreateContactsTable(req, res);
    //CreateAvgReviewsTable(req, res);
}

const CreateDB = async (req, res) => {
    SQL.query("CREATE DATABASE IF NOT EXISTS showtime", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating database: " + err
            });
            return;
        }
        console.log(`created database`);
    });
    //select database
    SQL.query("USE showtime", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting database: " + err
            });
            return;
        }
        console.log(`selected database`);
    });
    await CreateAllTables(req,res);

    await FillDB(req, res);

    return res.send("Created database");
}

const CreateUsersTable = (req, res) => {
    return SQL.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), dateofbirth DATE)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in creating users table: " + err
            });
        }
        console.log(`created users table`);
    })
    //return res.send("Created users table");
}

const InsertIntoUsersTable = (req, res) => {
    var Query = "INSERT INTO users SET ?";
    const csvFilePath = path.join(__dirname, 'csv-mock/users.csv');
    return csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            var values = {
                name: element.name,
                email: element.email,
                password: element.password,
                dateofbirth: element.dateofbirth
            };
            SQL.query(Query, values, (err, mysqlres) => {
                if (err) {
                    console.log("error: ", err);
                    return res.status(400).send({
                        message: "error in inserting into users table: " + err
                    });

                }
            })
        })
        console.log(`filled users table`);
    })
}

const SelectUsersTable = (req, res) => {
    SQL.query("SELECT * FROM users", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting users table: " + err
            });
            return;
        }
        console.log(`selected users table`);
        return res.send(mysqlres);

    })
}

const CreateShowsTable = (req, res) => {
    SQL.query("CREATE TABLE IF NOT EXISTS shows (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), minage INT, maxage INT, imageurl VARCHAR(255))", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating shows table: " + err
            });
            return;
        }
        console.log(`created shows table`);
    })
}

const InsertIntoShowsTable = (req, res) => {
    var Query = "INSERT INTO shows SET ?";
    const csvFilePath = path.join(__dirname, 'csv-mock/shows.csv');
    return csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            var values = {
                name: element.name,
                category: element.category,
                minage: element.minage,
                maxage: element.maxage,
                imageurl: element.imageurl
            };
            SQL.query(Query, values, (err, mysqlres) => {
                if (err) {
                    console.log("error: ", err);
                    return res.status(400).send({
                        message: "error in inserting into shows table: " + err
                    });

                }
            })
        })
        console.log(`filled shows table`);
    })
    // SQL.query("INSERT INTO shows (name, category, minage, maxage,imageurl) VALUES ('מאמא מיה','מחזמר',30,50,'/static/images/shows/mamamia.jpg'),('קזבלן','אימה',50,70,'/static/images/shows/kazablan.jfif'),('מרי לו','מחזמר',50,70,'/static/images/shows/merilu.jpg'),('חבדניקים','קומדי',10,30,'/static/images/shows/chabadnikim.jpg'),('סוס אחד','דרמה',20,30,'/static/images/shows/susehad.jpg')", (err, mysqlres) => {
    //     if (err) {
    //         console.log("error: ", err);
    //         return res.status(400).send({
    //             message: "error in filling shows table: " + err
    //         });
    //     }
    //     console.log(`filled shows`);
    // })
}

const SelectShowsTable = (req, res) => {
    SQL.query("SELECT * FROM shows", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting shows table: " + err
            });
            return;
        }
        console.log(`selected shows table`);
        return res.send(mysqlres);

    })
}

const CreateReviewsTable = (req, res) => {
    SQL.query("CREATE TABLE IF NOT EXISTS reviews (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), content VARCHAR(255), rating INT, showid INT, userid INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating reviews table: " + err
            });
            return;
        }
        console.log(`created reviews table`);
    })
}

const InsertIntoReviewsTable = (req, res) => {
    SQL.query("INSERT INTO reviews (title, content, rating, showid, userid) VALUES ('מאמא מיה','מאמא מיה היא המופע הכי טוב שראיתי בחיי',5,1,1),('קזבלן','קזבלן היא המופע הכי טוב שראיתי בחיי',5,2,1),('מרי לו','מרי לו היא המופע הכי טוב שראיתי בחיי',5,3,1),('חבדניקים','חבדניקים היא המופע הכי טוב שראיתי בחיי',5,4,1),('סוס אחד','סוס אחד היא המופע הכי טוב שראיתי בחיי',5,5,1)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in filling reviews table: " + err
            });
        }
        console.log(`filled reviews`);
    })
}

const SelectReviewsTable = (req, res) => {
    SQL.query("SELECT * FROM reviews", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting reviews table: " + err
            });
            return;
        }
        console.log(`selected reviews table`);
        res.send(mysqlres);

    })
}

const CreateContactsTable = (req, res) => {
    SQL.query("CREATE TABLE IF NOT EXISTS contactus (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), message VARCHAR(255))", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating contactus table: " + err
            });
            return;
        }
        console.log(`created contactus table`);
    });
}

const SelectContactsTable = (req, res) => {
    SQL.query("SELECT * FROM contactus", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting contactus table: " + err
            });
            return;
        }

        console.log(`selected contactus table`);
        return res.send(mysqlres);
    });
}

const CreateAvgReviewsTable = (req, res) => {
    SQL.query("CREATE TABLE IF NOT EXISTS avgreviews (id INT AUTO_INCREMENT PRIMARY KEY, showid INT, sumrating INT, countrating INT)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in creating avgreviews table: " + err
            });
            return;
        }
        console.log(`created avgreviews table`);

    });
}

const InsertIntoAvgReviewsTable = (req, res) => {

    SQL.query("INSERT INTO avgreviews (showid, sumrating, countrating) VALUES (1,5,1),(2,5,1),(3,5,1),(4,5,1),(5,5,1)", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({
                message: "error in filling avgreviews table: " + err
            });
        }
        console.log(`filled avgreviews`);
    })
}

const SelectAvgReviewsTable = (req, res) => {
    SQL.query("SELECT * FROM avgreviews", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in selecting avgreviews table: " + err
            });
            return;
        }
        console.log(`selected avgreviews table`, mysqlres);
        res.send(mysqlres);
    })
}

const FillDB = (req, res) => {
    InsertIntoUsersTable(req,res);
    InsertIntoShowsTable(req,res);
}

const DropTables = (req, res) => {
    //drop each table
    SQL.query("DROP TABLE reviews", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in deleting reviews table: " + err
            });
            return;
        }
        console.log(`deleted reviews`);
    });
    SQL.query("DROP TABLE avgreviews", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in deleting avgreviews table: " + err
            });
            return;
        }
        console.log(`deleted avgreviews`);
    });
    SQL.query("DROP TABLE contactus", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({

                message: "error in deleting contactus table: " + err
            });
            return;
        }
        console.log(`deleted contactus`);
    });
    SQL.query("DROP TABLE shows", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in deleting shows table: " + err
            });
            return;
        }
        console.log(`deleted shows`);
    });
    SQL.query("DROP TABLE users", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in deleting users table: " + err
            });
            return;
        }
        console.log(`deleted users`);
    });
    
    return res.send("All tables deleted");
}

module.exports = {
    CreateNewUser,
    LoginUser,
    GetReviews,
    GetShows,
    AddReview,
    GetShowsForMe,
    GetUsers,
    CreateDB,
    CreateAllTables,
    DropTables,
    AddContactUsMessage,
    CreateAvgReviewsTable,
    CreateContactsTable,
    CreateReviewsTable,
    CreateShowsTable,
    CreateUsersTable,
    SelectAvgReviewsTable,
    SelectContactsTable,
    SelectReviewsTable,
    SelectShowsTable,
    SelectUsersTable,
    InsertIntoReviewsTable,
    InsertIntoAvgReviewsTable,
    InsertIntoUsersTable,
    InsertIntoShowsTable,
    GetAvgReview
};