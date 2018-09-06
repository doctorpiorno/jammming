import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor (props) {
    super(props);
    /* Step 46: We've passed "addTrack" along all the way from App.js,
    then SearchResults, then TrackList, then Track, via the onAdd prop.
    Since we're finally going to be call it in this component, we need
    to bind "this" to it so it knows that "this" equals the Track
    component in this context.
    */
    this.addTrack = this.addTrack.bind(this);
  }

  /* Step 27: renderAction should render + or - depending on whether
  we're adding or removing a track. isRemoval is passed along as a prop
  from SearchResults. Note to self: shouldn't TrackList pass it on?
  */
  renderAction() {
    if (this.props.isRemoval) {
      return "-";
    } else {
      return "+";
    }
  }

  addTrack() {
    /* Step 45: PICK UP FROM HERE.
    So for some reason the track id is not being passed along from TrackList,
    hence I can only ever add one song before all the following songs are marked
    as duplicates. Maybe "key" has skipped a jump somewhere?
     */

    console.log(this.props.key);
    let track = {
      id: this.props.key,
      name: this.props.name,
      artist: this.props.artist,
      album: this.props.album
    }
    this.props.onAdd(track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.name}</h3>
          <p>{this.props.artist} | {this.props.album}</p>
        </div>
        <a className="Track-action" onClick={this.addTrack}>{this.renderAction()}</a>
      </div>
    )
  }
}

export default Track;
