const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.port || 3000;
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const jwt_decode = require('jwt-decode');
const path = require('path');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var connection = mysql.createConnection({
    host : 'sql9.freemysqlhosting.net',
    user : 'sql9381851',
    password : '8f4bUzmEqM',
    database : 'sql9381851'
});

connection.connect();

app.use(express.static(path.join(__dirname, 'dist')));

const secretKey = 'abcdefghijklmnop';
const jwtMW = expressJWT({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use((req, res, next) => {
  //ch
    res.setHeader('Access-Control-Allow-Origin', 'http://161.35.59.8');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var decoded_token;

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
      connection.query('SELECT * FROM login', async function(error, results, fields) {
       for (let user of results) {
          if(username == user.username && password == user.password) {
                let token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '7d'});
                 decoded_token = jwt_decode(token);
                 res.json({
                        success: true,
                        err: null,
                        token,
                        decoded_token
                    });
                    return;
                  }
              }
                res.status(401).json({
                  success: false,
                  token: null,
                  err: 'Username or password is incorrect'
              });
      });

});


app.post('/api/signup', async (req, res, next) => {
    const { username, password } = req.body;
    connection.query("SELECT username FROM login", function (error, results, fields) {
        for (let user of results) {
            if(username == user.username) {
                res.status(401).json({
                success: false,
                err: 'Username already taken. Please try again!'
              });

              return;
            }

          }

          if(error || username == "" || password == "")  {
            res.status(401).json({
                success: false,
                err: 'Please check your credentials!'
            });

            return;
        }

              connection.query('INSERT INTO login VALUES (?, ?)', [username, password], function (error, results, fields) {
                res.status(200).json({
                  success: true,
                  err: null
                });
              });

    });

});


app.post("/api/dashboard", (req, res) => {
    connection.query('INSERT INTO expenses VALUES (?,?, ?)', [decoded_token.username, req.body.title, req.body.budget], (error, result) => {
      if (error) {
        console.log(error);
        return;
      } else {
        res.json(200);
        console.log("working");
      }
    });
  });

  app.get("/api/dashboard",(req, res) => {
    console.log(decoded_token);
    connection.query(`SELECT title, budget FROM expenses WHERE user_id = "${decoded_token.username}"`,
      (error, result) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(result);
        res.json({
          budget: result
        });
      }
    );
  });



  app.use (function (err, req, res, next) {
    console.log(err.name === 'UnauthorizedError');
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Check username or password'
        });
    } else {
        next(err);
    }
  });


  app.get('/*', function(req, res) {
    console.log("loading....");
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });


  app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});



