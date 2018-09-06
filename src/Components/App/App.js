import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);

    //Step 31: Not sure I'm doing this properly. Calling the property
    //foundTracks rather than searchResults because the official policy
    //of calling everything by the exact same name makes my head hurt.
    //As I understand it, on this step, we're sending SearchResults a
    //mock response from the Spotify API.
    this.state = {
      foundTracks: [
        {name: "Test Song",
        artist: "Test Artist",
        album: "Test Album",
        id: "Test ID"}
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

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults foundTracks={this.state.foundTracks} />
            <Playlist playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
