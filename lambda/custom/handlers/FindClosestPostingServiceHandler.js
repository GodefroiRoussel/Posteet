const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const DB = require('../Database/DB');

var distanceInstance = axios.create({
    baseURL: 'http://www.mapquestapi.com/directions/v2/routematrix?',
    timeout: 5000,
    headers: { 'key': config.DISTANCE_API_KEY }
});



var instance = axios.create({
    baseURL: 'https://api.laposte.fr/', 
    timeout: 5000,
    headers: { 'key': config.API_KEY }
});

var instanceAlexaApi = axios.create({
    baseURL: 'https://api.amazonalexa.com/', 
    timeout: 5000
})



const findClosestPostingServiceHandler = Alexa.CreateStateHandler(config.APP_STATES.FIND_POSTING_SERVICE, {
    async PostingServiceIntent() {

        const alexa = this;

        //fetch user address 
        deviceId = alexa.event.context.System.device.deviceId
        accessToken = alexa.event.context.System.apiAccessToken

        instanceAlexaApi.headers({ 'Authorization': "Bearer " + accessToken })
        const PERMISSIONS = ['read::alexa:device:all:address'];
        
        const userAddressRequest = await instanceAlexaApi.get(`/v1/devices/${deviceId}/settings/address`)
        if (userAddressRequest.status == 403) {
            ResponseHelper.sendResponse(alexa, config.NOTIFY_MISSING_PERMISSIONS);
        }
        
        const userAddress = userAddressRequest.data;
        if (userAddress.addressLine1 == null || userAddress.addressLine1 == "") {
            ResponseHelper.sendResponse(alexa, config.NO_ADDRESS);
        }

        let postAddresses;
        if(userAddress.postalCode) postAddresses = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.postalCode}`) 
        else if(userAddress.city) postAddresses = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.city}`) 
        else return responseBuilder.speak(config.NO_ADDRESS).getResponse();


        const addressesForDistance = [`${userAddress.addressLine1}, ${userAddress.postalCode} ${userAddress.city}`]
        const addressArray = postAddresses.map( pa => {
            addressesForDistance.push(`${pa.adresse}, ${pa.codePostal} ${pa.localite}`)
        });

        const distancesRequest = await distanceInstance.post({ "locations": addressArray })

        if(distancesRequest.status != 200) return responseBuilder.speak(config.DISTANCE_ERROR).getResponse();

        const distances = distancesRequest.data.distance
        const smallest = distances.sort()[1]

        const nearest = addressArray.indexOf(distances.indexOf(smallest));

        let speechOutput = alexa.t("NEAREST_OFFICE_DISTANCE") + smallest + "kilomètres" + alexa.t("NEAREST_OFFICE_ADDRESS") + nearest;``
        ResponseHelper.sendResponse(alexa, speechOutput);

    }
    ,
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
})

module.exports = findClosestPostingServiceHandler;