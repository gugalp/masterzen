var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Game = require("./models/game");
var Config = require("./models/config");

var router = express.Router();

app.use(bodyParser.json());

router.post('/NewGame', function (request, response) {

    if (request.body.name == undefined) {
        console.log('bad request');
        response.send(400);
    } else {
        try {
            var config = request.body.config;
            if (config != undefined) {
                config = new Config(config.colors, config.codeLength, config.maxAttempts, config.numberOfPlayers);
            }

            var game = new Game(config);
            game.init(request.body.name);

            Game.methods.save(game);

            response.json({
                'gameId': game.gameId,
                'config': game.config,
                'status': true
            });
        }
        catch (e) {
            console.log(e);
            response.json(
                {
                    "status": false,
                    "msg": e.message
                }
            );
        }
    }
});


router.post('/Guess', function (request, response) {
    if (request.body.gameId == undefined || request.body.guess == undefined) {
        console.log('bad request');
        response.send(400);
    } else {
        Game.methods.load(request.body.gameId, function (err, game) {
            if (err) {
                response.json(
                    {
                        "status": false,
                        "msg": err
                    }
                );
            }
            else {
                try {
                    if (game.stats() && this.solved) {
                        response.json(
                            {
                                "status": true,
                                "msg": "Game already solved. Check stats!"
                            }
                        );
                    }
                    else {
                        var playerName = request.body.playerName;
                        if (game.isMultiplayer() && playerName == undefined) {
                            response.send(400);
                            return;
                        }

                        var player = ((playerName && game.findPlayer(playerName)) || game.players[0]);

                        game.guessCode(request.body.guess, player);

                        Game.methods.save(game);

                        response.json(
                            {
                                "status": true,
                                "msg": "Check stats for playing again!"
                            }
                        );
                    }
                }
                catch (e) {
                    console.log(e);
                    response.json(
                        {
                            "status": false,
                            "msg": e.message
                        }
                    );
                }
            }
        });
    }
});

router.post('/Stats', function (request, response) {
    if (request.body.gameId == undefined || request.body.playerName == undefined) {
        console.log('bad request');
        response.send(400);
    } else {
        Game.methods.load(request.body.gameId, function (err, game) {
            if (err) {
                response.json(
                    {
                        "status": false,
                        "msg": err
                    }
                );
            }
            else {
                try {
                    var out = JSON.parse(JSON.stringify(game));
                    var player = game.findPlayer(request.body.playerName);

                    if (!game.ended()) {
                        delete out.players;
                        delete out.sequence;
                        delete out.playedTurns;

                        out.pastGuesses = player.guesses.slice(0, game.playedTurns);
                        out.numGuesses = game.playedTurns;
                        out.canGuess = player.turn;
                        out.solved = false;
                    }
                    else {
                        out.canGuess = false;
                    }
                    out.status = true;

                    response.send(out);
                }
                catch (e) {
                    console.log(e);
                    response.json(
                        {
                            "status": false,
                            "msg": e.message
                        }
                    );
                }
            }
        });
    }
});

router.post('/JoinGame', function (request, response) {
    if (request.body.gameId == undefined || request.body.playerName == undefined || request.body.gameId == undefined) {
        console.log('bad request');
        response.send(400);
    } else {
        Game.methods.load(request.body.gameId, function (err, game) {
            if (err) {
                response.json(
                    {
                        "status": false,
                        "msg": err
                    }
                );
            }
            else {
                try {
                    if (game.addPlayer(request.body.playerName)) {
                        Game.methods.save(game);
                    }

                    var out = JSON.parse(JSON.stringify(game));
                    delete out.players;
                    delete out.sequence;

                    response.send(out);
                }
                catch (e) {
                    response.json(
                        {
                            "status": false,
                            "msg": e.message
                        }
                    );
                }
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