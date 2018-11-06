const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

var instance = axios.create({
    baseURL: 'https://api.laposte.fr/',
    timeout: 5000,
    headers: { 'X-Okapi-Key': config.LAPOSTE_API_KEY }
});

const pricePackageHandler = Alexa.CreateStateHandler(config.APP_STATES.PRICE_PACKAGE, {
    PricePackage() {
        const alexa = this;
        if (this.event.request.dialogState != 'COMPLETED') {
            this.emit(':delegate');
        }
        else {
            const package = alexa.event.request.intent.slots.package.value;
            const weight = alexa.event.request.intent.slots.poids.value;
            return instance.get(`tarifenvoi/v1?type=${package}&poids=${weight}`)
                .then((response) => {
                    let speechOutput = "Vous avez ";
                    response.data.forEach(element => {
                        //Split price
                        const priceArray = element.price.toString().split(".");
                        speechOutput += element.product + " ";
                        if (element.channel == "bureau") {
                            speechOutput += " en bureau de poste ";
                        }
                        else if (element.channel == " en ligne ") {
                            speechOutput += " en ligne ";
                        }
                        else {
                            speechOutput += " " + element.channel + " ";
                        }
                        speechOutput += " à " + priceArray[0] + "," + priceArray[1] + "" + element.currency + ". <break time='1s'/>";
                    });
                    alexa.handler.state = config.APP_STATES.START;
                    ResponseHelper.sendResponse(alexa, `${speechOutput} . ${SentenceHelper.getSentence(alexa.t("ASK_OTHER_ACTION"))} `, alexa.t("START_REPROMPT_MESSAGE"));
                })
                .catch(err => {
                    console.log(err);
                    ResponseHelper.sendResponse(alexa, `${SentenceHelper.getSentence(alexa.t("API_PROBLEM"))} `, null, null, null, null, false);
                })
        }
    },
    RegisterPackage() {
        this.handler.state = config.APP_STATES.REGISTER_PACKAGE;
        this.emitWithState('Init');
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('Init');
    },
    DeletePackage() {
        this.handler.state = config.APP_STATES.DELETE_PACKAGE;
        this.emitWithState('Init');
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')), this.t("PRICE_REPROMPT_MESSAGE"));
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("CANCEL_MESSAGE"));
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.HelpIntent': function helpStart() {
        ResponseHelper.sendResponse(this, this.t("HELP_MESSAGE_PRICE_PACKAGE"), this.t("PRICE_REPROMPT_MESSAGE"));
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = SentenceHelper.getSentence(this.t('STOP_MESSAGE'));
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
});

module.exports = pricePackageHandler;