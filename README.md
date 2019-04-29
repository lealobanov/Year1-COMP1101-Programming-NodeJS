# Documentation

May 2, 2019

Programming Summative Assignment 2

The following documentation outlines an ansynchronous, dynamic single page app integrating HTML/CSS styling with server/client-side communication via Javascript. Node JS was used to facilitate server side communication through Javascript; the fetch protocol and notion of a REST API was used to transmit JSON content to the client side, and dynamically render it in HTML format.

The proposed application handles two entities: users and blog posts.

Upon initializing the web server and rendering the index.html webpage, users are prompted to login or register by creating a new account. User authentication is handled with the aid of an external API service, Firebase. Upon completing the registration form, user data is collected; email address and password are collected for authentication purposes, and additional information such as first/last name and a user bio are collected to construct the user's profile. 

Upon creating an account, the user is automatically logged into the application. The user has the ability to logout and log back in to the service, provided that the server has not been restarted. User authentication (required for creating and publishing blog posts) is granted upon completing registration and/or logging in as a recurring user.

# API Documentation



User registration and login are performed via indepent POST requests handled in app.js. HTML form data in both the user registration and login forms is collected via event listener upon form submit; fetch is used to format the POST request body and send JSON content to the web server to be stored in memory.

Simultaneously, the Firebase API user authentication service collects data that the user inputs into the email address and password fields. 

On submit, both the login and user registration forms assign a temporary 'current user' value. This value is used to list appropriate data under 'My Posts' and properly accredit the post author when a new post is created in the system.

-- snippet of post request register
-- snippet of post request login
