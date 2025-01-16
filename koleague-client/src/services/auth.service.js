import { getAsync, postAsync, postAsyncLogin } from "./request";

const authService = {
	loginTwitter(params) {
		const url = `/api/auth/login-twitter`;
		return postAsyncLogin(url, params);
	},
	loginWithCode(params) {
		const url = `/api/auth/login-with-code`;
		return postAsyncLogin(url, params);
	},
	getMe() {
		const url = `/api/users/me`;
		return getAsync(url);
	},
	activeCode(params) {
		const url = `/api/auth/active`;
		return postAsync(url, params);
	},
	addWallet(params) {
		const url = `/api/wallet/add-wallet`;
		return postAsync(url, params);
	},
	configEth(params) {
		const url = `/api/config`;
		return getAsync(url, params);
	},
	getUsers(params) {
		const url = `/api/users`;
		return getAsync(url, params);
	},
	getRank(params) {
		const url = `/api/airdrops/my-rank`;
		return getAsync(url, params);
	},
}

export default authService;
