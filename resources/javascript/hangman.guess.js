(function(win, doc, nil, $){
	var Hangman = win.Hangman = win.Hangman || {};
	var Guess = Hangman.Guess = {},
		wrongGuess = 0,
		rightGuess = 0,
		MAX_WRONG = 7;
		//moved our guesses and MAX_WRONG variables to the Guess closure. If need be, these values can be exposed via the Guess namespace

	Guess.chooseNewLetter = function(letter){
		//-- don't accept letter input if guesses >= MAX_WRONG
		if (wrongGuess < MAX_WRONG){
			// force lowercase here to ensure case-insensitivity during check
			letter = letter.toLowerCase();

            //validate that the character is an alpha
            if (letter.match(/[^a-z]/gi)){
				new Hangman.Alert("You only need to guess letters a through z (we took care of the rest for you!)");
				return false;
			}

            if (letter === "" || letter.length != 1){
                new Hangman.Alert("Please input one letter");
				return false;
			}

			if ($('#wordBankP').html().match(letter)){
				new Hangman.Alert("Already guessed that letter!");
				return false;
			}

			var letterFound = false,
                i = 0, e = 0;

            if (Hangman.lettersToGuess[letter]) {
                letterFound = true;
                for (e = Hangman.lettersToGuess[letter].length; i < e; i++){
                    Hangman.lettersToGuess[letter][i].html(letter);
                    Hangman.lettersToGuess[letter][i].addClass('guessed');
                }
                if ($('b.letter-box').not('.guessed').length === 0){
                    Hangman.winGame();
                }
            }

			Guess.displayChosenLetter(letter);

			if(!letterFound){
		        wrongGuess += 1;
		        $('ul.strikes > #' + wrongGuess).addClass('active');
                if(wrongGuess <= MAX_WRONG) {
                    var imgStr = "<img src=\"resources/images/" + wrongGuess + ".png\">";
                    $("#gallowsPane").html(imgStr);
                }
		        if(wrongGuess >= MAX_WRONG) {
	        		Hangman.loseGame();
                }
			}
		}
		return letterFound;
	};

	Guess.displayChosenLetter = function(letter){
    	$('#wordBankP').append(letter);
	};

	Guess.reset = function(){
		guesses = 0;
		wrongGuess = 0;
	};

    $.extend({}, win.Hangman, Hangman);
})(window, document, null, jQuery);
