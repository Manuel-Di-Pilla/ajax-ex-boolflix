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
        alert('errore');
      }
    }
  );
}
function dataFilm (data, type) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < data.length; i++) {
    var thisData = data[i];
    var vote = Math.ceil(thisData.vote_average / 2);
    var context = {
      title: thisData.title,
      original_title: thisData.original_title,
      name: thisData.name,
      original_name: thisData.original_name,
      original_language: thisData.original_language,
      vote_average: thisData.vote_average,
      star: star(vote),
      type: type,
      poster_path: thisData.poster_path,
      nazione: thisData.original_language,
    }
    var html = template(context);
    $('.film').append(html);
  }
  if ($('.film ul').length <= 0) {
    var context = {notfound:'Nessun risultato trovato'};
    var html = template(context);
    $('.film').append(html);
  }
}
function resetSearch() {
  $('.film').html('');
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
