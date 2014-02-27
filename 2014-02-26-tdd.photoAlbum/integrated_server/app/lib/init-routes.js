'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var album = require('../routes/album');

  app.get('/', d, album.home);
  app.get('/albums/:id', d, album.show);
  app.get('/albums/new', d, album.new);
  app.get('/albums', d, album.index);
  app.post('/albums', d, album.create);
  app.post('/albums/:id', d, album.addPhoto);
  console.log('Routes Loaded');
  fn();
}

