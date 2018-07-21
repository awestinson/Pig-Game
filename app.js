/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let UIController = (() => {
    return {
        init : () => {
            let initArr = document.querySelectorAll('.player-score');
            Array.from(initArr).forEach(element => {
                element.textContent = '0';
            });
            let initArr1 = document.querySelectorAll('.player-current-score');
            Array.from(initArr1).forEach(element => {
                element.textContent = '0';
            });
            document.querySelector('.player-0-panel').classList.remove('winner');
            document.querySelector('.player-1-panel').classList.remove('winner');
            document.querySelector('.player-0-panel').classList.remove('active');
            document.querySelector('.player-1-panel').classList.remove('active');
            document.querySelector('.player-0-panel').classList.add('active');
            document.querySelector('#name-0').textContent = 'Player 1';
            document.querySelector('#name-1').textContent = 'Player 2';
            document.querySelector('.dice').style.display = 'none';
        },
        updateCurrent : (output) => {
            if(output !== undefined) {
                document.querySelector('.dice').style.display = 'block';
                document.querySelector('.dice').src = 'dice-' + output.retDice + '.png';
                if(output.retPlayerChange){
                    document.querySelector('.player-' + (1 - output.retActivePlayer) + '-panel').classList.toggle('active');
                    document.querySelector('.player-' + output.retActivePlayer + '-panel').classList.toggle('active');
                    document.getElementById('current-' + (1 - output.retActivePlayer)).textContent = output.retRoundScore;
                } else {
                    document.getElementById('current-' + output.retActivePlayer).textContent = output.retRoundScore;
                } 
            }
        },
        updateHold : (output) => {
            if(output !== undefined) {
                document.querySelector('.dice').style.display = 'none';
                document.getElementById('score-' + (1 - output.retActivePlayer)).textContent = output.retScore;
                document.getElementById('current-' + (1 - output.retActivePlayer)).textContent = '0';
                if(!output.retWin) {
                    document.querySelector('.player-' + (1 - output.retActivePlayer) + '-panel').classList.toggle('active');
                    document.querySelector('.player-' + output.retActivePlayer + '-panel').classList.toggle('active');
                } else {
                    document.querySelector('.player-' + (1 - output.retActivePlayer) + '-panel').classList.add('winner');
                    document.querySelector('#name-' + (1 - output.retActivePlayer)).textContent = 'Winner!';
                }
            }
        }
    };
})();

UIController.init();

let gameController = (() => {
    let scores = [0,0], roundScore = 0, activePlayer = 0, playing = true;
    return {
        setVariables : () => {
            scores = [0,0];
            roundScore = 0;
            activePlayer = 0;
            playing = true;
        },
        rollDice : () => {
            if(playing) {
                let dice = Math.floor(Math.random()*6 + 1);
                if(dice !== 1) {
                    roundScore += dice;
                } else {
                    activePlayer = (activePlayer === 0) ? 1 : 0;
                    roundScore = 0;
                }
                return {
                    retPlayerChange : (dice === 1) ? true : false,
                    retActivePlayer : activePlayer,
                    retRoundScore : roundScore,
                    retDice : dice
                }
            }
        },
        hold : function() {
            if(playing) {
                scores[activePlayer] += roundScore;
                let win = this.checkWin(scores[activePlayer]);
                activePlayer = 1 - activePlayer;
                roundScore = 0;
                return {
                    retActivePlayer : activePlayer,
                    retScore : scores[1-activePlayer],
                    retWin : win
                };
            }
        },
        checkWin : (score) => {
            if(score >= 50) {
                playing = false;
                return true;
            } else {
                return false;
            }
        }
    };
})();

let eventHandlers = ((UIFunction,ctrlFunction) => {
    let buttons = ['.btn-new','.btn-roll','.btn-hold'];
    document.querySelector(buttons[0]).addEventListener('click',() => {
        UIFunction.init();
        ctrlFunction.setVariables();
    });
    document.querySelector(buttons[1]).addEventListener('click',() => {
        let output = ctrlFunction.rollDice();
        UIFunction.updateCurrent(output);
    });
    document.querySelector(buttons[2]).addEventListener('click',() => {
        let output = ctrlFunction.hold();
        UIFunction.updateHold(output);
    })
})(UIController,gameController);
