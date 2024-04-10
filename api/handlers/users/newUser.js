const { setCorsHeaders } = require("../../lib/cors");
const { getRequestBody } = require("../../lib/parseBody")
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');

// const db = mysql.createConnection({
//     host: "cosc3380.c5iqeciq8qjg.us-east-2.rds.amazonaws.com",
//     user: "admin",
//     password: "TtZDqS57PM8KxHaOLRcs",
//     database: "cosc3380"
// })
// db.connect(err => {
//     if (err) {
//       console.error('Error connecting to database:', err);
//       return;
//     }
//     console.log('Connected to database');
//   });

module.exports = async (req, res) => {
    setCorsHeaders(req, res);
    const db = mysql.createConnection({
        host: "cosc3380.c5iqeciq8qjg.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "TtZDqS57PM8KxHaOLRcs",
        database: "cosc3380"
    })
    db.connect(err => {
        if (err) {
          console.error('Error connecting to database:', err);
          return;
        }
        console.log('Connected to database');
      });
    
    // const newbody = new Promise((resolve, reject) => {
    //     let body = '';
    //     req.on('data', chunk => {
    //         console.log(chunk)
    //       body += chunk.toString();
    //     });
    //     req.on('end', () => {
    //         try {
    //           // Parse the body string as JSON
    //           //console.log('user data:', body);
    //           let parsedBody = JSON.parse(body);
    //           resolve(parsedBody);
    //         } catch (error) {
    //           reject(error);
    //         }
    //       });
    //       req.on('error', (err) => {
    //         reject(err);
    //       });
    //     });

    // //console.log('Received data:', body);
    // const userData = await newbody;
    // console.log('Parsed user data:', userData);
    const userData = getRequestBody(req)
    const { email, password, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code } = userData;
    const type = 'Customer'

    const insertCredentialsSql = `INSERT INTO LOGIN (email, password) VALUES (?, ?)`;
    db.query(insertCredentialsSql, [email, password], (err, loginResult) => {
        if (err) {
            console.error(err);
            res.writeHead(404, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Login Internal Server Error' }));
            return;
        }

        const insertUserSql = `INSERT INTO USER (email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertUserSql, [email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, type], (err, userResult) => {
            if (err) {
                    console.error(err);
                    res.writeHead(404, { 'Content-Type' : 'application/json' });
                    res.end(JSON.stringify({ error: 'User Internal Server Error' }));
                    return;
                }
                console.log("inserted yippee")
                res.writeHead(200, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ message: 'User added successfully', redirectUrl: '/Login' }));
                // res.status(200).json({
                //     message: 'User added successfully', redirectUrl: '/Login'
                // })
            });
        });
}