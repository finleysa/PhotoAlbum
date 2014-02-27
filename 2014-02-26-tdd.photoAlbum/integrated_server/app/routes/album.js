'use strict';

var Album = require('../models/album');

exports.home = function(req, res){
  res.render('home/index', {title: 'Express Template'});
};

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.send({albums:albums});
  });
};

exports.new = function(req, res){
  res.render('albums/new/new', {title: 'Submit Album'});
};

exports.create = function(req, res){
  var album = new Album(req.body);
  album.addCover(req.files.cover.path);
  album.insert(function(){
    res.redirect('/');
  });
};

exports.show = function(req, res){
  Album.findById(req.params.id, function(foundAlbum){
    console.log(foundAlbum.cover);
    var cover = foundAlbum.cover.replace('/data/code/Group/2014-02-26-tdd.photoAlbum/integrated_server/app/static', '');
    res.render('albums/show', {background: cover, photos: foundAlbum.photos});
  });
};

exports.addPhoto = function(req, res){
  Album.findById(req.params.id, function(album){
    album.addPhoto(req.files.photo);
    album.update();
  });
  
  res.redirect('/albums'+req.params.id);
};
