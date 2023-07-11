'use strict';

const dotenv = require("dotenv");
// const { SnetSDK, DefaultPaymentStrategy } = require("snet-sdk-shark");
const SnetSDK = require("./lib/dist").default;
console.log(SnetSDK)
//  const {SnetSDK} = require("./lib/src/sdk-core");
const service = require("./translate_grpc_pb");
const messages = require("./translate_pb");

const config = {
	"privateKey": "<USE_PRIVATE_KEY>",
	"networkId": 1,
	"org_id": "naint",
	"service_id": "machine-translation",
	"web3Provider": "<WEB3_PROVIDER>",
 }

 dotenv.config();
 const sdk = new SnetSDK(config);
async function translation(query, API_KEY) {
	// returns a random integer between 0 and 9
	// await wait(1000);
	// sdk.paymentChannelManagementStrategy = new DefaultPaymentStrategy(100);
	const client = await sdk.createServiceClient(
		"naint",
		"machine-translation",
		service.RomanceTranslatorClient,
		'default_group',
		null,
		{ email: 'dev.codesymphony@gmail.com', tokenToMakeFreeCall:
		'',
	},
	);
	const translateReq = new Promise(function(resolve, reject) {
		// Uncomment this to test real translation
		// const input = new messages.Input();
		// input.setSentencesUrl(query);
		// input.setSourceLang("eng_Latn");
		// input.setTargetLang("fra_Latn");
		// client.service.translate(input, (err, resp) => {
		// 	console.log(err);
		// 	console.log(resp);
		// 	console.log(resp.array)
		// 	console.log(resp.array[0])
		// 	if (err) reject(err);
		// 	resolve(resp);
		// });
		resolve({array: ['translated mock text']});
	});
	const resp = await translateReq;
	console.log(resp.array[0]);
	const randomNumber = resp.array[0];
	// here you need to return HTML code for your package. You can use <style> and <script> tags
	// you need to keep <div id="presearchPackage"> here, you can remove everything else
	return `
	<div id="presearchPackage">
		<span class="mycolor">Random number: ${randomNumber}</span>
	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>
		/* styles for dark mode should have .dark before */
		.dark #presearchPackage .mycolor {
			color: yellow;
		}
		#presearchPackage .mycolor {
			color: green;
			cursor: pointer;
		}
	</style>
	<!-- example javascript -->
	<script>
		document.querySelector(".mycolor").addEventListener("click", () => alert("clicked!"));
	</script>
	`;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
	if (query) {
		// convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.
		query = query ? query.toLowerCase() : "";
		if (query.indexOf("translate") === 0) return true;
	}
	// you need to return false when the query should not trigger your package
	return false;
}

module.exports = { translation, trigger };