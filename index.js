var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Game = require("./models/game");
var Config = require("./models/config");

var router = express.Router();

app.use(bodyParser.json());

router.post('/NewGame', function (request, response) {
    if (request.body.playerName == undefined) {
        console.log('bad request');
        response.sendStatus(400);
        return;
    }

    try {
        var config = request.body.config;
        if (config != undefined) {
            config = new Config(config.colors, config.codeLength, config.maxAttempts, config.numberOfPlayers);
        }

        var game = new Game(config);
        game.init(request.body.playerName);

        Game.methods.initClient();
        Game.methods.save(game);
        Game.methods.quitClient();

        response.status(201).json({
            'gameId': game.gameId,
            'config': game.config
        });
        return;
    }
    catch (e) {
        console.log(e);
        response.status(e.errorCode || 500).json(
            {
                "msg": e.message
            }
        );
        Game.methods.quitClient();
        return;
    }
});


router.post('/Guess', function (request, response) {
    if (request.body.gameId == undefined || request.body.guess == undefined) {
        console.log('bad request');
        response.sendStatus(400);
        return;
    }

    Game.methods.initClient();
    Game.methods.load(request.body.gameId, function (err, game) {
        if (err) {
            response.status(err.code || 500).json(
                {
                    "msg": err.message || err
                }
            );
            Game.methods.quitClient();
            return;
        }

        try {
            if (game.stats() && this.solved) {
                response.json(
                    {
                        "msg": "Game already solved. Check stats!"
                    }
                );
                Game.methods.quitClient();
                return;
            }

            var playerName = request.body.playerName;
            if (game.isMultiplayer() && playerName == undefined) {
                response.sendStatus(400);
                return;
            }

            var player = ((playerName && game.findPlayer(playerName)) || game.players[0]);

            game.guessCode(request.body.guess, player);

            Game.methods.save(game);
            Game.methods.quitClient();

            response.json(
                {
                    "msg": "Check stats for playing again!"
                }
            );

            return;
        }
        catch (e) {
            console.log(e);
            response.status(e.errorCode || 500).json(
                {
                    "msg": e.message
                }
            );
            Game.methods.quitClient();
            return;
        }
    });
});

router.post('/Stats', function (request, response) {
    if (request.body.gameId == undefined || request.body.playerName == undefined) {
        console.log('bad request');
        response.sendStatus(400);
        return;
    }

    Game.methods.initClient();
    Game.methods.load(request.body.gameId, function (err, game) {
        Game.methods.quitClient();
        if (err) {
            response.status(err.code || 500).json(
                {
                    "msg": err.message || err
                }
            );
            return;
        }

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

            response.send(out);
            return;
        }
        catch (e) {
            console.log(e);
            response.status(e.errorCode || 500).json(
                {
                    "msg": e.message
                }
            );
            return;
        }
    });
});

router.post('/JoinGame', function (request, response) {
    if (request.body.gameId == undefined || request.body.playerName == undefined || request.body.gameId == undefined) {
        console.log('bad request');
        response.sendStatus(400);
        return;
    }

    Game.methods.initClient();
    Game.methods.load(request.body.gameId, function (err, game) {
        if (err) {
            response.status(err.code || 500).json(
                {
                    "msg": err.message || err
                }
            );
            Game.methods.quitClient();
            return;
        }

        try {
            game.addPlayer(request.body.playerName);
            Game.methods.save(game);
            Game.methods.quitClient();

            var out = JSON.parse(JSON.stringify(game));
            delete out.players;
            delete out.sequence;

            response.send(out);
            return;
        }
        catch (e) {
            response.status(e.errorCode || 500).json(
                {
                    "msg": e.message
                }
            );
            Game.methods.quitClient();
            return;
        }
    });
});


app.use('/API', router);

app.listen(8080);