/// <reference path="controller.js" />
/// <reference path="dataProvider.js" />
/// <reference path="kendo.custom.min.js" />



function onChange(arg) {
	var selected = $.map(this.select(), function (item) {
		return $(item).text();
	});
	console.log("Selected: " + selected.length + " item(s), [" + selected.join(", ") + "]");
}

$(document).ready(function() {
   
    //panelBar = $("#panelbar").kendoPanelBar({
    //    expandMode: "single",
    //    select: onSelect,
    //}).data("kendoPanelBar");

    controller = controllers.get();


    var kendoGrid = $("#grid").kendoGrid({
       
        columns: [
            { field: "Name", title: "Recipie Name", width: "200px" },
             { field: "Rating", title: "Rating", width: "200px", template: 
                 '<div class="qa-voting qa-voting-net" id="voting_113454">'+
									'<div class="qa-vote-buttons qa-vote-buttons-net" id="#=RecipyID #">' +
										'<input title="Click to vote up" name="voteUp" value="+" type="button"/> ' +
										'<input title="Click to vote down" name="voteDown" value="–" type="button"/>' +
									'</div>' +
									'<div class="qa-vote-count qa-vote-count-net">' +
										'<span class="qa-netvote-count">' +
											'<span class="qa-netvote-count-data">#=Rating #<span class="votes-up"><span class="value-title" title="0"></span></span><span class="votes-down"><span class="value-title" title="0"></span></span></span><span class="qa-netvote-count-pad"> votes</span>' +
										'</span>' +
									'</div>' +
									'<div class="qa-vote-clear">' +
									'</div>' +
								'</div>'  },
             { field: "ImagesFolder", title: "ImagesFolder", template: "<img src='#=ImagesFolder #  alt='NO IMAGE Available' width= '150px' height: '150px' /> "},
            { field: "CookingMinutes", title: "Time For Preperation in minutes", width: "200px" },
           { field: "CreatedBy", title: "Created By: ", width: "100px" }
        ],
        dataSource: {
            transport: {
            	read: "http://localhost:54081/api/recipies",
                pageSize: 5
            },
            width: 350,
            pageable: true
          
        },
        change: onChange,
    });
});

   