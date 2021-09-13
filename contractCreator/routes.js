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
  // app.post('/createERC223Contract', isLoggedIn, coinNameExist, hasPackage1,impl.createERC20Contract,  impl.createERC223Contract);

  app.post('/createERC223Contract',hasPackage1, impl.createERC20Contract);
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
  // Object.keys(a).length;
if(Object.keys(req.body).length >0) {
  console.log("Here", Object.keys(req.body).length,"Hereeee");
  req.session.reqObj=req.body;
  // req.session=req.session;
}
console.log("Here1", typeof req,"Hereeee1");
  // console.log("Here", Object.keys(req.body).length,"Hereeee");
  // req.session.reqObj=req.body;
  client.find({
    where: {
      'email': req.user.email
    }
  }).then(async result => {
    result.attemptsCount = result.attemptsCount + 1;
    // console.log(result,"resultresultresultresultresult")
    await result.save().then(console.log("attmpt added", result.package1));
    // console.log(req,"reqreqreq")
   
    // res.redirect('/createERC20Contract')
    if(Object.keys(req.body).length <= 0) {
      impl.createERC20Contract(req,req.session.reqObj,res)
      // return next();
    }
    // if (result.package1 > 0) {
    //   console.log(result.package1,"result.package122221111111")
    //   return next();
    // }
    //  else {
    //   console.log(result.package1,"result.package133333")
      req.flash('package_flash', "You need to buy Package 1 by contributing 50 USD worth of XDCe");
      // impl.createERC20Contract(req,res,false)

      res.redirect('/generatedContract');
      // req.session.isPackagePurchased = false;
      // req.session.reqData = req;
      // req.session.user= req.user;
      // // req.session.address= address,
      // // ProjectConfiguration: projectArray,
      // req.session.contract= req.contract,
     
      // req.session.coinSymbol = req.body.token_symbol;
      // req.session.coinName=  req.body.token_name;
            // impl.createERC20Contract(req,res,false)
    // }
  });
}

function hasPackage2(req, res, next) {
  console.log("Here2222222222222222", req,"ooooooooooooooooooooooo");
  client.find({
    where: {
      'email': req.user.email
    }
  }).then(async result => {
    result.attemptsCount = result.attemptsCount + 1;
    await result.save().then(console.log("attmpt added", result.package1));

      return next();
    
  });
}
function buyPackageSuccess(req, res, next) {
  console.log("Here1111"); 
     return next();
}

