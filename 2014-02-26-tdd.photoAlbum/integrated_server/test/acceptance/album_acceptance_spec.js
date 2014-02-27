'use strict';

process.env.DNAME='album-test';
//var expect = require('chai').expect;
var request = require('supertest');
var fs = require('fs');
var rimraf = require('rimraf');
var app = require('../../app/app');
var Album;

describe('albums', function(){

  beforeEach(function(done){
    rimraf.sync(__dirname + '/../../app/static/img');
    fs.mkdirSync(__dirname + '/../../app/static/img');
    var origcover = __dirname + '/../fixtures/dungeon-cover.jpg';
    var copycover = __dirname + '/../fixtures/dungeon-cover-copy.jpg';
    var origphoto = __dirname + '/../fixtures/bear.jpg';
    var copyphoto = __dirname + '/../fixtures/bear-copy.jpg';
    fs.createReadStream(origcover).pipe(fs.createWriteStream(copycover));
    fs.createReadStream(origphoto).pipe(fs.createWriteStream(copyphoto));
    global.nss.db.dropDatabase(function(err, result){done();});
  });

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
      done();
    });
  });
    
  describe('GET /albums', function(){
    it('should display the new album html page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });


  describe('POST /albums', function(){
    it('creates a new album and sens user to home page', function(done){
      var filename = __dirname + '/../fixtures/dungeon-cover-copy.jpg';

      request(app)
      .post('/albums')
      .attach('cover', filename)
      .field('title', 'My Lil Dungeon')
      .field('taken', '2014-06-15')
      .expect(302, done);
    });
  });

  describe('POST /albums/:id', function(){
    it('creates a new photo and loads it on the show page', function(done){
      var filename = __dirname + '/../fixtures/bear-copy.jpg';




      request(app)
      .post('/albums/777776')
      .attach('bear-copy', filename)
      .expect(302, done);
    });
  });

////END OF DESCRIBE////
});
