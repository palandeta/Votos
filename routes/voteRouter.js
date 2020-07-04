const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Votes = require('../models/votes');
const Users=require('../models/user');

const voteRouter=express.Router();
voteRouter.use(bodyParser.json());
voteRouter.route('/')
.options(cors.corsWhithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Votes.find(req.query)
    .populate('votes')
    .then((votes) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(votes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWhithOptions, authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /votes');
})
.put(cors.corsWhithOptions, authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /votes');
})
.delete(cors.corsWhithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /votes');
});

voteRouter.route('/:userId')
.options(cors.corsWhithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Votes.find(req.query)
    .populate('votes')
    .then((votes) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(votes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWhithOptions, authenticate.verifyUser, (req, res, next)=>{
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null) {
            var months = ["jan", "feb", "mar", "apr", "may", "jun", "july", "aug", "sep", "oct", "nov", "dec"];
            let now = new Date();
            var month = now.getMonth();
           
            req.body.elector = req.user._id;
            req.body.elected = req.params.userId;
            req.body.month = months[month];
            req.body.area = user.area;
            Votes.findOne({ elector: req.body.elector, area: user.area, month: req.body.month }).
                    then(ar => {      
                        if (ar != null){  
                            res.statusCode = 403;
                            res.end('Ya ha votado en esa area en este mes');   
                        }                           
                        else {
                            Votes.create(req.body)
                            .then((vote)=> {
                                console.log('Vote created ', vote);
                                res.statusCode=200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(vote);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                        }
                    }); 
  
        }
        else {
            err = new Error('User ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWhithOptions, authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /votes/userId');
})
.delete(cors.corsWhithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode=403;
    res.end('DELETE operation not supported on /votes/userId');
});


module.exports = voteRouter;