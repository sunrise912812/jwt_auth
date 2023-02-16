import { Schema, model } from 'mongoose'

const SchemaToken = new Schema({
    user : {type : Schema.Types.ObjectId, ref : 'User'},
    refreshToken : {type : String, required : true},
})

export const modelToken = model('Token', SchemaToken)