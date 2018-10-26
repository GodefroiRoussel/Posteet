const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const DB = require('../Database/DB');

var instance = axios.create({
    baseURL: 'https://api.laposte.fr/',
    timeout: 5000,
    headers: { 'X-Okapi-Key': config.API_KEY }
});

const findPackageHandler = Alexa.CreateStateHandler(config.APP_STATES.FIND_PACKAGE, {
    FindPackage() {
        const alexa = this;

        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    if (session.packages.length == 1) {
                        const packageNumber = session.packages[0];
                        let speechOutput = this.t("ONE_PACKAGE_REGISTER");

                        return instance.get(`suivi/v1/${packageNumber}`)
                            .then((response) => {
                                speechOutput += response.data.message
                                // OK
                                if (response.status === 200) {
                                    this.handler.state = config.APP_STATES.START;
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . Le colis ${packageNumber} ${this.t("ASK_OTHER_ACTION")} `, "");
                                    // Wrong Package Code Type Sent
                                } else if (response.status === 400) {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${this.t("WRONT_TYPE")} `, "");
                                    // Package Not Found
                                } else if (response.status === 404) {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${this.t("TRY_ANOTHER_PACKAGE_NUMBER")} `, "");
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                ResponseHelper.sendResponse(alexa, `${speechOutput} . ${this.t("API_PROBLEM")} `, "");
                            })

                    } else {
                        let speechOutput = this.t("MANY_PACKAGES_REGISTER");
                        return instance.get(`suivi/v1/list?codes=${session.packages.join(',')}`)
                            .then((response) => {
                                response.data.map(obj => {
                                    if (obj.data) {
                                        speechOutput += `Colis ${obj.data.code} : ${obj.data.message} <break time="0.5s"/>`
                                    } else {
                                        speechOutput += ' ERREUR '
                                    }
                                })
                                ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                            })
                            .catch(err => {
                                ResponseHelper.sendResponse(alexa, `${speechOutput} . ${this.t("API_PROBLEM")} `, "");
                            })
                    }
                } else {
                    let speechOutput = this.t("NO_PACKAGE_REGISTER");
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                }
            })
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, this.t('UNHANDLE_MESSAGE'));
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = this.t("CANCEL_MESSAGE");
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = this.t('STOP_MESSAGE');
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
});

module.exports = findPackageHandler;