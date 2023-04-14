const mysql = require("mysql2")
const express = require("express")
const app = express()
const hbs = require("hbs")
const expressHbs = require("express-handlebars")
jsonParser = express.json()


//layouts
app.engine("hbs", expressHbs.engine(
  {
    layotsDi: "views/layouts",
    defaultLayout: "layout",
    extname: "hbs"
  }
))
app.set("view engine", "hbs")
hbs.registerPartials(__dirname + "/views/particals")




const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  port: "3306",
  database: "new_schema",
})


connection.connect(function(err){
  if (err){
    return console.error(`Ошибка: ${err.message}`)
  }
  else{
    console.log("Подключение к бд успешно!!!!!")
  }
})


const sql = `SELECT * FROM users`

connection.query(sql, function(err, res){
  if (err) console.log(err);
  console.log(res);
})


app.get("/registration", (req,res) =>{
  res.render("registration.hbs")
})

app.get("/login", (req,res) =>{
  res.render("login.hbs")
})

app.post("/registration/api", jsonParser, (req,res) => {
  console.log('Посмотрите вдруг вам пришло что то важное');
  let user = req.body
  connection.query(`SELECT login FROM users WHERE login = "${user.login}" `, function(err, res){
    // console.log(user.login);
    // console.log(res.length);
    if (res.length == 0){
      connection.query(`INSERT INTO users(login, password) VALUES("${user.login}", "${user.password}")`, user, function(err, results) {
        if(err) console.log(err);
        else 
        {
          console.log("Данные добавлены");
        }
      });
      connection.query(sql, function(err, res){
        if (err) console.log(err);
        console.log(res);
      })
    }
    else{
      console.log('error');
      
    }
  })
  
})

app.post("/login/api", jsonParser, (req,response) => {
  console.log('Посмотрите вдруг вам пришло что то важное');
  let user = req.body
  console.log(req.body)
  connection.query(`SELECT * FROM users WHERE login = "${user.login}" AND password = "${user.password}"`, function(err, res){
    if (res.length == 0){
      console.log('Всё не пучком')
      response.send('Неправильный логин или пароль')
    }
    else if (res.length == 1){
      console.log('Всё пучком')
      response.send(res)
    } 
  })
  
})


app.listen(3000)