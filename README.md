# Documentation

May 2, 2019

Programming Summative Assignment 2

The following documentation outlines an ansynchronous, dynamic single page app integrating HTML/CSS styling with server/client-side communication via Javascript. Node JS was used to facilitate server side communication through Javascript; the fetch protocol and notion of a REST API was used to transmit JSON content to the client side, and dynamically render it in HTML format.

The proposed application handles two entities: users and blog posts.

Upon initializing the web server and rendering the index.html webpage, users are prompted to login or register by creating a new account. User authentication is handled with the aid of an external API service, Firebase. Upon completing the registration form, user data is collected; email address and password are collected for authentication purposes, and additional information such as first/last name and a user bio are collected to construct the user's profile. 

Upon creating an account, the user is automatically logged into the application. The user has the ability to logout and log back in to the service, provided that the server has not been restarted. User authentication (required for creating and publishing blog posts) is granted upon completing registration and/or logging in as a recurring user.

# External API Documentation

User registration and login are performed via indepent POST requests handled in app.js. HTML form data in both the user registration and login forms is collected via event listener upon form submit; fetch is used to format the POST request body and send JSON content to the web server to be stored in memory.

Simultaneously, the Firebase API user authentication service collects data that the user inputs into the email address and password fields. 

User registration is handled by a POST request denoted /create post, which is executed upon completing the create post field.
User email address and password are collected by the Firebase API, whereas user first/last name and bio are used to complete the user's WebForum profile.

'
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
'''

Firebase API is configured within a <script> tag in index.html and implemented in index.js.

Initially, the API is called in index.html:
'''

<script>
//Initialize Firebase authentication
const config = {
	apiKey: "AIzaSyDHnMD4FJcvRcy2NsVKRJ-FGHT_geeC2O8",
	authDomain: "prog-web-app-beacc.firebaseapp.com",
	databaseURL: "https://prog-web-app-beacc.firebaseio.com",
	projectId: "prog-web-app-beacc",
	storageBucket: "prog-web-app-beacc.appspot.com",
	messagingSenderId: "40206756427"
};
firebase.initializeApp(config);
const auth = firebase.auth();
</script>

'

In index. js,


On submit, both the login and user registration forms assign a temporary 'current user' value. This value is used to list appropriate data under 'My Posts' and properly accredit the post author when a new post is created in the system.


-- snippet of post request register
-- snippet of post request login


-- create new blog post request

-- get users in directory and search
  -- how search is managed - JS function to acquire value in form field on button click submit
-- get posts in library and search 

-- get posts in current feed

-- formatting html dynamically in get request through fetch (iterating through loops and creating/populating new html divs) 
  -- modal structure
  -- bootstrap styling
    -- handles mobile support 
  
-- cloud deployment via heroku

** when testing done: what test cases were addressed (eg what form inputs were not allowed + why)

