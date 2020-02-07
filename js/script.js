$(document).ready(function () {
  $(document).on('click', '.button', function () {
    resetSearch();
    searchFilm();
  });
  $('.search').keyup(function () {
    if (event.which == 13 || event.keyCode == 13) {
      resetSearch();
      searchFilm();
    }
  });
});

// FUNZIONI------------------

function searchFilm() {
  var ricerca = $('.search').val();
  $.ajax(
    {
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '37d5c5ef82f75ce59c3d75b9a0da47e4',
        language: 'it-IT',
        query: ricerca,
      },
      success: function (data) {
        var film = data.results;
        dataFilm(film);
      },
      error: function () {
        alert('errore');
      }
    }
  );
}
function dataFilm (data) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < data.length; i++) {
    var thisData = data[i];
    var vote = Math.ceil(thisData.vote_average / 2);
    var context = {
      title: thisData.title,
      original_title: thisData.original_title,
      original_language: thisData.original_language,
      vote_average: vote,
      star: star(vote),
      flag: flags(thisData.original_language),
    }
    var html = template(context);
    $('.film').append(html);
  }
  if (data.length <= 0) {
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
    console.log(i);
  }
  return somma;
}
function flags(lingua) {
  var bandiera = '';
  if (lingua == 'en') {
    bandiera += '<img src="img/english.png" alt="">';
  }
  else if (lingua == 'it') {
    bandiera += '<img src="img/italy.png" alt="">';
  }
  else if (lingua == 'fr') {
    bandiera += '<img src="img/france.png" alt="">';
  }
  else if (lingua == 'es') {
    bandiera += '<img src="img/spain.png" alt="">';
  }
  else if (lingua == 'de') {
    bandiera += '<img src="img/germany.png" alt="">';
  }
  else if (lingua == 'zh') {
    bandiera += '<img src="img/china.png" alt="">';
  }
  return bandiera;
}
