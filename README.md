masterzen - A Mastermind API for Axiom Zen's VanHackathon Challenge
===================================================================
This is a Node.js implementation for [the backend challenge of Axiom Zen on the VanHackaton](https://docs.google.com/document/d/1H9n_nWF7u7gq4oPs6AabhKPCZJMP2sbHqqkmD4yM6Y0).

## Requirements

Node 4.4.4+
Redis 3.2.0

## Usage

`npm start`

The default location for connecting redis is local. For changing it, you must edit the ./models/game.js file, and look for the line
```
client = redis.createClient('//user:pw@host:port');
```
## API Definition
### API/NewGame

Game configurations available:

|Configuration Name|Default Value|Description|
|---|---|---|
|colors|["R", "G", "B", "Y"]|Array of colors represented by single characters or numbers|
|codeLength|6|Length of the master code to be generated and guessed by the players|
|maxAttempts|10|Maximum number of attemps to guess the master code|
|numberOfPlayers|1|Number of players trying to guess the master code|

#### Request:
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|playerName| Name of the player creating the game|Yes|
|config| Game configurarions|No|

##### Example:
```json
{
    "playerName": "PlayerOne",
    "config": {
        "colors": ["R", "G", "B", "Y"],
        "codeLength": 6,
        "maxAttempts": 10,
        "numberOfPlayers": 1
    }
}

```

#### Response
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|gameId|Id of the newly created game|No|
|config|Game configurations|No|
|msg|Error message field|No|

Available Status:

| Status Code | Description|
|---|---|
|201|Successfully created the game|
|500|Unknown error |

##### Example:
```json
{
    "gameId": "e273b2f0-204e-11e6-a687-c78d2f877fe1",
    "config": {
        "colors": ["R", "G", "B", "Y"],
        "codeLength": 6,
        "maxAttempts": 10,
        "numberOfPlayers": 1
    }
}
```

### API/JoinGame

#### Request:
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|playerName| Name of the player joinning the game|Yes|
|gameId| Id of the game that the player wants to join|Yes|

##### Example:
```json
{
    "playerName": "PlayerTwo",
    "gameId": "e273b2f0-204e-11e6-a687-c78d2f877fe1"
}

```

#### Response
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|gameId|Id of the joinned game|No|
|config|Game configurations|No|
|solved|Flag to show if the game has been solved|No|
|playedTurns|Number of turns already played in this game (-1 if the game isn't started yet)|No|
|timestamp|Game start timestamp, generated only after all players have joined|No|
|msg|Error message field|No|

Available Status:

| Status Code | Description|
|---|---|
|200|Successfully joinned the game|
|403|Joinning forbidden: <br>- Exceeded number of players; <br/>- Player name already in use;|
|404|Game not found|
|500|Unknown error |

##### Example:
```json
{
    "gameId": "e273b2f0-204e-11e6-a687-c78d2f877fe1",
    "config": {
        "colors": ["R", "G", "B", "Y"],
        "codeLength": 6,
        "maxAttempts": 10,
        "numberOfPlayers": 1
    },
    "solved": false,
    "playedTurns": 0,
    "timestamp": 1463951658842
}
```

### API/Guess

#### Request:
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|playerName| Name of the player that wants to try guessing|Multiplayer: Yes<br/>Single Player: No|
|gameId| Id of the game that the player wants to try guessing|Yes|
|guess|Guess sequence to be compared to the master code|Yes|

##### Example:
```json
{
    "playerName": "PlayerTwo",
    "gameId": "e273b2f0-204e-11e6-a687-c78d2f877fe1",
    "guess": "RGBYRB"
}

```

#### Response
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|msg|Return message|Yes|

Available Status:

| Status Code | Description|
|---|---|
|200|Successfully sent the guess|
|403|Guessing forbidden: <br>- Wait for other players to play; <br/>- Wait for other players to join;<br/>- Game ended;<br/>- Wrong guess sequence length;|
|404|Game not found<br>Player not found|
|500|Unknown error |

##### Example:
```json
{
    "msg": "Check stats for playing again!"
}
```

### API/Stats

#### Request:
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|playerName| Name of the player that wants to try guessing|Multiplayer: Yes<br/>Single Player: No|
|gameId| Id of the game that the player wants to try guessing|Yes|

##### Example:
```json
{
    "playerName": "PlayerOne",
    "gameId": "e273b2f0-204e-11e6-a687-c78d2f877fe1"
}

```

#### Response
Available Fields:

| Field Name | Description| Required|
|---|---|---|
|gameId|Id of the joinned game|No|
|config|Game configurations|No|
|solved|Flag to show if the game has been solved|No|
|canGuess|Flag to show if the player is allowed to make another guess|No|
|pastGuesses|Array of guesses data made by the player on past turns<br/>Shown only before the game ends|No|
|numGuesses|Number of guesses done by the player<br/>Shown only before the game ends|No|
|playedTurns|Number of turns already played in this game (-1 if the game isn't started yet)<br/>Shown only after the game ends|No|
|players|Array of players data shown after the game ends|No|
|sequence|Master code shown after the game ends|No|
|timestamp|Game start timestamp, generated only after all players have joined|No|
|msg|Error message|No|

Guesses data:

| Field Name | Description|
|---|---|
|sequence|Guessing sequence sent by the player|
|exact|Number of exact hits|
|near|Number of near hits|
|timestamp|Timestamp of the guess|

Player data:

| Field Name | Description|
|---|---|
|name|Name of the player|
|turn|Flag showing whether the player can make a guess|
|guesses|Array containing the player's guesses data|

Available Status:

| Status Code | Description|
|---|---|
|200|Successfully retrieved game status|
|404|Game not found<br>Player not found|
|500|Unknown error |

##### Example:
```json

{
    "gameId": "c98dc700-2060-11e6-a3d5-8ff0647ea4ba",
    "config": {
        "colors": ["R", "G", "B", "Y"],
        "codeLength": 6,
        "maxAttempts": 10,
        "numberOfPlayers": 2
    },
    "solved": false,
    "pastGuesses": [{"sequence": "RGBYRG",
                     "exact": 1,
                     "near": 2,
                     "timestamp": 1463952485712}],
    "numGuesses": 1,
    "canGuess": false
}
```