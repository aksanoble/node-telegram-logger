const http = require('https')
const querystring = require('querystring');
module.exports = class TelegramLogger {
    constructor(token,channelName){
        this.isThereToken(token)
        this.token = token 
        this.channelName = channelName
        this.baseUrl = `https://api.telegram.org/bot${token}/`
    }
    isThereToken(token){
        if(!token) throw new Error('there is no token in class constructor')
    }
    isThereChannel(token){
        if(!token) throw new Error('there is no token in class constructor')
    }
    sendRequest(url){
        http.get(url,(res)=> {
            const { statusCode } = res;
            if(statusCode !== 200) console.log('status code :',statusCode)
            let data 
            res.on('data',(chunk)=>{
                data += chunk
            })
            res.on('end',()=>{
                // console.log(data)
            })
        }).on('error',(e)=>{
            console.log(e,'got a error in https request')
        })
    }
    sendMessage(message,level='INFO'){
        message = `${this.emojiMap()[level]} ${message}
${this.getDate()}`
        let urlParams = querystring.stringify({
            chat_id : this.channelName,
            text : message ,
            parse_mode  :'HTML'
        })
        let url =  `${this.baseUrl}sendMessage?${urlParams}`
        this.sendRequest(url)
        
    }
     emojiMap(){
        return {
            DEBUG    : '🚧',
            INFO     : '‍🗨',
            NOTICE   : '🕵',
            WARNING  : '⚡️',
            ERROR    : '🚨',
            CRITICAL : '🤒',
            ALERT    : '👀',
            EMERGENCY: '🤕',
        }   
    }
    getDate(){
        var date = new Date()
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }
}

