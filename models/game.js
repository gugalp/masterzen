var Player = require("./player");
var redis = require("redis");
var uuid = require("node-uuid");
var Config = require("./config");
var PlayerNotFoundException = require("../exceptions/playernotfound");
var MaximumAttemptsExceededException = require("../exceptions/maximumattempts");
var PlayerAddException = require("../exceptions/playeradd");

var client;

if (![].contains) {
    Object.defineProperty(Array.prototype, 'contains', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchElement/*, fromIndex*/) {
            if (this === undefined || this === null) {
                throw new TypeError('Cannot convert this value to object');
            }
            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1]) || 0;
            if (n >= len) {
                return false;
            }
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) k = 0;
            }
            while (k < len) {
                var currentElement = O[k];
                if (searchElement === currentElement ||
                    searchElement !== searchElement && currentElement !== currentElement
                ) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}

function initClient() {
    client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });
};

function makeSequence(possible, length) {
    var text = "";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function checkNear(nearIndexes, guessChar, sequence, startPosition) {
    var nearIndex = sequence.indexOf(guessChar, startPosition);

    if (nearIndex > -1) {
        if (!nearIndexes.contains(nearIndex)) {
            nearIndexes.push(nearIndex);
            return true;
        }
        else if (nearIndex >= sequence.length) {
            return false;
        }
        else {
            return checkNear(nearIndexes, guessChar, sequence, ++nearIndex);
        }
    }
    else {
        return false;
    }
};

function Game(config) {
    this.gameId = "";
    this.config = config || new Config(["R", "G", "B", "Y"], 6, 10, false);
    this.players = [];
    this.sequence = "";
    this.timestamp = Date.now();
    this.solved = false;
};

Game.prototype.init = function (playerName) {
    this.players.push(new Player(playerName));

    this.gameId = uuid.v1();
    this.sequence = makeSequence(this.config.colors.join(""), this.config.codeLength);

    if (!this.config.multiplayer) {
        this.startTurn();
    }
};

Game.prototype.startTurn = function () {
    this.players.forEach(
        function (player) {
            player.turn = true;
        }
    );
};

Game.prototype.guessCode = function (sequence, player) {
    if (player.guesses.length < this.config.maxAttempts) {
        var exactCount = 0;
        var nearCount = 0;
        var nearIndexes = [];
        for (var i = 0; i < sequence.length; i++) {
            var guessChar = sequence.charAt(i);

            var sequenceChar = this.sequence.charAt(i);

            if (guessChar == sequenceChar) {
                nearIndexes.push(i);
                exactCount++;
            }
            else {
                if (checkNear(nearIndexes, guessChar, this.sequence, 0)) {
                    nearCount++;
                }
            }
        }

        this.solved = exactCount == this.sequence.length;


        player.addGuess(sequence, exactCount, nearCount);
        player.turn = false;

        if (this.stats()) {
            this.startTurn();
        }
    }
    else {
        throw new MaximumAttemptsExceededException();
    }
};

Game.prototype.stats = function () {
    var ret = true;
    this.players.forEach(function (player) {
        ret = ret && !player.turn;
    });

    return ret;
};

Game.prototype.getPlayer = function (playerName) {
    var ret = null;
    this.players.forEach(function (player) {
        if (player.name == playerName) {
            ret = player;
        }
    });

    return ret;
};

Game.prototype.findPlayer = function (playerName) {
    var ret = this.getPlayer(playerName);

    if (!ret) {
        throw new PlayerNotFoundException();
    }

    return ret;
};

Game.prototype.addPlayer = function (playerName) {
    var player = this.getPlayer(playerName);

    if (player == null) {
        this.players.push(new Player(playerName));

        this.startTurn();

        return true;
    }
    else {
        throw new PlayerAddException();
    }
};

Game.methods = {
    save: function (game) {
        initClient();
        var gameHash = "game:" + game.gameId;
        client.set(gameHash, JSON.stringify(game), redis.print);
        client.quit();

    },

    load: function (gameId, callback) {
        initClient();
        var gameHash = "game:" + gameId;

        client.get(gameHash, function (err, reply) {
                var game;

                if (reply) {
                    game = JSON.parse(reply);
                    game.__proto__ = Game.prototype;

                    game.players.forEach(function (player) {
                        player.__proto__ = Player.prototype;
                    });
                }
                else {
                    err = "Game not found!";
                }

                callback(err, game);
                client.quit();
            }
        )
    }
};

module.exports = Game;