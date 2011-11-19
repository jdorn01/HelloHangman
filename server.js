
var app = require('express').createServer(),

    eventTemplate = {
        id: 12345,
        type: 'game',
        action: 'guessLetter',
        data: {},
        user: 654377
    },

    eventStack = [],

    eventPointer = 0,

    Guid = (function(){
        var S4 = function(){
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            },
            generated = [],
            init = function(){
                var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                if (generated.indexOf(guid) == -1){
                    generated.push(guid);
                    return guid;
                } else {
                    return init();
                }
            };

        return init;
    })(),

    emitEvent = function(type, action, data, userId){
        eventStack.push({
            id: eventPointer++,
            type: type,
            action: action,
            data: data,
            userId: userId
        });
    };

    hangman = (function(){
        var settings = {
                maxPlayers: 4
            },
            currentWord ='',
            obj = {
                players: [],
                usrConnect: function(id, name){
                    var i = 0, e = this.players.length;
                    for (; i < e; i++){
                        if (this.players[i].id == id){
                            return this.players[i];
                        }
                    }
                    if (e < settings.maxPlayers){
                        name = name || 'player' + (this.players.length + 1);
                        var player = {
                            id: Guid(),
                            name: name,
                            isTurn: false,
                            isMaster: false
                        }
                        //TODO: if player disconnects, assign new player to that location first
                        this.players.push(player);

                        emitEvent('player', 'connected', {name: player.name, id: player.id}, player.id);
                        console.log('Player has connected: ' + player.id);

                        return player;
                    } else {
                        return {error: 'Too many players!'};
                    }
                },
                usrDisconnect: function(){

                },

                newWord: function(word, player){
                    currentWord = word;
                    emitEvent('game', 'newWord', {word: word, player: player}, player.id);
                    return true;
                },
                guessLetter: function(letter, player){
                    var response;
                    if (currentWord.match(letter)){
                        response = {correct: true, letter: letter, player: player};
                    } else {
                        response = {correct: false, letter: letter, player: player};
                    }
                    emitEvent('game', 'guessLetter', response, player.id);
                },
                guessWord: function(word, player){
                    var response;
                    if (currentWord === word){
                        response = {correct: true, word: word, player: player};
                    } else {
                        response = {correct: false, word: word, player: player};
                    }
                    emitEvent('game', 'guessWord', response, player.id);
                },
                giveTurn: function(player, choice){
					emitEvent('game', 'giveTurn', {choice: choice, player: player}, player.id);
                    return true;
                }

            };


        return obj;
    })();

/*Web Methods */
app.get('/listen', function(req, res){
    var data = req.query,
        currentIndex = data.event
        events = [];

    for (; currentIndex < eventPointer; currentIndex++){
        events.push(eventStack[currentIndex]);
    }

    res.send(events, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    });
});

app.get('/alert', function(req, res){});

app.get('/guessLetter', function(req, res){
    var data = req.query,
        guess = hangman.guessLetter(data.letter, data.player, data.player.id);

    res.send(guess, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    });
});

app.get('/guessWord', function(req, res){
    var data = req.query,
        guess = hangman.guessWord(data.word, data.player);

    res.send(guess, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    });
});

app.get('/newWord', function(req, res){
    var data = req.query,
        word = hangman.newWord(data.word, data.player);

    res.send(word, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    });
});

app.get('/connect', function(req, res){
    var data = req.query,

        player = hangman.usrConnect(data.id, data.name);

    res.send(player, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    });
});

app.get('/giveTurn', function(req, res){
    var data = req.query;
	
    hangman.giveTurn(data.player, data.choice);
	
    res.send(true, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    })

});

app.get('/disconnect', function(req, res){
    var data = req.query;


});


app.get('/', function(req, res){

    res.send('hello world!', {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    })
});

app.listen(8080, 'localhost');

console.log('Hangman server running at http://localhost:8080');
