import { modelUser } from '../models/user-model.js'
import bcrypt from 'bcrypt'
import {v4} from 'uuid'
import MailService from './mail-service.js'
import TokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exeptions/api-error.js'

class UserService{
    async registration(email, password){
        const candidate = await modelUser.findOne({email}) //Смотрим есть ли пользователь с таким email
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует...`)
        }
        const hashPassword = await bcrypt.hash(password, 3) //хэшируем пароль
        const activationLink = v4() //Генерируем ссылку для активациия пользователя
        const user = await modelUser.create({email, password : hashPassword, activationLink})
        await MailService.sendActivationMail(email, `${process.env.API_URL}api/activate/${activationLink}`) //Отправляем письмо для активации, передаем вторым параметром полную ссылку
        const userDto = new UserDto(user) //Передаем в dto класс созданную нами модель, чтобы убрать лишние поля из возвращаемого объекта user 
        const tokens = TokenService.generateToken({...userDto}) //Передаем в качетве праметра класс dto развернутый в новый объект
        await TokenService.saveToken(user._id, tokens.refreshToken) //Сохрагняем рэфреш токен в базу данных

        return {...tokens, user : userDto} //Возвращаем токены и информацию о пользователе
    }

    async activate(activationLink){
        const user = await modelUser.findOne({activationLink}) // Ищем пользователя с такой ссылкой
        if(!user){
            throw ApiError.BadRequest('Некоректная ссылка активации...')
        }
        user.isActivated = true //Меняем флаг активациия у пользователя
        await user.save()
    }

    async login(email, password){
        const user = await modelUser.findOne({email})
        if(!user){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден...`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password) //Проверяем равны ли пароли, полученный в запросе и указанный в базе
        if(!isPassEquals){
            throw ApiError.BadRequest('Указан не верный пароль...')
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateToken({...userDto})
        await TokenService.saveToken(user._id, tokens.refreshToken)
        return {...tokens, user : userDto}
    }

    async logout(refreshToken){
        const token = await TokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){ //Проверяем есть ли у пользователя токен
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError() //Поднимаем ошибку если токен не прошел валидацию или токена нет в базе
        }
        const user = await modelUser.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateToken({...userDto})
        await TokenService.saveToken(user._id, tokens.refreshToken)
        return {...tokens, user : userDto}
    }

    async getAllUsers(){
        const users = await modelUser.find()
        return users
    }
}

export default new UserService()