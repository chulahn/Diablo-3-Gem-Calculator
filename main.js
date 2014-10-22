//all ranks of gems.  used when calculating Cost
var gemRanks = ["Chipped", "Flawed", "Regular", "Flawless", "Perfect", "Radiant" , "Square", "Flawless Square", "Perfect Square", "Radiant Square", "Star", "Flawless Star", "Perfect Star", "Radiant Star" , "Marquise" , "Imperial" , "Flawless Imperial" , "Royal" , "Flawless Royal"];

//reverse of gemRanks.  used assign appropriate titles to gems in divs.
var gemRanksReverse = gemRanks.slice();
gemRanksReverse.reverse();

var gemType = ["Amethyst", "Diamond", "Emerald", "Ruby", "Topaz"];


//# of gems , gold , death breath
//index is upgrading from gemRanks[index] gemRanks[0] = Chipped
//upgradeCosts[0] is cost to upgrade from chipped
//
var upgradeCosts = [ [2 , 10 , 0],
[2 , 25 , 0],
[2 , 40 , 0],
[2 , 55 , 0],
[2 , 70 , 0],
[2 , 85 , 0],//from radiant 
[2 , 100 , 0],
[3 , 5000 , 0],//from flawless square to Perfect square
[3 , 10000 , 0],
[3 , 20000 , 0],//from radiant square to star
[3 , 30000 , 0],
[3 , 50000 , 0],
[3 , 75000 , 0],
[3 , 100000 , 0],//radiant star to marquise
[3 , 200000 , 0],//marquise to imperial
[3 , 300000 , 0],//imperial to flawless imp
[3 , 400000 , 0],//flawless imp to royal
[3 , 500000 , 0],//royal to flawless royal

];

//url used to show img
var baseUrl="http://media.blizzard.com/d3/icons/items/large/";
//used when switching gems
var gemToSearch = "emerald";
var gemToSearchRegEx = new RegExp(gemToSearch, 'g');

var gemToCreateHTML = "";
var creatingFromHTML = "";
//store the title's of gems to be passed into  calculateCost function.
var wantToCraft;
var craftingFrom;

var wantToCreateIndex;
var createFromIndex;

$(document).ready(function() {
	//create and add HTML for choosing which gem type.  Add handler
	var gemTypeDivHTML = "";
	$.each(gemType, function(index, gemType) {

		gemTypeDivHTML += "<img class=\"gemType\" title=\""+gemType+"\" src = \" http://media.blizzard.com/d3/icons/items/large/"+gemType.toLowerCase()+"_15_demonhunter_male.png \">";
	});
	$('#gemTypes').append(gemTypeDivHTML);
	$('.gemType').on('click', function() {
		switchGem($(this).attr('title'));
	});


	//HTML for choosing which gem rank to create and make from.
	//using reverse to show add correct title for shown gem.
	$.each(gemRanksReverse, function(index, gemRank) {
		gemToCreateHTML += "<span class=\"gemToCreateRank inactive\" title=\""+gemRank+"\">";
		gemToCreateHTML += "<img src=\""+baseUrl+gemToSearch.toLowerCase()+"_";
		//gem img number runs from 0-19.  to get the last image, length-index
		//
		if (gemRanksReverse.length-index <= 9) {
			gemToCreateHTML += "0"+(gemRanksReverse.length-index);
		}
		else {
			gemToCreateHTML += gemRanksReverse.length-index;
		}
		gemToCreateHTML += "_demonhunter_male.png\"";
		gemToCreateHTML += "></span>";
	});
	//creatingFromHTML has the same exact html as gemToCreate except
	//different classes for spans.
	creatingFromHTML = gemToCreateHTML.replace(new RegExp('gemToCreateRank' , 'g') , 'creatingFromRank');


	//First step, "Which gem would you like to make?" HTML and handler
	$('#gemToCreateDiv').html(gemToCreateHTML);
	//chipped is removed because it cannot be created.
	$(".gemToCreateRank[title='Chipped']").remove();
	$(this).on('click', '.gemToCreateRank', function() {
		wantToCraft = $(this).attr('title');
		//apply active class only to gem clicked.
		$('.gemToCreateRank').removeClass('active').addClass('inactive');
		$(this).removeClass('inactive').addClass('active');
		//edit Span to show which gem want to create
		$('#gemToCreateSpan').html("<h3>"+wantToCraft+"</h3>");
		wantToCreateIndex = gemRanks.indexOf($(this).attr('title'));
		//based on rank of gem picked, all ranks above are hidden in the div below this.
		$(".creatingFromRank").show();
		for (o=wantToCreateIndex; o<18; o++) {
			gemTitle = gemRanks[o];
			$(".creatingFromRank[title=\""+gemTitle+"\"]").hide();
		}
		//if a gem was clicked in both divs, calculate the cost and show
		if ($('.gemToCreateRank.active').size() == 1 && $('.creatingFromRank.active').size() == 1) {
			finalCost = calculateCost($('#gemToCreateSpan').text() , $('#creatingFromSpan').text());
			finalCost = intMultArray(finalCost, $('#numOfGems').val());
			$('#mats').html("<h3>"+$('.creatingFromRank.active').html()+finalCost[0]+" "+$('#creatingFromSpan').text()+" Gems<br /> <img src=\"http://media.blizzard.com/d3/icons/items/large/crafting_looted_reagent_01_demonhunter_male.png\">"+ finalCost[2] + " Death Breath<br /><img src =\"http://www.diablo3wiz.com/32-71-large/800m-diablo-3-normal-mode-gold-usa.jpg\" height=\"75\" width=\"75\">"+finalCost[1]+" gold</h3>");
		}
	});

	//mostly similar code as above, except removing Flawless Royal because Flawless Royal is the highest rank and cannot be upgraded.
	$('#creatingFromDiv').html(creatingFromHTML);
	$(".creatingFromRank[title='Flawless Royal']").remove();
	$(this).on('click', '.creatingFromRank', function() {
		craftingFrom = $(this).attr('title');
		$('.creatingFromRank').removeClass('active').addClass('inactive');
		$(this).removeClass('inactive').addClass('active');
		$('#creatingFromSpan').html("<h3>"+craftingFrom+"</h3>");
		createFromIndex = gemRanks.indexOf($(this).attr('title'));
		if ($('.gemToCreateRank.active').size() == 1 && $('.creatingFromRank.active').size() == 1) {
			finalCost = calculateCost($('#gemToCreateSpan').text() , $('#creatingFromSpan').text());
			finalCost = intMultArray(finalCost, $('#numOfGems').val());
			$('#mats').html("<h3>"+$('.creatingFromRank.active').html()+finalCost[0]+" "+$('#creatingFromSpan').text()+" Gems<br /> <img src=\"http://media.blizzard.com/d3/icons/items/large/crafting_looted_reagent_01_demonhunter_male.png\">"+ finalCost[2] + " Death Breath<br /><img src =\"http://www.diablo3wiz.com/32-71-large/800m-diablo-3-normal-mode-gold-usa.jpg\" height=\"75\" width=\"75\">"+finalCost[1]+" gold</h3>");
		}
	});

	$('#numOfGems').change(function() {
		if ($('.gemToCreateRank.active').size() == 1 && $('.creatingFromRank.active').size() == 1) {
			finalCost = calculateCost($('#gemToCreateSpan').text() , $('#creatingFromSpan').text());
			finalCost = intMultArray(finalCost, $('#numOfGems').val());

			$('creatingFromRank active').html()
			$('#mats').html("<h3>"+$('.creatingFromRank.active').html()+finalCost[0]+" "+$('#creatingFromSpan').text()+" Gems<br /> <img src=\"http://media.blizzard.com/d3/icons/items/large/crafting_looted_reagent_01_demonhunter_male.png\">"+ finalCost[2] + " Death Breath<br /><img src =\"http://www.diablo3wiz.com/32-71-large/800m-diablo-3-normal-mode-gold-usa.jpg\" height=\"75\" width=\"75\">"+finalCost[1]+" gold</h3>");
		}
	})


});


function switchGem(gemToSwitchTo) {
		gemToSwitchTo = gemToSwitchTo.toLowerCase();

		//get current HTML and switch gem names to change the images.
		gemToCreateHTML = $('#gemToCreateDiv').html().replace(gemToSearchRegEx, gemToSwitchTo);
		creatingFromHTML = $('#creatingFromDiv').html().replace(gemToSearchRegEx, gemToSwitchTo);

		//set divs to new html
		$('#gemToCreateDiv').html(gemToCreateHTML);
		$('#creatingFromDiv').html(creatingFromHTML);	

		//set regex for the next time switchGem is called.
		gemToSearchRegEx = new RegExp(gemToSwitchTo, 'g');
}

function calculateCost(wantToCraft, craftingFrom) {

	wantToCraftIndex = gemRanks.indexOf(wantToCraft);
	craftingFromIndex = gemRanks.indexOf(craftingFrom);

	rankDifference = wantToCraftIndex - craftingFromIndex;

	//if rankDifference is 1, just return the upgradeCost.  no further calculations necessary.
	if (rankDifference == 1) {
		return upgradeCosts[craftingFromIndex];
	}
	//incase user clicks a higher rank gem in the createFromDiv than the wantToCreateDiv
	else if(rankDifference<= 0) {
		return [0,0,0];
	}

	else {
		//last step in upgrading cost.  only goldCost information is important
		lastCost = upgradeCosts[wantToCraftIndex-1];
		console.log(lastCost);
		gemCost = lastCost[0];
		goldCost = lastCost[1];

		//Determining Death Breath's Cost
		//If user wants to create a Flawless Royal, the cost will be 1 DB if upgrading from Royal, otherwise it will be 4.  
		if (wantToCraftIndex == 18) {
			if (craftingFromIndex == 17) {
				dbCost = 1;
			}
			else {
				dbCost = 4
			}
		}
		//Want to create a Royal, costs 1 DB
		else if (wantToCraftIndex == 17) {
			dbCost = 1;
		}
		else {
			dbCost = 0;
		}

		//first get the total number of gems
		for (i=0; i<rankDifference-1; i++) {
			var getCost = upgradeCosts[craftingFromIndex+i]; 
			gemCost *= getCost[0];
		}
		finalGemCost = gemCost
		//then get the gold cost.
		for (i=0; i<rankDifference-1; i++) {
			var getCost = upgradeCosts[craftingFromIndex+i]; 
			gemCost /= getCost[0];
			goldCost += gemCost * getCost[1];
		}
		finalCost = [finalGemCost, goldCost, dbCost];
		return finalCost;
	}
}

function intMultArray(arrayToMult, intVar) {
	for (l=0; l<arrayToMult.length; l++) {
		arrayToMult[l] *= intVar;
	}
	return arrayToMult;
}