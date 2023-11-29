require('../models/database');
const { trusted } = require('mongoose');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



// /**
//  * GET / categories 
//  * HOMEPAGE 
//  */





    // try{
    
    // const limitNumber = 5;
    // const Categories = await Category.find({}).limit(limitNumber);

    // res.render('index', { title : 'Recipe Book MERN Application ' , categories} );  
    // } catch (error) {
    //     res.status(500).send({message: error.message || "error occurred"} );
    // } 

    /**
     
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
    try {
      const limitNumber = 5;
      const categories = await Category.find({}).limit(limitNumber);


      const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
       const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
       const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
       const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
       const indian = await Recipe.find({ 'category': 'Indian' }).limit(limitNumber);
       const spanish = await Recipe.find({ 'category': 'Spanish' }).limit(limitNumber);


      const food = { latest , thai , american , chinese , indian , spanish };
    
      res.render('index', { title: 'Cooking Recipes - Home ', categories , food} );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }



exports.exploreCategories = async(req , res) => {
   
   try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories' , { title: 'Cooking Recipes - view all categories ' , categories});
   } catch (error) {
    res.status(500).send( { message: error.message || "error occurred"})
   }

}


/** get / categories /:id
 * categories by id 
 */

exports.exploreCategoriesById = async(req , res) => {
   
  try {

   let categoryId = req.params.id; 
   const limitNumber = 20;
   const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
   res.render('categories' , { title: 'Cooking Recipes - view all categories ' , categoryById});
  } catch (error) {
   res.status(500).send( { message: error.message || "error occurred"})
  }

}




/* GET /recipe/:id
*recipe 
*/

exports.exploreRecipe = async(req , res) => {
   
  try {
  

  let recipeId = req.params.id;

  const recipe = await Recipe.findById(recipeId);
   
   res.render('recipe' , { title: 'Cooking Recipes - view recipes' , recipe});
  } catch (error) {
   res.status(500).send( { message: error.message || "error occurred"})
  }

}



/* POST / search 
*recipe 
*/

exports.searchRecipe = async(req  , res) => {

   // searchTerm 
   try {

    let searchTerm = req.body.searchTerm;

    let recipe = await Recipe.find(  {  $text:   {  $search:  searchTerm,   $diacriticSensitive: true}});

    // res.json(recipe)

    res.render('search', { title: "Cooking Recipes : search ", recipe}); 

   } catch(error) {
    res.status(500).send({message: error.message ||  "error occurred"});
   }


  res.render('search'  , { title : 'Cooking recipes : by chef sanjeev kapoor search'});
}


/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking recipes - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking recipes  - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  

  const infoErrorsObj = req.flash('infoerrors');
  const infoSubmitObj = req.flash('inforSubmit');

  res.render('submit-recipe', { title: 'Cooking Recipes  - Submit' , infoErrorsObj , infoSubmitObj} );
}



/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }



    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    //res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


































// async function insertDymmyCategoryData() {

//     try 
//     {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai recipes.jpg"
//             },

//             {
//                 "name": "American",
//                 "image": "american recipes.jpg"
//             },

//             {
//                 "name": "Chinese",
//                 "image": "chinese recipes.jpeg"
//             },


//             {
//                 "name": "Mexican", 
//                 "image": "mexican food.jpg"
//             },


//             {
//                 "name": "Indian", 
//                 "image": "Indian-Dinner-Recipes.jpg"
//             },

//             {
//                 "name":"Spanish",
//                 "image": "spanish food.jpeg"
//             },

//         ]);
//     } catch(error){
//        console.log('err', + error);
//     }
// }

//insertDymmyCategoryData();



// async function insertDymmyRecipeData() {

//   try 
//   {
//       await Recipe.insertMany([
        
//           {
//             "name": "Leftover Rice PANCAKES",
//             "description": 'This is a great way to use leftover rice. This Leftover Rice Pancake is a good option for breakfast, all you have to do is prepare a batter by adding egg, flour, butter and some essential ingredients to the Leftover Rice. After that prepare a delicious pancake from it.',
//             "email": "vanshikapahuja@gmail.com",
//             "ingredients": [
//               "1 Cup leftover cooked rice1",
//               "cup all-purpose flour1",
//               "tbsp granulated sugar1",
//               "tsp baking powder",
//               "1/2 tsp baking soda",
//               "1/4 tsp salt1",
//               "cup buttermilk/milk1",
//               "large egg2",
//               " tbsp melted butter/oil1",
//               "tbsp vanilla extract",
//             ],
//             "category": "American",
//             "image": "leftover-rice-pancake.jpeg"
//           },
          



//         { 
//           "name": "Thai Curry Noodle Soup",
//            "description": 'The evenings are dark and the weather’s turned cold… thankfully, with this warming, comforting and flavour-packed Thai curry, Shannon Bennett, has the perfect dish to enjoy curled up on the sofa. ',
//          "email": "vanshikapahuja@gmail.com",
//          "ingredients": [
//            "2 tbs coconut oil",
//            "2 large desiree potatoes, peeled, cut into 4cm chunks",
//            "1 onion, thinly sliced",
//            "1/2 cup (150g) yellow curry paste",
//            "800ml coconut milk",
//            "2 cups (500ml) chicken stock",
//            "1/4 cup (60ml) fish sauce",
//            "1/2 tsp brown sugar",
//            "Juice of 1 lime",
//            "600g skinless chicken thigh fillets",
//            "200g dried rice noodles, cooked according to packet instructions",
//            "2 cups baby spinach",
//            "1 long red chilli, thinly sliced",
//            "Thai basil leaves plus coriander leaves, to serve",
//           ],
//          "category": "Thai", 
//           "image": "thai-curry-noodle-soup.jpeg"
//         },

//         { 
//           "name": "Pork carnitas",
//            "description": 'Enjoy tender shredded pork on corn tortillas with salsa and chopped coriander. This recipe is inspired by the staple Mexican dish and is easy to make at home ',
//          "email": "vanshikapahuja@gmail.com",
//          "ingredients": [
//           "1½ tbsp vegetable oil",
//           "2 red onions, roughly chopped",
//           "1 whole garlic bulb, cut in half",
//           "2 tsp dried oregano",
//           "2 tsp ground cumin",
//           "1 tsp chilli powder",
//           "2 bay leaves",
//           "4 limes, juiced (reserve the squeezed halves of 3 limes)",
//           "2 oranges, juiced (reserve the squeezed halves)",
//           "4 tbsp light brown soft sugar",
//           "700ml beef stock",
//           "1kg pork shoulder",
//           "1 onion, roughly chopped",
//           "corn tortillas, chopped coriander and salsa, to serve",
//           ],
//          "category": "Mexican", 
//           "image": "pork-carnitos.jpeg"
//         },

//         { 
//           "name": "Copycat Panda Express Chow Mein",
//            "description": `You can make this Panda Express menu favorite at home in less time than it’d take you to load in the car and hit the drive thru. Even better, you can customize our copycat chow mein easily by adding in any favorite veggies you have on hand. If you want to bulk this easy noodle dish into an entree, add your protein of choice—leftover chicken, shrimp, or a freshly fried egg would all make great additions (and they won’t cost extra).`,
//          "email": "vanshikapahuja@gmail.com",
//          "ingredients": [
//           "3 tablespoons canola oil",
//           "1 tablespoon sesame oil",
//           "1/2 white onion, finely chopped",
//           "2 stalks celery, sliced",
//           "1 tablespoon chopped fresh ginger",
//           "3 cups shredded coleslaw mix",
//           "5 ounces bean sprouts",
//           "1 (7.1 ounce) package pre-cooked stir-fry noodles",
//           "1/4 cup tamari",
//           "2 tablespoons mirin",
//           ],
//          "category": "Chinese", 
//           "image": "copycat-panda-express-chowmein.jpeg"
//         },

//         { 
//           "name": "Chickpea Tikka Masala",
//            "description": `Chickpea tikka masala is a classic Indian curry where chickpeas are cooked in a flavorful creamy sauce. Serve over basmati rice or with naan..`,
//          "email": "vanshikapahuja@gmail.com",
//          "ingredients": [
//           "1 tablespoon olive oil",
//           "1 medium onion, thinly sliced",
//           "2 carrots, thinly sliced",
//           "1 teaspoon garam masala",
//           "1/4 teaspoon ground cumin",
//           "1/8 teaspoon freshly ground black pepper",
//           "1 tablespoon tomato paste",
//           "1 1/2 teaspoons ginger paste",
//           "1/2 teaspoon garlic paste",
//           "1/2 medium fresh jalapeño chile pepper, finely chopped",
//           "2 (15-ounce) cans chickpeas, rinsed and drained",
//           "1 (8 ounce) can tomato sauce",
//           "1/4 teaspoon sugar",
//           "1/4 teaspoon salt",
//           "1/8 teaspoon cayenne pepper (optional)",
//           "3/4 cup water, or as needed",
//           "1/4 cup half and half",
//           "1/4 cup snipped fresh cilantro",
//           "4 cups hot cooked basmati rice",
//           ],
//          "category": "Indian", 
//           "image": "copycat-panda-express-chowmein.jpeg"
//         },



//         { 
//           "name": "Spanish torilla",
//            "description": `Not only are they way easier to prep than raw potatoes (no mandoline needed!) they also impart the delicious fried flavor that is typical in a classic tortilla. Be sure to look for thin cut varieties like Lays or Cape Cod over thicker cuts like Kettle ChipsWith the addition of rosemary, this simple frittata is much greater than the sum of its parts. Topped with garlicky, lemony sour cream sauce, it's downright delicious.`,
//           "email": "vanshikapahuja@gmail.com",
//           "ingredients": [
//             "8 large eggs, beaten",
//             "4 oz. thin-cut potato chips",
//             "1 tbsp. freshly chopped rosemary",
//             "Kosher salt",
//             "Freshly ground black pepper",
//             "2 tbsp. olive oil",
//             "1 garlic clove, halved",
//             ],
//           "category": "Spanish", 
//           "image": "spanish-torilla.jpg"
//         },
//       ]);
//   } catch(error){
//      console.log('err', error);
//   }
// }

// insertDymmyRecipeData();