let userAccessToken;
let expiryTime;
const clientID = "66315be50a5d42af814984f8a9cf4e2a";
const redirectURI = "http://localhost:3000/";
const searchUrl = "https://api.spotify.com/v1/search?";
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

/* Step 76: "In Spotify.js create a Spotify module as an empty object."
Huh, I hope I'm understanding this properly. :?
*/
let Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      // Do we have an access token already. If affirmative, that's grand. :)
      console.log("Already have a userAccessToken.");
      return userAccessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) !== null &&
      window.location.href.match(/expires_in=([^&]*)/) !== null) {
      /* Step 79: Does the URL contain an access token and expiry time then?
      Hoping this will make sense later because it sure as hell doesn't
      right now. At what point am I supposed to be getting that URL
      I am supponed to parse? */
      userAccessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiryTime = window.location.href.match(/expires_in=([^&]*)/)[1];
      // Step 80: How I was supposed to figure this out without the hint? :S
      window.setTimeout(() => userAccessToken = '', expiryTime * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log("userAccessToken found in URL.");
      return userAccessToken
    } else {
      /* Step 83: If URL doesn't contain an access token, redirect the user
      to authentication page. */
      window.location = authUrl;
    }
  },

  search(term) {
    //Steps 84 and up. Using page 3 of Requests II for reference.
    /* Note this is step 2 in the Implicit Grant Flow documentation, not 4. So this is not really in the instructions, but this is where we need to call getAccessToken. Makes sense, as otherwise we'd always be passing the default value which is null, resulting in the error 400 I kept getting earlier. */
    let accessToken = Spotify.getAccessToken();
    return fetch(`${searchUrl}type=track&q=${term}`, {
      headers: {
       Authorization: "Bearer " + accessToken
      }
      // Surprisingly important: there needs to be a blank space after "Bearer". Otherwise the auth header is not valid and you keep getting an error 400. Like I did. For a long time.
    }).then(response => {
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
  }
}

save

export default Spotify;
