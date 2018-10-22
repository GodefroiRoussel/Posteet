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

const pricePackageHandler = Alexa.CreateStateHandler(config.APP_STATES.PRICE_PACKAGE, {
    PricePackage() {
        const alexa = this;
        if(this.event.request.dialogState != 'COMPLETED'){
            this.emit(':delegate');
        }
        else{
            let speechOutput="Vous avez ";
            const package = alexa.event.request.intent.slots.package.value;
            const weight = alexa.event.request.intent.slots.poids.value;
            return instance.get(`tarifenvoi/v1?type=${package}&poids=${weight}`)
                .then((response) => {
                    response.data.forEach(element => {
                        speechOutput += element.product+" ";
                        if(element.channel=="bureau"){
                            speechOutput += " en bureau de poste ";
                        }
                        else if (element.channel== " en ligne "){
                            speechOutput +=" en ligne ";
                        }
                        else{
                            speechOutput+=" "+element.channel+" ";
                        }
                        speechOutput += " à "+element.price+" "+element.currency+".<break time='1s'/>";
                    });
                    console.log(speechOutput);
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

module.exports = pricePackageHandler;