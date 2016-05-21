var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Game = require("./models/game");

var router = express.Router();

app.use(bodyParser.json());

router.post('/NewGame', function(request, response) {

    if(request.body.name == undefined) {
        console.log('bad request');
        response.send(400);
        return;
    } else {
        console.log(request.body);

        var config;
        if (request.body.config == undefined) {

        }

        var game = new Game(config);
        game.init(request.body.name);

        Game.methods.save(game);

        console.log(game);

        response.json({
            'gameId': game.gameId,
            'config': game.config
        });
    }
});


router.post('/Guess', function(request, response) {
    if (request.body.gameId == undefined || request.body.guess == undefined) {
        response.send(400);
    } else {
        Game.methods.load(request.gameId, function(game) {
            try
            {
                if (game.config.multiplayer === true) {
                    if (request.body.playerName == undefined)
                    {
                        response.send(400);
                    } else
                    {
                        game.guessCode(request.body.guess, request.body.playerName);
                    }
                } else {
                    game.guessCode(request.body.guess);
                }
            }
            catch(e)
            {
                response.json(
                    {
                        "status": false,
                        "msg": e.message
                    }
                );
            }
        });
    }
});


app.use('/API', router);

app.listen(8080);
/*


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
*/