import React from "react";
import Track from '../Track/Track';
import "./TrackList.css";

class TrackList extends React.Component {
  render () {
    //Step 34: Currently this causes an error:
    //TypeError: Cannot read property 'map' of undefined
    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return <Track key={track.id} />;
        })}
      </div>
    )
  }
}

export default TrackList;
