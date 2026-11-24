import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection
const conn = mysql.createPool({
    host: "d6q8diwwdmy5c9k9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "iuhr83if1xo27cjc",
    password: "ev74qgtok1ap7v8v",
    database: "is4ynyg0rdoieo1v",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', (req, res) => {
   res.render('index')
});

//dbTest
app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await conn.query("SELECT * FROM q_authors");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get("/searchByKeyword", async(req, res) => {
    let userKeyword = req.query.keyword;
    console.log(userKeyword);
    res.send('results coming soon...');
});

app.listen(3000, ()=>{
    console.log("Express server running")
})