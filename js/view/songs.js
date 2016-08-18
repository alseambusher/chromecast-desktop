/*jshint esversion: 6 */
class Song {
  constructor(fullpath){
    let separator;
    // If windows
    if (navigator.platform.indexOf("Win") != -1)
        separator = "\\";
    else
      separator = "/";
    this.fullpath = fullpath;
    this.filename = fullpath.split(separator).pop();
    this.path = fullpath.substring(0, fullpath.length - this.filename.length);
    // TODO
    this.duration = "00:00:00";
  }
}

class Songs {
  constructor(songs = []){
    this.songs = songs;
    this.playing = undefined;
  }
  play (song) {
    this.playing = song;
  }
  add(song){
    this.songs.push(song);
  }
  add_file(fullpath){
    this.add(new Song(fullpath));
  }
}
