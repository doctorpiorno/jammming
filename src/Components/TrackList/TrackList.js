import React from "react";
import Track from '../Track/Track';
import "./TrackList.css";

class TrackList extends React.Component {
  render () {
    /* As of step 34: This component was throwing a TypeError: Cannot read
    property 'map' of undefined; turns out this component was being called
    from both SearchResults.js and Playlist.js, and the second was not
    passing it any tracks at the time. This is now fixed.
    As of step 46: Added id={track.id] to props passed to <Track />; seems
    redundant, but trying to access .key in <Track /> returned "undefined".
    See https://reactjs.org/warnings/special-props.html for explanation.
    */

    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return <Track key={track.id} id={track.id} name={track.name} artist={track.artist} album={track.album} onAdd={this.props.onAdd}/>;
        })}
      </div>
    )
  }
}

export default TrackList;
