let userAccessToken;
let expiryTime;
const clientID = "66315be50a5d42af814984f8a9cf4e2a";
const redirectURI = "http://localhost:3000";
const baseUrl = "https://api.spotify.com/v1";
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

let Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      // Do we have an access token already? If affirmative, that's grand. :)
      return userAccessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) !== null &&
      window.location.href.match(/expires_in=([^&]*)/) !== null) {
      /* Step 79: Does the URL contain an access token and expiry time then? Had to look up what URL we're supponed to parse and how to access the browser address bar. */
      userAccessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiryTime = window.location.href.match(/expires_in=([^&]*)/)[1];
      // Step 80: How I was supposed to figure this out without the hint? :S
      window.setTimeout(() => userAccessToken = '', expiryTime * 10000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken
    } else {
      /* Step 83: If URL doesn't contain an access token, redirect the user to authentication page. */
      window.location = authUrl;
    }
  },

  search(term) {
    /* Steps 84 and up. Using page 3 of Requests II for reference.
    Note this is step 2 in the Implicit Grant Flow documentation, not 4. This is not really clear in the instructions, but this is where getAccessToken() comes into play; we call it to get a token before making an API request, as otherwise our auth token will have the default value (empty) resulting in the error 400 I kept getting earlier. */
    let accessToken = Spotify.getAccessToken();
    /* Do not forget blank space after "Bearer". Otherwise the auth header is not valid and the API returns error 400 until you figure this out (which took me a long time). */
    let authHeader = {
      Authorization: "Bearer " + accessToken
    };
    return fetch (`${baseUrl}/search?type=track&q=${term}`, {headers: authHeader}).then(response => {
      if (response.ok) {
        return response.json();
      	} throw new Error("Request failed!");
    	}, networkError => {
        console.log (networkError.message);
    	}).then (jsonResponse => {
        /* Create an empty array. If there be tracks, push them onto it. JSON response looks like /tracks/items/0, 1, 2, etc., which are the actual tracks. See https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-simplified. */
        let resultArray = [];
        jsonResponse.tracks.items.map(track => {
          resultArray.push({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          })
        })
        return resultArray;
    });
  },

  getUserID() {
    /* Refinement of step 92. Contacts API to get the current user's ID. */
    let accessToken = Spotify.getAccessToken();
    const userProfileUrl = `${baseUrl}/me`;

    return fetch (userProfileUrl, {
      headers: {Authorization: "Bearer " + accessToken}
    }).then(response => {
        if (response.ok) {
          return response.json();
        } throw new Error("Request failed!");
      }, networkError => {
        console.log (networkError.message);
      }).then (jsonResponse => {
        // Return user id.
        return jsonResponse.id;
      })
    },

  generatePlaylist(playlistName) {
    /* Refinement of step 93: Use returned user ID to create new playlist and return playlist ID. Have to specify "POST" as method, as otherwise the API complains GET/HEAD requests cannot include a body; also apparently need to stringify the body but not too sure why? $*/
    let accessToken = Spotify.getAccessToken();

    return this.getUserID().then(userID => {
      let createPlaylistURL = `${baseUrl}/users/${userID}/playlists`;
      return fetch (createPlaylistURL, {
        method: "POST",
        headers: {Authorization: "Bearer " + accessToken},
        body: JSON.stringify({name: playlistName, description: "Created with StruMMM."})
      }).then(response => {
          if (response.ok) {
            return response.json();
          } throw new Error("Request failed!");
        }, networkError => {
          console.log (networkError.message);
          }).then (jsonResponse => {
            // Return id of the generated playlist.
            return jsonResponse.id;
        })
    })
  },

  populatePlaylist(playlistName, trackURIs) {
    /* Step 90: Check if arguments are empty before proceeding.
    To do: Double-check logic of conditional statement when fully awake. */
    if (!(playlistName && trackURIs)) {
      return;
    }

    /* Compile list of tracks to populate the playlist with. Format for the body of the requestneeds to be something like:
     {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"]}
    That's not quite trackURIs and not quite JSON.stringify(trackURIs), so ended up creating a fresh "tracksToAdd" array with just the URIs to pass onto the body. */
    let tracksToAdd = []
    trackURIs.forEach(track => {
      tracksToAdd.push("spotify:track:" + track.id);
    })

    /* Requests start here. Get access token, then get user ID, then generate (empty) playlist, then populate it with tracksToAdd. */
    let accessToken = Spotify.getAccessToken();

    this.getUserID().then (userID => {
      return this.generatePlaylist(playlistName)
    }).then(playlistID => {
      return fetch (`${baseUrl}/playlists/${playlistID}/tracks`, {
        method: "POST",
        headers: {Authorization: "Bearer " + accessToken, "Content-Type": "application/json"},
        body: JSON.stringify({uris: tracksToAdd})
      })
    });

  } // End of populatePlaylist()

} // End of Spotify object

export default Spotify;
