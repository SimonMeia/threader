import * as dotenv from 'dotenv'
dotenv.config()
import express, { response } from "express"
import cors from 'cors'
import { Client } from "twitter-api-sdk";
import bodyparser from 'body-parser'


const app = express()
const client = new Client(process.env.BEARER_TOKEN);

app.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CORS_DOMAIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors({
    origin: [process.env.CORS_DOMAIN]
}));
app.use(express.json())

app.get('/thread/:id', async (req, res, next) => {
    try {
        let response = []
        let isAReply = true
        let idToFetch = req.params.id.toString()
        do {
            const tweet = await client.tweets.findTweetById(idToFetch, {
                "tweet.fields": [
                    "author_id",
                    "created_at",
                    "text",
                    'referenced_tweets',
                ],
                "expansions": [
                    "attachments.media_keys"
                ],
                "media.fields": [
                    "type",
                    "url"
                ]
            });

            response.push(tweet)

            if (!tweet.data.referenced_tweets) {
                isAReply = false
            } else {
                idToFetch = tweet.data.referenced_tweets.filter(reference => reference.type == 'replied_to')[0].id
            }
        } while (isAReply);



        res.send(response.reverse())
    } catch (error) {
        next(error)
    }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(`Error : ${err.status} - ${err.message}`);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Send the error status
    res.status(err.status || 500);
    res.send(err.message);
});

export default app;