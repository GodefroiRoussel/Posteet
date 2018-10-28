const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

var instance = axios.create({
    baseURL: 'https://api.laposte.fr/',
    timeout: 5000,
    headers: { 'X-Okapi-Key': config.API_KEY }
});

const findPackageHandler = Alexa.CreateStateHandler(config.APP_STATES.FIND_PACKAGE, {
    Init() {
        const alexa = this;
        // Check if we can find a package
        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    alexa.emitWithState('FindPackage', session)
                } else {
                    alexa.handler.state = config.APP_STATES.START;

                    const speechOutput = SentenceHelper.getSentence(alexa.t("NO_PACKAGE_REGISTER"));
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, alexa.t("START_REPROMPT_MESSAGE"));
                }
            })
            .catch(err => {
                console.log(err);
                const speechOutput = alexa.t('AMAZON_ERROR');
                ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
            })
    },
    FindPackage(session) {
        const alexa = this;
        // We will go back to the start state after sending the response
        this.handler.state = config.APP_STATES.START;

        if (session.packages.length == 1) {
            const packageNumber = session.packages[0];
            let speechOutput = SentenceHelper.getSentence(this.t("ONE_PACKAGE_REGISTER"));

            return instance.get(`suivi/v1/${packageNumber}`)
                .then((response) => {
                    speechOutput += response.data.message
                    // OK
                    if (response.status === 200) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . Le colis ${packageNumber} ${SentenceHelper.getSentence(alexa.t("ASK_OTHER_ACTION"))} `, alexa.t("START_REPROMPT_MESSAGE"));
                        // Wrong Package Code Type Sent
                    } else if (response.status === 400) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(alexa.t("WRONT_TYPE"))} `, alexa.t("START_REPROMPT_MESSAGE"));
                        // Package Not Found
                    } else if (response.status === 404) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(alexa.t("TRY_ANOTHER_PACKAGE_NUMBER"))} `, alexa.t("START_REPROMPT_MESSAGE"));
                    }
                })
                .catch(err => {
                    console.log(err);
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(alexa.t("API_PROBLEM"))} `, null, null, null, null, false);
                })

        } else {
            let speechOutput = SentenceHelper.getSentence(this.t("MANY_PACKAGES_REGISTER"));
            return instance.get(`suivi/v1/list?codes=${session.packages.join(',')}`)
                .then((response) => {
                    response.data.map((obj, index) => {
                        if (obj.data) {
                            const packageNumberString = packageNumberIntoString(obj.data.code);
                            speechOutput += `Colis ${packageNumberString} : ${obj.data.message} <break time="0.5s"/>`;
                        } else {
                            const packageNumber = session.packages[index];
                            const packageNumberString = packageNumberIntoString(packageNumber);
                            speechOutput += `Le colis ${packageNumberString} n'existe pas.  <break time="0.5s"/>`;
                        }
                    })
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, alexa.t("START_REPROMPT_MESSAGE"));
                })
                .catch(err => {
                    console.log(err);
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(alexa.t("API_PROBLEM"))} `, null, null, null, null, false);
                });
        }
    }
    //No need of Amazon Intent here because we always go to another handler when sending a response
});

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}

/**
 * Return a package number that is easy to speak by Alexa and understandable by the user.
 * The package number is splitted in group of 4 digits before being joined in a single string with space between each group of digits.
 * 
 * @param {String} packageNumber 
 */
function packageNumberIntoString(packageNumber) {
    const packageNumberArray = packageNumber.split('')
    const packageArrays = chunkArray(packageNumberArray, 4)

    var tempArray = [];
    const arrayLength = packageArrays.length;

    for (index = 0; index < arrayLength; index++) {
        let myChunk = packageArrays[index].join('');
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray.join(' <break time="0.2s"/> ');
}

module.exports = findPackageHandler;