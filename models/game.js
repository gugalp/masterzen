function Game(config) {
    this.gameId = "";
    this.config = config || {

        };
    this.players = [];
    this.sequence = "";
};

var redis = require("redis");
var client;

function initClient()
{
    client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });
}

Game.methods = {
    save: function(game)
    {
        initClient();
        var gameHash = "game:" + game.gameId;
        client.set(gameHash, game, redis.print);
        client.quit();

    },

    load: function(gameId, callback)
    {
        initClient();
        var gameHash = "game:" + game.gameId;
        client.keys(gameHash, function(err, replies)
            {
                var game;

                if (replies.length == 1)
                {
                    game = replies[0];
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