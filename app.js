
// *********************************************
/*                  PRE CONFIG                */

var express             = require('express');
var bodyParser          = require('body-parser');
var expressValidator    = require('express-validator');

var path                = require('path');
var app                 = express();

const fetchIP = require("ipinfo");


// *********************************************
/*                  APP CONFIG                */

app.set('port',             3000);
app.set('view engine',      'ejs');


// *********************************************
/*                  MIDDLEWARE                */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressValidator());

// *********************************************
/*                  GLOBAL VARS               */

app.use(function(req, res, next)
{
    res.locals.errors = null;
    next();
});

// *********************************************
/*                     ROUTING                */

app.get('/', function(req, res)
{
        res.render('index',
        {
            title   :   'IP Lookup'
        });
});

app.post('/lookup', function(req, res)
{

    req.checkBody('ip',  'IP is required to return information.'   ).notEmpty();

    var errors = req.validationErrors();

    if(errors)
    {
        res.render('index',
        {
            title   : 'IP Lookup',
            errors  : errors
        });
    }
    else
    {
        fetchIP(req.body.ip, function (error, response)  {
            
                console.log(error || response);
                if(error) { console.log(error) } else
                res.render('results',
                {
                    title   : 'Results',
                    results : response,
                    errors  : errors
                });
            });
    }
});

// *********************************************
/*                  APP LAUNCH                */

app.listen(app.get('port'), function()
{
    console.log('IP lookup tool is live at localhost:' + app.get('port'));
});
