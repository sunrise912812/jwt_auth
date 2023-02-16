import nodemailer from 'nodemailer'
import {config} from 'dotenv'

config()

class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host : process.env.SMTP_HOST,
            port : process.env.SMTP_PORT,
            secure : false,
            auth : {
                user : process.env.SMTP_USER,
                pass : process.env.SMTP_PASSWORD
            }

        })
    }

    async sendActivationMail(to, link){
        // Отправляем пользователю письмо с ссылкой на активацию
        await this.transporter.sendMail({
            from : process.env.SMTP_USER,
            to,
            subject : 'Активация аккаунта на ' + process.env.API_URL,
            text : '',
            html : `
            <div>
                <h1>Для активации перейдите по ссылке:</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
    }
}

export default new MailService()