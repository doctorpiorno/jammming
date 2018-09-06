import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);

    //Step 31: Not sure I'm doing this properly. Calling the property
    //resultList rather than searchResults because the official policy
    //of calling everything by the exact same name makes my head hurt.
    //As I understand it, on this step, we're sending SearchResults a
    //mock response from the Spotify API.
    this.state = {
      resultList: [
        {name: "testName",
        artist: "testArtist",
        album: "testAlbum",
        id: "testId"}
      ]}
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults resultList={this.state.resultList} />
            <Playlist />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
