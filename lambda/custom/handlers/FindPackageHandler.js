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
    PackageNumberIntent() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = "Ah j'ai mal compris votre numéro de colis ? Recommençons la saisie! Dites moi votre numéro de colis ou dites 'Annuler' pour retourner à l'accueil."
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            const alexa = this;

            const firstNumber = alexa.event.request.intent.slots.number.value;
            const letter = alexa.event.request.intent.slots.letter.value.toUpperCase().charAt(0);
            const firstDigits = alexa.event.request.intent.slots.firstDigits.value;
            const secondDigits = alexa.event.request.intent.slots.secondDigits.value;
            const lastDigits = alexa.event.request.intent.slots.lastDigits.value;

            // TODO: Vérifier le slice
            const packageNumber = `${firstNumber}${letter}${firstDigits}${secondDigits}${lastDigits}`.slice(0, 13);

            return instance.get(`suivi/v1/${packageNumber}`)
                .then((response) => {
                    speechoutput += response.data.message
                    // OK
                    if (response.status === 200) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . Souhaitez vous faire autre chose avec notre application? `, "");
                        // Wrong Package Code Type Sent
                    } else if (response.status === 400) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . Le problème vient de chez nous et nous travaillons actuellement dessus. Merci de votre compréhension. `, "");
                        // Package Not Found
                    } else if (response.status === 404) {
                        ResponseHelper.sendResponse(alexa, `${speechOutput} . Essayez de donner un nouveau numéro de colis. `, "");
                    }
                })
                .catch(err => {
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . Cependant le service est temporairement indisponible, réessayez plus tard. `, "");
                })
        }
    },
    FindPackage() {
        const alexa = this;

        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    if (session.packages.length == 1) {
                        const packageNumber = session.packages[0];
                        let speechOutput = "Vous avez actuellement un seul colis enregistré. "

                        return instance.get(`suivi/v1/${packageNumber}`)
                            .then((response) => {
                                speechOutput += response.data.message
                                // OK
                                if (response.status === 200) {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . Souhaitez vous faire autre chose avec notre application? `, "");
                                    // Wrong Package Code Type Sent
                                } else if (response.status === 400) {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . Le problème vient de chez nous et nous travaillons actuellement dessus. Merci de votre compréhension. `, "");
                                    // Package Not Found
                                } else if (response.status === 404) {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput} . Essayez de donner un nouveau numéro de colis. `, "");
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                ResponseHelper.sendResponse(alexa, `${speechOutput} . Cependant le service est temporairement indisponible, réessayez plus tard. `, "");
                            })

                    } else {
                        let speechOutput = "Vous avez actuellement plusieurs colis déjà enregistré, je vais faire une recherche pour chaque colis. "

                        return instance.get(`suivi/v1/list?codes=${session.packages.split(',')}`)
                            .then((response) => {
                                response.data.map(obj => {
                                    if (obj.data) {
                                        speechOutput += `Colis ${obj.data.code} : ${obj.data.message} `
                                    } else {
                                        speechOutput += ' ERREUR '
                                    }
                                })
                                ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                            })
                            .catch(err => {
                                ResponseHelper.sendResponse(alexa, `${speechOutput} . Cependant le service est temporairement indisponible, réessayez plus tard. `, "");
                            })
                    }
                } else {
                    let speechOutput = "Vous n'avez pas de colis déjà enregistré, veuillez me donner le numéro de colis que je dois chercher. "
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                }
            })
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, this.t('UNHANDLE_MESSAGE'));
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = 'Très bien, retournous sur le menu. ';
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = this.t('STOP_MESSAGE');
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
});

module.exports = findPackageHandler;