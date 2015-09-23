var express = require('express');
var router = express.Router();
var User = require('../models/db');

router.get('/',function(req,res,next){
	res.send('Hello, World!');
});

//api routes
router.get('/users',findAllUsers);
router.get('/users/:id',findUserById);
router.post('/users',addUser);
router.put('/users/:id',updateUser);
router.delete('/users/:id',deleteUser);

//get all users
function findAllUsers(req,res){
	User.find(function(err,users){
		if(err)
			res.json({'ERROR':err});
		else
			res.json(users);
	});
}

//get single user
function findUserById(req,res){
	User.findById(req.params.id, function(err,user){
		if(err){
			res.json({'ERROR':err});
		}
		else{
			res.json(user);
		}
	});
}

//add new user
function addUser(req,res){
	var newUser = new User({
		name: req.body.name,
		email:req.body.email
	});
	newUser.save(function(err){
		if(err){
			res.json({'ERROR':err});
		}
		else{
			res.json({'SUCCESS':newUser});
		}
	});
}

//put single user
function updateUser(req,res){
	User.findById(req.params.id, function(err,user){
		user.name=req.body.name;
		user.email=req.body.email;
		user.save(function(err){
			if(err){
				res.json({'ERROR':err});
			}
			else{
				res.json({'UPDATED':user});
			}
		});
	});
}

//delete single user

function deleteUser (req,res) {
	User.findById(req.params.id, function(err,user){
		if(err){
			res.json({'ERROR':err});
		}
		else{
			user.remove(function(err){
				if(err){
					res.json({'ERROR':err});
				}
				else{
					res.json({'DELETED':user});
				}
			});
		}
		});
}

module.exports=router;
