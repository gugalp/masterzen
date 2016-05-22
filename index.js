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
                config = new Config(config.colors, config.codeLength, config.maxAttempts, config.multiplayer);
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
                    if (game.solved) {
                        response.json(
                            {
                                "status": true,
                                "msg": "Game already solved. Check stats!"
                            }
                        );
                    }
                    else {
                        var playerName = request.body.playerName;
                        if (game.config.multiplayer === true && playerName == undefined) {
                            response.send(400);
                            return;
                        }

                        var player = ((playerName && game.findPlayer(playerName)) || game.players[0]);

                        if (player.turn) {
                            game.guessCode(request.body.guess, player);

                            Game.methods.save(game);
                        }
                        else if (game.config.multiplayer === true) {
                            response.json(
                                {
                                    "status": true,
                                    "msg": "Guessing not allowed until all players send their guesses!"
                                }
                            );
                        }

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
                    var player = game.findPlayer(request.body.playerName);

                    var out = JSON.parse(JSON.stringify(game));
                    delete out.players;
                    delete out.sequence;

                    out.pastGuesses = player.guesses;
                    out.numGuesses = player.guesses.length;
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
                if (game.config.multiplayer) {
                    if (game.addPlayer(request.body.playerName)) {
                        Game.methods.save(game);
                    }

                    var out = JSON.parse(JSON.stringify(game));
                    delete out.players;
                    delete out.sequence;

                    response.send(out);
                }
                else {
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