'use strict';
import express from 'express';
const router = express.Router();

export default router;

import Paths from '../models/paths';

import cowsay from 'cowsay';

router.post('/500', (req, res) => {
  throw new Error('Test Error');
});
router.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});
router.get('/cowsay', (req, res) =>{
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowsay.say({text: req.query.text})}</pre></body></html>`);
});
router.get('/api/cowsay', (req, res) =>{
  json(res, {
    content: cowsay.say(req.query),
  });
});
router.get('/api/v1/paths/:id', (req,res) =>{
  return Path.findById(req.params.id)
    .then(instrument => {
      res.json(instrument);
    });
});
router.post('/api/cowsay', (req, res) => {
  json(res, {
    message: `Hello, ${req.body.name}!`,
  });
});
router.post('/api/v1/paths', (req, res) =>{
  if (!req.body || !req.body.name || !req.body.class || !req.body.retailer) {
    res.send(400);
    res.end();
    return;
  }
  var newPath = new Paths(req.body);
  newPath.save()
    .then(saved=>{
      res.json(saved);
    });
});
router.put('/api/v1/paths/:id', (req,res)=>{
  return Instrument.findById(req.params.id)
    .then(instrument =>{
      instrument.name = req.body.name;
      instrument.class = req.body.class;
      instrument.retailer = req.body.retailer;
      res.json(instrument);
      res.end();
      return;
    });
});
router.delete('/api/v1/paths/:id', (req,res)=>{
  res.json({
    message: `ID ${req.params.id} was deleted`,
  });
});

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

  
function json(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}