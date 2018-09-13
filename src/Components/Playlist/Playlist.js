import React from "react";
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    //this.renderUndo = this.renderUndo.bind(this);
  }

  /* Step 59: Not sure this was how we handled getting an input value from an event. Check notes if it fails. Note: Nope, it's OK. */

  handleNameChange(event) {
    this.props.onNameChange(event.target.value)
  }

  renderUndo() {
    if (this.props.playlistTracks.length > 0) {
      return <a className="Playlist-undo" onClick={this.props.onUndo}>UNDO</a>;
    //} else {
      //return <a className="Playlist-undo" onClick={this.props.onUndo}>NOT UNDO</a>;
    }
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"} onChange={this.handleNameChange} />
          <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        {this.renderUndo()}
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    )
  }
}

export default Playlist;
