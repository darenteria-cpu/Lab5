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

//retrieve quotes and author first/last when user inputs "keyword"
app.get("/searchByKeyword", async (req, res) => {
    let keyword = req.query.keyword; //req = request
    let sql = `SELECT quote, authorId, firstName, lastName
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`]; //avoid SQL injection by user. replaces the ?
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

//finds quotes within a range of likes
app.get("/searchByLikes", async (req, res) => {
    let minLikes = Number(req.query.minLikes); //convert to "Number" so alert message pops up
    let maxLikes = Number(req.query.maxLikes);
    //ensures min is less than max
    if (minLikes > maxLikes) {
      return res.render("results",{"quotes": [],
                "message": "Minimum likes can't be more than maximum likes."});
    }
    let sql = `SELECT quote, authorId, firstName, lastName
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE likes >= ? AND likes <= ?`;
    let sqlParams = [minLikes, maxLikes];
    const [rows] = await conn.query(sql,sqlParams);
    res.render("results",{"quotes":rows});
});

//finds all quotes by author chosen in dropdown
app.get("/searchByAuthor", async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `SELECT quote, authorId, firstName, lastName
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE authorId = ?`; // LIKE needs injection protection not exact match (=)
    let sqlParams = [authorId]; //does not need injection protection cause of previous line
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

//finds all quotes by category chosen in dropdown
app.get("/searchByCategory", async (req, res) => {
    let category = req.query.category;
    let sql = `SELECT quote, authorId, firstName, lastName
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE category = ?`;
    let sqlParams = [category];
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
})

//sql - finds all authors, routed to dropdown menu.  
//sql1 - finds all categories in alphabetical order (ASC) and routes to another dropdown
app.get("/", async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
            FROM q_authors
            ORDER by lastName`;
    const [rows] = await conn.query(sql);
    let sql1 = `SELECT DISTINCT category
                FROM q_quotes
                ORDER BY category ASC`;
    const [rows1] = await conn.query(sql1);
    res.render("index",{"authors":rows, "quoteCats":rows1}); //only one res.render for two dropdowns
});

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
               from q_authors
               WHERE authorId = ?`;
    const [rows] = await conn.query(sql, [authorId]);
    res.send(rows);
});



app.listen(3000, ()=>{
    console.log("Express server running")
})