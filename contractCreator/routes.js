const impl = require("./impl");
var db = require('../database/models/index');
var client = db.client;
var request = require('request');


module.exports = function (app) {

  app.get('/customContract', isLoggedIn, impl.getCustomContractForm);
  app.get('/stablecoin', isLoggedIn, impl.getStablecoinForm);
  app.get('/ERC223Contract', isLoggedIn, impl.getERC223ContractForm);
  app.get('/erc721Contract', isLoggedIn, impl.getERC721ContractForm);
  app.get('/generatedContract', isLoggedIn, impl.getGeneratedContract);
  app.post("/createERC721", isLoggedIn, coinNameExist, hasPackage1,  impl.createERC721Contract);
  app.post('/createERC20Contract', isLoggedIn, coinNameExist, hasPackage1,  impl.createERC20Contract);
  app.post('/createERC223Contract', isLoggedIn, coinNameExist, hasPackage1,  impl.createERC223Contract);
  app.post('/createUSDCToken', impl.createUSDCToken);
  // app.post("/createERC223ContractNew", buyPackageSuccess, impl.createERC20Contract);


}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');

}

async function coinNameExist(req, res, next) {
  if (req.body.token_symbol == "XDC" || req.body.token_symbol == "XDCE") {
    req.flash('project_flash', "Token Name Already Exist! Please Try Different Name.");
    res.redirect('/customContract');
  } else {
    await db.projectConfiguration.find({
      where: {
        'coinName': req.body.token_name
      }
    }).then(result => {
      // console.log(result,"here")
      if (result == null) {
        return next();
      } else {
        console.log("exist");
        req.flash('project_flash', "Token Name Already Exist! Please Try Different Name.");
        res.redirect('/customContract');
      }
    })
  }
}

// route middleware to check package 1
function hasPackage1(req, res, next) {
  console.log("Here");
  client.find({
    where: {
      'email': req.user.email
    }
  }).then(async result => {
    result.attemptsCount = result.attemptsCount + 1;
    console.log(result.package1,"result.package1")
    await result.save().then(console.log("attmpt added", result.package1));
    // console.log(req,"reqreqreq")
   
    // var options = {
    //   // host: 'http://localhost:4000',
    //   // port: 80,
    //   // path: '/createERC20Contract',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Content-Length': data.length
    //   },
    //   uri:'http://localhost:4000/createERC20Contract',
     
    //   body:req
     
    //   // data: JSON.stringify({ "address": address }),
    // };
    // console.log(options,"optionsoptions")
    // request(options, function(res) {
    //   console.log(res,"res")
    //   console.log('STATUS: ' + res.statusCode);
    //   console.log('HEADERS: ' + JSON.stringify(res.headers));
    //   res.setEncoding('utf8');
    //   res.on('data', function (chunk) {
    //     console.log('BODY: ' + chunk);
    //   });
    // })
    // res.redirect('/createERC20Contract')
    if (result.package1 > 0) {
      console.log(result.package1,"result.package122221111111")
      return next();
    }
     else {
    //   console.log(result.package1,"result.package133333")
      req.flash('package_flash', "You need to buy Package 1 by contributing 50 USD worth of XDCe");
      // impl.createERC20Contract(req,res,false)
      res.redirect('/generatedContract');
            // impl.createERC20Contract(req,res,false)
    }
  });
}

function buyPackageSuccess(req, res, next) {
  console.log("Here1111"); 
     return next();
}

