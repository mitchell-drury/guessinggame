var game;

function generateWinningNumber () {
    return Math.floor(Math.random()*100) + 1;
}

function shuffle (arr) {
    let swapIndex;
    let temp;
    let length = arr.length;
    while (length) {
        swapIndex = Math.floor(Math.random()*length--);
        temp = arr[swapIndex];
        arr[swapIndex] = arr[length];
        arr[length] = temp; 
    }   
    return arr;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.gameState = true;
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (num) {
    if (game.gameState) {
        try{
            if (!/^[1-9][0-9]{0,1}$|100/.test(num)) {
                throw 'That is an invalid guess.';
            } else {
                this.playersGuess = parseInt(num);
                return this.checkGuess();
            }
        }
        catch (err) {
            $('#messageBox').html(err);
        }
        finally {
            $('#players-input').val('');
            console.log(game.pastGuesses);
        }
    }
}

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
        updateGuessDisplay();
        game.gameState = false;
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(this.playersGuess) >= 0) {
        return 'You have already guessed that number.';
    } else if (this.pastGuesses.length === 4){     
        this.pastGuesses.push(this.playersGuess);
        updateGuessDisplay();
        game.gameState = false;
        return 'You Lose. The answer was ' + game.winningNumber;
    } else {
        this.pastGuesses.push(this.playersGuess);
        updateGuessDisplay();
        if (this.difference() < 10){
            return 'You\'re burning up!';
        } else if (this.difference() < 25){
            return 'You\'re lukewarm.'
        } else if (this.difference() < 50){
            return 'You\'re a bit chilly.'
        } else {
            return 'You\'re ice cold!';
        }
    }
}

function updateGuessDisplay () {
    let guessNumber = game.pastGuesses.length;
    $('#guess' + guessNumber).html(game.pastGuesses[guessNumber-1]);

}

function newGame () {
    return new Game;
}

Game.prototype.provideHint = function () {
    let hints = [];
    for (let i = 0; i < 7; i++){
        hints.push(generateWinningNumber()); 
    }
    hints.push(this.winningNumber);
    return shuffle(hints);
}

$(document).ready(function () {
    game = newGame();
    $('#submit').on('click', function () {
        let input = $('#players-input').val();
        $('#messageBox').html(game.playersGuessSubmission(input));
        $('#target').html(game.winningNumber);
    });
    $('#players-input').on('keypress', function (event) {
        if (event.which === 13){
            let input = $('#players-input').val();
            $('#messageBox').html(game.playersGuessSubmission(input));
            $('#target').html(game.winningNumber);
        }
    });
    $('#hint').on('click', function () {
        if (!game.hintGiven) {
            let hints = game.provideHint();
            $('#messageBox').html('It could be ' + hints.join(', '));
            game.hintGiven = true;
        } else {
            $('#messageBox').html('You already got a hint.');
        }
    });
    $('#reset').on('click', function () {
        game = newGame();
        $('.guess').each(function () {
            $(this).html('-');
        });
        $('#players-input').val('');
        $('#messageBox').html('');
    });
});
