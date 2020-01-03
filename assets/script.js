var firebaseConfig = {
    apiKey: "AIzaSyBufhI3DF63sZuqtKWhmNMBBeDXDFhq5bU",
    authDomain: "whats-for-dinner-e745a.firebaseapp.com",
    databaseURL: "https://whats-for-dinner-e745a.firebaseio.com",
    projectId: "whats-for-dinner-e745a",
    storageBucket: "whats-for-dinner-e745a.appspot.com",
    messagingSenderId: "290069514662",
    appId: "1:290069514662:web:e28fcfe875a8334c542767",
    measurementId: "G-F50Y95R11R"
};


// vars to hold search options
var protein = ["chicken", "turkey", "beef", "pork", "fish", "shellfish", "tofu/soy", "egg", "other beans"]
var dietOptions = ["balanced", "high-protein", "low-fat", "low-carb"];
var healthOptions = ["vegan", "vegetarian", "sugar-conscious", "peanut-free", "tree-nut-free", "alcohol-free"];
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var activities = ["Education", "Recreational", "Social", "DIY", "Charity", "Cooking", "Relaxation", "Music", "Busywork"];
var lastSearch;
var recipesAvail = [];
var lastRecipes = [];
var searchResults = [];
var shoppingList = [];
var lastActivities = [];
var activitySearchResults = [];

function initApp() {
    //get previous responses from local storage
    if (localStorage.getItem("interestedFoods") !== null) {
        interestedFoods = JSON.parse(localStorage.getItem("interestedFoods"));
    }
    if (localStorage.getItem("dietOptionsUsed") !== null) {
        dietOptionsUsed = JSON.parse(localStorage.getItem("dietOptionsUsed"));
    }
    if (localStorage.getItem("healthOptionsUsed") !== null) {
        healthOptionsUsed = JSON.parse(localStorage.getItem("healthOptionsUsed"));
    }
    if (localStorage.getItem("activitiesUsed") !== null) {
        activitiesUsed = JSON.parse(localStorage.getItem("activitiesUsed"));
    }
    if (localStorage.getItem("lastSearch") !== null) {
        console.log("last search was: " + localStorage.getItem("lastSearch"));
        lastSearch = localStorage.getItem("lastSearch");
        if (moment(lastSearch).isBefore(moment().subtract(7, 'days'))) {
            console.log("let's search again");
            searchEdamam();
            searchActivity();
        }
        else {
            lastRecipes = JSON.parse(localStorage.getItem("lastRecipes"));
            lastActivities = JSON.parse(localeStorage.getItmes("lastActivities")) ;
            console.log("let's use our previous " + lastRecipes.length + " search results: " + lastRecipes);
            createPrevMenu();
        }
    }
    if (localStorage.getItem("shoppingList") !== null) {
        shoppingList = JSON.parse(localStorage.getItem("shoppingList"));
    }
}

$(document).on("click", ".pref-btn", function () {
    proteinDiv.empty();
    healthDiv.empty();
    dietDiv.empty();
    activityDiv.empty();

    //display the preference options for the health key
    for (var i = 0; i < protein.length; i++) {
        var label = $("<label>");
        proteinDiv.append(label);
        var input = $("<input>");
        input.addClass("uk-checkbox");
        input.addClass("uk-checkbox modal-checkbox");
        input.attr("type", "checkbox");
        input.attr("data-protein", protein[i]);
        if (interestedFoods.indexOf(protein[i]) !== -1) {
            input.attr("checked", "");
        }
        label.append(input);
        label.append(protein[i]);
        label.append($("<br>"));
    }

    for (var i = 0; i < healthOptions.length; i++) {
        var label = $("<label>");
        healthDiv.append(label);
        var input = $("<input>");
        input.addClass("uk-checkbox");
        input.addClass("uk-checkbox modal-checkbox");
        input.attr("type", "checkbox");
        input.attr("data-health", healthOptions[i]);
        if (healthOptionsUsed.indexOf(healthOptions[i]) !== -1) {
            input.attr("checked", "");
        }
        label.append(input);
        label.append(healthOptions[i]);
        label.append($("<br>"));
    }

    for (var i = 0; i < dietOptions.length; i++) {
        var label = $("<label>");
        dietDiv.append(label);
        var input = $("<input>");
        input.addClass("uk-checkbox");
        input.addClass("uk-checkbox modal-checkbox");
        input.attr("type", "checkbox");
        input.attr("data-diet", dietOptions[i]);
        if (dietOptionsUsed.indexOf(dietOptions[i]) !== -1) {
            input.attr("checked", "");
        }
        label.append(input);
        label.append(dietOptions[i]);
        label.append($("<br>"));
    }

    for (var i = 0; i < activities.length; i++) {
        var label = $("<label>");
        activityDiv.append(label);
        var input = $("<input>");
        input.addClass("uk-checkbox");
        input.addClass("uk-checkbox modal-checkbox");
        input.attr("type", "checkbox");
        input.attr("data-activity", activities[i]);
        if (activitiesUsed.indexOf(activities[i]) !== -1) { //need to add activitiesUsed
            input.attr("checked", "");
        }
        label.append(input);
        label.append(activities[i]);
        label.append($("<br>"));
    }
});
// var li2 = ($("<li>").text("test")); //cant do it here cause it keeps appending to this one
// function createActivityList() { //only appends on first div card regardless, need to add class to button maybe and append uniquely
//     // var li2 = ($("<li>")); 
//     console.log("start");
//     for (i = 0; i < activities.length; i++) {
//         var atag = $("<a>").attr("href", "#").attr("id", "choiceDrop").text(activities[i]); //replace href later with a class to register click event?
//         li2.append(atag);
//     }
//     console.log("end");

// }


function createMenuFramework() {
    //clear previous display
    $("#weekdisplay").empty();
    //add the button to refresh the menu
    $("#weekdisplay").append($("<button>").attr("class", "uk-button uk-button-default uk-align-center uk-width-1-2 menu-update").text("Refresh my menu"));

}

function makeCard(data, activity, day) {
    var newCard = $("<div>").attr("class", "uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin").attr("uk-grid", "").attr("uk-scrollspy", "cls: uk-animation-slide-right; repeat: true");
    
    //add image of recipe
    var picDiv = $("<div>").attr("class", "uk-card-media-left uk-cover-container");
    picDiv.append($("<img>").attr("src", data.image).attr("alt", data.label).attr("uk-cover", ""));
    picDiv.append($("<canvas>").attr("width", "600").attr("height", "400"));
    newCard.append(picDiv);
    
    //add body of card
    var simpDiv = $("<div>");
    var cardBody = $("<div>").attr("class", "uk-card-body");
    
    //add card title
    var cardTitle = $("<h3>").attr("class", "uk-card-title").text(day + ": " + data.label);
    var recipeSrc = $("<p>").attr("class", "uk-text-meta uk-margin-remove-top").html("See the full recipe at: <a href=" + data.url + ">" + data.source + "</a>");
    //add buttons for favorites and swaps
    var favBtn = $("<button>").attr("class", "uk-icon-button uk-margin-small-right favorite-btn").attr("recipe-data", data.uri).attr("uk-tooltip", "title: Save to favorites; pos: top").attr("uk-icon", "heart");
    var swapBtn = $("<button>").attr("class", "uk-icon-button swap-btn").attr("recipe-data", data.uri).attr("uk-tooltip", "title: Swap this recipe; pos: top").attr("uk-icon", "refresh");

    //set up the ul for the ingredient list
    var ul = $("<ul>").attr("class", "uk-list uk-list-divider");
    //add ingredients
    for (var j = 0; j < data.ingredientLines.length; j++) {
        var li = $("<li>").text(data.ingredientLines[j]);
        ul.append(li);
        li.append($("<button>").attr("ingred-data", data.ingredientLines[j]).attr("class", "uk-icon-button uk-margin-small-left shopping-btn").attr("uk-tooltip", "title: Add to shopping list; pos: top").attr("uk-icon", "cart"));
    }
       
        //creates button
        // var activeSelect = $("<button>").attr("id", "activity").attr("class", "uk-button uk-button-primary").text("Choose Activity");
        // var selections = $("<div>").attr("uk-dropdown", "");
        // //iterates through activities array to create dropdown
        // var ul2 = ($("<ul>").attr("class", "uk-nav uk-dropdown-nav"));
        // // ul2.append(createActivityList());
        // var li2 = ($("<li>"));

        // li2.append(atag)
        // ul2.append(li2);
        // selections.append(ul2);

        // //appends the button within the div
        // cardBody.append(activeSelect).append(selections); //could append to cardBody OR newCard
        //needs to store the value from click to pass to API
        //pulls from bored api to return an activity from the dropdown selection

    cardBody.append(cardTitle);
    cardBody.append(recipeSrc);
    cardBody.append(favBtn);
    cardBody.append(swapBtn);
    cardBody.append(ul);
    simpDiv.append(cardBody);
    newCard.append(simpDiv);
    $("#weekdisplay").append(newCard);
}

function createNewMenu(response) {

    createMenuFramework();
    for (var h = 0; h < searchResults.length; h++) {
        recipesAvail.push(h);
    }
    //loop through the response JSON and add the recipes
    for (var i = 0; i < days.length; i++) {
        
        //get random recipe from available options
        var arrPos = Math.floor(Math.random() * recipesAvail.length);
        var recipeNum = recipesAvail[arrPos];
        recipesAvail.splice(arrPos, 1);

        //create card div
        makeCard(searchResults[recipeNum], activitySearchResults[i], days[i]);
        lastRecipes.push(searchResults[recipeNum]);
    }
    localStorage.setItem("lastRecipes", JSON.stringify(lastRecipes));
};

function createPrevMenu(){
    createMenuFramework();
    for (var i = 0; i < days.length; i++) {
        makeCard(lastRecipes[i], lastActivities[i], days[i]);
    }
}

function saveFavorites(){
    console.log("Save this to favorites: ", $(this).attr("recipe-data"));
}

function swapRecipe() {
    console.log("Swap this recipe: ", $(this).attr("recipe-data"));
}

function createList(){
    console.log("Add this ingredient to the shopping list: ", $(this).attr("ingred-data"));
    shoppingList.push($(this).attr("ingred-data"));
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

function emptyList(){
    $("#my-shopping-list").empty();
    shoppingList = [];
    localStorage.removeItem("shoppingList");
}


$(document).on("click", ".shop-list-btn", function() {
    //empty the shopping list div
    $("#my-shopping-list").empty();
    console.log(shoppingList);
    //loop through to create li's
    if (shoppingList.length >= 1){
        for (var i = 0; i < shoppingList.length; i++){
            $("#my-shopping-list").append($("<li>").text(shoppingList[i]));
        };
    }
    else {
        $("#my-shopping-list").append($("<li>").text("Your shopping list is currently empty. Select items from the weekly menu to add to your shopping list."));
    }
      
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
initApp();

$("#open").on("click", function () {
    UIkit.modal("#sign-in").show();
    console.log(UIkit.modal("#sign-in"));
});

$(".save-prefs").on("click", retrieveData);

$(".menu-update").on("click", searchEdamam);

$(".favorite-btn").on("click", saveFavorites);

$(".swap-btn").on("click", swapRecipe);

$(".shopping-btn").on("click", createList);

$(".empty-list").on("click", emptyList);
