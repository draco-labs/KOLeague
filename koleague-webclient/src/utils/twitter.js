import base64url from "base64url";
import { createHash, randomBytes } from "crypto";

export const twitterAuth = () => {
	const codeVerifier = base64url(randomBytes(32));
	const codeChallenge = "codeChallenge" || base64url(
		createHash("sha256").update(codeVerifier).digest()
	);
	sessionStorage.setItem("code_verifier", codeVerifier);
	sessionStorage.setItem("code_challenge", codeChallenge);
	sessionStorage.setItem("current_path", window.location.pathname + window.location.search);
	sessionStorage.setItem("current_ref", window.location.search);
	console.log('process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID', process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID)
	const returnUrl =
		"?response_type=code" +
		"&client_id=" +
		process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID +
		"&state=" +
		"state" +
		"&code_challenge=" +
		// 'challenge' +
		codeChallenge +
		"&code_challenge_method=plain" +
		"&redirect_uri=" +
		process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI +
		`&scope=tweet.read users.read follows.read follows.write offline.access`;
	console.log('returnUrl', returnUrl)
	if (false)
		window.open(
			("https://twitter.com/i/oauth2/authorize") +
			(returnUrl), "_blank")
	else window.location.href = ("https://x.com/i/oauth2/authorize") + returnUrl

	// let a = document.createElement("a");
	// document.body.appendChild(a);
	// a.style = "display: none";
	// a.href = ("https://twitter.com/i/oauth2/authorize") +
	// (returnUrl);
	// a.click();
	// document.body.removeChild(a);

}
