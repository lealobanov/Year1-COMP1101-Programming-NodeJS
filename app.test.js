'use strict';

const request = require('supertest');
const app = require('./app');

function checkValidUserContent(res)
{

    const jContent = res.body;
    if(typeof jContent !== 'object'){
	throw new Error('Not an object');
    }

    if(jContent['fname'] !== 'John'){
	throw new Error('First name should be John');
    }

    if(jContent['lname'] !== 'Doe'){
        throw new Error('Last name should be Doe');
        }

    if(jContent['username'] !== 'john.doe@gmail.com'){
	console.log(jContent);
	throw new Error('Username should be john.doe@gmail.com');
    }
}

function checkValidPostContent(res)
{

    const jContent = res.body;
    if(typeof jContent !== 'object'){
	throw new Error('Not an object');
    }

    if(jContent['posttitle'] !== 'Sample Post 1'){
	throw new Error('Post title should be Sample Post 1');
    }

    if(jContent['postauthor'] !== 'john.doe@gmail.com'){
        throw new Error('Post author should be john.doe@gmail.com');
        }

    if(jContent['postdate'] !== '2019-04-12'){
	console.log(jContent);
	throw new Error('Post date should be 2019-04-12');
    }
}

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj){
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

// Testing GET and POST user entities
 
describe('Test the users service', () => {
    test('GET /users succeeds', () => {
        return request(app)
	    .get('/users')
	    .expect(200);
    });

    test('GET /users returns JSON', () => {
        return request(app)
	    .get('/users')
	    .expect('Content-type', /json/);
    });

    test('GET /users includes john.doe@gmail.com', () => {
        return request(app)
	    .get('/users')
	    .expect(/john.doe@gmail.com/);
    });

    test('GET /users/john.doe@gmail.com succeeds', () => {
        return request(app)
	    .get('/users/john.doe@gmail.com')
	    .expect(200);
    });

    test('GET /users/john.doe@gmail.com returns JSON', () => {
        return request(app)
	    .get('/users/john.doe@gmail.com')
	    .expect('Content-type', /json/);
    });

    test('GET /users/john.doe@gmail.com includes user details', () => {
        return request(app)
	    .get('/users/john.doe@gmail.com')
	    .expect(checkValidUserContent);
    });


    // test('POST /users needs access_token', () => {
    //     return request(app)
	//     .post('/people')
	//     .expect(403);
    // });

    test('POST /newuser cannot replicate user with same username', () => {
    const params = {fname: 'John',
            lname: 'Doe',
			username: 'john.doe@gmail.com',
			bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt.'};
        return request(app)
	    .post('/newuser')
	    .send(serialise(params))
	    .expect(400);
    });

});

// Testing GET and POST blog post entities


describe('Test the blog posts service', () => {
    test('GET /posts succeeds', () => {
        return request(app)
	    .get('/users')
	    .expect(200);
    });

    test('GET /posts returns JSON', () => {
        return request(app)
	    .get('/posts')
	    .expect('Content-type', /json/);
    });

    test('GET /posts includes Sample Post 1', () => {
        return request(app)
	    .get('/posts')
	    .expect(/Sample Post 1/);
    });

    test('GET /posts/Sample Post 1 succeeds', () => {
        return request(app)
	    .get('/posts/Sample Post 1')
	    .expect(200);
    });

    test('GET /posts/Sample Post 1 returns JSON', () => {
        return request(app)
	    .get('/posts/Sample Post 1')
	    .expect('Content-type', /json/);
    });

    test('GET /posts/Sample Post 1 includes post details', () => {
        return request(app)
	    .get('/posts/Sample Post 1')
	    .expect(checkValidPostContent);
    });


    // test('POST /users needs access_token', () => {
    //     return request(app)
	//     .post('/people')
	//     .expect(403);
    // });

    test('POST /createpost cannot replicate post with duplicate post title', () => {
    const params = {
        posttitle: 'Sample Post 1',
        postauthor: 'john.doe@gmail.com',
        postdate: '2019-04-12',
        postcontent: 'Integer accumsan nunc quis lectus maximus, congue cursus dolor porta. Duis ultrices sapien non elit cursus, vitae vestibulum massa fermentum. Aliquam sed ligula viverra, imperdiet dolor ut, ornare lorem. Phasellus erat neque, viverra non ipsum at, mollis porta mi. Vivamus nulla turpis, rutrum non laoreet ut, molestie sed mi. Suspendisse nec pharetra tellus. Nam vitae nibh non nisi rutrum rhoncus. Aliquam ligula nulla, placerat ut lobortis vel, aliquam eu lectus. Nulla eget suscipit eros. Vivamus dignissim ornare vehicula. Nunc eleifend arcu est, vitae fringilla risus sodales ac. Nulla porta vestibulum elementum. Sed non porttitor massa, id ultrices elit. Donec gravida turpis eget laoreet aliquam.'
    };
    
        return request(app)
	    .post('/createpost')
	    .send(serialise(params))
	    .expect(400);
    });

});