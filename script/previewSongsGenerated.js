Authorization_key = localStorage.getItem("Authorization_key");

user_id = localStorage.getItem("user_id");
playlistID = localStorage.getItem("playlist_id");

const init = function () {
  showHtmlPlaylists();
};

const showHtmlPlaylists = function () {
  let html = "";
  html += `<iframe src="https://open.spotify.com/embed/playlist/${playlistID}" width="320"
            height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;

  document.querySelector(".js-load__playlist").innerHTML = html;
  console.log("toegevoegd aan queryselector");
};

document.addEventListener("DOMContentLoaded", function () {
  console.info("domcontentloaded");
  init();
});
