/// <reference path="class.js" />
/// <reference path="dataProvider.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />
/// <reference path="helpers.js" />
/// <reference path="notify.js" />

var controllers = (function () {
	var rootUrl = "http://localhost:54081/";
	var Controller = Class.create({
		init: function () {
		    this.provider = providers.get(rootUrl);
		    
			if (this.provider.isUserLoggedIn()) {
			    this.loadGame("#panelbar");
			}
			else {
			    this.loadLogin("#kwindow");
			}

			if (true) {
			    this.loadGame("#panelbar");
			}
		},
		loadLogin: function (selector) {
		    this.attachLoginEventHandlers(selector);
		    createKendoWindow("Login / Register", "Login").open();
		},
		loadGame: function () {
		    this.attachGameEventHandlers("#kwindow");

		    //this.loadMessages();
		},
		loadOpenGames:function() {
		    this.provider.game.open().then(function (result) {
		        for (var i = 0; i < result.length; i++) {
		            var item = findById(games, result[i].id);
		            if (item === undefined) {
		                games.push(result[i]);
		                panelBar.select(getItemByIndex(0));
		                panelBar.append('<li id="' + result[i].id + '" class="k-link">' + result[i].title + '</li>', panelBar.select());
		            }
		        }
		        panelBar.expand(panelBar.select(getItemByIndex(0)));
		    });
		},

		attachLoginEventHandlers: function (selector) {
		    var self = this;
		    var kwindow = $(selector);
		    kwindow.on('click', '#btnLogin', function () {
		        var username = $('#txtLoginUsername').val();
		        var password = $('#txtLoginPassword').val();
		        self.provider.user.login(username, password).then(function () {
		            kwindow.data("kendoWindow").close();
		            self.loadGame("#panelbar");
		        });
		    });

		    kwindow.on('click', '#btnRegister', function () {
		        var username = $('#txtRegisterUsername').val();
		        var nickname = $('#txtRegisterNickname').val();
		        var password = $('#txtRegisterPassword').val();
		        self.provider.user.register(username, nickname, password).then(function () {
		            kwindow.data("kendoWindow").close();
		            self.loadGame("#panelbar");
		        });
		    });
		},
		attachGameEventHandlers: function (selector) {
		    var self = this;
		    var kwindow = $(selector);
		    kwindow.on('click', '#btnJoinGame', function () {
		        var password = $('#txtJoinGamePassword').val();
		        var number = $('#txtJoinGameNumber').val();
		        self.provider.game.join(selectedGameId, password, number).then(function (result) {
		            kwindow.data("kendoWindow").close();
		            var item = panelBar.getItemById(selectedGameId);
		        }, function (error) {
		            alert(error.responseText);
		        });
		    });
		    kwindow.on('click', '#btnCreateGame', function () {
		        var title = $('#txtCreateGameName').val();
		        var password = $('#txtCreateGamePassword').val();
		        var number = $('#txtCreateGameNumber').val();
		        self.provider.game.create(title, password, number).then(function (result) {
		            kwindow.data("kendoWindow").close();
		            var data = {
		                message: "new-game",
		                user: self.provider.nickname()
		            };
		            pubnubPublish(data);
		        }, function (error) {
		            alert(error.responseText);
		        });
		    });

		    kwindow.on('click', '#btnAddStep', function () {
		        $('#addedSteps').append($("<p>" + '|Step|' + $('#txtCreateRecipieStep').val() + '||Time|' + $('#txtCreateRecipieStepTime').val() + "</p>"));
		    });

		    kwindow.on('click', '#btnDeleteAllSteps', function () {
		        $('#addedSteps').html("");
		    });

		    kwindow.on('click', '#btnCreateGame', function () {
		        var name = $('#txtCreateRecipie').val();
		        var description = $('#txtCreateRecipieDescription').val();
		        var imageUrl = $('#txtCreateRecipieDescription').val();

		        var step = [];
		        var nextChild = $('#addedSteps').next() ;
		        while (nextChild  != null) {

		            var stepElementsArray = nextChild.val().replace('|Step|', " ").replace('|Time|').split('|');
		            var stepForSend = {
		                PreparationTime: stepElementsArray[1],
		                Description: stepElementsArray[0]
		            }

		            step.push(stepForSend);

		            nextChild.Remove();

		            nextChild = $('#addedSteps').next();


		        }

		        self.provider.game.create(name, description, step, imageUrl).then(function (result) {
		            kwindow.data("kendoWindow").close();
		            //var data = {
		            //    message: "new-game",
		            //    user: self.provider.nickname()
		            //};
		            //pubnubPublish(data);
		            console.log("created:", result);
		        }, function (error) {
		            alert(error.responseText);
		        });
		    });

		    $('#wrapper').on('click', '#btnCreateNewRecipie', function () {
		        createKendoWindow("Create New Game", "CreateGame").center().open();
		    });
		    $('#organizer').on('click', '#btnReadAllRecipies', function () {
		        self.provider.message.all().then(function (result) {
		            for (var i = 0; i < result.length; i++) {
		                var content = 'text: ' + result[i].text +
                            '<br />gameId: ' + result[i].gameId +
                            '<br />type: ' + result[i].type +
                            '<br />state: ' + result[i].state;
		                notify.create(content, result[i].gameId, result[i].type, result[i].state);
		            }
		        });
		    });
		}
	});
    return {
        get: function() {
            return new Controller();
        }
    };
}());