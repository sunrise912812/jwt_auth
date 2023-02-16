import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import { modelToken } from '../models/token-model.js'

config()

class TokenService{
    generateToken(payload){
        //Генерируем токены
        const accsesToken = jwt.sign(payload, process.env.JWT_ACCSES_SECRET, {expiresIn : '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn : '30d'})
        return{
            accsesToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await modelToken.findOne({user : userId}) //Смотрм есть ли у пользователя токен
        if(tokenData){
            //Перезаписываем токен
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await modelToken.create({user : userId, refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await modelToken.deleteOne({refreshToken})
        return tokenData
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCSES_SECRET) //Проверяем токен
            return userData
        }
        catch(e){
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) //Проверяем токен
            return userData
        }
        catch(e){
            return null
        }
    }

    async findToken(refreshToken){
        const tokenData = await modelToken.findOne({refreshToken})
        return tokenData
    }
}

export default new TokenService()