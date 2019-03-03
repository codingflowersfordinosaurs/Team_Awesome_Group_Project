var config = {
  apiKey: "AIzaSyBEJ9arbT3vnXcQrLp-JzzgZ8WrlSYIjg8",
  authDomain: "alcohol-engine.firebaseapp.com",
  databaseURL: "https://alcohol-engine.firebaseio.com",
  projectId: "alcohol-engine",
  storageBucket: "alcohol-engine.appspot.com",
  messagingSenderId: "504435190757"
};
firebase.initializeApp(config);

var database = firebase.database();

function getCocktailAPI() {
  //need to get the correct value from checkboxes not input
  var searchCategory = $("#category").val();
  console.log(searchCategory);
  var queryURL =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";

  //the ajax call to the cocktaildb api to get the list of drinks by searching with an ingredient
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var results = response.drinks;
    console.log(results);

    var drinkListArray = [];

    results.forEach(result => {
      console.log(result);
      var drinkID = result.idDrink;
      drinkListArray.push(drinkID);
    });
    console.log(drinkListArray);

    drinkListArray.forEach(drink => {
      $.ajax({
        url:
          "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink,
        method: "GET"
      }).then(function(drinkResponse) {
        var results = drinkResponse.drinks[0];
        var IDofDrink = drinkResponse.drinks.idDrink;
        // fullDetailedArray.push(drinkResponse.drinks);
        var ingredientsList = [];
        for (var key in results) {
          if (
            results.hasOwnProperty(key) &&
            key.includes("strIngredient") &&
            results[key] !== ""
          ) {
            var measurementKey = key.replace("strIngredient", "strMeasure");
            var ingredient = {
              name: results[key],
              measurement: results[measurementKey]
            };
            ingredientsList.push(ingredient);
            console.log(ingredientsList);
          }
        }

        console.log("TEST ME", results);
        database.ref(IDofDrink).push({
          strDrink: results.strDrink,
          strCategory: results.strCategory,
          strGlass: results.strGlass,
          strInstructions: results.strInstructions,
          strDrinkThumb: results.strDrinkThumb,
          ingredients: ingredientsList
        });
      });
    });

    //get the first 10 results and write them to the screen
    // for (var i = 0; i < 10; i++) {
    //   var card = $("<div>");
    //   var drinkImage = $("<img>");
    //   var drinkTitle = $("<p>");
    //   card.addClass("card");
    //   drinkImage.attr("src", results[i].strDrinkThumb);
    //   drinkTitle.text(results[i].strDrink)
  });
}
database.ref().on("value", function(snapshot) {
  var results = snapshot.val();
  console.log("LOOK AT THIS", results);

  var recipes = Object.values(results);
  console.log(recipes);

  // for (var property1 in results) {
  //   if (results.hasOwnProperty(property1)) {
  //     string1 = results[property1];
  //     string1.id = property1;
  //     string1.ingredients = [];
  //     recipes.push(string1);
  //     console.log(string1);
  //   }
  // }
  const filteredRecipes = recipes.filter(recipe => {
    var found = recipe.ingredients.find(
      ingredient =>
        ingredient.name ===
        $("#category")
          .val()
          .trim()
    );

    if (found) {
      return recipe;
    }
  });
  console.log(filteredRecipes);
});

$("#submit").on("click", function() {
  database.ref().on("value", function(snapshot) {
    var results = snapshot.val();
    console.log("LOOK AT THIS", results);

    var recipes = Object.values(results);
    console.log(recipes);

    // for (var property1 in results) {
    //   if (results.hasOwnProperty(property1)) {
    //     string1 = results[property1];
    //     string1.id = property1;
    //     string1.ingredients = [];
    //     recipes.push(string1);
    //     console.log(string1);
    //   }
    // }
    const filteredRecipes = recipes.filter(recipe => {
      var found = recipe.ingredients.find(
        ingredient =>
          ingredient.name ===
          $("#category")
            .val()
            .trim()
      );

      if (found) {
        return recipe;
      }
    });
    console.log(filteredRecipes);
  });
});
