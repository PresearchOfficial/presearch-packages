"use strict";

const dotenv = require("dotenv");
const SnetSDK = require("./lib/dist").default;
const service = require("./translate_grpc_pb");
const messages = require("./translate_pb");

const languages = require("./languages.json");

function wordAfterLastTo(query) {
  return query.split("to")[query.split("to").length - 1].trim();
}

function getQueryLanguages(query) {
	return query.split("from")[query.split("from").length - 1].trim();
}
function wordAfterLastFrom(query) {
	return getQueryLanguages(query).split("to")[0].trim();
  }
  
function extractQuery(query) {
	if( findMatchingLanguage(languages, wordAfterLastFrom(query)) ) {
		const queryWithoutLang = query
			.substr(10, query.length - getQueryLanguages(query).length - 10)
			.trim();
		const queryStatement = queryWithoutLang
			.substr(0, queryWithoutLang.length - 4)
			.trim();
		return queryStatement;
	} else {
		const possibleLangWord = wordAfterLastTo(query);
		const queryWithoutLang = query
		  .substr(10, query.length - possibleLangWord.length - 10)
		  .trim();
		const queryWithoutLangAndTo = queryWithoutLang
		  .substr(0, queryWithoutLang.length - 2)
		  .trim();
		return queryWithoutLangAndTo;	  
	}
}

const config = {
  privateKey:
    "<your private key here>",
  networkId: 1,
  orgId: "naint",
  serviceId: "machine-translation",
  web3Provider: "<your web3 provider here>",
};

function findMatchingLanguage(languageList, language) {
  const matchingLanguage = languageList.filter(
    (lang) => lang.language.toLowerCase() === language.toLowerCase()
  )[0];
  if (matchingLanguage) {
    return matchingLanguage.langCode;
  }
}

dotenv.config();
const sdk = new SnetSDK(config);
async function translation(query, API_KEY) {
	const possibleFromLang = wordAfterLastFrom(query);
	const possibleToLang = wordAfterLastTo(query);
	const detectedFromLanguage = findMatchingLanguage(languages, possibleFromLang);
	const detectedToLanguage = findMatchingLanguage(languages, possibleToLang);
  const client = await sdk.createServiceClient(
    config.orgId,
    config.serviceId,
    service.RomanceTranslatorClient,
    "default_group",
    null,
    { email: "dev.codesymphony@gmail.com", tokenToMakeFreeCall: "" }
  );
  const translateReq = new Promise(function (resolve, reject) {
    const input = new messages.Input();
    input.setSentencesUrl(extractQuery(query));
    input.setSourceLang(detectedFromLanguage || "eng_Latn");
    input.setTargetLang(detectedToLanguage || "fra_Latn");
    client.service.translate(input, (err, resp) => {
    	console.log(err);
    	console.log(resp);
    	console.log(resp.array)
    	console.log(resp.array[0])
    	if (err) reject(err);
    	resolve(resp);
    });
  });
  const resp = await translateReq;
  const translation = resp.array[0];
  return `
	<div id="presearchPackage">
		<span class="mycolor">Translation: ${translation}</span>
	</div>
	`;
}

async function trigger(query) {
  if (query) {
    query = query ? query.toLowerCase() : "";
    if (
      query.indexOf("translate ") === 0 &&
      query.indexOf(" to ") > -1 &&
	  findMatchingLanguage(languages, wordAfterLastTo(query))
    )
      return true;
  }
  return false;
}

module.exports = { translation, trigger };
