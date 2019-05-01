"use strict";
//Run packages

const express = require('express');
const bodyParser = require('body-parser');

//Set up app
const app = express();
const port = process.env.PORT || 8090;

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Set up entities
let users = [{"fname":"John", "lname":"Doe","username":"john.doe@gmail.com", "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt."},
{"fname":"Jane", "lname":"Smith","username":"jane.smith@gmail.com", "bio": "Pellentesque vitae ante vehicula, blandit mauris a, maximus nulla. Donec non enim at velit hendrerit pretium. Nulla iaculis, nunc sit amet volutpat pharetra, erat justo tempor orci, a vulputate tellus turpis sit amet mauris."},
{"fname":"Tom", "lname":"Clark","username":"tom.clark@gmail.com", "bio": "Integer nibh justo, venenatis at nulla ac, malesuada dignissim dolor. Integer ac vulputate enim. Mauris ac mi a enim consequat maximus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."}];
let current_user = [];

let my_posts = [];
let posts = [{"posttitle":"Sample Post 1", "postauthor":"john.doe@gmail.com","postdate":"2019-04-12", "postcontent": "Integer accumsan nunc quis lectus maximus, congue cursus dolor porta. Duis ultrices sapien non elit cursus, vitae vestibulum massa fermentum. Aliquam sed ligula viverra, imperdiet dolor ut, ornare lorem. Phasellus erat neque, viverra non ipsum at, mollis porta mi. Vivamus nulla turpis, rutrum non laoreet ut, molestie sed mi. Suspendisse nec pharetra tellus. Nam vitae nibh non nisi rutrum rhoncus. Aliquam ligula nulla, placerat ut lobortis vel, aliquam eu lectus. Nulla eget suscipit eros. Vivamus dignissim ornare vehicula. Nunc eleifend arcu est, vitae fringilla risus sodales ac. Nulla porta vestibulum elementum. Sed non porttitor massa, id ultrices elit. Donec gravida turpis eget laoreet aliquam."},
{"posttitle":"Sample Post 2", "postauthor":"jane.smith@gmail.com","postdate":"2019-04-20", "postcontent": "Nulla libero urna, condimentum eget magna sit amet, tempor suscipit enim. Ut consectetur interdum sem, vel pretium risus feugiat eu. Sed in sollicitudin nunc. Aliquam ac scelerisque dui. Quisque consequat congue orci, ac feugiat tellus pulvinar vitae. Maecenas vehicula volutpat diam elementum porttitor. Donec in ornare nunc. Aenean scelerisque est quis mauris vulputate, ut sagittis metus lacinia. Pellentesque ultrices leo ipsum, efficitur ultrices sapien molestie in. Integer mollis porta fermentum. Mauris iaculis risus ac scelerisque viverra."},
{"posttitle":"Sample Post 3", "postauthor":"tom.clark@gmail.com","postdate":"2019-04-24", "postcontent": "Sed aliquam neque est, vitae consectetur sapien sagittis ac. Sed vitae ornare velit. Aenean ut odio vitae quam tempus aliquet id ultricies nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas tristique, turpis sed tempus aliquet, diam quam vestibulum dolor, nec varius purus sapien et lorem. Sed at euismod erat. Curabitur scelerisque libero quis condimentum tristique. Praesent arcu massa, blandit vel rutrum vitae, porta ac dui. Cras placerat condimentum urna, ut ornare lorem. Suspendisse volutpat eget lorem non pretium. Maecenas varius eu nisi vel auctor. Vestibulum vitae purus nec sem faucibus fringilla. Aliquam lobortis dolor nec hendrerit egestas. Etiam ut tincidunt dolor, nec tincidunt metus."}];


//Routes
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/client/index.html'));
});

//Collect user data upon registration (user authentication handled by Google Firebase Auth API)
app.post('/newuser', function(req,res){
	
  if(checkUserExists(req.body.username) !== false){
		res.send(400);
    res.send("A user with this username already exists. Please try again.");
    
	}else if(!req.body.username || !req.body.fname || !req.body.lname || !req.body.password || !req.body.confirmpass){
    res.send("Form fields missing. Please complete all fields.");
    
	}else if(req.body.password != req.body.confirmpass){
    res.send("Passwords do not match. Please try again.");
    
	}else{
		
		current_user.push(req.body.username);

		let user = {
			fname: req.body.fname,
      lname: req.body.lname,	
			username: req.body.username,
			bio: req.body.bio
		};

		users.push(user);
		
	
		res.send(true);
		console.log('Added new user');
		
		
	}
	console.log("Request to add new user data sent: " +req.body);
});

//Post user profile data upon login
app.post('/login', function(req,res){
	
  if(checkUserExists(req.body.username) !== false){
		console.log('This user has already been stored in the list of current users.')
		current_user.push(req.body.username)
		console.log('CURRENT USER', current_user[0]); 
	} else if (!req.body.username || !req.body.password ){
		res.send(400);
		res.send("Form fields missing. Please complete all fields.");
	}
	else {
		current_user.push(req.body.username)
		console.log('CURRENT USER', current_user[0]); 
		let user = {
			fname: 'Null',
      lname: 'Null',	
			username: req.body.username,
			bio: 'This user was registered and authenticated by Firebase during a previous server session.'
		};
		users.push(user);

		console.log('This user was registered and authenticated by Firebase in a previous session.')
	}
});

// Functions for searching among user properties

function checkUserExists(username){
	for (var i = 0; i < users.length; i++) {

		if (users[i].username == username){
			return i;
		}
	}
	return false
};

function checkFnameUserExists(fname){
	for (var i = 0; i < users.length; i++) {

		if (users[i].fname == fname){
			return i;
		}
	}
	return false
};
function checkLnameUserExists(lname){
	for (var i = 0; i < users.length; i++) {

		if (users[i].lname == lname){
			return i;
		}
	}
	return false
};

// List all current users in user directory
app.get("/users/", function(req,res) {
	res.send(users)
});

// Create a new forum post
app.post("/createpost",function(req,resp){
	
	if(!req.body.posttitle || !req.body.postdate || !req.body.postcontent ){
		
		resp.send(400);
		resp.send("Form fields missing. Please try again.");
	}else if (checkPostExists(req.body.posttitle) !== false){
			resp.status(400)
			resp.send("A post with this title already exists in the system. Please try again.");
	
	}else{
		let post= {
			posttitle: req.body.posttitle,
			postauthor: current_user[0],
			postdate: req.body.postdate,
			postcontent: req.body.postcontent,
		};
		
		posts.push(post);
		my_posts.push(post);
		
	}
})

// List all current posts in the post library
app.get("/posts/", function(req,res) {
	res.send(posts)
});

// List all of the logged-in user's posts
app.get("/myposts/", function(req,res) {
	res.send(my_posts)
});

// Functions for searching among post properties

function checkPostExists(posttitle){
	for (var i = 0; i < posts.length; i++) {

		if (posts[i].posttitle == posttitle){
			return i;
		}
	}
	return false
};

function checkPostAuthorExists(postauthor){
	for (var i = 0; i < posts.length; i++) {

		if (posts[i].postauthor == postauthor){
			return i;
		}
	}
	return false
};
// Search in user library by username (user's email address)

app.get("/users/:username", function(req,res){
	let index = checkUserExists(req.params.username);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this email address."});
	}

})

// Search in user library by first name

app.get("/users/fname/:fname", function(req,res){
	let index = checkFnameUserExists(req.params.fname);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this first name."});
	}

})

// Search in user library by last name

app.get("/users/lname/:lname", function(req,res){
	let index = checkLnameUserExists(req.params.lname);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this last name."});
	}

})

// Search in post library by post title

app.get("/posts/:posttitle", function(req,res){
	let index = checkPostExists(req.params.posttitle);
	if(index !== false){
		res.send(posts[index]);
	}else{
		res.send({"nonefound":"No post found with this title."});
	}

})

// Search in post library by post author (user's email address)

app.get("/posts/author/:postauthor", function(req,res){
	let index = checkPostAuthorExists(req.params.postauthor);
	if(index !== false){
		res.send(posts[index]);
	}else{
		res.send({"nonefound":"No post found with this author."});
	}

})

module.exports = app;
