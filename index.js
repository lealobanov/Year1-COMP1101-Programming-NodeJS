"use strict";

// Defining Firebase authentication elements

const txtEmail = document.getElementById('username_login');
const txtPassword = document.getElementById('password_login');
const txtEmail_Reg = document.getElementById('username_reg');
const txtPassword_Reg = document.getElementById('password_reg');
const btnLogin = document.getElementById('btnLogin');

const btnRegister =document.getElementById('btnRegister');
const btnLogout = document.getElementById('btnLogout');

const btnLoginheader = document.getElementById('loginnavbutton');
const btnRegisterheader = document.getElementById('regnavbutton');
const btnCreatePost = document.getElementById('createnewpostmodal');
const btnMyPosts = document.getElementById('mypostsbtn');

// Authenticate user registration
btnRegister.addEventListener('click', e => {
  const email = txtEmail_Reg.value;
  const pass = txtPassword_Reg.value;
  const promise = auth.createUserWithEmailAndPassword(email,pass);
  promise.catch(e => console.log(e.message));

});

// Authenticate user login
btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const promise = auth.signInWithEmailAndPassword(email,pass);
  promise.catch(e => console.log(e.message));

});

// Logout current user
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
});

// Realtime listener for authentication state change (logged in/logged out)
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

// Post user registration (authentication granted via Firebase API upon submission)

document.getElementById('btnRegister').addEventListener('click', async function(event){
    event.preventDefault();
    
    
    try{
        let data = {

           "fname": document.getElementById('first_reg').value,
           "lname" : document. getElementById('last_reg').value,
           "username" : document.getElementById('username_reg').value,
           "password": document.getElementById('password_reg').value,
           "confirmpass" : document.getElementById('confirmpass_reg').value,
           "bio" : document.getElementById('bio_reg').value
            }
    
      let response = await fetch('/newuser',
                                 {
                                   method: "POST",
                                   headers: {
                                     "Content-Type": "application/json"
                                   },
                                   body: JSON.stringify(data),
                                   
                                  });
      if(!response.ok){
        throw new error("Encountered error when registering new user. Ensure that all fields are submitted and passwords match.");
      }
    } catch (error) {
      alert(error);
    }
    console.log('Fetch happened')
    
  });

// Post user profile information upon login

document.getElementById('form_login').addEventListener('submit', async function(event){
	event.preventDefault();
	
	try{
			let data = {
				 "username" : document.getElementById('username_login').value,
					}
	
		let response = await fetch('/login',
															 {
																 method: "POST",
																 headers: {
																	 "Content-Type": "application/json"
																 },
																 body: JSON.stringify(data),
																 
                                });
    console.log('response', response)                     
		if(!response.ok){
			throw new Error("Encountered error when logging in. Please ensure that all fields are completed.");
    }
    
	} catch (error) {
		alert ("Problem: " + error);
	}
  console.log('Fetch happened')
});

//Post new forum post to post library (authentication required to execute post)

document.getElementById('form_create_post').addEventListener('submit', async function(event){
  event.preventDefault();
  
  try{
      let data = {
         "posttitle" : document.getElementById('post_title').value,
         "postdate": document.getElementById('date').value,
         "postcontent": document.getElementById('post_content').value
          }
  
    let response = await fetch('/createpost',
                               {
                                 method: "POST",
                                 headers: {
                                   "Content-Type": "application/json"
                                 },
                                 body: JSON.stringify(data),
                                 
                                });
    if(!response.ok){
      console.log(response.code)
      throw new Error("Encountered error creating new post. A post with this title already exists in the post library.");
    }
  } catch (error) {
    alert ("Problem: " + error);
  }
  console.log('Fetch happened')
});


// Dynamically list current user directory
  document.getElementById('listusers').addEventListener('click', async function(event){
    let response = await fetch('/users');
    let body = await response.text();
    
  
    let userlist = JSON.parse(body);
    $("#usercontent").html("");
    for(let i = 0; i < userlist.length; i++){
      usercontent.innerHTML += `
          <br>
          <div class="card bg-light" data-id=${userlist[i].username}>
          <div class="card-body">
            <h4 style="font-size: 22px; color: #16A2B8;">${userlist[i].fname} ${userlist[i].lname}</h4>
            <h6 class="card-subtitle mb-2 ">${userlist[i].username}</h6>
            <p><strong>Profile Bio:</strong> ${userlist[i].bio}</p>
          </div>
          </div>`
    }
  
  });

// Dynamically list current post library
document.getElementById('listposts').addEventListener('click', async function(event){
  let response = await fetch('/posts');
  let body = await response.text();
  

  let postlist = JSON.parse(body);
  $("#postlistcontent").html("");
  for(let i = 0; i < postlist.length; i++){
    postlistcontent.innerHTML += `
        <br>
        <div class="card bg-light" data-id=${postlist[i].posttitle}>
        <div class="card-body">
          <h4 style="font-size: 22px; color: #16A2B8;">${postlist[i].posttitle}</h4>
          <h6 class="card-subtitle mb-2 text-muted"> Written by: ${postlist[i].postauthor}</h6>
          <h6 class="card-subtitle mb-2 text-muted"><strong> ${postlist[i].postdate}</strong></h6>
          <p>${postlist[i].postcontent}</p>
        </div>
        </div>`
  }

});

// Dynamically list current user's posts
document.getElementById('mypostsbtn').addEventListener('click', async function(event){
  let response = await fetch('/myposts');
  let body = await response.text();
  

  let postlist = JSON.parse(body);
  $("#mypostslistcontent").html("");
  for(let i = 0; i < postlist.length; i++){
    mypostslistcontent.innerHTML += `
        <br>
        <div class="card bg-light" data-id=${postlist[i].posttitle}>
        <div class="card-body">
          <h4 style="font-size: 22px; color: #16A2B8;">${postlist[i].posttitle}</h4>
          <h6 class="card-subtitle mb-2 text-muted"> Written by: ${postlist[i].postauthor}</h6>
          <h6 class="card-subtitle mb-2 text-muted"><strong> ${postlist[i].postdate}</strong></h6>
          <p>${postlist[i].postcontent}</p>
        </div>
        </div>`
  }

});

// Generate current post feed
document.getElementById('postfeed').addEventListener('click', async function(event){
  let response = await fetch('/posts');
  let body = await response.text();

  let postlist = JSON.parse(body);
  $("#listallpostcontent").html("");
  for(let i = 0; i < postlist.length; i++){
    listallpostcontent.innerHTML += `
        <br>
        <div class="card bg-light" style="margin-left:-20px" data-id="${postlist[i].posttitle}">
        <div class="card-body">
          <h4 style="font-size: 22px; color: #16A2B8;">${postlist[i].posttitle}</h4>
          <h6 class="card-subtitle mb-2 text-muted"> Written by: ${postlist[i].postauthor}</h6>
          <h6 class="card-subtitle mb-2 text-muted"><strong> ${postlist[i].postdate}</strong></h6>
          <p>${postlist[i].postcontent}</p>
          

        </div>
        </div>`
  }
});



