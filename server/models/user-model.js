import { Schema, model } from 'mongoose'

const SchemaUser = new Schema({
    email : {type : String, unique : true, required : true},
    password : {type : String, required : true},
    isActivated : {type : Boolean, default : false},
    activationLink : {type : String}
})

export const modelUser = model('User', SchemaUser)