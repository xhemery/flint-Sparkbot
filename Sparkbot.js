var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var Restify = require('restify');
var server = Restify.createServer();
var google = require('google')
//Lets require/import the HTTP module
var http = require('http');
var httpport =8088;

var Client = require('google-images');

var clientgoogle = Client('######','############');

google.resultsPerPage = 1
var nextCounter = 0
server.use(Restify.bodyParser());

// flint options
var config = {
  webhookUrl: 'http://####:8080/flint',
  token: '#################',
  port: 8080,
  webhookSecret:'######'
};

// init flint
var flint = new Flint(config);
flint.start();

// define restify path for incoming webhooks
server.post('/flint', webhook(flint));


//Create a web restify server for API
//var restify = require('restify');
//var webserver = restify.createServer({
//  name: 'myapp',
 // version: '1.0.0'
//});

var SKCTEST = {Num:"0", Name:"SKC Test", TeamID:"#######"};
var SKCWX = {Num:"1", Name:"SKC Workforce Experience", TeamID:"#######"};
var SKCNGM = {Num:"2", Name:"SKC Next Gen Meeting", TeamID:"########"};
var SKCCX = {Num:"3", Name:"SKC Customer Experience", TeamID:"########"};
var SKCIOT = {Num:"4", Name:"SKC Digitisation - IOT", TeamID:"#########"};
var SKCAP = {Num:"5", Name:"SKC Applications Platform", TeamID:"###########"};
var SKCSDNP = {Num:"6", Name:"SKC Software Defined Networking Platforms", TeamID:"#######"};
var SKCHCP = {Num:"7", Name:"SKC Hybrid Cloud Platform", TeamID:"#######"};
var SKCSC = {Num:"8", Name:"SKC Security & Compliance", TeamID:"#######"};
var SKCDNA = {Num:"9", Name:"SKC DNA", TeamID:"######"};
var SKCTSS = {Num:"10", Name:"SKC TSS", TeamID:"########"};
var SKCAS = {Num:"11", Name:"SKC Advanced Services", TeamID:"######"};

var skcarray = [SKCTEST,SKCWX,SKCNGM,SKCCX,SKCIOT,SKCAP,SKCSDNP,SKCHCP,SKCSC,SKCDNA,SKCTSS,SKCAS];


function functiontofindTeamIDByKeyValue(arraytosearch, keysearch, valuetosearch, keyreturn) {

    for (var i = 0; i < arraytosearch.length; i++) {
    if (arraytosearch[i][keysearch] == valuetosearch) {
    return arraytosearch[i][keyreturn];
    }
    }
    return null;
    }


function skcrespond(req, res, next) {
    ////console.log("req.params.SKCNum:" + req.params.SKCNum);
    ////console.log("req.params.Customer:" + req.params.Customer);
	////console.log("req.params.Advisor:" + req.params.Advisor);
    ////console.log("req.params.CSE" + req.params.CSE);
	////console.log("req.params.AM" + req.params.AM);
	////console.log("req.params.SE" + req.params.SE);
	////console.log("req.params.RSM" + req.params.RSM);

    
	//find SKC id in array of objects
	//return SKC TeamID
	//Do the magic
	var Team = functiontofindTeamIDByKeyValue(skcarray, "Num", req.params.SKC, "TeamID");
	var Name = functiontofindTeamIDByKeyValue(skcarray, "Num", req.params.SKC, "Name");

	//console.log(Team);
	//console.log(Name);
	flint.spark.teamRename(Team,Name);
	flint.spark.teamRoomAdd(Team,String.fromCharCode(55357, 56787)+' SKC: ' + req.params.SKCNum + ' - ' + req.params.Customer + ' - DealID: ' + req.params.DealID)
		.then(function(room) {
			////console.log(room.title);
			////console.log(room.id);
			flint.spark.membershipAdd(room.id, req.params.Assigned, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.membershipAdd(room.id, req.params.PSS, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.membershipAdd(room.id, req.params.AM, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.membershipAdd(room.id, req.params.SE, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.membershipAdd(room.id, req.params.CSE, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.membershipAdd(room.id, req.params.RSM, true)
				.then(function(membership) {
					////console.log(membership.id);
					});
			flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'Bienvenue dans cette salle Spark. '
				});
			flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'Ressource affectée: ' + req.params.Assigned +' '+ req.params.PSS
				});	
			flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'AM: ' + req.params.AM
				});
			flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'SE: ' + req.params.SE
				});
			flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'Guide d'+String.fromCharCode(39)+'utilisation du bot SKC #######'
				});
		flint.spark.messageSendRoom(room.id, 
				{ 
					//text: 'Hello!',
					text: 'Description de la requête : ' + req.params.Description
				});			
		});
	
	res.end('Path Hit: ' + req.url);
};

//webserver.get('/echo/:SKCNum/:Customer/:Advisor/:CSE/:AM/:SE/:RSM', skcrespond);
//webserver.use(restify.queryParser());
server.get('/api/:SKC/:SKCNum/:Customer/:DealID/:Assigned/:PSS/:AM/:SE/:RSM/:Description', skcrespond);
server.use(Restify.queryParser());


//webserver.listen(httpport, function(){
    //Callback triggered when server is successfully listening. Hurray!
    ////console.log("Server listening on: http://localhost:%s", httpport);
//});


// start restify server
server.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
  ////console.log('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});


flint.hears('/', function(bot, trigger) {
	////console.log('heard hello');
   bot.say('Hello %s!', trigger.personDisplayName);
});

flint.hears('/hello', function(bot, trigger) {
	////console.log('heard hello');
   bot.say('Hello %s!', trigger.personDisplayName);
});

// remove a person or people from room by email
flint.hears('/help', function(bot, trigger) {
bot.say('/echo: repeat ');
bot.say('/add: add a single user by email');
bot.say('/rem: remove a single user by email');
//bot.say('/brexit: removes all users and kills room, use with caution, you have been warned');
bot.say('/room: create new room with following users by email');
bot.say('search: no need for /, search a topic on google image');

});

// echo test
flint.hears('/echo', function(bot, trigger) { 
  ////console.log("echo");
  bot.say(trigger.args.join(' '));
});

// add a person or people to room by email
flint.hears('/add', function(bot, trigger) {
  var email = trigger.args;
  if(email) bot.add(email);
});

// remove a person or people from room by email
flint.hears('/rem', function(bot, trigger) {
  var email = trigger.args;
  if(email) bot.remove(email);
});

// remove everybody then itself from room by email
flint.hears('/brexit', function(bot, trigger) {
	// console.log("Big Bang");
	bot.implode();
});

// create a new room with people by email
flint.hears('/room', function(bot, trigger) {
  if(trigger.args.length > 0) {
    // add the person who typed command
    trigger.args.push(trigger.person.emails[0]);
    // create room with people
    bot.room(trigger.person.displayName + '\'s Room', trigger.args);
  }
});



// anytime someone says beer
flint.hears(/(^| )search( |.|$)/i, function(bot, trigger) {
  // console.log("search");
  //bot.say('Enjoy a beer, %s!', trigger.person.displayName);
  //console.log('textesearched :'+trigger.args);
  var textsearched = trigger.args;
  //var trimmedtext = textsearched.replace(/ /g,'');
  //console.log('trimmedtext :'+trimmedtext);

	var url = 'https://www.googleapis.com/customsearch/v1?key=####'+textsearched+'&searchType=image&safe=high';
	var request = require('request');
	request(url,function(error, response, result){
		if(!error){
		//console.log('result'+result);
			jsondata = JSON.parse(result);
			//console.log('result jsonparsed');
			//console.log(jsondata);
			//console.log('item 0');
			//console.log(jsondata.items[0].link);
			//console.log(jsondata.kind);
			//for (var i = 0; i < jsonData.items.length; i++) {
			//		var counter = jsonData.items[i];
			//		console.log(counter.link);
			//}
			//console.log('reached');
			
			bot.say({text: 'Here is your file!', file: jsondata.items[0].link})
		  }

		});

	
 
});


