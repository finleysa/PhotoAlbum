'use strict';

module.exports = Album;

var albums = global.nss.db.collection('albums');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var folderName;

function Album(album){
  this._id = album._id;
  this.title = album.title;
  this.taken = new Date(album.taken);
  this.cover = '';
  this.photos = [];
}

Album.prototype.addCover = function(oldPath){
  var dirname = this.title.replace(/\s/g, '').toLowerCase();
  folderName = dirname;
  var newPath = __dirname + '/../static/img/' + dirname;
  fs.mkdirSync(newPath);

  var extension = path.extname(oldPath);
  newPath += '/cover' + extension;
  fs.renameSync(oldPath, newPath);

  this.cover = path.normalize(newPath);
  

};

Album.prototype.insert = function(fn){
  albums.save(this, function(err, record){
    fn(err);
  });
};

Album.prototype.addPhoto = function(image, name, fn){
  var newPath = __dirname + '/../static/img/'+folderName+'/'+name;
  fs.renameSync(image, newPath);
  var newImage = path.normalize(newPath);
  this.photos.push(newImage);
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  albums.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};


