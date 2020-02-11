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
  $(".search").on("focus", function() {
  $(this).attr("placeholder", "");
  });
  $(".search").on("blur", function() {
    $(this).attr("placeholder", "Inserisci un titolo");
  });
});

// FUNZIONI------------------
function search() {
  var urlFilm = 'https://api.themoviedb.org/3/search/movie';
  var urlTv = 'https://api.themoviedb.org/3/search/tv';
  var typeFilm = 'Film';
  var typeTV = 'Serie Tv';
  var urlActorFilm = 'movie';
  var urlActorTv = 'tv';
  searchFilmTv(urlFilm, typeFilm, urlActorFilm);
  searchFilmTv(urlTv, typeTV, urlActorTv);
  if ($('.search').val().length == 0) {
    alert('inserisci una parola chiave');
  }
}

function searchFilmTv(url, type, urlActor) {
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
        dataFilm(film, type, data.total_results, urlActor);
      },
      error: function () {
        console.log('errore');
      }
    }
  );
}

function dataFilm (data, type, results, urlActor) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  var original_title;
  var title;
  var categoria;
  for (var i = 0; i < data.length; i++) {
    var thisData = data[i];
    var trama = thisData.overview;
    if (trama.length <= 0) {
      trama = 'non disponibile';
    }
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
      overview: trama,
      data: thisData.id,
    }
    var html = template(context);
    if (type == 'Film') {
      $('.film').append(html);
    } else if (type == 'Serie Tv') {
      $('.serie').append(html);
    }

    getDetails(thisData.id, urlActor);
  }

  function getDetails(id, type) {
    $.ajax(
      {
        url: "https://api.themoviedb.org/3/"+type+"/"+ id +"/credits",
        method: 'GET',
        data: {
          api_key: '37d5c5ef82f75ce59c3d75b9a0da47e4',
        },
        success: function (data) {
          var cast = data.cast;
          if (cast.length > 0) {
            if (cast.length > 5) {
              cast = cast.slice(0, 5);
            }
            var card = $('.specifiche[data-movie-id = "'+id+'"]');
            var item = '<li> <span> Cast: </span>';
            for (var i = 0; i < cast.length; i++) {
              console.log(i + ", " +cast[i]);
              item += cast[i].name + ', ';
            }
            item += '</li>';
            card.append(item);
          }
        },
        error: function () {
          console.log('errore');
        },
      }
    );
  }

  if (type == 'Film') {
    if (results == 0) {
      var context = {notfound:'Nessun film trovato'};
      var html = template(context);
      $('.film').append(html);
      $('.film ul.copertina').hide();
      $('.classe-film').hide();
      $('.film ul.not-found').show();
    } else {
      $('.film ul.not-found').hide();
      $('.film ul.copertina').show();
      $('.classe-film').show();
    }
    var source = $("#classe-template").html();
    var template = Handlebars.compile(source);
    var context = {classe: 'Film'};
    var html = template(context);
    $('.classe-film').prepend(html);
  }
  if (type == 'Serie Tv') {
    if (results == 0) {
      var context = {notfound:'Nessuna serie trovata'};
      var html = template(context);
      $('.serie').append(html);
      $('.serie ul.copertina').hide();
      $('.serie ul.not-found').show();
      $('.classe-serie').hide();
    } else{
      $('.serie ul.not-found').hide();
      $('.serie ul.copertina').show();
      $('.classe-serie').show();
    }
    var source = $("#classe-template").html();
    var template = Handlebars.compile(source);
    var context = {classe: 'Serie Tv'};
    var html = template(context);
    $('.classe-serie').prepend(html);
  }
  $('.search').val('');
}

function resetSearch() {
  $('.film').html('');
  $('.serie').html('');
  $('.classe-film').html('');
  $('.classe-serie').html('');
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
