const auth = {};
const atob = require('atob');
const jwt = require('jsonwebtoken')
const config = require('config');
auth.passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;

const notFound = "Not Found";
const notAuthorized = "Not Authorized";


auth.initPassportStrategies = function(db){
    auth.passport.use('json', new JsonStrategy(
        async function(username, password, done) {
            let user = await db.User.findOne({ where:{email: username, archived: false }});
                //if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.correctPassword(password)) { return done(null, false); }
            let userRole = await user.getFullRole();
            
            const sessionUser = JSON.parse(JSON.stringify(user));
            sessionUser.role = userRole;
            
            delete sessionUser.password;
            delete sessionUser.salt;
            delete sessionUser.archived;
            delete sessionUser.resetCode;
            delete sessionUser.resetExpiry;
            delete sessionUser.createdBy;
            delete sessionUser.createdAt;
            delete sessionUser.updatedAt;

            const token = jwt.sign({
                ...sessionUser,
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                }, config.get('jwtSecret'));

            sessionUser.jwt = token;
            
            return done(null, sessionUser);
        }));
    return auth.passport;
    
}

let env = process.env.NODE_ENV || 'development';

auth.requireLoggedIn = async function(req, res, next){
    let user = null;
    if (!req.user){
        if (!req.headers.authorization) {
            res.status(401);
            return res.json({error: notAuthorized});
        }else{
            let bearer = req.headers.authorization;
            if (bearer.indexOf("Bearer ") !== 0){
                res.status(401);
                return res.json({error: notAuthorized});
            }
            let tok = bearer.substring("Bearer ".length);
            try{
                var decoded = jwt.verify(tok, config.get('jwtSecret'));
                if (auth.isTokenExpired(decoded.exp)){
                    res.status(401);
                    return res.json({error: notAuthorized});
                }
                user = decoded;
                delete user.iat;
                delete user.exp;
            }catch(e){
                res.status(401);
                return res.json({error: notAuthorized});
            }   
        }
    }else{
        user = req.user;
    }
    
    if (user.jwt){
        try{
            var decoded = jwt.verify(tok, config.get('jwtSecret')); 
            let fiveFromNow = new Date( (new Date(0)).getTime() + 5 * 60000);

            let exp = new Date(0);
            exp.setUTCSeconds(jwtExp);

            if (fiveFromNow > exp){
                delete user.jwt;
                const token = jwt.sign({
                    ...user,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                }, config.get('jwtSecret'));
                user.jwt = token;
            }
        }catch(e){
        }
    }
    if (!req.session){
        req.session = {};
    }
    if (!req.session.passport){
        req.session.passport = {};
    }
    req.session.passport.user = user
    next();
}

auth.requireRole = function(role){
    return async function(req, res, next){
        if (!req.user){
            res.status(401);
            return res.json({error: notAuthorized});
        }
        if (!req.user.role){
            res.status(404);
            return res.json({error: notFound});
        }
        if (!req.user.role.name){
            res.status(404);
            return res.json({error: notFound});
        }
        if (req.user.role.name === 'admin'){
            return next();
        }
        if (!req.user.role.name === role){
            res.status(404);
            return res.json({error: notFound});
        }
        next()
    }
}

auth.hasRoleIn = function(roles, user){
    //console.log("HI!", roles, user);
    if (!user || !user.role){
        return false;
    }
    if (user.role.name === 'admin'){
        return true;
    }
    if (roles.indexOf(user.role.name) === -1){
        return false;
    }
    return true;
}

auth.requireRoleIn = function(roles){
    return function(req, res, next){
        if (!req.user){
            res.status(401);
            return res.json({error: notAuthorized});
        }
        let hasRole = auth.hasRoleIn(roles, req.user);
        if (!hasRole){
            res.status(404);
            return res.json({error: notFound});
        }
        return next();
    }
}

auth.requireAdmin = async function(req, res, next){
    if (!req.user){
        res.status(401);
        return res.json({error: notAuthorized});
    }
    let hasAdminRole = auth.hasRoleIn(['admin'], req.user);
    if (!hasAdminRole){
        res.status(404);
        return res.json({error: notFound});
    }
    next();
}

auth.isTokenExpired = function(jwtExp){
    //calculate if a jwt token is expired.
    let currDate = new Date();

    let exp = new Date(0);
    exp.setUTCSeconds(jwtExp);

    return (currDate > exp);
}

module.exports = auth