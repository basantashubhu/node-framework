const { check } = require("express-validator")
const mongoose = require("mongoose")

/**
 * @param {string} key 
 * @param {string} model 
 * @param {string} column 
 * @param {string} message
 */
function exists(key, model, column, message = null) {
    return check(key).custom((value) => {
        return mongoose.model(model).findOne({[column] : value}).then(doc => {
            if(!doc) {
                if(message) throw new Error(message)
                throw new Error(key.replace('_', ' ') +" does not exists")
            }
        })
    })
}

/**
 * @param {string} key
 * @param {string} model
 * @param {string} column
 * @param message
 * @param ignore
 */
function unique(key, model, column, message = null, ignore = null) {
    return check(key).custom(value => {
        return mongoose.model(model).findOne({[column] : value, _id : {$ne : ignore}}).then(doc => {
            if(doc) {
                if(message) throw new Error(message)
                throw new Error(key.replace('_', ' ') + " already exists")
            }
        })
    })
}

module.exports = {
    exists,
    unique
}