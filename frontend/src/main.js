import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, send_message } from './helpers.js';
import { logInPage } from './login.js';
import { channelPage } from './channel.js';
import{ update_profile} from './channel.js';


if(localStorage.getItem("token")){
    channelPage();
}else{
    logInPage();
}
//console.log("here");

document.getElementById("send-btn").addEventListener('click',()=>{
    const send_pic = document.getElementById("send-imag").files[0]
    if(send_pic!=undefined && send_pic !=""){
        fileToDataUrl(send_pic).then(res=>{
            send_message(res)
        })
    }else{
        send_message("")
    }
    //console.log(content_to_send)
})