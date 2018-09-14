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

    this.undo = this.undo.bind(this);

    //Step 31: Calling the mock tracklist foundTracks rather than searchResults because the official policy of calling everything by the exact same name makes my head hurt.
    this.state = {
      foundTracks: [
        // Preloaded tracks for testing.
        // {album: "...And Justice For All", artist: "Metallica", id: "5IX4TbIR5mMHGE4wiWwKW0", name: "One"},
        // {album: "Powerslave (1998 Remastered Edition)", artist: "Iron Maiden", id: "6aYXSH9JZrD30Av2KlAOMY", name: "2 Minutes To Midnight - 1998 Remastered Version"},
        // {album: "3 A.M.", artist: "Jesse & Joy", id: "0yyZN5ASdrYu0XYWFzfxUu", name: "3 A.M."}
      ],
      playlistName: "New Playlist",
      playlistTracks: [],
      previousActions: []
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
    Spotify.populatePlaylist(this.state.playlistName, this.state.playlistTracks);
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

  addTrack(track, pos, isUndo) {
    /* Step 41: Checking whether a tracak with that ID has already been added. This is a lot less elegant than the solution in the hint, but I'm a caveman and I want to see if my solution works. The much nicer approach in the hint is:
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } */

    let alreadyAdded = false;

    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        alreadyAdded = true;
      }})

    /* If track hasn't been added, add it now to the end of the playlist (if we have no "pos" argument) or to the appropriate position if we do have a "pos" argument.
    Remember that setState takes an OBJECT, dammit. */

    if (alreadyAdded !== true) {

      if (pos === undefined) {
        this.setState({
          playlistTracks: this.state.playlistTracks.concat([track])
        });
      } else {
        /* splice() returns an array of deleted items (in this case an empty array, as we're not deleting any). Therefore we cannot directly assign the result of splice(pos, 0, track) to playListTracks, as it would delete our playlist - instead, we'll use an intermediate variable. There's probably a better way to do this, though. */
        let splicedList = this.state.playlistTracks;
        splicedList.splice(pos, 0, track);
        this.setState({
          playlistTracks: splicedList
        });
      }

      // Log the action, unless the isUndo parameter is set (i.e. this has been called by the undo() method).
      if (isUndo === undefined) {
        this.setState({previousActions: this.state.previousActions.concat({
          actionType: "add",
          track: track,
          position: this.state.playlistTracks.length
          })
        });
      }
    }
  }

  removeTrack(track, isUndo) {
    /* Step 49: I was going to do this with .findIndex and .splice but this Looks like a good use case for .filter (creates a new array with elements that pass the test implemented by the provided function).
    */

    let pos = this.state.playlistTracks.findIndex(item => item.id === track.id);
    console.log("Position: " + pos)

    this.setState({
      playlistTracks: this.state.playlistTracks.filter(item => item.id !== track.id)});

    // Log the action, unless the isUndo parameter is set (i.e. this has been called by the undo() method).
    if (isUndo === undefined) {
      this.setState({
          previousActions: this.state.previousActions.concat({
            actionType: "remove",
            track: track,
            position: pos
          })
        });
      }
  }

  undo() {
      let lastAction = this.state.previousActions.pop();

      if (lastAction.actionType === "add") {
        this.removeTrack(lastAction.track, true);
      } else {
        // Need to implement logic to re-add track at its previous position.
        // That logic would have to go in addTrack proper, right?
        this.addTrack(lastAction.track, lastAction.position, true);
      }
  }

  /* Step 42: Fairly sure onAdd={this.addTrack} does *NOT* need to be onadd={this.addTrack()}, but we'll know soon enough. CONFIRMED. */
  render() {
    return (
      <div>
        <h1>Stru<span className="highlight">mmm</span></h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults foundTracks={this.state.foundTracks} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} previousActions={this.state.previousActions} onRemove={this.removeTrack} onUndo={this.undo} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
