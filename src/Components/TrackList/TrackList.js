import React from "react";
import Track from '../Track/Track';
import "./TrackList.css";

class TrackList extends React.Component {
  render () {
    //Step 34: Currently this causes an error:
    //TypeError: Cannot read property 'map' of undefined
    //FIXED: Turns out this was being called from PLaylist.js with no arguments.
    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return <Track key={track.id} name={track.name} artist={track.artist} album={track.album} />;
        })}
      </div>
    )
  }
}

export default TrackList;
