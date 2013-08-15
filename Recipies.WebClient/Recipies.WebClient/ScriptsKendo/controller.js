/// <reference path="class.js" />
/// <reference path="dataProvider.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />
/// <reference path="helpers.js" />
/// <reference path="notify.js" />

var controllers = (function () {
    var rootUrl = "http://localhost:54081/api/";
    var Controller = Class.create({
        init: function () {
            this.provider = providers.get(rootUrl);

            //if (this.provider.isUserLoggedIn()) {
            //    this.loadGame("#panelbar");
            //}
            //else {
            //    this.loadLogin("#kwindow");
            //}

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
            //kwindow.on('click', '#btnJoinGame', function () {
            //    var password = $('#txtJoinGamePassword').val();
            //    var number = $('#txtJoinGameNumber').val();
            //    self.provider.game.join(selectedGameId, password, number).then(function (result) {
            //        kwindow.data("kendoWindow").close();
            //        var item = panelBar.getItemById(selectedGameId);
            //    }, function (error) {
            //        alert(error.responseText);
            //    });
            //});

            //ADD Step to the new recipie
            kwindow.on('click', '#btnAddStep', function () {
                $('#addedSteps').append($("<p>" + '|Step|' + $('#txtCreateRecipieStep').val() + '||Time|' + $('#txtCreateRecipieStepTime').val() + "</p>"));
            });

            //DELETE steps
            kwindow.on('click', '#btnDeleteAllSteps', function () {
                $('#addedSteps').html("");
            });

            //Create New recipie
            kwindow.on('click', '#btnCreateRecipie', function () { // in kendo window CreateRecipeie
                var name = $('#txtCreateRecipie').val();
                var description = $('#txtCreateRecipieDescription').val();
                var imageUrl = $('#txtCreateRecipieDescription').val();

                var step = [];
                var nextChild = $('#addedSteps').next();
                while (nextChild != null) {

                    var stepElementsArray = nextChild.text().replace('|Step|', " ").replace('|Time|').split('|');
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

            // Create comment on recipie
            kwindow.on('click', '#btnMakeTurn', function () {

                var commentOnRecipie = $('#commentOnRecipie').val();

                self.provider.game.addComment(recipieId, commentOnRecipie).then(function (result) {

                    //var data = {
                    //    message: "new-game",
                    //    user: self.provider.nickname()
                    //};
                    //pubnubPublish(data);

                    // refresh comments

                    console.log("created:", result);
                }, function (error) {
                    alert(error.responseText);
                });
            });


            // Load The window for new recipie from the main window
            $('#wrapper').on('click', '#btnCreateNewRecipie', function () {
                if (self.provider.isUserLoggedIn()) {
                    createKendoWindow("Create New Recipie", "CreateRecipie").center().open();

                }
                else {
                    self.loadLogin("#kwindow");
                }

            });

            // load the window for the detailed view on the select recipie
            $('#grid').on('click', 'tr', function () {

                var recipieId = parseInt(
		        $(this).first().text());

                self.provider.game.getRecipie(3).then(function (result) {
                    createKendoWindow("Recipie" + recipieId, "ViewRecipie").center().open();

                    var commentsGrid = $("#commentsGrid").kendoGrid({

                        columns: [
                            { field: "Text", title: "Text", width: "100px" },
                           { field: "CreatedBy", title: "Created By", width: "100px" }
                        ],
                        dataSource: {
                            transport: {
                                read: "http://localhost:54081/api/recipies",
                            },
                            pageSize: 2
                        },
                        height: 200,
                        pageable: true,
                        scrollable: true,
                        selectable: "row",

                    });
                    console.log("created:", result);
                }, function (error) {
                    alert(error.responseText);
                });

            });
        }
    });
    return {
        get: function () {
            return new Controller();
        }
    };
}());