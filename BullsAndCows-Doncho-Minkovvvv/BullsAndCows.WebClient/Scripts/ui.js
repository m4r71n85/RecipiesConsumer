var ui = (function () {

    //The UI when no user is logged in the game.
	function buildLoginForm() {
		var html =
            '<div id="login-form-holder">' +
				'<form>' +
					'<div id="login-form">' +
						'<label for="tb-login-username">Username: </label>' + 
						'<input type="text" id="tb-login-username"><br />' + '<br/>' +
						'<label for="tb-login-password">Password: </label>' + 
						'<input type="password" id="tb-login-password"><br />' + '<br/>' +
						'<button id="btn-login" class="button">Login</button>' + '<br/>' + '<br/>' +
					'</div>' +
					'<div id="register-form" style="display: none">' +
						'<label for="tb-register-username">Username: </label>' +
						'<input type="text" id="tb-register-username"><br />' + '<br/>' +
						'<label for="tb-register-nickname">Nickname: </label>' +
						'<input type="text" id="tb-register-nickname"><br />' + '<br/>' +
						'<label for="tb-register-password">Password: </label>' +
						'<input type="text" id="tb-register-password"><br />' + '<br/>' +
						'<button id="btn-register" class="button">Register</button>' + '<br/>' + '<br/>' +
					'</div>' +
					'<a href="#" id="btn-show-login" class="button selected">Show Login Form</a>' + '&nbsp;&nbsp;&nbsp;' + 
					'<a href="#" id="btn-show-register" class="button">Show Register Form</a>' + '<br/>' + '<br/>' +
				'</form>' +
            '</div>';
		return html;
	}

    //The UI if an user has already been logged in.
	function buildGameUI(nickname) {
	    var html = 
        '<span id="user-nickname">' + nickname + '</span>' + '&nbsp;&nbsp;&nbsp;' +
		'<button id="btn-logout">Logout</button>' + '<br/> <br/>' +
        '<button id="btn-show-scores">Show score board</button>' + '<br/> <br/>' +
		'<fieldset id="create-game-holder">' +
            '<legend>Create Game</legend>' + 
			'Title: <input type="text" id="tb-create-title" />' + '&nbsp;' + '<br/>' + '<br/>' +
			'Password: <input type="password" id="tb-create-pass" />' + '&nbsp;' + '<br/>' + '<br/>' +
			'Number: <input type="text" id="tb-create-number" />' + '&nbsp;' + '<br/>' + '<br/>' +
			'<button id="btn-create-game">Create</button>' + 
		'</fieldset>' +

		'<div id="open-games-container">' +
			'<h2>Open Games</h2>' +
		'</div>' +

		'<div id="active-games-container">' +
			'<h2>Active Games</h2>' +
		'</div>' +

		'<div id="game-holder">' +
		'</div>' + 

        '<div id="messages-container">' +
           '<h2>Messages</h2>' +
           '<button id="btn-show-unread-messages">Show unread</button>' + '&nbsp;&nbsp;' +
           '<button id="btn-show-all-messages">Show all</button>' + '<br/>' +
       '</div>';

		return html;
	}

    //The UI for the Open games.
	function buildOpenGamesList(games) {
		var list = '<ul class="game-list open-games">';
		for (var i = 0; i < games.length; i++) {
			var game = games[i];
			list +=
				'<li data-game-id="' + game.id + '">' +
					'<a href="#" >' +
						$("<div />").html(game.title).text() +
					'</a>' +
					'<span> by ' +
						game.creatorNickname +
					'</span>' +
				'</li>';
		}
		list += '</ul>';
		return list;
	}

    //The UI for join game form.
	function joinGame() {
	    var html = '<div id="game-join-inputs">' +
						'Number: <input type="text" id="tb-game-number"/>' + '<br/>' +
						'Password: <input type="password" id="tb-game-pass"/>' + '<br/>' +
						'<button id="btn-join-game">join</button>' + '<br/>' +
					'</div>';
	    return html;
	}

    //The UI if some of the active games is clicked(which are not in progress).
	function startGame() {
	    var html = '<button id="btn-start-game">Start</button>';
	    return html;
	}

    //UI for the messages section in the application.
	function showMessages(messages) {
	    var list = '<ul id="messages-list">';
	    for (var i = 0; i < messages.length; i++) {
	        list += '<li>' + messages[i].text + '</li>';
	    }
	    list += '</ul>';
	    return list;
	}

    //The UI for the active games.
	function buildActiveGamesList(games) {
		var gamesList = Array.prototype.slice.call(games, 0);
		gamesList.sort(function (g1, g2) {
			if (g1.status == g2.status) {
				return g1.title > g2.title;
			}
			else
			{
				if (g1.status == "in-progress") {
					return -1;
				}
			}
			return 1;
		});

		var list = '<ul class="game-list active-games">';
		for (var i = 0; i < gamesList.length; i++) {
			var game = gamesList[i];
			list +=
				'<li data-game-id="' + game.id + '">' +
					'<a href="#" class="' + game.status + '">' +
						$("<div />").html(game.title).text() +
					'</a>' +
					'<span> by ' +
						game.creatorNickname +
					'</span>' +
				'</li>';
		}
		list += "</ul>";
		return list;
	}

    //The guess table UI.
	function buildGuessTable(guesses) {
		var tableHtml =
			'<table border="1" cellspacing="0" cellpadding="5">' +
				'<tr>' +
					'<th>Number</th>' +
					'<th>Cows</th>' +
					'<th>Bulls</th>' +
				'</tr>';
		for (var i = 0; i < guesses.length; i++) {
			var guess = guesses[i];
			tableHtml +=
				'<tr>' +
					'<td>' +
						guess.number +
					'</td>' +
					'<td>' +
						guess.cows+
					'</td>' +
					'<td>' +
						guess.bulls+
					'</td>' +
				'</tr>';
		}
		tableHtml += '</table>';
		return tableHtml;
	}

    //Build the guesses section
	function buildGameState(gameState) {
		var html =
			'<div id="game-state" data-game-id="' + gameState.id + '">' +
				'<h2>' + gameState.title + '</h2>' +
                'Number: <input type="text" id="tb-make-guess">' +
                '<button id="btn-guess">Guess</button>' +
				'<div id="blue-guesses" class="guess-holder">' +
					'<h3>' +
						gameState.blue + '\'s gueesses'+
					'</h3>' +
					buildGuessTable(gameState.blueGuesses) +
				'</div>' +
				'<div id="red-guesses" class="guess-holder">' +
					'<h3>' +
						gameState.red + '\'s gueesses' + 
					'</h3>'+
					buildGuessTable(gameState.redGuesses) +
				'</div>' +
		'</div>';
		return html;
	}

	return {
	    gameUI: buildGameUI,
	    showMessages: showMessages,
	    joinGame: joinGame,
        startGame: startGame,
		openGamesList: buildOpenGamesList,
		loginForm: buildLoginForm,
		activeGamesList: buildActiveGamesList,
		gameState: buildGameState
	}
}());