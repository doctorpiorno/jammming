import React from "react";
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

class SearchResults extends React.Component {
  // Step 33: Passing resultList from App.js to TrackList as attribute "tracks".
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
          <TrackList tracks={this.props.resultList}/>
      </div>
    );
  }
}

export default SearchResults;
