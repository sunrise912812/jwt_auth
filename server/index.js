import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {config} from 'dotenv'
import mongoose from 'mongoose'
import router from './router/index.js'
import { errorMiddleware } from './middlewares/error-middleware.js'

config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials : true, //Разрешаем использование куков
    origin : process.env.CLIENT_URL //Разрешаем нашей клиентской части отправлять запросы на сервер
}))
app.use('/api', router)
app.use(errorMiddleware) //Middleware для обработки ошибок обязатьльно подключаем последним

const start = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        app.listen(PORT, ()=>console.log(`Server started on PORT = ${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()