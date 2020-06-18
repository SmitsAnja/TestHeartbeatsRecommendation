//Authorization_key ="BQCDqRJaaG1BKw2aAkLgbJlgdnTyI8pNkZ5QKuEl8Ka6_8cH8u8_5HTVj2h__HeMFt3mLE17qd9oYIenTnxHRoShR9CqrcYRAySp1KpdxWH4FoW4wWq1r5skojReq1pPOLB-hZQ7m2d-xXDF5pnSHo5zyGav5l5dwtLWRtMy8Qa9UvY16cyNhjWFNElGI-yK8ofkOrvpbu6aY7UXfmk0m5NLG3F2Jzbm8w";

Authorization_key = localStorage.getItem("Authorization_key");
let customHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${Authorization_key}`,
};

user_id = localStorage.getItem("user_id");
display_name = localStorage.getItem("display_name");
URI = "https://api.spotify.com/v1";
//user_id = "8437qbev57v9zy5tjwhgl6b0d";
var slideIndex = 1;
artist = "Rick Ashley";
//arrayArtists = ["The Osmonds", "Jackson Five", "Edith Piaff"];
//arrayGenres = ["french soundtrack", "belgian pop"];

if (localStorage.getItem("genre") != "") {
  arrayGenres = [`${localStorage.getItem("genre")}`, "belgian pop"];
} else {
  arrayGenres = ["french soundtrack", "belgian pop"];
}

if (localStorage.getItem("artist") != "") {
  arrayArtists = localStorage.getItem("artist");
} else {
  arrayArtists = ["The Osmonds", "Jackson Five", "Edith Piaff"];
}

if (localStorage.getItem("PlaylistName") != "") {
  name_playlist = localStorage.getItem("PlaylistName");
} else {
  name_playlist = "geen naam ingevuld";
}
//name_playlist = "generateTest";

var playlistID;
// je kan max 5 seeds meegeven
var arrayTracks = [];
var arrayArtistsID = [];

if (localStorage.getItem("yearInput") != "") {
  var yearBorn = parseInt(localStorage.getItem("yearInput"));
} else {
  var yearBorn = 1955;
}

var yearMin = yearBorn + 16;
var yearMax = yearBorn + 30;

var dictLikeDislike = [];
var arrayRecommendationSongs;
var arrayRecommendationSongsTwenty = [];

const init = async function () {
  //artistsid();
  // belangrijk search aanzetten!
  loadName(display_name);
  searchtracksYears();
  //createPlaylist();
};

function loadName(name) {
  document.querySelector(".js-load_gebruikersnaam").innerHTML = name;
}

/* #region navigate songs */
// Next/previous controls
function plusSong(n) {
  showSlides((slideIndex += n));
}

// Thumbnail songs controls
function currentSong(n) {
  showSlides((slideIndex = n));
}

function smileyRed() {
  console.log("clicked red");
  console.log(slideIndex);
  if (Object.keys(dictLikeDislike).length < 4) {
    dictLikeDislike.push({
      key: "dislike",
      value: arrayRecommendationSongs[slideIndex - 2],
    });
  } else if (Object.keys(dictLikeDislike).length < 5) {
    dictLikeDislike.push({
      key: "like",
      value: arrayRecommendationSongs[slideIndex - 1],
    });
  }
  if (Object.keys(dictLikeDislike).length == 5) {
    putDictLikeDislike(dictLikeDislike);
    console.log(dictLikeDislike);
  }
}

function smileyGreen() {
  console.log("clicked green");
  console.log(arrayRecommendationSongs);
  if (Object.keys(dictLikeDislike).length < 4) {
    dictLikeDislike.push({
      key: "like",
      value: arrayRecommendationSongs[slideIndex - 2],
    });
  } else if (Object.keys(dictLikeDislike).length < 5) {
    dictLikeDislike.push({
      key: "like",
      value: arrayRecommendationSongs[slideIndex - 1],
    });
  }

  if (Object.keys(dictLikeDislike).length == 5) {
    putDictLikeDislike(dictLikeDislike);
    console.log(dictLikeDislike);
  }
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("c-widget__song");
  var dots = document.getElementsByClassName("c-icon__dot");
  var nextStyle = document.getElementsByClassName("c-icon__next")[0];
  var prevStyle = document.getElementsByClassName("c-icon__prev")[0];

  console.log(n);
  if (n == slides.length) {
    //next overload
    document.getElementById("next").removeAttribute("onclick");
    nextStyle.classList.replace(
      "c-icon__next-active",
      "c-icon__next-non_active"
    );
    document.getElementById("smiley-green").removeAttribute("onclick");
    document.getElementById("smiley-red").removeAttribute("onclick");
    document
      .getElementById("smiley-green")
      .setAttribute("onclick", `smileyGreen();`);
    document
      .getElementById("smiley-red")
      .setAttribute("onclick", `smileyRed();`);
  }
  if (n < slides.length) {
    document.getElementById("next").setAttribute("onclick", "plusSong(1)");
    nextStyle.classList.replace(
      "c-icon__next-non_active",
      "c-icon__next-active"
    );
    document
      .getElementById("smiley-green")
      .setAttribute("onclick", `plusSong(1);smileyGreen();`);
    document
      .getElementById("smiley-red")
      .setAttribute("onclick", `plusSong(1);smileyRed();`);
  }
  if (n > 1) {
    //prev overload
    document.getElementById("prev").setAttribute("onclick", "plusSong(-1)");
    prevStyle.classList.replace(
      "c-icon__prev-non_active",
      "c-icon__prev-active"
    );
  }
  if (n == 1) {
    document.getElementById("prev").removeAttribute("onclick");
    prevStyle.classList.replace(
      "c-icon__prev-active",
      "c-icon__prev-non_active"
    );
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" c-icon__dot-active ", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " c-icon__dot-active ";
}

/* #endregion */

/* #region artists */

function artistsid() {
  for (artiest in arrayArtists) {
    fetchArtist(artiest);
  }
}

let fetchArtist = async function (artiest) {
  //alert(artiest);
  // Eerst bouwen we onze url op
  const SERVER_ENDPOINT = `${URI}/search?q=${artiest}&type=artist`;
  // Met de fetch API proberen we de data op te halen.
  const response = await fetch(SERVER_ENDPOINT, {
    headers: customHeaders,
  });
  const queryResponse = await response.json();
  console.log(queryResponse);
  getArtistID(queryResponse);
};

function getArtistID(queryResponse) {
  console.log(Object.values(queryResponse));
  artist = Object.values(queryResponse)[0];
  artistid = artist.items[0].id;
  arrayArtistsID.push(artistid);
  //fetchRecommendation(artistid);
  console.log(arrayArtistsID);
  if (arrayArtistsID.length == arrayArtists.length) {
    fetchRecommendation(arrayArtistsID);
  }
}

/* #endregion */

/* #region searchtracksYears */
function searchtracksYears() {
  for (artiest in arrayArtists) {
    fetchTrackYear(artiest);
  }
}

let fetchTrackYear = async function (artiest) {
  //alert(artiest);
  // Eerst bouwen we onze url op
  const SERVER_ENDPOINT = `${URI}/search?q=year%3A${yearMin}-${yearMax}%20artist%3A${artiest}&type=track`;
  // Met de fetch API proberen we de data op te halen.
  const response = await fetch(SERVER_ENDPOINT, {
    headers: customHeaders,
  });
  const queryResponse = await response.json();
  console.log("queryrespone search");
  console.log(queryResponse);
  getTrackYear(queryResponse);
};

function getTrackYear(queryResponse) {
  trackId = queryResponse.tracks.items[0].id;
  console.log(trackId);
  arrayTracks.push(trackId);
  console.log(arrayTracks);
  if (arrayTracks.length == 3) {
    fetchRecommendation(arrayTracks);
  }
}
/* #endregion */

let fetchRecommendation = async function (artistid) {
  // Eerst bouwen we onze url op
  if (arrayGenres != "") {
    //const SERVER_ENDPOINT = `${URI}/recommendations?market=BE&seed_artists=${artistid}&seed_genres=${arrayGenres}&seed_tracks=${trackid}`;
    //const SERVER_ENDPOINT = `${URI}/recommendations?year:${yearMin}-${yearMax}&market=BE&seed_artists=${artistid}&seed_genres=${arrayGenres}`;
    const SERVER_ENDPOINT = `${URI}/recommendations?limit=100&market=BE&seed_tracks=${artistid}&seed_genres=${arrayGenres}`;
    // Met de fetch API proberen we de data op te halen.
    const response = await fetch(SERVER_ENDPOINT, {
      headers: customHeaders,
    });
    const queryResponse = await response.json();
    console.log(queryResponse);
    getInfoRecommendation(queryResponse);
  } else {
    const SERVER_ENDPOINT = `${URI}/recommendations?seed_artists=${artistid}`;
    // Met de fetch API proberen we de data op te halen.
    const response = await fetch(SERVER_ENDPOINT, {
      headers: customHeaders,
    });
    const queryResponse = await response.json();
    //console.log(queryResponse);
    getInfoRecommendation(queryResponse);
  }
};

function getInfoRecommendation(queryResponse) {
  console.log(queryResponse);
  tracksRecommendation = queryResponse.tracks;
  console.log(tracksRecommendation);
  let counter = 0;
  arrayRecommendationSongs = [];
  for (var data of tracksRecommendation) {
    tracksRecommendationYear = data.album.release_date;
    tracksRecommendation = data.id;

    if (
      tracksRecommendationYear > yearMin &&
      tracksRecommendationYear < yearMax &&
      counter < 5
    ) {
      console.log("recommendation");
      console.log(tracksRecommendation);
      console.log(tracksRecommendationYear);
      arrayRecommendationSongs.push(tracksRecommendation);
      counter += 1;
      if (counter == 5) {
        showHtmlSongs(arrayRecommendationSongs);
      }
    }
    if (
      tracksRecommendationYear > yearMin &&
      tracksRecommendationYear < yearMax &&
      counter < 21
    ) {
      arrayRecommendationSongsTwenty.push(tracksRecommendation);
    }
  }
  console.log("woow");
  console.log(counter);
}

const showHtmlSongs = function (arrayRecommendationSongs) {
  let counter = 0;
  let html = "";
  for (const id of arrayRecommendationSongs) {
    html += ` <div class="c-preview js-load-song-preview">
                    <div class="c-widget__song">
                        <iframe class="c-iframe" src="https://open.spotify.com/embed/track/${id}"
                            frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </div>
                </div>`;
    counter += 1;
  }
  document.querySelector(".js-load-all-songs").innerHTML = html;
  console.log("toegevoegd aan queryselector");
  console.log(arrayRecommendationSongs);
  showSlides(slideIndex);
  createPlaylist();
};

let createPlaylist = async function () {
  data = {
    name: `${name_playlist}`,
    description: "",
    public: false,
  };
  const SERVER_ENDPOINT = `${URI}/users/${user_id}/playlists`;
  // Met de fetch API proberen we de data op te halen.
  const response = await fetch(SERVER_ENDPOINT, {
    method: "POST", // or 'PUT'
    headers: customHeaders,
    body: JSON.stringify(data),
  });
  const queryResponse = await response.json();
  console.log(queryResponse);
  getPlaylistID(queryResponse);
};

function getPlaylistID(queryResponse) {
  playlistID = queryResponse.id;
  fillPlaylist(playlistID);
}

let fillPlaylist = async function (playlistID) {
  console.log(playlistID);
  Uri = "spotify:track:";
  newUri = [];
  for (dataBody of arrayRecommendationSongsTwenty) {
    newUri.push(Uri.concat(dataBody));
  }

  data = {
    uris: newUri,
  };
  const SERVER_ENDPOINT = `${URI}/playlists/${playlistID}/tracks`;
  // Met de fetch API proberen we de data op te halen.
  const response = await fetch(SERVER_ENDPOINT, {
    method: "POST", // or 'PUT'
    headers: customHeaders,
    body: JSON.stringify(data),
  });
  const queryResponse = await response.json();
  console.log(queryResponse);
};

function putDictLikeDislike(dictLikeDislike) {
  console.log("function dict");
  console.log(dictLikeDislike);
  passString();
  window.location.replace("./previewSongsGeneratedPlaylist.html");
}

function passString() {
  window.localStorage.setItem("Authorization_key", Authorization_key);
  window.localStorage.setItem("playlist_id", playlistID);
  window.localStorage.setItem("user_id", user_id);
}

const fetchData = function (url) {
  fetch(url, { headers: customHeaders })
    .then((r) => r.json())
    .then((data) => data);
};

document.addEventListener("DOMContentLoaded", function () {
  console.info("domcontentloaded");
  init();
});
