const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');

const PERMISSIONS = ['read::alexa:device:all:address']

const instance = axios.create({
    baseURL: 'https://api.laposte.fr', 
    timeout: 5000,
    headers: { 'X-Okapi-Key': config.LAPOSTE_API_KEY }
});

const findClosestPostingServiceHandler = Alexa.CreateStateHandler(config.APP_STATES.FIND_POSTING_SERVICE, {
    async PostingServiceIntent() {

        const alexa = this;

        deviceId = alexa.event.context.System.device.deviceId
        accessToken = alexa.event.context.System.apiAccessToken
        apiEndpoint = alexa.event.context.System.apiEndpoint

        const instanceAlexaApi = axios.create({
            baseURL: apiEndpoint, 
            timeout: 5000,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })

        try {
            const userAddressRequest = await instanceAlexaApi.get(`/v1/devices/${deviceId}/settings/address`)
            const userAddress = userAddressRequest.data
            
            if (userAddress.addressLine1 == null && userAddress.postalCode == null) return ResponseHelper.sendResponse(alexa, alexa.t("NO_ADDRESS"), PERMISSIONS)
            if (userAddress.addressLine1 == null && userAddress.postalCode) {
                postAddresses = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.postalCode}`)

                let nearbyOffices = "";
                for (let i = 0; i < Object.keys(postAddresses).length; i++) {
                    const office = postAddresses[i];
                    if (office.caracteristique == "Bureau de Poste") {
                        nearbyOffices += `${office.adresse}, ${office.codePostal} ${office.localite}`
                    }
                }
                
                let responseWithCard = {
                    "outputSpeech": alexa.t("NO_NEAREST_OFFICE"),
                    "card": {
                        "type": "Standard",
                        "title": "Bureaux de poste alentours",
                        "content": nearbyOffices
                    }
                }
                return ResponseHelper.sendResponseWithCard(alexa, responseWithCard);
            }
            else {
                let postAddressesRequest;
                if(userAddress.postalCode) postAddressesRequest = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.postalCode}`) 
                else if(userAddress.city) postAddressesRequest = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.city}`) 
                else return ResponseHelper.sendResponse(alexa, alexa.t("DISTANCE_ERROR"));

                const postAddresses = postAddressesRequest.data

                let addressesForDistance = [`${userAddress.addressLine1}, ${userAddress.postalCode} ${userAddress.city}`];

                for (let i = 0; i < Object.keys(postAddresses).length; i++) {
                    const office = postAddresses[i];
                    if (office.caracteristique == "Bureau de Poste") {
                        addressesForDistance.push(`${office.adresse}, ${office.codePostal} ${office.localite}`)
                    }
                }

                let requestBody = { locations: addressesForDistance }
                const distancesRequest = await axios.post('http://www.mapquestapi.com/directions/v2/routematrix?key=DOW3yIozsh0EobJtzvPwP5AzbSMP0YrS', requestBody)

                const distances = distancesRequest.data.distance.map( d => d.toString().replace(".", ","))

                const smallest = distances.sort()[1]
                const nearest = addressesForDistance[distances.indexOf(smallest)];

                // const speechOutput = alexa.t("NEAREST_OFFICE_DISTANCE") + smallest.substr(0,3) + alexa.t(" kilomètres , ") + alexa.t("NEAREST_OFFICE_ADDRESS") + nearest + " ";
                const speechOutput = alexa.t("NEAREST_OFFICE") + nearest;
                const cardContent = `${nearest} \n Distance : ${smallest.substr(0,3)}km`
                let responseWithCard = {
                    "outputSpeech": speechOutput,
                    "card": {
                        "type": "Standard",
                        "title": "Bureau de poste le plus proche de chez vous",
                        "content": cardContent
                    }
                }
                return ResponseHelper.sendResponseWithCard(alexa, responseWithCard);
            }
        }
        catch(err) {
            if(err.response && err.response.status == 403 && err.response.config.baseURL.includes(apiEndpoint)) 
                return ResponseHelper.askForUserPermission(alexa, alexa.t("NOTIFY_MISSING_PERMISSIONS"), PERMISSIONS)
            else return SentenceHelper.getSentence(this.t("API_PROBLEM"))
        }
 
    },
    Unhandled() {
        const speechOutput = SentenceHelper.getSentence(this.t("UNHANDLE_MESSAGE"));
        ResponseHelper.sendResponse(this, `${speechOutput}`, "");
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("CANCEL_MESSAGE"));
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = SentenceHelper.getSentence(this.t('STOP_MESSAGE'));
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
})

module.exports = findClosestPostingServiceHandler;