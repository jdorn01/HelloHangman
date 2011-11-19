(function(win, doc, nil, $){
	Hangman = Hangman || {};
	var Word = Hangman.Word = {},
        maxLength = 50;

	// jQuery: this function will occur on click of the field with id="inputButton" in HTML below
	Word.inputNewWord = function(word){
		//Get value of WOrd and Split the words into an array (force lowercase)
		//Declaring variables first to comply with jsLint standards
		var wordArray,
            tempWord,
			$boxes = $('#boxes'), //find the boxes cantainer for the same reason
            $letter = $('<b class="letter-box inline"></b>'),
            $word,
			i = 0, x = 0, e, l;

		word = word.replace(/\s{2,}/g, ' ') //use a regExp to replace all whitespace that is more than one space with a single space
					.trim() //trim off excess whitespace at the begining and end of the string
					.toLowerCase(); //and convert it to lower case!

		if(word == "") {
			return;
		}

        //Check the word length to see if it is too long.  If the number of characters in the word exceeds the maxLength value,
        //Alert the user and return
        if (word.length > maxLength){
            new Hangman.Alert("Your phrase is too long!  That's not very sporting of you. Try choosing a phrase less than " + maxLength + " characters long.")
        }

		wordArray = word.split(" ");
		//clear any existing fields
        $boxes.html("");

		//Create Boxes for each Letter in each word
		for(e = wordArray.length; i<e; i+=1)    //For Each Word
		{
            $word = $('<div class="word-box inline"></div>');
            for(x = 0, l = wordArray[i].length; x < l; x+=1)   //For Each Letter
			{
				//Check to see if the character is alphabetic
                if (wordArray[i][x].match(/[a-z]/i)){
                    tempWord = $letter.clone()
                    Hangman.lettersToGuess[wordArray[i][x]] ? Hangman.lettersToGuess[wordArray[i][x]].push(tempWord) : Hangman.lettersToGuess[wordArray[i][x]] = [tempWord];
                    $word.append(tempWord);
                    tempWord = null;
                } else {
                    //if the letter is not an alpha character, just display it.
                    $word.append('<span>' + wordArray[i][x] + '</span>')
                }

            }
            if ($word.html() != '' || $word.html() != null){
                $boxes.append($word);
            }

		}
/*
		$("#inputWord").hide();
		$('ul.strikes li.strike').show();
		$("#inputLetter").show();
        $("#wordBankDiv").show(); */
	};

	//export the Hangman namespace
	win.Hangman = Hangman;

})(window, document, null, jQuery);
