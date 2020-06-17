// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

// Set token
let _token = hash.access_token;

const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "4e30f282f2b741a49cec4492f318ff35";
const redirectUri =
  "https://smitsanja.github.io/TestHeartbeatsRecommendation/index.html";
const scopes = ["playlist-modify-private"];

console.log(_token);

// If there is no token, redirect to Spotify authorization
if (!_token) {
  console.log("ooops");
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token`;
}

function passString(PlaylistName, genre, artist, year) {
  window.localStorage.setItem("PlaylistName", PlaylistName);
  window.localStorage.setItem("genre", genre);
  window.localStorage.setItem("artist", artist);
  window.localStorage.setItem("year", year);
  window.localStorage.setItem("Authorization_key", _token);
  location.href = "previewSongs.html";
}

function passStrings() {
  PlaylistName = document.getElementById("playlistName").value;
  genre = document.getElementById("genre").value;
  artist = document.getElementById("artist").value;
  year = document.getElementById("year").value;
  passString(PlaylistName, genre, artist, year);
}
