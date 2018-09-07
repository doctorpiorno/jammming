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
    /* Step 54 */
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    /* Step 45: Track id is taken from this.props.id, not this.props.key,
    because "key" is a special snowflake prop that returns "undefined"
    when accessed. See: https://reactjs.org/warnings/special-props.html
    What we get from onClick is an *event*, not a track object, so we have to create a new track object and pass THAT along to onAdd / onRemove.
    */
    let track = {
      id: this.props.id,
      name: this.props.name,
      artist: this.props.artist,
      album: this.props.album
    }
    this.props.onAdd(track);
  }

  removeTrack() {
    /* Steps 53 - 55: See notes for addTrack above. */
    let track = {
      id: this.props.id,
      name: this.props.name,
      artist: this.props.artist,
      album: this.props.album
    }
    this.props.onRemove(track);
  }

  /* Step 27: renderAction should render + or - depending on whether
  we're adding or removing a track. isRemoval is passed along as a prop
  from SearchResults. [Note to self: doesn't TrackList have to pass it on?
  Response to self: Nope, because we're inheriting it via super(props)].
  Step 55: We have to call removeTrack() or addTrack() depending on what we're doing, so it's not just the text that changes, the onClick attribute too. We can't have that conditional in the render() method so moving it here.
  */
  renderAction() {
    if (this.props.isRemoval) {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>;
    } else {
      return <a className="Track-action" onClick={this.addTrack}>+</a>;
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.name}</h3>
          <p>{this.props.artist} | {this.props.album}</p>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}

export default Track;
