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
                    alexa.handler.state = config.APP_STATES.START

                    const speechOutput = SentenceHelper.getSentence(alexa.t("NO_PACKAGE_REGISTER"));
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                }
            })
            .catch(err => {
                console.log(err)
                const speechOutput = alexa.t('AMAZON_ERROR');
                ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
            })
    },
    FindPackage(session) {
        const alexa = this;
        // We will go back to the start state after sending the response
        this.handler.state = config.APP_STATES.START

        if (session.packages.length == 1) {
            const packageNumber = session.packages[0];
            let speechOutput = SentenceHelper.getSentence(this.t("ONE_PACKAGE_REGISTER"));

            return instance.get(`suivi/v1/${packageNumber}`)
                .then((response) => {
                    speechOutput += response.data.message
                    // OK
                    if (response.status === 200) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . Le colis ${packageNumber} ${SentenceHelper.getSentence(this.t("ASK_OTHER_ACTION"))} `, "");
                        // Wrong Package Code Type Sent
                    } else if (response.status === 400) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(this.t("WRONT_TYPE"))} `, "");
                        // Package Not Found
                    } else if (response.status === 404) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(this.t("TRY_ANOTHER_PACKAGE_NUMBER"))} `, "");
                    }
                })
                .catch(err => {
                    console.log(err)
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(this.t("API_PROBLEM"))} `, "");
                })

        } else {
            let speechOutput = SentenceHelper.getSentence(this.t("MANY_PACKAGES_REGISTER"));
            return instance.get(`suivi/v1/list?codes=${session.packages.join(',')}`)
                .then((response) => {
                    response.data.map(obj => {
                        if (obj.data) {
                            speechOutput += `Colis ${obj.data.code} : ${obj.data.message} <break time="0.5s"/>`
                        } else {
                            speechOutput += "Erreur ce colis n'existe pas. "
                        }
                    })
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                })
                .catch(err => {
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(this.t("API_PROBLEM"))} `, null, null, null, null, false);
                });
        }
    }
    //No need of Amazon Intent here because we always go to another handler when sending a response
});

module.exports = findPackageHandler;