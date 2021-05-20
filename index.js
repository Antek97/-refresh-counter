const { Console } = require('console');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

let counter = 0;

const server = http.createServer(generatingResponses);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://user:uGGEoOqEn7eOnzSe@cluster0.y6nro.mongodb.net/couterdb?retryWrites=true&w=majority";

{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
    const collection = client.db("couterdb").collection("single_counter");
    // perform actions on the collection object
    //  let firstOfCollection = await collection.findOne({ _id: new ObjectId.createFromHexString("5f63afe608ad31275c661499") });
    let firstOfCollection = await collection.findOne({});
    counter += firstOfCollection.counter;
    
    client.close();
    });
}

function updateDBCounter() {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
        const collection = client.db("couterdb").collection("single_counter");
        await collection.updateOne({}, { $set: {counter: counter} });
        
        client.close();
      });
}

function generatingResponses(req, res) {        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        
        const cookieString = (req.headers.cookie);
        if (!cookieString) {
            res.setHeader('Set-Cookie', 'cookie=1; Max-Age=5');
            ++counter;
            updateDBCounter();
        }

        const response = counter;
        const html= `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet">
        
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Open Sans',sans-serif;
        
            }
        
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #060a1f;
            }
        
            h2 {
                position: relative;
                display: block;
                color: #fff;
                text-align: center;
                margin: 10px 0 40px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.4em;
                font-size: 2em;
            }
        
           .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        
            div {
                position: relative;
                margin: 0 5px;
                -webkit-box-reflect: below 2px linear-gradient(transparent,#0004);
            }
        
            span {
                position: relative ;
                display: block;
                width: 300px;
                height: 80px;
                background: #2196f3;
                color: #fff;
                font-weight: 300;
                display: flex;
                justify-content: center ;
                align-items: center ;
                font-size: 3em;
                z-index: 9;
                box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
            }
        
            </style>
        
        </head>
        <body>
            <div class='counter'>
                <!-- /* ilość typa */ -->
            <h2>Liczba wejść</h2>
            <div class="container">
                <div class="box"><span class="amount">${response}</span></div>
            </div></div>
        
        </body>
        </html>`;        
        res.end(html);
}