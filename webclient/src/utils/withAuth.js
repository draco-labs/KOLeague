import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, abi, provider } from '../utils/contract'
const withAuth = Component => {
	const Auth = (props) => {
		const [data, setData] = useState({})
		const [contract, setContract] = useState()
		useEffect(() => {
			getData()
		}, [])

		const getData = async () => {
			const pk = localStorage.getItem("portco_privateKey")
			console.log('pk', pk)

			if (!pk) {
				// router.push("/signin")
				return
			}


			const signer = new ethers.Wallet(pk, provider); //pk
			const PortcoContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer) // contract testnet
			console.log('PortcoContract', PortcoContract)

			setContract(PortcoContract)

		}

		return (
			<Component {...props} data={data} syncData={getData} contract={contract} />
		);
	};

	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
};

export default withAuth;
