import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/router'
import marketService from "@/services/market.service";

const CallBack = () => {
	const router = useRouter()
	const [code, setCode] = useState("")
	const [init, setInit] = useState(false)
	const [loading, setLoading] = useState(false);
	const [mobile, setMobile] = useState(true)

	useEffect(() => {
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get('code');
			if (code) {
				getDataCode(code)
			}
		} catch (error) {
			console.log('error', error)
		}
	}, [])

	const getDataCode = async (code) => {
		console.log('code', code)
		const loading = toast.loading("Connecting Twitter...")
		try {
			const { data } = await marketService.getTwitterInfo({
				"code": code,
				"challenge": sessionStorage.getItem("code_challenge") || "codeChallenge",
				"redirect_uri": process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI
			})

			console.log('data', data)
			if (data.code > 0) {
				localStorage.code = data?.code
				localStorage.twitter_uid = data?.id
				localStorage.name = data?.name
				localStorage.screen_name = data?.username
				localStorage.profile_url = data?.profile_url
				localStorage.jwt = data?.token
				window.location.href = "/"
			} else if (data.code == -50 ) {
				localStorage.twitter_uid = data?.id
				localStorage.name = data?.name
				localStorage.screen_name = data?.username
				localStorage.profile_url = data?.profile_url
				localStorage.jwt = data?.token
				router.push("/signin?step=2")
			} else {
				toast.error("Please check your twitter account!")
				toast.dismiss(loading)
				router.push("/signin")
				return
			}


			// if (!data.data) {
			//   toast.error("Please check your twitter account!")
			//   toast.dismiss(loading)
			//   return
			// }

			// const { twitter_uid, twitter_screen_name} = data?.data?.airdrop || {}
			// const { data: airdrop } = await shareService.getAccount({
			//   "populate": "*",
			// "sort": "createdAt" + ":desc",
			// "filters[twitter_uid][$eq]": localStorage.getItem("twitter_uid"),
			// })

			// const res = await shareService.postAccount(
			// 	{
			// 		data: {
			// 		"twitter_uid": data?.data?.airdrop?.id,
			// 		"ref_code": new Proxy(new URLSearchParams(sessionStorage.getItem("current_ref")), {
			// 			get: (searchParams, prop) => searchParams.get(prop),
			// 		})?.ref,
			// 		"twitter_screen_name": data?.data?.airdrop?.username,
			// 		}
			// 	},
			// )
			// console.log('res', res)
			// window.location.href = "/"

		} catch (err) {
			console.log('err', err)
			toast.error("Please check your twitter account!")
			router.push("/signin")
		}
		toast.dismiss(loading)
	}

	return (
		<div className="text-center">
			Loading
		</div>
	);
}

export default CallBack
