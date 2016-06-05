var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var GameController = require("../src/controllers/gamecontroller");

describe('GameController', function() {
    describe('#newGame(request, response)', function () {
        it('should respond', function () {
            var request = {};
            request.body = {"playerName":"Guga", "config":{"numberOfPlayers":1, "colors":["R", "G", "B", "Y"], "codeLength": 4, "maxAttempts": 3}};
            var response = {};
            var spy = response.send = sinon.spy();

            GameController.methods.newGame(request, response);

            expect(spy.calledOnce).to.equal(true);
            //assert.equal({"gameId":"caf7f6f0-2b38-11e6-b8e3-9fc14401403f","config":{"colors":["R", "G", "B", "Y"],"codeLength":4,"maxAttempts":3,"numberOfPlayers":1}}, response);
        });
    });
});