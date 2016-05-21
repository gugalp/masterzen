var Game = require("./models/game");

var game = new Game();

game.gameId = "testeGame";
game.sequence = "ABCD";
Game.methods.save(game);

Game.methods.load(
    "testeGame",
    function(err, ret)
    {
        console.log(err);
        console.log(JSON.stringify(ret));
    }
);