var buildStatic = function(db, router, auth){
    router.post('/', auth.passport.authenticate('json'), function(req, res, next){
        return res.json({status: 'Logged in'});
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