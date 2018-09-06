import React from "react";
import "./Track.css";

class Track extends React.Component {

//Step 27: renderAction should check whether we're adding or removing track.
//Fairly sure I'll to have to bind "this" at some point.

  renderAction() {
    if (this.props.isRemoval) {
      return "-";
    } else {
      return "+";
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>TRACKNAME</h3>
          <p>TRACKARTIST | TRACKALBUM</p>
        </div>
        <a class="Track-action">{this.renderAction()}</a>
      </div>
    )
  }
}

export default Track;
