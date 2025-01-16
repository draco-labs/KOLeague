import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, abi, provider } from '../utils/contract'
const withAuth = Component => {
	const Auth = (props) => {
		const [data, setData] = useState({})
		const [contract, setContract] = useState()
		// const [holderOf, setHolderOf] = useState()
		// Login data added to props via redux-store (or use react context for example)
		const { isLogin = false } = props;
		const router = useRouter()
		useEffect(() => {
			getData()
		}, [])

		const getData = async () => {
			// const { data } = await authService.getMe()
			// if (data?.error?.status) {
			// 	router.push("/login")
			// 	return
			// }

			// if (!isLogin && (!localStorage["jwt"] || (!localStorage.getItem(data?.wallet_address) && !localStorage.getItem("pk")))) {
			// 	router.push("/login")
			// 	return
			// }

			// setData(data);
			// if (isLogin) return

			const pk = localStorage.getItem("portco_privateKey")
			console.log('pk', pk)

			if (!pk) {
				// router.push("/signin")
				return
			}


			const signer = new ethers.Wallet(pk, provider); //pk
			console.log('signer', signer)
			const PortcoContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer) // contract testnet
			// const PortcoContract = new ethers.Contract("0x794F7Aa919d86B9c63719e71360120c2a8B54F45", abi, signer) // contract mainnet
			console.log('PortcoContract', PortcoContract)

			// if (true) {
			// 	const tx = await PortcoContract.deployERC20("Demo", "D")
			// 	const data = await tx?.wait()
			// 	console.log('tx', data?.events?.[0]?.address)
			// }

			setContract(PortcoContract)

			// getHolder
			// try {
			// 	const holderOf = await PortcoContract.supplyOf(data?.wallet_address) // địa chỉ của nó
			// 	console.log('holderOf', holderOf.toString())
			// 	// if (!holderOf || holderOf.toString() == 0) {
			// 	// 	router.push("/buy-first-share")
			// 	// 	return
			// 	// }
			// 	setHolderOf(holderOf.toString())
			// } catch (err) {
			// 	console.log('err', err)
			// 	// router.push("/buy-first-share")
			// 	return
			// }

			// await getHolder()

		}

		// // If user is not logged in, return login component
		// if (true) {
		// 	router.push("/login")
		// }

		// If user is logged in, return original component
		return (
			<Component {...props} data={data} syncData={getData} contract={contract} />
		);
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
};

export default withAuth;
