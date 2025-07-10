const express = require("express")
const cors = require("cors")
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000
const host = process.env.IP_ADDRESS

app.use(cors());
app.use(express.json())

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    idleTimeoutMillis: 30000,
});

const testConnection = async () => { 
    const res = await pool.query("SELECT * FROM games")
    return res.rows
}

app.get("/", async (req: any, res: any): Promise<void> => {
    res.send(await testConnection())
})

app.post("/insert", async (req: any, res: any): Promise<void> => {
    try {
        const { fullText } = req.body
        console.log(fullText)
        const insertQuery = "INSERT INTO games (ai_content, full_story) VALUES ($1, $2) RETURNING *"
        const result = await pool.query(insertQuery, ["...", fullText])
        console.log("result:", result)
        res.status(201).send({id: result.rows[0].id})
    } catch (error) {
       console.error(error)
       res.status(400)
    }
})

app.put("/update", async (req: any, res: any): Promise<void> => {
    try {
        const { aiContent, fullStory, id } = req.body
        const updateQuery = `
            UPDATE games
            SET ai_content = ai_content || ';$1',
	        full_story = full_story || ';$2'
            WHERE id = $3;
        `
        pool.query(updateQuery, [aiContent, fullStory, id])
        res.status(200)
    } catch (error) {
        console.error(error)
        res.status(400)
    }
})

//app.listen(3000,() => console.log('API listening on port 3000'))
app.listen(port, host, () => console.log('API listening on port 3000'))