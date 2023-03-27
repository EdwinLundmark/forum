const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const ip = '10.0.1.77';
const port = 80;

app.set('view engine', 'ejs');


app.use(express.json({ limit: '50mb' }));


app.use(express.static('public/'));

app.get('/', (req, res) => {
    let json = fs.readFileSync('./posts.json', 'utf-8', (err, data) => {
    });

    json = JSON.parse(json);

    res.render('index', { posts: json.posts, comment: false });
})

app.post('/images/:image', (req, res) => {
    res.sendFile(path.join(__dirname, `images/${req.params.image}`));
})

app.post('/submit-post', (req, res) => {
    let json = fs.readFileSync('./posts.json', 'utf-8', (err, data) => {
    });

    json = JSON.parse(json);


    const author = req.body.author;
    const content = req.body.content;
    const imageName = req.body.imageName;
    const id = Date.now();

    const base64Data = req.body.image;
    let binaryData
    if (base64Data) binaryData = Buffer.from(base64Data, "base64");

    const date = new Date();

    let formattedDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);


    if (req.body.postIndex != undefined) {
        json.posts[req.body.postIndex].comments.unshift({
            "author": author,
            "timestamp": formattedDate,
            "image": imageName,
            "content": content,
        });
    }
    else {
        json.posts.unshift({
            "id": id,
            "author": author,
            "timestamp": formattedDate,
            "image": imageName,
            "content": content,
            "comments": [],
        });
    }

    json = JSON.stringify(json);

    fs.writeFileSync('./posts.json', json);
    if (binaryData) fs.writeFileSync(`./images/${imageName}`, binaryData);

    res.send('Posted');
})


app.get('/post/:id', (req, res) => {
    let json = fs.readFileSync('./posts.json', 'utf-8');

    json = JSON.parse(json);

    let post = new Array(1);

    for (let i = 0; i < json.posts.length; i++) {
        if (json.posts[i].id === parseInt(req.params.id)) {
            post[0] = json.posts[i]

        }
    }

    console.log(post[0])

    res.render('index', { posts: post, comment: true });
})


app.all('*', (req, res) => {
    res.status(404).render('404');
});




app.listen(port, ip, () => { console.log(`serving on: ${ip}:${port}`) });
