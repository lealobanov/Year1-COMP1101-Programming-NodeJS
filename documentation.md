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

User registration is handled by a POST request denoted /newuser, which is executed upon submitting the user registration form.
User email address and password are collected by the Firebase API, whereas user first/last name and bio are used to complete the user's WebForum profile.

	//Collect user data upon registration (user authentication handled by Google Firebase Auth API)
	app.post('/newuser', function(req,res){
	
    if(checkUserExists(req.body.username) !== false){
        res.send(400);
        res.send('A user with this username already exists. Please try again.');
    
    }else if(!req.body.username || !req.body.fname || !req.body.lname || !req.body.password || !req.body.confirmpass){
        res.send('Form fields missing. Please complete all fields.');
    
    }else if(req.body.password != req.body.confirmpass){
        res.send('Passwords do not match. Please try again.');
    
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
		
		
  	  }

	});

Alternatively, if the the user is recurring and attempting to access the WebForum service via the login form, a post request is issued to /login:

	//Post user profile data upon login
	app.post('/login', function(req,res){
	
    if(checkUserExists(req.body.username) !== false){
        current_user.push(req.body.username);
    
    } else if (!req.body.username || !req.body.password ){
        res.send(400);
        res.send('Form fields missing. Please complete all fields.');
    }
    else {
        current_user.push(req.body.username);
      
        let user = {
            fname: 'Null',
            lname: 'Null',	
            username: req.body.username,
            bio: 'This user was registered and authenticated by Firebase during a previous server session.'
        };
        users.push(user);

        
    }
	});


Firebase API user authentication is initially configured within a <script> tag in index.html and implemented in index.js.

Initially, the external API is called and setup in index.html:


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

In index. js, the API is initialized through a real time listener for authentication state change (logged in/logged out). Upon logging into the server, post methods are enabled such that a logged in user has the capability to initialize a new forum post.


	auth.onAuthStateChanged(firebaseUser => {
  	if(firebaseUser){
  	 console.log(firebaseUser);
   	 btnLogout.classList.remove('d-none');
   	 btnMyPosts.classList.remove('d-none');
	btnLoginheader.classList.add('d-none');
    	btnRegisterheader.classList.add('d-none');
    //Prevent users who are not logged in from initating new post entry
    btnCreatePost.classList.remove('d-none');
  	} else {
   	 console.log('Not logged in.');
   	 btnLogout.classList.add('d-none');
 	 }
	});


User logged-in and registration status are regulated via the following commands, which execute on submit of the user registration and login forms, respectively:

	btnRegister.addEventListener('click', e => {
  	const email = txtEmail_Reg.value;
  	const pass = txtPassword_Reg.value;
  	const promise = auth.createUserWithEmailAndPassword(email,pass);
  	promise.catch(e => console.log(e.message));

	});
	btnLogin.addEventListener('click', e => {
  	const email = txtEmail.value;
  	const pass = txtPassword.value;
  	const promise = auth.signInWithEmailAndPassword(email,pass);
  	promise.catch(e => console.log(e.message));
	});

Given the asynchronous nature of this app and the lack of external database support, registered users are retained within Firebase API, regardless of server restart. For demonstration purposes, existing users listed in app.js have also been pre-registered in the Firebase API authentication service. Assuming functionality on a live web hosting service with access to a database, registered user data will be retained between server reloads in the event that a recurring user login occurs. 

In order to initiate a new forum post, user login must be successfully handled by the Firebase API. If proper authentication does not occur, the button to create a new WebForum post is not visible and hence not clickable for the user; the user cannot physically initiate a /createpost POST request without prior authentication from the Firebase API.

On submit of the /newuser or /login posts request, both the login and user registration forms assign a temporary 'current user' value. This value is used to list appropriate data under 'My Posts' and properly accredit the post author when a new post is created in the system.

Upon registering to the WebForum system, the user can proceed to create a new blog post to be posted on the service. A new post is issued via a /createpost POST request:
 
 	// Create a new forum post
	app.post('/createpost',function(req,resp){
	
    if(!req.body.posttitle || !req.body.postdate || !req.body.postcontent ){
		
        resp.send(400);
        resp.send('Form fields missing. Please try again.');
    }else if (checkPostExists(req.body.posttitle) !== false){
        resp.status(400);
        resp.send('A post with this title already exists in the system. Please try again.');
	
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
	});



Further, all users of the site (regardless of login status) can perform GET requests which generate lists of all users and posts currently hosted by the WebForum site. 


To generate the current user directory, a GET request to /users is issued in the 'User Directory' modal:

	app.get("/users/", function(req,res) {
	res.send(users)
	});


Similarly, to generate the current post library,  a GET request to /users is issued in the 'Post Library' modal:

	app.get("/posts/", function(req,res) {
	res.send(posts)
	});
	
The current logged-in user can also generate a library of their personal posts via a GET request to /myposts in the 'My Library' modal:

	app.get("/myposts/", function(req,res) {
	res.send(my_posts)
	});

Additionally, users can search for individual users or posts depending on user email address, first name, or last name, as well as post title and post author.

A JavaScript function inititalized in index.html is used to dynamically pull text content from a search query field upon button click. When this information is collected, a GET request is initialized to retrieve user- or post- specific data. Each GET request for /users and /posts is subseqeuntly renderend in a dynamic HTML modal:

For example, searching for users by username (email address):

	app.get("/users/:username", function(req,res){
		let index = checkUserExists(req.params.username);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this email address."});
	}

	})

Searching for users by first name:

	app.get("/users/fname/:fname", function(req,res){
	let index = checkFnameUserExists(req.params.fname);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this first name."});
	}

	})

Searching for users by last name:

	app.get("/users/lname/:lname", function(req,res){
	let index = checkLnameUserExists(req.params.lname);
	if(index !== false){
		res.send(users[index]);
	}else{
		res.send({"nonefound":"No user found with this last name."});
	}

	})
	
Similarly, with regards to posts, users can search for posts by title:

	app.get("/posts/:posttitle", function(req,res){
	let index = checkPostExists(req.params.posttitle);
	if(index !== false){
		res.send(posts[index]);
	}else{
		res.send("No post found with this title.");
	}

	})


As well as search for post by author (email address):

	app.get("/posts/author/:postauthor", function(req,res){
	let index = checkPostAuthorExists(req.params.postauthor);
	if(index !== false){
		res.send(posts[index]);
	}else{
		res.send("No post found with this author.");
	}

	})

The functions checkUserExists() and checkPostExists() are called to determine whether or not a specific post or user are contained as an existing JSON object within the 'users' or 'posts' arrays.

Lastly, all users, regardless of login status, are able to refresh the current post feed upon button click to 'Refresh Post Feed', initiating a GET request to /posts.

The post feed content is updated upon submission of a new /createpost POST request.

Within the app, new HTML content is dynamically formatted via the fetch API when GET requests are initiated. A for loop is used to iterate through applicable JSON content, creating a new HTML card section and filling content where applicable. The Bootstrap-supported modal structure is used to render HTML content upon button click.
	
The presented WebForum app further supports mobile compatability; all content and navigation (mobile hamburger) are responsive to device width.

Lastly, the WebForum app is deployed to Heroku cloud deployment service: https://progsumm2.herokuapp.com

