import Router from 'express'
import UserControler from '../controllers/user-controler.js'
import { body } from 'express-validator'
import { authMiddleware } from '../middlewares/auth-middleware.js'

const router = new Router()

router.post('/registration', 
body('email').isEmail(), //Валидация email
body('password').isLength({min : 3, max : 32}), //Валидация длины пароля минимальная длина 3, максимальная 32
UserControler.registartion)
router.post('/login', UserControler.login)
router.post('/logout', UserControler.logout)
router.get('/activate/:link', UserControler.activate)
router.get('/refresh', UserControler.refresh)
router.get('/users', authMiddleware , UserControler.getUsers)

export default router