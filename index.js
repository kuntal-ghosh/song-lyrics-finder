// getting reference
const songName = document.getElementById("song-name");
const searchBtn = document.getElementById("search");
const searchResult = document.getElementById("search-result");
const lyricsResult = document.getElementById("lyrics-result");
const div = document.createElement("div");

// search button click events
searchBtn.addEventListener("click", () => {
  searchResult.innerHTML = "";
  getSongBySongName(songName.value).then((songs) => {
    console.log(songs);
    let displayedSongNumber = 0;
    if (songs.length < 10) {
      displayedSongNumber = songs.length;
    } else {
      displayedSongNumber = 10;
    }

    for (let i = 0; i < displayedSongNumber; i++) {
      console.log(songs[i]);
      songObject = songs[i];
      const {
        id,
        title,
        artist: { name: artistName },
      } = songObject;

      searchResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
        <div class="col-md-9">
          <h3 class="lyrics-name">${title}</h3>
          <p class="author lead">Album by <span>${artistName}</span></p>
        </div>
        <div class="col-md-3 text-md-right text-center">
          <button class="btn btn-success" onclick="getLyrics('${title}', '${artistName}');">Get Lyrics</button>
        </div>
      </div>`;
    }
  });
  songName.value = "";
});

/**
 *  this function fetch songs from api according to song name
 *
 * @param {*string} songName
 * @returns list of song objects as a promise
 */
function getSongBySongName(songName) {
  return fetch(`https://api.lyrics.ovh/suggest/${songName}`)
    .then((response) => response.json())
    .then((songs) => songs.data);
}

/**
 *  this is a function that inputs lyrics in the lyrics-result section
 *
 * @param {*string} songName
 * @returns lyrics of the song
 */
function getLyrics(title, artistName) {
  if (title && artistName) {
    fetch(`https://api.lyrics.ovh/v1/${artistName}/${title}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          lyricsResult.innerHTML = `<div class="single-lyrics text-center">
          <button class="btn go-back">&lsaquo;</button>
          <h2 class="text-success mb-4">Sorry, don't have any lyrics for ${title} by ${artistName}</h2>
        </div>`;
          console.log("don't have any lyrics");
          return 0;
        }
      })
      .then((data) => {
        if (data) {
          console.log(data);
          lyricsResult.innerHTML = `<div class="single-lyrics text-center">
          <button class="btn go-back">&lsaquo;</button>
          <h2 class="text-success mb-4">${title} By ${artistName}</h2>
          <pre class="lyric text-white">
         ${data.lyrics}
          </pre>
        </div>`;
        }
      })
      .catch((error) => console.log(error));
  }
}
