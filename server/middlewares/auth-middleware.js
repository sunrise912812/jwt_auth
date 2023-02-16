import ApiError from "../exeptions/api-error.js";
import TokenService from "../service/token-service.js";

export function authMiddleware(req, res, next){
    try{
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError())
        }
        const accsesToken = authorizationHeader.split(' ')[1]
        if(!accsesToken){
            return next(ApiError.UnauthorizedError())
        }
        const userData = TokenService.validateAccessToken(accsesToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData
        next()//Переходим к следующему middleware
    }
    catch(e){
        return next(ApiError.UnauthorizedError()) //Функция next вызывает следующий в цепочке middleware
    }
}