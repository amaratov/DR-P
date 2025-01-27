const env = process.env.NODE_ENV || "development";
if (env !== "production") {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  require("https").globalAgent.options.rejectUnauthorized = false;
}

let express = require("express");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let config = require("config");
let session = require("express-session");
let helmet = require("helmet");

let db = require("./db/db").init();
let auth = require("./auth/auth");
var df = require("dateformat");

let log = require("npmlog");
log.level = config.get("logLevel");
log.addLevel("debug", 2900, { fg: "green" });
//Object.defineProperty(log, 'heading', { get: () => { return '['+df(new Date(), 'HH:MM:ss.l')+']' } })
log.headingStyle = { bg: "", fg: "white" };

// add timestamps in front of log messages
require("console-stamp")(console, "[HH:MM:ss.l]");
logger.format("mydate", function () {
  return df(new Date(), "HH:MM:ss.l");
});

let app = express();

let logLevel = "dev";
if (config.has("morganLogType")) {
  logLevel = config.get("morganLogType");
}

if (logLevel !== "none") {
  app.use(
    logger(
      "[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms",
      logLevel
    )
  );
}

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.originAgentCluster());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());

let passport = auth.initPassportStrategies(db);

let backendRouter = require("./routes/backendRouter");

app.use(
  session({
    secret: config.get("sessionSecret"),
    resave: false,
    saveUninitialized: true,
    name: "pdx",
    cookie: {
      httpOnly: false,
      secure: false,
      sameSite: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

app.get("/api/version", async function (req, res) {
  var hash = process.env.GITHASH ? process.env.GITHASH : "";
  var pjson = require("./package.json");
  var v = pjson.version;

  var name = pjson.name.replace(/_/g, " ");
  let words = name.split(" ");

  name = "";

  for (let i = 0; i < words.length; i++) {
    if (i > 0) {
      name += " ";
    }
    name += words[i][0].toUpperCase() + words[i].substr(1);
  }

  var version = v;
  if (hash !== "") {
    version += "-" + hash;
  }

  res.json({
    v: v,
    hash: hash,
    version: version,
    name: name,
  });
});

//app.get('/', (req, res) => { res.redirect('/api/version'); });

app.use("/api", backendRouter(log));

const path = require("path");
app.use(express.static(path.join(__dirname, "dist")));
app.use("/preview", express.static("icons"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const fs = require("fs");
  fs.readFile("dist/index.html", "utf-8", (err, content) => {
    if (err) {
      log.error('We cannot open "index.html" file.');
      return next();
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    res.end(content);
  });
});

module.exports = app;
