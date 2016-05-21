/*var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var router = express.Router();

app.use(bodyParser.json());

router.post('/NewGame', function(request, response) {

    if(request.body.name == undefined) {
        console.log('bad request');
        response.send(400);
        return;
    } else {
        console.log(request.body);

        response.json({
            'teste': 123
        });
    }
});


router.post('/Guess', function(request, response) {
    
});


app.use('/API', router);

app.listen(8080);*/


var Game = require("./models/game");

var game = new Game();
game.init("TestPlayer")
game.addPlayer("TestPlayer2");
game.startTurn();
game.guessCode("TestPlayer", "RRGYYG");

Game.methods.save(game);
Game.methods.load(
    game.gameId,
    function(err, ret)
    {
        console.log(err);
        console.log(JSON.stringify(ret));
    }
);