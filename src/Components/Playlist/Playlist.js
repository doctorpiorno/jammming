import React from "react";
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {
  render() {
    const defaultValue =
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"}/>
        <!-- Add a TrackList component -->
        // Uncomment later (see step 20): <TrackList />
        <a className="Playlist-save">SAVE TO SPOTIFY</a>
      </div>
    )
  }
}

export default Playlist;
