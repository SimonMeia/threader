import * as dotenv from 'dotenv'
dotenv.config()
import express, { response } from "express"
import cors from 'cors'
import { Client } from "twitter-api-sdk";
import bodyparser from 'body-parser'


const app = express()


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

    const client = new Client(process.env.BEARER_TOKEN);

    let response = []

    try {
        const firstTweet = await client.tweets.findTweetById(req.params.id, {
            "tweet.fields": [
                "author_id",
                "conversation_id",
                "created_at",
                "text"
            ]
        });

        if (firstTweet != undefined) {
            let today = new Date()
            let tweetDate = new Date(firstTweet.data.created_at)
            let diff = today.getTime() - tweetDate.getTime();
            let daydiff = diff / (1000 * 60 * 60 * 24);

            if (daydiff > 7) {
                res.send({
                    type: 'error',
                    message : 'too_old'
                })
            } else {
                response.push({
                    text: firstTweet.data.text,
                    id: firstTweet.data.id
                })

                const thread = await client.tweets.tweetsRecentSearch({
                    "query": `to:${firstTweet.data.author_id} from:${firstTweet.data.author_id} conversation_id:${firstTweet.data.conversation_id}`,
                });
                for (let i = thread.data.length - 1; i >= 0; i--) {
                    response.push({
                        text: thread.data[i].text,
                        id: thread.data[i].id
                    })
                }
                res.send({
                    type: 'success',
                    data: response
                })
            }
        }
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
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Send the error status
    res.status(err.status || 500);
    res.send(err.message);
});

export default app;