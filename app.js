const express = require('express'),
 fileUpload = require('express-fileupload'),
 bodyParser = require('body-parser'),
 mysql = require('mysql'),
 path = require('path');

 var app = express();
 const {getHomePage} = require('./routes/index');
const {addPersonPage,addperson,deletePerson,editPerson,editPersonPage} = require('./routes/person');

const port = 5000;
//connect database 

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
//config middleware
app.set('port',process.env.PORT||port); //set express to use this port
app.set('views',__dirname+'views'); //set express to use this folder to render view
app.get('view engine','ejs'); //congfig template engine
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public'))); // configure express to use public folder
app.use(fileUpload()); //config file upload

//routes for the app

app.get('/',getHomePage);
app.get('/add',addPersonPage);
app.get('/edit/:id',editPersonPage);
app.get('delete/:id',deletePerson);
app.post('/add',addperson);
app.post('/edit/:id' ,editPerson);
//

var server = app.listen(port ,()=>{
    console(`Server running on port: ${port}`);
})