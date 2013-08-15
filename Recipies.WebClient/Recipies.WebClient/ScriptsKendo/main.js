/// <reference path="controller.js" />
/// <reference path="dataProvider.js" />
/// <reference path="kendo.custom.min.js" />

$(document).ready(function() {
   
    //panelBar = $("#panelbar").kendoPanelBar({
    //    expandMode: "single",
    //    select: onSelect,
    //}).data("kendoPanelBar");

    var someData = [
                    {
                        RecipieName: "Some Recipie",
                        Rating: 3,
                        Url: "www.dajda.com",
                        TimeForPreperation: 5,
                        CreatedBy: "SomeOne"
                    },
                    {
                        RecipieName: "Some Recipie",
                        Rating: 3,
                        Url: "www.dajda.com",
                        TimeForPreperation: 5,
                        CreatedBy: "SomeOne"
                    },
                    {
                        RecipieName: "Some Recipie",
                        Rating: 3,
                        Url: "www.dajda.com",
                        TimeForPreperation: 5,
                        CreatedBy: "SomeOne"
                    },
                    {
                        RecipieName: "Some Recipie",
                        Rating: 3,
                        Url: "www.dajda.com",
                        TimeForPreperation: 5,
                        CreatedBy: "SomeOne"
                    },
    ];

    $("#grid").kendoGrid({
        dataSource: {
            data:
                
                someData
            ,
            schema: {
                model: {
                    fields: {
                        RecipieName: { type: "string" },
                        Rating: { type: "number" },
                        Url: { type: "string" },
                        TimeForPreperation: { type: "number" },
                        CreatedBy: { type: "string" }
                    }
                }
            },
            pageSize: 5
        },
        height: 430,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "RecipieName", title: "Recipie Name", width: "100px" },
            "Rating",
            "Url",
            { field: "TimeForPreperation", title: "Time For Preperation in minutes", width: "50px" },
           { field: "CreatedBy", title: "Created By", width: "100px" }
        ],
        dataSource: {
            data: someData
        }
    });
    controller = controllers.get();
    controller.provider.user.scores();

    function onSelect(e) {
        selectedGameId = $(e.item)[0].id;
        console.log(selectedGameId);
    }
});

   