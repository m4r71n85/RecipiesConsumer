/// <reference path="controller.js" />
/// <reference path="dataProvider.js" />
/// <reference path="kendo.custom.min.js" />

$(document).ready(function() {
   
    panelBar = $("#panelbar").kendoPanelBar({
        expandMode: "single",
        select: onSelect,
    }).data("kendoPanelBar");

    controller = controllers.get();
    controller.provider.user.scores();
 
    function onSelect(e) {
        selectedGameId = $(e.item)[0].id;
        console.log(selectedGameId);
        //if (!isNaN(selectedGameId)) {
        //    var game = findById(games, selectedGameId);
        //    if (game.status === "open") {
        //        createKendoWindow("Join in Game Id: " + selectedGameId, "JoinGame").center().open();
        //    } else if (game.status === "full") {
        //        var content = 'Start the game.';
        //        notify.create(content, game.id, '', game.status, e.item);
        //    } else {
        //        var gameWindow = createGameWindow("Active Game: " + game.title, selectedGameId);
        //        controller.provider.game.state(game.id).then(function (result) {

        //            var turns = [];
        //            if (result.red === controller.provider.nickname()) {
        //                var i, length = result.redGuesses.length;
        //                for (i = length - 1; i >= 0; i--) {
        //                    turns.push(result.redGuesses[i]);
        //                }
        //            } else {
        //                var i, length = result.blueGuesses.length;
        //                for (i = length - 1; i >= 0; i--) {
        //                    turns.push(result.blueGuesses[i]);
        //                }
        //            }

        //            var dataSourceTurns = new kendo.data.DataSource({
        //                data: turns,
        //                pageSize: 10
        //            });

        //            var viewModelTurns = kendo.observable({
        //                dataSource: dataSourceTurns
        //            });
                    
        //            dataSourceTurns.read();
                    
        //            $("#pager").kendoPager({
        //                dataSource: dataSourceTurns
        //            });
                    
        //            var pnlListTurns = $(gameWindow).find('#pnlListTurns');
        //            pnlListTurns.kendoGrid({
        //                dataSource: dataSourceTurns,
        //                sortable: false,
        //                pageable: {
        //                    refresh: true,
        //                    pageSizes: true
        //                },
                        
        //            });//template: kendo.template($(gameWindow).find('#template').html())
                    
        //            gameWindow.data('kendoWindow').center().open();
                    
        //            kendo.bind(pnlListTurns, viewModelTurns);

        //            game.gameWindow = gameWindow;
        //            game.dataSourceTurns = dataSourceTurns;
        //        });
        //    }
        //} else {
            if ($(e.item).text().trim() === "Scores") {
                controller.provider.user.scores().then(function (result) {
                    var item = getItemByIndex(3);
                    item.remove('> li');
                    panelBar.select(getItemByIndex(3));
                    for (var i = 0; i < result.length; i++) {
                        panelBar.append('<li id="' + result[i].UserID + '" class="k-link">' + result[i].UserName + ': ' + result[i].NickName + '</li>', panelBar.select());
                    }
                    panelBar.expand(item);
                });
            }
        //}
    }
});