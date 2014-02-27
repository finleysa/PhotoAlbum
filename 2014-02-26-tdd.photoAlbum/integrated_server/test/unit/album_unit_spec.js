'use strict';

process.env.DNAME='album-test';
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Album;

describe('Album', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
      done();
    });
  });

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

  describe('new', function(){
    it('should create a new instance of Album', function(){
      var a1 = new Album({title: 'My Lil Dungeon',
                          taken: '03/08/2003',
                          });

      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('My Lil Dungeon');
      expect(a1.taken).to.be.instanceof(Date);
      expect(a1.taken).to.deep.equal(new Date('03/08/2003'));
    });
  });
  
  describe('#addCover', function(){
    it('should create a new instance of Album', function(){
      var a1 = new Album({title: 'My Lil Dungeon',
                          taken: '03/08/2003',
                          });
      var oldPath = __dirname + '/../fixtures/dungeon-cover-copy.jpg';
      a1.addCover(oldPath);
      
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('My Lil Dungeon');
      expect(a1.taken).to.be.instanceof(Date);
      expect(a1.taken).to.deep.equal(new Date('03/08/2003'));
      expect(a1.cover).to.equal(path.normalize(__dirname + '/../../app/static/img/mylildungeon/cover.jpg'));
    });
  });
 
  describe('#insert', function(){
    it('should save a new instance of Album', function(done){
      var a1 = new Album({title: 'My Lil Dungeon',
                          taken: '03/08/2003',
                          });
      var oldPath = __dirname + '/../fixtures/dungeon-cover-copy.jpg';
      a1.addCover(oldPath);
      
      a1.insert(function(err){
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find an album based on its id', function(done){
      var a1 = new Album({title: 'My Lil Dungeon',
                          taken: '03/08/2003',
                          });
      var oldPath = __dirname + '/../fixtures/dungeon-cover-copy.jpg';
      a1.addCover(oldPath);
      
      a1.insert(function(err){
        Album.findById(a1._id.toString(), function(album){
          expect(album.title).to.equal('My Lil Dungeon');
          expect(album.taken).to.deep.equal(new Date('03/08/2003'));
          expect(a1.cover).to.equal(path.normalize(__dirname + '/../../app/static/img/mylildungeon/cover.jpg'));
          done();
        });
      });
    });
  });
  
  describe('#addPhoto', function(){
    it('should create a new photo in the album', function(){
      var a1 = new Album({title: 'My Lil Dungeon',
                          taken: '03/08/2003',
                          });
      var oldPath = __dirname + '/../fixtures/dungeon-cover-copy.jpg';
      a1.addCover(oldPath);
      var photoPath = __dirname + '/../fixtures/bear-copy.jpg';
      a1.addPhoto(photoPath, 'bear.jpg');
      
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('My Lil Dungeon');
      expect(a1.taken).to.be.instanceof(Date);
      expect(a1.taken).to.deep.equal(new Date('03/08/2003'));
      expect(a1.cover).to.equal(path.normalize(__dirname + '/../../app/static/img/mylildungeon/cover.jpg'));
      expect(a1.photos[0]).to.equal(path.normalize(__dirname + '/../../app/static/img/mylildungeon/bear.jpg'));
      expect(a1.photos).to.have.length(1);
    });
  });
// End Describe //
});
