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
        Game.methods.load(request.body.gameId, function(err, game) {
            try
            {
                if (game.config.multiplayer === true && request.body.playerName == undefined)
                {
                    response.send(400);
                    return;
                }
                
                var player = ((playerName && this.getPlayer(playerName)) || this.players[0]);

                if (player.turn) {
                    game.guessCode(request.body.guess, player);

                    Game.methods.save(game);
                }
                console.log(JSON.stringify(game));

                response.json(
                    {
                        "status": true,
                        "msg": "Check stats for playing again!"
                    }
                );
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