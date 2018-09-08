let url="https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123";

let regexResult = url.match(/access_token=([^&]*)/)[0];

console.log(regexResult);
