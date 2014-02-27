(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    getAlbums();
    $('#albums').on('click', '.album', showAlbum);
  }

  function showAlbum(){
    var id = $(this).attr('id');
    var url = window.location.origin + '/albums/'+id;
    console.log(url);
    $.getJSON(url, function(data){console.log(data);});
  }

  function getAlbums(){
    // Recieves all Album information from Node/Mongo
    var url = window.location.origin + '/albums';
    $.getJSON(url, pushAlbums);
  }

  function pushAlbums(data){
   // Pushes albums one at a time to displayAlbum
    _.map(data.albums, function(x){displayAlbum(x);});
  }

  function displayAlbum(album){
    // Create new div with background image
    var $a = $('<a>');
    var $div = $('<div>');
    var $title = $('<div>');
    var $date = $('<div>');
    var $delete = $('<div>');
    var date = album.taken.replace('T00:00:00.000Z', '');
    var cover = album.cover.replace('/data/code/Group/2014-02-26-tdd.photoAlbum/integrated_server/app/static', '');
    $div.css('background-image', 'url('+cover+')');
    $div.addClass('album');
    $title.text(album.title);
    $title.addClass('title');
    $date.addClass('date');
    $date.text(date);
    $div.attr('id', album._id.toString());
    $delete.css('background-image', 'url(img/delete.png)');
    $delete.addClass('delete');
    $a.attr('href','/albums/'+album._id);

    // Appends #albums with album $div
    $div.append($title, $date, $delete);
    $a.append($div);
    $('#albums').append($a);
  }

})();

