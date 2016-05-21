var Player = require("./player");
var redis = require("redis");
var uuid = require('node-uuid');

var client;

function initClient()
{
    client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });
}

function makeSequence(possible, length)
{
    var text = "";

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function Game(config) {
    this.gameId = "";
    this.config = config || {

        };
    this.players = [];
    this.sequence = "";
};

Game.prototype.init = function(playerName)
{
    this.players.push(new Player(playerName));

    this.gameId = uuid.v1();
    this.sequence = makeSequence(this.config.colors.join(""), this.config.codeLength);
};

Game.methods = {
    save: function(game)
    {
        initClient();
        var gameHash = "game:" + game.gameId;
        client.set(gameHash, JSON.stringify(game), redis.print);
        client.quit();

    },

    load: function(gameId, callback)
    {
        initClient();
        var gameHash = "game:" + gameId;

        client.get(gameHash, function(err, reply)
            {
                var game;

                if (reply)
                {
                    game = JSON.parse(reply);
                }
                else
                {
                    err = "Not found!";
                }

                callback(err, game);
                client.quit();
            }
        )
    }
};


module.exports = Game;