import React from "react";
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor (props) {
    super(props);
    // Step 69: Instructions don't actually mention this I think, but I guess we need to initialise the "term" property of state here.
    this.state = {
      term: ""
    }
    // Step 70:
    this.search = this.search.bind(this);
    // Step 72:
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(term) {
    // Step 69: So I guess this is what they mean  by "passing the state of the term"? CHECK IN CASE OF IMPLOSION.
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    // Step 71: And I guess this arises naturally from step 69...
    this.setState({term: event.target.value});
  }

  render() {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
