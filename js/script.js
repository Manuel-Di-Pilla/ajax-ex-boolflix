$(document).ready(function () {
  $(document).on('click', '.button', function () {
    resetSearch();
    search();
  });
  $('.search').keyup(function () {
    if (event.which == 13 || event.keyCode == 13) {
      resetSearch();
      search();
    }
  });
});

// FUNZIONI------------------
function search() {
  var urlFilm = 'https://api.themoviedb.org/3/search/movie';
  var urlTv = 'https://api.themoviedb.org/3/search/tv';
  var typeFilm = 'Film';
  var typeTV = 'Serie Tv';
  searchFilmTv(urlFilm, typeFilm);
  searchFilmTv(urlTv, typeTV);
  if ($('.search').val().length == 0) {
    alert('inserisci una parola chiave');
  }
}

function searchFilmTv(url, type) {
  var ricerca = $('.search').val();
  $.ajax(
    {
      url: url,
      method: 'GET',
      data: {
        api_key: '37d5c5ef82f75ce59c3d75b9a0da47e4',
        language: 'it-IT',
        query: ricerca,
      },
      success: function (data) {
        var film = data.results;
        dataFilm(film, type);
      },
      error: function () {

      }
    }
  );
}
function dataFilm (data, type) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  var original_title;
  var title;
  var categoria;
  for (var i = 0; i < data.length; i++) {
    var thisData = data[i];
    if (type == 'Film') {
      original_title = thisData.original_title;
      title = thisData.title;
    } else if (type == 'Serie Tv') {
      original_title = thisData.original_name;
      title = thisData.name;
    }
    var urlImg = 'https://image.tmdb.org/t/p/w185';
    var img = thisData.poster_path;
    var poster = urlImg + img;
    if (thisData.poster_path == null) {
      img = '/4Ghn0LSESaPZUFIhgQKrCMfluwm.jpg';
      poster = urlImg + img;
    }
    var vote = Math.ceil(thisData.vote_average / 2);
    var nazione = thisData.original_language;
    if (nazione != 'it' && nazione != 'de' && nazione != 'en' && nazione != 'es' && nazione != 'fr' && nazione != 'zh') {
      nazione = 'world';
    }
    var context = {
      title: title,
      original_language: thisData.original_language,
      vote_average: vote,
      star: star(vote),
      type: type,
      poster_path: poster,
      nazione: nazione,
    }
    var html = template(context);
    if (type == 'Film') {
      $('.film').append(html);
    } else if (type == 'Serie Tv') {
      $('.serie').append(html);
    }
  }
  if (type == 'Film') {
    if ($('.film ul').length <= 0) {
      var context = {notfound:'Nessun film trovato'};
      var html = template(context);
      $('.film').append(html);
    }
  }
  if (type == 'Serie Tv') {
    if ($('.serie ul').length <= 0) {
      var context = {notfound:'Nessuna serie trovata'};
      var html = template(context);
      $('.serie').append(html);
    }
  }
  $('.search').val('');
}
function resetSearch() {
  $('.film').html('');
  $('.serie').html('');
}
function star(voto) {
  var somma = '';
  for (var i = 0; i < 5; i++) {
    if (i < voto) {
      somma += '<i class="fas fa-star"></i>';
    } else {
      somma += '<i class="far fa-star"></i>';
    }
  }
  return somma;
}
