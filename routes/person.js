const fs = require('fs');

module.exports = {
    addPersonPage: (req, res) => {
        res.render('addperson.ejs', {
            title: "Welcome   | Add a new person"
            ,message: ''
        });
    },
    addperson: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `person` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('addperson.ejs', {
                    message,
                    title: "Welcome | Add a new person"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the person's details to the database
                        let query = "INSERT INTO `person` (first_name, last_name, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" +  "', '" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('addperson.ejs', {
                        message,
                        title: "Welcome | Add a new person"
                    });
                }
            }
        });
    },
    editPersonPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `person` WHERE id = '" + personId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('editperson.ejs', {
                title: "Edit  Person"
                ,person: result[0]
                ,message: ''
            });
        });
    },
    editPerson: (req, res) => {
        let personId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
    
        let number = req.body.number;

        let query = "UPDATE `person` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name +"', `number` = '" + number + "' WHERE `person`.`id` = '" + personId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePerson: (req, res) => {
        let personId = req.params.id;
        let getImageQuery = 'SELECT image from `person` WHERE id = "' + personId + '"';
        let deleteUserQuery = 'DELETE FROM person WHERE id = "' + personId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};