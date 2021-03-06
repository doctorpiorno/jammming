import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    // Step 42: Bind(this) to .addTrack(). Not 100% sure why this is needed? $MANUCHECK
    this.addTrack = this.addTrack.bind(this);
    // Step 50: Bind(this) to .removeTrack(). See above.
    this.removeTrack = this.removeTrack.bind(this);
    // Step 57: Bind(this) to .updatePlaylistName(). See above.
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    // Step 64: Bind(this) to .savePlaylist(). See above.
    this.savePlaylist = this.savePlaylist.bind(this);
    // Step 68: Bind(this) to .search(). See above.
    this.search = this.search.bind(this);

    //Step 31: Calling the mock tracklist foundTracks rather than searchResults because the official policy of calling everything by the exact same name makes my head hurt.
    this.state = {
      foundTracks: [],
      playlistName: "New Playlist",
      playlistTracks: []
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlaylist() {
    // Step 63: This is how I understand the instructions.
    let trackURIs = [];
      this.state.playlistTracks.forEach(track => {
        trackURIs.push("spotify:track:" + track.id);
      });
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks);
    // this.updatePlaylistName("New Playlist");
    this.setState({playlistTracks: []});
    this.setState({playlistName: "New Playlist"});
  }

  search(term) {
    Spotify.search(term).then (result => {
      //Note to self: this.setstate takes brackets + an object, not =. Get that into your slow head, Fran.
      this.setState({
        foundTracks: result
      })
    })
  }

  addTrack(track) {
    /* Step 41: This is a lot less elegant than the solution in the hint, but I'm a caveman and I want to see if my solution works. The much nicer approach in the hint is:
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

      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track])
    });
    }
  }

  removeTrack(track) {
    /* Step 49: I was going to do this with .findIndex and .splice but this Looks like a good use case for .filter (creates a new array with elements that pass the test implemented by the provided function).
    */

    this.setState({
        playlistTracks: this.state.playlistTracks.filter(element => element.id !== track.id)
        });
  }

  /* Step 42: Fairly sure onAdd={this.addTrack} does *NOT* need to be onadd={this.addTrack()}, but we'll know soon enough. CONFIRMED. */
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults foundTracks={this.state.foundTracks} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
