const Alexa = require('alexa-sdk');
const axios = require('axios');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const DB = require('../Database/DB');

const distanceInstance = axios.create({
    baseURL: 'http://www.mapquestapi.com/directions/v2/routematrix?',
    timeout: 5000,
    headers: { 'key': config.DISTANCE_API_KEY }
});



const instance = axios.create({
    baseURL: 'https://api.laposte.fr/', 
    timeout: 5000,
    headers: { 'key': config.API_KEY }
});

const instanceAlexaApi = axios.create({
    baseURL: 'https://api.amazonalexa.com/', 
    timeout: 5000
})



const findClosestPostingServiceHandler = Alexa.CreateStateHandler(config.APP_STATES.FIND_POSTING_SERVICE, {
    async PostingServiceIntent() {

        const alexa = this;

        deviceId = alexa.event.context.System.device.deviceId
        accessToken = alexa.event.context.System.apiAccessToken

        instanceAlexaApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        try {
            const userAddressRequest = await instanceAlexaApi.get(`/v1/devices/${deviceId}/settings/address`)
            // const userAddress = userAddressRequest.data;
            // if (userAddress.addressLine1 == null || userAddress.addressLine1 == "") {
            //     ResponseHelper.sendResponse(alexa, alexa.t("NO_ADDRESS"));
            // }

            // let postAddresses;
            // if(userAddress.postalCode) postAddresses = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.postalCode}`) 
            // else if(userAddress.city) postAddresses = await instance.get(`/datanova/v1/pointscontact?q=${userAddress.city}`) 
            // else ResponseHelper.sendResponse(alexa, alexa.t("NO_ADDRESS"));


            // const addressesForDistance = [`${userAddress.addressLine1}, ${userAddress.postalCode} ${userAddress.city}`]
            // const addressArray = postAddresses.map( pa => {
            //     addressesForDistance.push(`${pa.adresse}, ${pa.codePostal} ${pa.localite}`)
            // });

            // const distancesRequest = await distanceInstance.post({ "locations": addressArray })

            // if(distancesRequest.status != 200) ResponseHelper.sendResponse(alexa, alexa.t("DISTANCE_ERROR"));

            // const distances = distancesRequest.data.distance
            // const smallest = distances.sort()[1]

            // const nearest = addressArray.indexOf(distances.indexOf(smallest));

            // let speechOutput = alexa.t("NEAREST_OFFICE_DISTANCE") + smallest + " kilomètres, " + alexa.t("NEAREST_OFFICE_ADDRESS") + nearest;``
            // ResponseHelper.sendResponse(alexa, speechOutput);
        }
        catch(err) {
            console.log("ERROR");
            console.log(err);
            console.log("error detail: " + err.data);
            if(err.status == 403) ResponseHelper.sendResponse(alexa, alexa.t("NOTIFY_MISSING_PERMISSIONS"));
            if(err.data.type == "FORBIDDEN") ResponseHelper.sendResponse(alexa, alexa.t("NOTIFY_MISSING_PERMISSIONS"));
        }
 
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
})

module.exports = findClosestPostingServiceHandler;