import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this); // Step 42: Bind(this) to .addTrack()

    //Step 31: Calling the mock tracklist foundTracks rather than searchResults because the official policy of calling everything by the exact same name makes my head hurt.
    //TEST OBJECTS TO BE REMOVED LATER.
    this.state = {
      foundTracks: [
        {name: "Test Song 1",
        artist: "Test Artist 1",
        album: "Test Album 1",
        id: "01"},
        {name: "Test Song 2",
        artist: "Test Artist 2",
        album: "Test Album 2",
        id: "02"}
      ],
      playlistName: "Test Playlist",
      playlistTracks: [
        {name: "Added song",
        artist: "Well-liked artist",
        album: "Famous album",
        id: "An id"}
      ]
    }
  }

  addTrack(track) {
    /* Step 41: This is seriously ghetto logic and a lot less elegant than the solution in the hint, but I want to see if it will work. The much nicer solution in the hint is:
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } */

    let alreadyAdded = false;

    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        alreadyAdded = true;
      }})

    if (alreadyAdded !== true) {
      this.setstate(track);
    }
  }

//Step 42: Fairly sure onAdd={this.addTrack} does *NOT* need extra brackets, like this: onadd={this.addTrack()}.
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults foundTracks={this.state.foundTracks} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
