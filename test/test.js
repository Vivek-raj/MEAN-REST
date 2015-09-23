process.env.NODE_ENV='test';

var chai=require('chai');
var chaiHttp =require('chai-http');
var mongoose = require('mongoose');
var server = require('../server.js');
var User = require('../app/models/db');
var should=chai.should();

chai.use(chaiHttp); 

describe('Users',function(){
User.collection.drop();


beforeEach(function(done){
	var newUser= new User({
		name:"demo",
		email:"demo@demo.com"
	});
	newUser.save(function(err){
		done();
	});
});

afterEach(function(done){
	User.collection.drop();
	done();
});
	//get all users from dbs
	it('should list all users on /users GET',function(done){
		chai.request(server)
			.get('/users')
			.end(function(err,res){
				if(err)
					throw err;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('_id');
      			res.body[0].should.have.property('name');
      			res.body[0].should.have.property('email');
      			res.body[0].name.should.equal('demo');
      			res.body[0].email.should.equal('demo@demo.com');
				done();
			});
	});

	//get single user using id
	it('should get a single User on /users/:id GET',function(done){
		var newUser = new User({
			name: 'new-user',
			email: 'newemailuser@newemailuser.com'
		});
		newUser.save(function(err,data){
		chai.request(server)
			.get('/users/'+data.id)
			.end(function(err,res){
				res.should.have.status(200);
				res.should.be.json;
				//console.log(res.body);
            	res.body.should.be.a('object');
            	res.body.should.have.property('_id');
            	res.body.should.have.property('name');
            	res.body.should.have.property('email');
            	res.body.name.should.equal('new-user');
            	res.body.email.should.equal('newemailuser@newemailuser.com');
            	res.body._id.should.equal(data.id);
            	done();
			});
		});
	});

	//post a new user into dbs
	it('should add a new user on /users POST',function(done){
		chai.request(server)
			.post('/users')
			.send({'name':'test','email':'test@test.com'})
			.end(function(err,res){
				res.should.have.status(200);
				res.should.be.json;
				//console.log(res.body);
				res.body.should.be.a('object');
				res.body.should.have.property('SUCCESS');
				res.body.SUCCESS.should.be.a('object');
				res.body.SUCCESS.should.have.property('name');
				res.body.SUCCESS.should.have.property('email');
				res.body.SUCCESS.name.should.equal('test');
				res.body.SUCCESS.email.should.equal('test@test.com');
				done();
			});
	});

	//update a particular user using id
	it('should update a user on /users/id GET',function(done){
		chai.request(server)
		.get('/users')
		.end(function(err,res){
			chai.request(server)
			.put('/users/'+res.body[0]._id)
			.send({'name':'demo'})
			.end(function(error,response){
				response.should.have.status(200);
				response.should.be.json;
            	response.body.should.be.a('object');
            	response.body.should.have.property('UPDATED');
            	response.body.UPDATED.should.be.a('object');
            	response.body.UPDATED.should.have.property('name');
            	response.body.UPDATED.should.have.property('_id');
            	response.body.UPDATED.name.should.equal('demo');
				done();
			});
		});
	});

	//delete a single user 
	it('should delete a single user on /users/id DELETE',function(done){
		chai.request(server)
			.get('/users')
			.end(function(err,res){
				chai.request(server)
				.delete('/users/'+res.body[0]._id)
				.end(function(error,response){
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.be.a('object');
					response.body.should.have.property('DELETED');
					response.body.DELETED.should.be.a('object');
            		response.body.DELETED.should.have.property('name');
            		response.body.DELETED.should.have.property('_id');
            		response.body.DELETED.name.should.equal('demo');
            		done();
				});
			});
	});
});