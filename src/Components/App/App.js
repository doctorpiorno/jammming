import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    // Step 42: Bind(this) to .addTrack(). Not 100% sure why this is needed? $MANUCHECK
    this.addTrack = this.addTrack.bind(this);
    // Step 50: Bind(this) to .removeTrack(). See above.
    this.removeTrack = this.removeTrack.bind(this);
    // Step 57: Bind(this) to .updatePlaylistName(). See above.
    this.updatePlaylistName = this.updatePlaylistName.bind(this);

    //Step 31: Calling the mock tracklist foundTracks rather than searchResults because the official policy of calling everything by the exact same name makes my head hurt.
    //TEST OBJECTS TO BE REMOVED LATER.
    this.state = {
      foundTracks: [
        {name: "Ghost Love Score",
        artist: "Nightwish",
        album: "Once",
        id: "330345"},
        {name: "Que tengas suertecita",
        artist: "Enrique Bunbury",
        album: "Freak Show",
        id: "124114"}
      ],
      playlistName: "Test Playlist",
      playlistTracks: [
        {name: "Bongo Bong",
        artist: "Manu Chao",
        album: "Clandestino",
        id: "659821"}
      ]
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  addTrack(track) {
    /* Step 41: This is seriously ghetto logic and a lot less elegant than the solution in the hint, but I'm a caveman and I want to see if my solution works. The much nicer approach in the hint is:
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } */

    let alreadyAdded = false;

    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        alreadyAdded = true;
      }})

    if (alreadyAdded !== true) {
      /* Step 45: Remember that setState takes an OBJECT, dammit.
      Using concat here as we're adding to an array of objects, so simply passing track to playlistTracks via setState would replace our array w/ an object and we don't want that. */

      console.log(track); //CAN BE DELETED NOW

      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track])
    });
    }
  }

  removeTrack(track) {
    /* Step 49: I was going to do this with .findIndex .splice but this Looks like a good use case for .filter (creates a new array with elements that pass the test implemented by the provided function).
    */

    this.setState({
        playlistTracks: this.state.playlistTracks.filter(element => element.id !== track.id)
        });
  }

  /* Step 42: Fairly sure onAdd={this.addTrack} does *NOT* need to be onadd={this.addTrack()}, but we'll know soon enough. */
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults foundTracks={this.state.foundTracks} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
