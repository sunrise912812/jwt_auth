import UserService from '../service/user-service.js'
import { validationResult } from 'express-validator'
import ApiError from '../exeptions/api-error.js'
import userService from '../service/user-service.js'
import { json } from 'express'

class UserControler{
    async registartion(req, res, next){
        try{
            const errors = validationResult(req) //Выполняем валидацию указанную в роутинге
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации...', errors.array())) //Не забываем вернуть ошибку чтобы код дальше не выполнялся
            }
            const {email, password} = req.body
            const userData = await UserService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true}) //Сохраняем refreshToekn в куки, период хранения ставим 30 дней и добавляем httpOnly для того чтобы куки не было возможности изменить в браузере
            return res.json(userData)
        }
        catch(e){
            next(e) //Если в next попадет ошибка типа ApiError она будет обработана соответсвующим образом, попадаем в middleware который ранее реализовали
        }
    }

    async login(req, res, next){
        try{
            const {email, password} = req.body
            const userData = await UserService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true}) //Сохраняем refreshToekn в куки, период хранения ставим 30 дней и добавляем httpOnly для того чтобы куки не было возможности изменить в браузере
            return res.json(userData)
        }
        catch(e){
            next(e)
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies //Получаем рэфреш токен через куки
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken') //Удаляем рэфреш токен из куков
            return res.json(token)
        }
        catch(e){
            next(e)
        }
    }

    async activate(req, res, next){
        try{
            const activationLink = req.params.link //Получаем ссылку по которой перешел пользователь из параметров запроса
            await UserService.activate(activationLink) //Активируем пользлвателя 
            return res.redirect(process.env.CLIENT_URL) //Переходим на клиентскую часть после завершения активации
        }
        catch(e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true}) //Сохраняем refreshToekn в куки, период хранения ставим 30 дней и добавляем httpOnly для того чтобы куки не было возможности изменить в браузере
            return res.json(userData)
        }
        catch(e){
            next(e)
        }
    }

    async getUsers(req, res, next){
        try{
            const users = await UserService.getAllUsers()
            return res.json(users)
        }
        catch(e){
            next(e)
        }
    }
}

export default new UserControler()