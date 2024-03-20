const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');

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

const corsMiddleware = cors();

// Create an HTTP server
const server = http.createServer((req, res) => {
  corsMiddleware(req, res, () => {});

  res.writeHead(200, { 'Content-Type': 'text/html' });

  // Write the response content
  res.write('<h1>Hello, Node.js HTTP Server!</h1>');
  
  // Handle /users endpoint
  if (req.url === '/users' && req.method === 'GET') {
    const sql = "SELECT * FROM USER";
    db.query(sql, (err, data) => {
      if (err) {
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
      res.end(JSON.stringify(data));
    });
  }

  // Handle /inventory endpoint
  else if (req.url === '/inventory' && req.method === 'GET') {
      // Example: Fetch products from the database
      const sql = "SELECT * FROM INVENTORY";
      db.query(sql, (err, data) => {
          if (err) {
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
              return;
          }
          res.end(JSON.stringify(data));
      });
  }

  // Handle PUT /updateUser endpoint
  else if (req.url.startsWith('/updateUser') && req.method === 'PUT') {
    // Extract user ID from URL query parameters
    const parsedUrl = url.parse(req.url, true);
    const userId = parsedUrl.query.id;

    // Example: Update user in the database
    const updateSql = `UPDATE USER SET name = 'Updated Name' WHERE id = ${userId}`;
    db.query(updateSql, (err, result) => {
        if (err) {
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        res.end(JSON.stringify({ message: 'User updated successfully' }));
    });
  }

  // Handle POST /addUser endpoint
  else if (req.url === '/newUser' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', () => {
        const userData = querystring.parse(body);
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = userData;

        // Insert email and password into the 'credentials' table
        const insertCredentialsSql = `INSERT INTO credentials (email, password) VALUES ('${email}', '${password}')`;
        db.query(insertCredentialsSql, (err, credentialsResult) => {
            if (err) {
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            // Extract the inserted credentials ID

            // Insert the rest of the user details into the 'users' table
            const insertUserSql = `INSERT INTO users (email, first_name, last_name, phone_number, date_of_birth, address) VALUES (${email}, '${firstName}', '${lastName}', '${phoneNumber}', '${dateOfBirth}', '${address}')`;
            db.query(insertUserSql, (err, userResult) => {
                if (err) {
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }
                res.end(JSON.stringify({ message: 'User added successfully' }));
            });
        });
    });
  }

  // Handle other endpoints
  else {
      res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Specify the port to listen on
const port = 12358;

// Start the server
server.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});