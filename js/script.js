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
    }
    var html = template(context);
    $('.film').append(html);
  }
  if (data.length <= 0) {
    var context = {notfound:'Nessun risultato trovato'};
    var html = template(context);
    $('.film').append(html);
  }
  star(data);
}
function resetSearch() {
  $('.film').html('');
}
function star(data) {
  for (var i = 0; i < data.length; i++) {
    var thisList = $('ul').eq(i).find('li#voto').text();
    var thisStar = $('ul').eq(i).find('li#voto span i');

    if (thisList == 1) {
      thisStar.eq(0).css('color', 'red').removeClass('far').addClass('fas');
    }
    else if (thisList == 2) {
      thisStar.eq(0).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(1).css('color', 'red').removeClass('far').addClass('fas');
    }
    else if (thisList == 3) {
      thisStar.eq(0).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(1).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(2).css('color', 'red').removeClass('far').addClass('fas');
    }
    else if (thisList == 4) {
      thisStar.eq(0).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(1).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(2).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(3).css('color', 'red').removeClass('far').addClass('fas');
    }
    else if (thisList == 5) {
      thisStar.eq(0).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(1).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(2).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(3).css('color', 'red').removeClass('far').addClass('fas');
      thisStar.eq(4).css('color', 'red').removeClass('far').addClass('fas');
    }
  }
}
