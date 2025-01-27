var buildStatic = function(db, router, auth){
    router.post('/', auth.requireLoggedIn, function(req, res, next){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.json({status: 'Logged out'});
          });
    });

    return router;
}


var buildDynamic = function(db, router, auth){
    return router;
}

module.exports = {
    buildStatic: buildStatic,
    buildDynamic: buildDynamic
};