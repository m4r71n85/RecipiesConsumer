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

            if (this.provider.isUserLoggedIn()) {
                this.loadrecipie("#panelbar");
            }
            else {
                this.loadLogin("#kwindow");
            }
        },
        loadLogin: function (selector) {
            this.attachLoginEventHandlers(selector);
            createKendoWindow("Login / Register", "Login").open();
            $("#userNickname").html("stranger");
            $("#LogBtn").html("Sign in");
            $("#LogBtn").on("click", function () {
                
              location.reload();
               
            });
        },
        loadrecipie: function () {
            var self = this;
            this.attachRecipieEventHandlers("#kwindow");
            $("#userNickname").html(this.provider.nickname());
            $("#LogBtn").on("click", function () {
                self.provider.user.logout().then(function (result) {

                    console.log("created:", result);
                    location.reload();
                }, function (error) {
                    location.reload();
                    alert(error.responseText);
                });
            });

            $("#LogBtn").html("LogOut");     
        },

        attachLoginEventHandlers: function (selector) {
            var self = this;
            var kwindow = $(selector);
            kwindow.on('click', '#btnLogin', function () {
                var username = $('#txtLoginUsername').val();
                var password = $('#txtLoginPassword').val();
                self.provider.user.login(username, password).then(function (result) {
                    console.log("created:", result);
                    location.reload();
                }, function (error) {
                    location.reload();
                    alert(error.responseText);
                });
            });

            kwindow.on('click', '#btnRegister', function () {
                var username = $('#txtRegisterUsername').val();
                var nickname = $('#txtRegisterNickname').val();
                var password = $('#txtRegisterPassword').val();
                self.provider.user.register(username, nickname, password).then(function (result) {
                    location.reload();

                }, function (error) {
                    alert(error.responseText);

                });
            });
        },
        attachRecipieEventHandlers: function (selector) {
            var self = this;
            var kwindow = $(selector);
           
            //ADD Step to the new recipie
            kwindow.on('click', '#btnAddStep', function () {
                $('#addedSteps').append($("<p>" + '|Step| <span class="step">' + $('#txtCreateRecipieStep').val() + '</span> ||Time| <span class="time">' + $('#txtCreateRecipieStepTime').val().trim() + "</span></p>"));
                $('#txtCreateRecipieStep').val("");
                $('#txtCreateRecipieStepTime').val("")

            });

            //DELETE steps
            kwindow.on('click', '#btnDeleteAllSteps', function () {
                $('#addedSteps').html("");
            });

            //Create New recipie
            kwindow.on('click', '#btnCreateRecipie', function () { // in kendo window CreateRecipeie
                var name = $('#txtCreateRecipieName').val();
                var description = $('#txtCreateRecipieDescription').val();
                var imageUrl = $('#ImageRecipierUrl').val();

                var stepsCollection = [];
                var steps = $('#addedSteps').children();

                for (var i = 0; i < steps.length; i++) {

                    var stepVal = $(steps[i]).find("span.step").html();
                    var timeVal = $(steps[i]).find("span.time").html();
                    var stepForSend = {
                        PreparationTime: parseFloat(timeVal),
                        Description: stepVal
                    }

                    stepsCollection.push(stepForSend);
                }


                self.provider.recipie.create(name, description, stepsCollection, imageUrl).then(function (result) {
                    kwindow.data("kendoWindow").close();
                    //var data = {
                    //    message: "new-recipie",
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

                self.provider.recipie.addComment(recipieId, commentOnRecipie).then(function (result) {

                    //var data = {
                    //    message: "new-recipie",
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

                self.provider.recipie.getRecipie(3).then(function (result) {
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