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
let users = [{"fname":"Bob", "lname":"Smith","username":"testuser123", "bio": "this is my bio"}];

let posts = []


//Routes
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/client/index.html'));
});

//
app.post('/newuser', function(req,res){
	
  if(checkUserExists(req.body.username) !== false){
		res.send(400);
    res.send("A user with this username already exists. Please try again.");
    
	}else if(!req.body.username || !req.body.fname || !req.body.lname || !req.body.password || !req.body.confirmpass){
    res.send("Form fields missing. Please complete all fields.");
    
	}else if(req.body.password != req.body.confirmpass){
    res.send("Passwords do not match. Please try again.");
    
	}else{
		
		let user = {
			fname: req.body.fname,
      lname: req.body.lname,	
			username: req.body.username,
			bio: req.body.bio
		};

		passwords.push(req.body.password);
		users.push(user);
	
		res.send(true);
		console.log('Added new user');
		
	}
	console.log("Request sent: " +req.body);
})

function checkUserExists(username){
	for (var i = 0; i < users.length; i++) {

		if (users[i].username == username){
			return i;
		}
	}
	return false
};

// Search individual users
app.get("/users/:username", function(req,res){
	let index = checkUserExists(req.params.username);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send("User not found.");
	}

});

// List all current users in user directory
app.get("/users/", function(req,res) {
	res.send(users)
});

// Login to website; assigns access token to user. To initiate further post requests (create post, add comment), access token is required.
app.post("/login",function(req,resp){
	let existingUser = checkUserExists(req.body.username);
	if(!req.body.username || !req.body.password || existingUser === false || passwords[existingUser] != req.body.password ){
		resp.send(false);
	}else{
		req.session.isLoggedin = true;
		req.session.isAdmin= users[existingUser].adminStatus;
		req.session.username = users[existingUser].username;
		req.session.save(function(err){});
		resp.send(true);
	}
})

// Logout of site, revert back to initial homescreen
app.get("/logout",function(req,resp){
	req.session.destroy();
	resp.send(true);
})

// Create a new forum post
app.post("/createpost",function(req,resp){
	
	if(!req.body.posttitle || !req.body.postdate || !req.body.postcontent ){
		
		resp.send(false);
	}else{
		let post= {
			posttitle: req.body.posttitle,
			postauthor: 'assign post author dynamically',
			postdate: req.body.postdate,
			postcontent: req.body.postcontent,
		};
		
		posts.push(post);
		resp.send(true);
	}
})

// List all current posts in the post library
app.get("/posts/", function(req,res) {
	res.send(posts)
});

// Comment on an existing post
app.post("/addcomment",function(req,resp){

	if(!req.body.eventn || !req.body.comment){
		
		resp.send(false);
	}else{
		let comment= {
			username: req.session.username,
			event: req.body.eventn,
			comment: req.body.comment,
			image: req.session.image
		};
		
		comments["comments"].push(comment);
		resp.send(true);
	}
})
//Run server
app.listen(port,function(){
  console.log(`Server listening on port ${port}`);
});

module.exports = app;