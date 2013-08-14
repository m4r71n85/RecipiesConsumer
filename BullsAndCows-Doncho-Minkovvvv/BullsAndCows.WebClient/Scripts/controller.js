/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />

var controllers = (function () {
	var rootUrl = "http://localhost:40643/api/";
	var Controller = Class.create({
		init: function () {
			this.persister = persisters.get(rootUrl);
		},

        //Load UI depending if there is logged user or not.
		loadUI: function (selector) {
			if (this.persister.isUserLoggedIn()) {
				this.loadGameUI(selector);
			}
			else {
				this.loadLoginFormUI(selector);
			}
			this.attachUIEventHandlers(selector);
		},
        //Load UI if no user is logged in. (The main window of the application)
		loadLoginFormUI: function (selector) {
			var loginFormHtml = ui.loginForm()
			$(selector).html(loginFormHtml);
		},

        //Load UI if an user is logged in.
		loadGameUI: function (selector) {
		    var list = ui.gameUI(this.persister.nickname());
		    $(selector).html(list);

			this.persister.game.open(function (games) {
				var list = ui.openGamesList(games);
				$(selector + " #open-games-container").append(list);
			});

			this.persister.game.myActive(function (games) {
			    var list = ui.activeGamesList(games);
			    $(selector + " #active-games-container").append(list);
			});
		},

        //Loads the state of the games in progress which are inside the active game conatiner.
		loadGame: function (selector, gameId) {	    
		    this.persister.game.state(gameId, function (gameState) {	       
				var gameHtml = ui.gameState(gameState);
				$(selector + " #game-holder").html(gameHtml);

		    });
		},

        //Event handlers
		attachUIEventHandlers: function (selector) {
			var wrapper = $(selector);
			var self = this;

            //Show login form when clicked
			wrapper.on("click", "#btn-show-login", function () {
				wrapper.find(".button.selected").removeClass("selected");
				$(this).addClass("selected");
				wrapper.find("#login-form").show();
				wrapper.find("#register-form").hide();
			});

            //Show register form when clicked
			wrapper.on("click", "#btn-show-register", function () {
				wrapper.find(".button.selected").removeClass("selected");
				$(this).addClass("selected");
				wrapper.find("#register-form").show();
				wrapper.find("#login-form").hide();
			});

            //User login
			wrapper.on("click", "#btn-login", function () {
				var user = {
					username: $(selector + " #tb-login-username").val(),
					password: $(selector + " #tb-login-password").val()
				}

				self.persister.user.login(user, function () {
					self.loadGameUI(selector);
				}, function () {
				    wrapper.html("Wrong username or password");
				});
				return false;
			});

            //Registers new user
			wrapper.on("click", "#btn-register", function () {
			    var user = {
			        username: $(selector + ' #tb-register-username').val(),
			        nickname: $(selector + ' #tb-register-nickname').val(),
                    password: $(selector + ' #tb-register-password').val()
			    }
			    self.persister.user.register(user, function () {
			        self.loadGameUI(selector);
			    }, function () {
			        wrapper.html("Error, Failed to register user!");
			    });
			    return false;
			});

            //Logouts user and returns the initial UI for loging/registering new user.
			wrapper.on("click", "#btn-logout", function () {
				self.persister.user.logout(function () {
					self.loadLoginFormUI(selector);
				});
			});

            //Click on an open game
			wrapper.on("click", "#open-games-container a", function () {
				$("#game-join-inputs").remove();
				var html = ui.joinGame();
				$(this).next().after(html);
			});

            //Click on game join button from the open games menu
			wrapper.on("click", "#btn-join-game", function () {
				var game = {
					number: $("#tb-game-number").val(),
					gameId: $(this).parents("li").first().data("game-id")
				};

				var password = $("#tb-game-pass").val();

				if (password) {
					game.password = password;
				}

				self.persister.game.join(game);
			});

            //Click on the game create button
			wrapper.on("click", "#btn-create-game", function () {
				var game = {
					title: $("#tb-create-title").val(),
					number: $("#tb-create-number").val(),
				}
				var password = $("#tb-create-pass").val();
				if (password) {
					game.password = password;
				}
				self.persister.game.create(game, function () {
				    alert("Successful operation");
				}, function (err) {
				    alert(JSON.stringify(err));
				});
			});

		    //Click on active game which is in progress.
			wrapper.on("click", ".active-games .in-progress", function () {
			    self.loadGame(selector, $(this).parent().data("game-id"));
			    return false;
			});

		    //Click on active game which is not in progress.
			wrapper.on("click", ".active-games .full", function () {
			    $("#btn-start-game").remove();
			    var html = ui.startGame();
			    $(this).parent().append(html);
			    return false;
			});

            //Click on start game button.
			wrapper.on("click", "#btn-start-game", function () {
			    self.persister.game.start($(this).parent().data("game-id"), function () {
			        alert("Successful start of the game");
			    }, function (err) {
			        alert(JSON.stringify(err));
			    });
			});

		    //Click on make guess button
			wrapper.on("click", "#btn-guess", function () {
			    var game = {
			        number: $("#tb-make-guess").val(),
			        gameId: $(this).parents("div").first().data("game-id")
			    };
			    self.persister.guess.make(game, function () {
			        alert("Successful guess");
			    }, function (err) {
			        var errObject = err["responseJSON"];
			        alert(errObject["Message"]);
			    });
			});

            //Show scores board button.//Success and error good to be implemented here not in the persister.
			wrapper.on("click", "#btn-show-scores", function () {
			    self.persister.user.scores();
			});

		    //Show all messages
			wrapper.on("click", "#btn-show-all-messages", function () {
			    $('#messages-list').remove();
			    self.persister.messages.all(function (messages) {
			        var list = ui.showMessages(messages);
			        $(selector + " #messages-container").append(list);
			    }, function (err) {
			        alert(JSON.stringify(err));
			    });
			});

		    //Show unread messages
			wrapper.on("click", "#btn-show-unread-messages", function () {
			    $('#messages-list').remove();
			    self.persister.messages.unread(function (messages) {
			        var list = ui.showMessages(messages);
			        $(selector + " #messages-container").append(list);
			    }, function (err) {
			        alert(JSON.stringify(err));
			    });
			});
		}
	});
	return {
		get: function () {
			return new Controller();
		}
	}
}());

$(function () {
	var controller = controllers.get();
	controller.loadUI("#content");
});