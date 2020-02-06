$(document).ready(function () {
  $(document).on('click', '.button', function () {
    $('.film').html('');
    searchFilm();
  });
  $('.search').keyup(function () {
    if (event.keyCode == 13) {
      $('.film').html('');
      searchFilm();
    }
  });
});

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
    var html = template(thisData);
    $('.film').append(html);
  }
  if (data.length <= 0) {
    var context = {notfound:'Nessun risultato trovato'};
    var html = template(context);
    $('.film').append(html);
  }
}
