const express = require("express")
const cors = require("cors")
const fs = require("fs")
const { Pool } = require('pg');
const { textToSpeech } = require("../utils/lmnt") 
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

app.get("/", async (req: any, res: any): Promise<void> => {
    try {
        const gameId = req.query.gameId
        const getGameByIDQuery = `
            SELECT *
            FROM games
            WHERE id = $1
        `
        const result = await pool.query(getGameByIDQuery, [gameId])
        res.status(200).send(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(400)
    }
})

app.get("/someGames", async (req: any, res: any): Promise<void> => {
    try {
        const getSomeGames = `
            SELECT id
            FROM games
            LIMIT $1
        `
        const getGamesAmount = `
            SELECT COUNT(*)
            FROM games
        `

        const result = await pool.query(getSomeGames, [req.query.amount])
        const gamesAmount = await pool.query(getGamesAmount)

        res.status(200).send({
            games: result.rows,
            allGamesAmount: gamesAmount.rows[0].count
        })
    } catch (error) {
        console.error(error)
        res.status(404)
    }
})

app.post("/insert", async (req: any, res: any): Promise<void> => {
    try {
        const { fullText } = req.body
        const insertQuery = "INSERT INTO games (full_story) VALUES ($1) RETURNING *"
        const result = await pool.query(insertQuery, [fullText])
        res.status(201).send({id: result.rows[0].id})
    } catch (error) {
       console.error(error)
       res.status(400)
    }
})

app.put("/update", async (req: any, res: any): Promise<void> => {
    try {
        const { fullStory, id } = req.body
        const updateQuery = `
            UPDATE games
            SET full_story = full_story || '; ' || $1
            WHERE id = $2;
        `
        pool.query(updateQuery, [fullStory, id])
        res.status(200)
    } catch (error) {
        console.error(error)
        res.status(400)
    }
})

app.post("/textToSpeech", async (req: any, res: any) => {
    try {
        const speech = await textToSpeech(req.body.text)

        const buffer = Buffer.from(speech.audio, "base64");
        await fs.writeFile("./assets/audios/lastSpeech.mp3", buffer);

        res.status(204).end();
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error");
    }
})

app.listen(port, host, () => console.log('API listening on port 3000'))