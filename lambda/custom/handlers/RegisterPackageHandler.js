const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const DB = require('../Database/DB');

const registerPackageHandler = Alexa.CreateStateHandler(config.APP_STATES.REGISTER_PACKAGE, {
    Init() {
        speechOutput = 'On va maintenant enregistrer votre colis. Veuillez me donner votre numéro de colis.'
        ResponseHelper.sendResponse(this, `${speechOutput} `, "");
    },
    PackageNumberIntent() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = "Ah j'ai mal compris votre numéro de colis ? Recommençons l'enregistrement! Dites moi votre numéro de colis ou dites 'Annuler' pour retourner à l'accueil."
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            const alexa = this;

            const firstNumber = this.event.request.intent.slots.number.value;
            const letter = this.event.request.intent.slots.letter.value.toUpperCase().charAt(0);
            const firstDigits = this.event.request.intent.slots.firstDigits.value;
            const secondDigits = this.event.request.intent.slots.secondDigits.value;
            const lastDigits = this.event.request.intent.slots.lastDigits.value;

            const packageNumber = `${firstNumber}${letter}${firstDigits}${secondDigits}${lastDigits}`.slice(0, 13);

            DB.getSession(alexa.event.context.System.user.userId)
                .then(session => {
                    if (session.packages) {
                        session.packages.push(packageNumber)
                    } else {
                        const obj = {
                            packages: [
                                packageNumber
                            ]
                        }
                        session.packages = obj.packages
                    }

                    DB.save(alexa.event.context.System.user.userId, session).then(() => {
                        speechOutput = "Parfait, j'ai enregistré votre colis. Vous pouvez dès à présent suivre votre colis en disant 'Alexa où en est mon colis'. "
                        ResponseHelper.sendResponse(alexa, `${speechOutput} ${packageNumber}`, "");
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('FindPackage');
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

module.exports = registerPackageHandler;