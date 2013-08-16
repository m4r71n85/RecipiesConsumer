/// <reference path="controller.js" />
/// <reference path="dataProvider.js" />
/// <reference path="kendo.custom.min.js" />

$(document).ready(function () {

    controller = controllers.get();


    var kendoGrid = $("#grid").kendoGrid({

        columns: [
            { field: "RecipieID", title: "RecipieID", template: "#=RecipyID #", width: "1px" },
            { field: "Name", title: "Recipie Name", width: "200px" },
			{ field: "Rating", title: "Rating", width: "200px", template:
                    '<div class="qa-vote-buttons qa-vote-buttons-net">' +
                        '<input title="Click to vote up" name="vote_113454_1_a113454" onclick="return qa_vote_click(this);" type="submit" value="+" class="qa-vote-first-button qa-vote-up-button" onmouseover="this.className="qa-vote-first-button qa-vote-up-hover"/> ' +
                        '<input title="Click to vote down" name="vote_113454_-1_a113454" onclick="return qa_vote_click(this);" type="submit" value="–" class="qa-vote-second-button qa-vote-down-button" onmouseover="this.className="qa-vote-second-button qa-vote-down-hover">' +
                    '</div>'
            },
            { field: "ImagesFolder", title: "ImagesFolder", template: "<img src='#=ImagesFolder #'  alt='NO IMAGE Available' width= '150px' height: '150px' />" },
			{ field: "CookingMinutes", title: "Time For Preperation in minutes", width: "200px" },
			{ field: "CreatedBy", title: "Created By", width: "100px" }
        ],
        dataSource: {
            transport: {
                read: "http://recepies-1.apphb.com/api/recipies",
            },
            pageSize: 5
        },
        height: 350,
        pageable: true,
        scrollable: true,
        selectable: "row",

    });

});

