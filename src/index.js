var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var GameController = require ("./controllers/gamecontroller");

var router = express.Router();

app.use(bodyParser.json());

router.post('/NewGame', GameController.methods.newGame);


router.post('/Guess', GameController.methods.guess);

router.post('/Stats', GameController.methods.stats);

router.post('/JoinGame', GameController.methods.joinGame);


app.use('/API', router);

app.listen(8080);