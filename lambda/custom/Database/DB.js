/*
 * Database helper
 * Version: 1.0
 *
 * This allow us to save a user session in the database and retrieve and reconstruct it.
 *
 * Last Updated: July 25, 2018
 * Author: Picosson A.
 */
const aws = require('aws-sdk');
const dateFns = require('date-fns');
const config = require('../config');
const Session = require('./Session');

const docClient = new aws.DynamoDB.DocumentClient();

/**
 * Save the game state and some info in the database
 * @param {String} userId Unique userId describing the user
 * @param {Object} session Session object you want to store inside the database
 */
const save = function saveSession(userId, session) {
    return new Promise((resolve, reject) => {
        // If there is no userId we can't store the user in the database
        if (!userId) {
            reject(new Error('No user id provided'));
        }

        // By default the user used the app for one day (today)
        let dayUsedInARow = 1;

        // If the user already used the app and it was yesterday
        if (session.lastUse && dateFns.isYesterday(new Date(session.lastUse))) {
            // He used the app one more day in a row
            dayUsedInARow = session.dayUsedInARow + 1;
        }

        // By default if the user never saved a package then packages is set to false (because we cannot save an empty parameter in DynamoDB)
        let packages = false;
        // If there is at least one package saved in the session
        if (session.packages) {
            // We retrieve packages so we can store it to let the user find it later
            packages = session.packages;
        }

        /*
        * We build the param object for our request to DynamoDB
        * Item represent the item we want to store, userId is the key.
        *   userId is the only thing that need to be provided in the Item object
        * TableName is the table we want to store the object in
        */
        const params = {
            Item: {
                userId,
                packages,
                lastUse: Date.now(),
                dayUsedInARow
            },
            TableName: config.DYNAMODB_TABLE,
        };

        // We ask the database client to put the object in params inside the database
        docClient.put(params, (err, data) => {
            // If dynamoDB returns an error
            if (err) {
                // We reject the promise with the db error as it was not fulfilled
                reject(err);
            }
            // We fulfill the promise and send the message returned by the database
            resolve(data);
        });
    });
};

/**
 * Return a session object from the database.
 * If we can't find the requested user we create a new session object with some basic properties
 * @param {String} userId Id of the user you want to request from the database
 */
const load = function loadSession(userId) {
    return new Promise((resolve, reject) => {
        // We need the userId to retrieve an object from the db as it is the key
        if (!userId) {
            reject(new Error('No user id provided'));
        }

        // We build a param object with the table we want to query and the key of the object
        const params = {
            TableName: config.DYNAMODB_TABLE,
            Key: {
                userId,
            },
        };

        // we ask the database client to retrieve the object correponding to the info in params
        docClient.get(params, (err, data) => {
            if (err) {
                // We reject the promise with the db error as it was not fulfilled
                reject(err);
            }
            // We fulfill the promise and send the session object returned by the database
            resolve(data.Item);

        });
    });
};

/**
 * Retrieve a session from the database, if the requested user doesn't exists create a new session
 * @param {String} userId Id of the user you want to retrieve a session for
 */
const getSession = function getUserSession(userId) {
    return load(userId).then(sessionFromDb => {
        let userSession;

        // We check if the response object is empty
        if (sessionFromDb) {
            let packages = false;
            // If there is a saved game in the session object
            if (sessionFromDb.packages) {
                // We rebuild the game from the JSON data
                packages = sessionFromDb.packages;
            }

            // We rebuild a session object so the skill is in the same state as when the user left
            userSession = new Session(
                sessionFromDb.userId,
                packages,
                sessionFromDb.dayUsedInARow,
                sessionFromDb.lastUse
            );
        } else {
            // We build a new session as it is the first time this user use the skill
            userSession = new Session(userId);
        }

        return userSession;
    });
};

module.exports = { save, getSession };