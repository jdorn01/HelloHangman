var Hangman = (function(win, doc, $){
    var $inputWord, $inputLetter, $wordBankDiv, $strikes, $finalWord
        settings = {
            serverUrl: 'http://localhost:8080'
        },

		players = {
			player1: {			
				id: "",
				name: "Player 1",
				score: 0,
				isTurn: false,
				isGuessing: false,
				isMaster: true, /* default player1 to master */
				isActive: false
			},
			player2: {			
				id: "",
				name: "Player 2",
				score: 0,
				isTurn: false,
				isGuessing: false,
				isMaster: false,
				isActive: false
			},
			player3: {			
				id: "",
				name: "Player 3",
				score: 0,
				isTurn: false,
				isGuessing: false,
				isMaster: false,
				isActive: false
			},	
			player4: {			
				id: "",
				name: "Player 4",
				score: 0,
				isTurn: false,
				isGuessing: false,
				isMaster: false,
				isActive: false
			}
		},
		
		

        obj = {
            lettersToGuess: {},
            lastEvent: 0,
            player: null,
            init: function(){
                $inputLetter = $("#inputLetter");
                $inputWord = $('#inputWord');
                $playerChooseId = $('#playerChooseId');
                //$inputLetterButton = $('#inputLetterButton');
                $wordBankDiv = $('#wordBankDiv');
                $strikes = $('ul.strikes li.strike');

				$playerChooseId.hide();
                $inputLetter.hide();
                $wordBankDiv.hide();
                $strikes.hide();
                p1wins = 0;
                p2wins = 0;
				p3wins = 0;
                p4wins = 0;
                
                $('#player1ChooseBtn').click(function(e){
                    e.preventDefault();
					$.ajax({
						url: 'http://localhost:8080/giveTurn',
						context: Hangman,
						data: {
							player: Hangman.player,
							choice: "Player 1"
						},
						success: function(data, textStatus, jqXHR){
							if(this.player.isMaster)
								$inputWord.hide();
							return;
						}
					});
				});
				
				$('#player2ChooseBtn').click(function(e){
					e.preventDefault();
					$.ajax({
						url: 'http://localhost:8080/giveTurn',
						context: Hangman,
						data: {
							player: Hangman.player,
							choice: "Player 2"
						},
						success: function(data, textStatus, jqXHR){
							if(this.player.isMaster)
								$inputWord.hide();
							return;
						}
					});
				});
				
				$('#player3ChooseBtn').click(function(e){
					e.preventDefault();
					$.ajax({
						url: 'http://localhost:8080/giveTurn',
						context: Hangman,
						data: {
							player: Hangman.player,
							choice: "Player 3"
						},
						success: function(data, textStatus, jqXHR){
							if(this.player.isMaster)
								$inputWord.hide();
							return;
						}
					});
				});
				
				$('#player4ChooseBtn').click(function(e){
					e.preventDefault();
					$.ajax({
						url: 'http://localhost:8080/giveTurn',
						context: Hangman,
						data: {
							player: Hangman.player,
							choice: "Player 4"
						},
						success: function(data, textStatus, jqXHR){
							if(this.player.isMaster)
								$inputWord.hide();
							return;
						}
					});
				});
                
                $inputWord.submit(function(e){
                    e.preventDefault();
                    //TODO: Instead of explicitly calling another module, fire an event 'word' which the other module can listen to
                    Hangman.Word.inputNewWord(this['word'].value);
                    //
                    var word = this['word'].value;
					
					$.ajax({
						url: 'http://localhost:8080/newWord',
						context: Hangman,
						data: {
							player: Hangman.player,
							word: word
						},
						success: function(data, textStatus, jqXHR){
							if(this.player.isMaster)
								$inputWord.hide();
							return;
						}
					});
                    //
                    this['word'].value = '';
                });

                $inputLetter.submit(function(e){
                    e.preventDefault();
                    //TODO: Instead of explicitly calling another module, fire an event 'guess' which the other module can listen to
                    Hangman.Guess.chooseNewLetter(this['letter'].value);
                    var letter = this['letter'].value;

					$.ajax({
						url: 'http://localhost:8080/guessLetter',
						context: Hangman,
						data: {
							player: Hangman.player,
							letter: letter
						},
						success: function(data, textStatus, jqXHR){
							return;
						}
					});
                    this['letter'].value = '';
                })

                $inputLetter.prop("disabled", false);

                $("#newWord").click(this.resetGame);

                this.connect();
            },
            loseGame: function(){
            	var k, winner;
            	for(k in players){
            		if(players[k].isMaster){
            			players[k].score = this.player.score + 1;
            			winner = k;
					}
            	}
            	
				if(this.player.isMaster){
            		new Hangman.Alert("You win!");
            	}else{
            		new Hangman.Alert("You lose; the correct word was \"" + $finalWord + "\"");
            	}            
            	
            	$('#p1Score').html(players["player1"].score);
				$('#p2Score').html(players["player2"].score);
				$('#p3Score').html(players["player3"].score);
				$('#p4Score').html(players["player4"].score);
            	
            	Hangman.resetGame(winner);
            },
            winGame: function(){
            	var k, winner;
            	for(k in players){
            		if(players[k].isGuessing){
            			players[k].score = this.player.score + 1;
            			winner = k;
					}
            	}
            	
            	if(this.player.isGuessing){
            		new Hangman.Alert("You win!");
            	}else{
            		var k;
					for(k in players){
						if(players[k].isGuessing){
							new Hangman.Alert("Sorry, " + players[k].name + " wins.");
						}
					}
            	}
            	
				$('#p1Score').html(players["player1"].score);
				$('#p2Score').html(players["player2"].score);
				$('#p3Score').html(players["player3"].score);
				$('#p4Score').html(players["player4"].score);
				
				Hangman.resetGame(winner);
            },
            resetGame: function(winner){
                //-- in the Math.floor((Math.random()*maxPlayers-1)) + 1'th loop, set isMaster
                //jQuery lets you use multiple selectors at one time which I think is cool ~AL
                $('#testingP,#wordBankP,#boxes').html("");
                $("#gallowsPane").html("<img src=\"resources/images/0.png\"");
                $("#inputWord").show();
                $playerChooseId.hide();
                //reset the strikes to 0 
                $strikes.removeClass('active');
                $strikes.hide();
                //hide this interface
                $wordBankDiv.hide();
                $inputLetter.hide();
                //re-enable the disabled form
                $inputLetter.prop("disabled", false);
                //reset the number of guesses
                //TODO: Instead of explicitly calling another module, fire an event 'reset' which the other module can listen to
                Hangman.Guess.reset();
                
                if(this.player.name === players[winner].name){
            		this.player.isMaster = true;
            		this.player.isGuessing = false;
            		$("#inputWord").show();
            	}else{
            		this.player.isMaster = false;
            		this.player.isGuessing = false;
            		$("#inputWord").hide();
            	}
            },
            activatePlayer: function(playerName, playerId){
                if(players[playerName].isActive){
                    return players[playerName];
                }
                players[playerName].isActive = true;
                players[playerName].id = playerId;
                $('.' + playerName).addClass('active');
				
                return players[playerName];
            },

            connect: function(playerName, callback){
                playerName = playerName || '';
                $.ajax({
                    url: settings.serverUrl + "/connect",
                    context: Hangman,
                    data: {
                        id: win.sessionStorage.getItem('hangman_id'),
                        name: playerName
                    },
                    success: function(data, textStatus, jqXHR){
                        if (data.error){
                            new Hangman.Alert(data.error);
                        } else {
                            //TODO: instantiate new player object with the returned guid
                            //this.player = this.newPlayer(data.id, data.name);

                            this.player = this.activatePlayer(data.name, data.id);
                            
                            //new Hangman.Alert('User Id: ' + data.id + ' User Name: ' + data.name);
                            //TODO: create class to manage cookies

                            //TODO create class to leverage local browser storage
                            win.sessionStorage.setItem('hangman_id', data.id)
                            if ($.type(callback) === 'function') {
                                callback.call(data);
                            }
                            
                            if(this.player.isMaster == false){
								$("#inputWord").hide();
							}
                            this.listen();
                        }
                    }
                });
            },
            disconnect: function(){
                var id = win.sessionStorage.getItem('hangman_id');
                if (!id){
                    return;
                }
                $.ajax({
                    url: settings.serverUrl + "/disconnect",
                    context: Hangman,
                    data: {
                        id: id
                    },
                    success: function(data, textStatus, iqXHR){

                    }
                })

            },
            listen: function(){
                $.ajax({
                        url: 'http://localhost:8080/listen',
                        context: Hangman,
                        data: {
                            userId: this.userId,
                            event: this.lastEvent
                        },
                        success: function(data, textStatus, jqXHR){
                            var i = 0, e = data.length;
                            for (; i < e; i++){
                                if (data[i].action === 'connected'){
                                    this.activatePlayer(data[i].data.name, data[i].data.id);
                                } else if (data[i].action === 'newWord'){
                                	$finalWord = data[i].data.word;
                                	Hangman.Word.inputNewWord(data[i].data.word);
                                	//new Hangman.Alert(data[i].data.player.name + ' has entered a word.');
                                    //console.append('<div>A new word has been entered: ' + data[i].data.word + '</div>');
                                    if(this.player.isMaster == true){
										$playerChooseId.show();
										$inputLetter.hide();
                                    }
                                    var j;
									for(j in players){
										if(players[j].isActive && (players[j].name != data[i].data.player.name)){
											$('#' + j + 'ChooseBtn').show();
										}else{
											$('#' + j + 'ChooseBtn').hide();
										}
									}
									$("#inputWordLegend").html(this.player.name + ', Please Enter a Word or Phrase');
									$("#inputLetterLegend").html(this.player.name + ', Please Guess a Letter');
									
                                } else if (data[i].action === 'guessLetter'){
                                    var correct = data[i].data.correct ? 'correctly' : 'incorrectly';
                                    //console.append('<div>' + data[i].data.player + ' ' + correct + ' guessed the letter: ' + data[i].data.letter + '</div>');
                                	if(data[i].data.player.name == this.player.name){
                                		if(data[i].data.correct == false){
                                			var j, count = 0;
											for(j in players){
												if(players[j].isActive && !players[j].isMaster && (players[j].name != data[i].data.player.name)){
													$('#' + j + 'ChooseBtn').show();
													count = count + 1;
												}else{
													$('#' + j + 'ChooseBtn').hide();
												}
											}
											if(count > 1){
												$playerChooseId.show();
												$inputLetter.hide();
											}
                                		}
                                	}
                                	if(data[i].data.player.name != this.player.name){
                                		//new Hangman.Alert(data[i].data.player.name + ' guessed the letter: ' + data[i].data.letter);
                                		Hangman.Guess.chooseNewLetter(data[i].data.letter);
                                	}
                                }  else if (data[i].action === 'guessWord'){
                                    var correct = data[i].data.correct ? 'correctly' : 'incorrectly';
                                    //console.append('<div>' + data[i].data.player + ' ' + correct + ' guessed the word: ' + data[i].data.word + '</div>');
                                	new Hangman.Alert(data[i].data.player + ' guessed the word: ' + data[i].data.word);
                                } else if (data[i].action === 'giveTurn'){
                                    //new Hangman.Alert(data[i].data.player.name + ' passed to: ' + data[i].data.choice);
									$('ul.strikes li.strike').show();
									$("#inputWord").hide();
									$("#wordBankDiv").show();
									$playerChooseId.hide();
									var k;
									for(k in players){
										if(players[k].name == data[i].data.choice){
											players[k].isGuessing = true;
										}else{
											players[k].isGuessing = false;
										}
									}
									if(this.player.name == data[i].data.choice){
										$("#inputLetter").show();
										this.player.isGuessing = true;
									}else{
										$("#inputLetter").hide();
										this.player.isGuessing = false;
									}
                                } 
                                //console.append('<div>' + data[i].id + ' : ' + data[i].type + ' : ' + data[i].action + ' : ' + data[i].data + ' : ' + data[i].userId + '</div>')
                                this.lastEvent++;
                            }

                            this.listen();
                        }
                    });

            },
            emit: function(){}
        };

    return $.extend({}, Hangman, obj)
})(window, document, jQuery);

$(document).ready(function(e){
    Hangman.init(); //call initialize function once the document has loaded
});

// from http://www.electrictoolbox.com/pad-number-zeroes-javascript/
function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}
