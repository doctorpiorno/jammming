let userAccessToken;
let expiryTime;
const clientID = "66315be50a5d42af814984f8a9cf4e2a";
const redirectURI = "http://doctorpiorno.surge.sh";
const baseUrl = "https://api.spotify.com/v1";
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

let Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      // Do we have an access token already? If affirmative, that's grand. :)
      console.log("Already have a userAccessToken."); //CAN BE DELETED
      return userAccessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) !== null &&
      window.location.href.match(/expires_in=([^&]*)/) !== null) {
      /* Step 79: Does the URL contain an access token and expiry time then? Had to look up what URL we're supponed to parse and how to access the browser address bar. */
      userAccessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiryTime = window.location.href.match(/expires_in=([^&]*)/)[1];
      // Step 80: How I was supposed to figure this out without the hint? :S
      window.setTimeout(() => userAccessToken = '', expiryTime * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log("userAccessToken found in URL."); //CAN BE DELETED
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

  savePlaylist(playlistName, trackURIs) {
    /* Step 90: Check if arguments are empty before proceeding.
    To do: Double-check logic of conditional statement when fully awake. */
    if (!(playlistName && trackURIs)) {
      return;
    }

    /* Step 91: Define default variables. */
    let accessToken = Spotify.getAccessToken();
    let authHeader = {
      Authorization: "Bearer " + accessToken
    };
    let userID;
    let playlistID;

    /* Step 92: Request user name. */
    const userProfileUrl = `${baseUrl}/me`;
    return fetch (userProfileUrl, {headers: authHeader}).then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error("Request failed!");
    }, networkError => {
      console.log (networkError.message);
    }).then (jsonResponse => {
      userID = jsonResponse.id;
      console.log ("User ID is: " + userID);
      return userID;
    }).then (userID => {
      /* Step 93: Use returned user ID to create new playlist and return playlist ID. Have to specify "POST" as method; otherwise the API complains GET/HEAD requests cannot include a body; also apparently need to stringify the body but not too sure why? $MANUCHECK.
      I initially had the playlist set to public: false but apparently that causes the API to return an error 403 because I guess I'm not requesting the right permissions on auth; see https://github.com/rckclmbr/pyportify/issues/60. */
      const createPlaylistURL = `${baseUrl}/users/${userID}/playlists`
      return fetch (createPlaylistURL, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({name: playlistName, description: "Created with Jammming."})
      });
    }).then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error("Request failed!");
    }, networkError => {
      console.log (networkError.message);
    }).then (jsonResponse => {
      playlistID = jsonResponse.id;
      console.log(playlistID); //CAN BE DELETED
      return playlistID;
    }).then(playlistID => {
      const populatePlaylistURL = `${baseUrl}/playlists/${playlistID}/tracks`;

      let tracksToAdd = []
      trackURIs.forEach(track => {
        tracksToAdd.push("spotify:track:" + track.id);
      })

      /* So it took a while to figure out the right format for the body of the request below; needs to be something like:
       {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"]}
      That's not quite trackURIs and not quite JSON.stringify(trackURIs), so ended up creating a fresh "tracksToAdd" array with just the URIs to pass onto the body. The following are debugging attempts and can be deleted.

      console.log ("trackURIs: " + trackURIs);  //CAN BE DELETED
      console.log ("JSON.stringify(trackURIs): " + JSON.stringify(trackURIs));  //CAN BE DELETED
      console.log ("JSON.stringify({uris: trackURIs}): " +  JSON.stringify({uris: trackURIs})); //CAN BE DELETED
      console.log ("tracksToAdd: " + tracksToAdd); //CAN BE DELETED */

      return fetch (populatePlaylistURL, {
        method: "POST",
        headers: {Authorization: "Bearer " + accessToken, "Content-Type": "application/json"},
        body: JSON.stringify({uris: tracksToAdd})
      });
    });

  } // End of savePlaylist()

} // End of Spotify object

export default Spotify;
