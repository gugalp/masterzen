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