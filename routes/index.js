module.exports = {
    getHomePage: (req,res)=>{
        let query =  "SELECT * FROM `person` ORDER BY id ASC"; // query database to get all the persons
        // execute query
        db.query(query,(err,result)=>{
            if(err){
                res.redirect('/');
            }
            res.render('index.ejs',{
                title: "Welcome to DataBase | View person"
                ,person: result
            });
        });
    }
};