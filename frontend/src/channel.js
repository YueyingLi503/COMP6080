import { fileToDataUrl } from "./helpers.js"
import { createElement } from "./login.js"
import { removeAllChild } from "./login.js"
import { logInPage } from "./login.js"
import { getChannelMessage } from "./message.js"
const portNum = 5005
export function channelPage(){
    document.getElementById("container").style.display="none"
    document.getElementById("channel-page").style.display="grid"
    document.getElementById("channel-page").style.gridTemplateColumns="5fr 5fr"
    //document.getElementById("view-page").style.display = "none"
    const token = localStorage.getItem("token")
    const options = {
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch (`http://localhost:${portNum}/channel`,options).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                var channels = res["channels"]
                getPubChannel(channels)
            })
        }else{
            res.json().then(res=>{
                alert(res["error"]);
            })
        }
    })
}
function getPubChannel(channels){
    let publicChannel = []
    for (var i=0; i< channels.length;i++){
        if(channels[i]["private"]==false){
            if(channels[i]["id"])
            publicChannel.push(channels[i])
        }
    }
    for (var i=0; i<publicChannel.length;i++){
        channelAppend(publicChannel[i])
    }
}

function getPriChannel(channel){
    let privateChannel = []
    for (var i=0; i< channel.length;i++){
        if(channel[i]["private"]==true){
            privateChannel.push(channel[i])
        }
    }
    for (var i=0; i<privateChannel.length;i++){
        channelAppend(privateChannel[i])
    }
}
document.getElementById("create-channel-btn").addEventListener("click",function(){
    document.getElementById("create").style.display="flex";
})
document.getElementById("pub-button").addEventListener("click", function(){
    let allChannel = document.getElementById("channels") 
    const token = localStorage.getItem("token")
    const requestOption = {
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch(`http://localhost:${portNum}/channel`,requestOption).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                var channels = res["channels"]
                removeAllChild(allChannel)
                getPubChannel(channels)
            })
        }
    })
})
document.getElementById("pri-button").addEventListener("click", function(){
    let allChannel = document.getElementById("channels") 
    const token = localStorage.getItem("token")
    const requestOption = {
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch(`http://localhost:${portNum}/channel`,requestOption).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                var channel = res["channels"]
                removeAllChild(allChannel);
                getPriChannel(channel);
            })
        }
    })
})
document.getElementById("submit-channel").addEventListener("click", function(){
    var channelName = document.getElementById("channel-name").value;
    var opt = document.getElementById("channel-property").value.toString();
    const token = localStorage.getItem("token")
    var description = document.getElementById("description").value;
    if(opt == "private"){
        var data = {"name":channelName, "private":true, "description":description};
    }else{
        var data = {"name":channelName, "private":false, "description":description};
    }
    
    const options = {
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch(`http://localhost:${portNum}/channel`,options).then(res=> {
        if(res.status === 200){
            res.json().then(res=>{
                var channelId = res["channelId"];
                document.getElementById("pub-button").click();
                document.getElementById("pri-button").click();
            })
        }else{
            res.json().then(res=>{
                alert(res["error"]);
            })
        }
    })
})
//console.log(document.getElementById("edit-profile-btn"))
document.getElementById("edit-profile-btn").addEventListener('click',function(){
    //alert("edit-btn-in")
    const pic = document.getElementById("imag").files[0]
    //console.log(pic)
    if(pic!=undefined && pic !=""){
        //alert("if in")
        fileToDataUrl(pic).then(res=>{
            //console.log(res)
            //const data = {"name":name,"password":password,"email":email,"bio":bio,"image":res}
            update_profile(res)
        })
    }else{
        //const data = {"name":name,"password":password,"email":email,"bio":bio,"image":""}
        alert("else else")
        update_profile("")
    }
})
export function update_profile(r){
    var name = document.getElementById("edit-profile-name").value;
    var password = document.getElementById("edit-password").value;
    var email = document.getElementById("edit-email").value;
    var bio = document.getElementById("bio").value;
    const data = {"name":name,"password":password,"email":email,"bio":bio,"image":r.toString()}
    //alert(data["image"])
    const token = localStorage.getItem("token")
    const options = {
        method:'PUT',
        body:JSON.stringify(data),
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    //alert("hhhhhhhh")
    fetch(`http://localhost:${portNum}/user`,options).then(res=>{
        //alert("11111")
        if(res.status == 200){
            //alert("2222222")
            res.json().then(res=>{
                //alert("personal info updated")
                document.getElementById("edit-profile-name").value=""
                document.getElementById("edit-password").value=""
                document.getElementById("bio").value=""
                document.getElementById("edit-email").value=""

            })
        }else{
            res.json().then(res=>{
                alert(res["error"])
            })
        }
    })
}
document.getElementById("edit").addEventListener("click", function(){
    var name = document.getElementById("view-channel-name").value
    var channel_id = document.getElementById("view-channel-id").value
    var dis = document.getElementById("view-description").value
    var property = document.getElementById("view-property").value
    const token = localStorage.getItem("token")
    var data = {"name":name,"description":dis}
    const options = {
        method:'PUT',
        body:JSON.stringify(data),
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch(`http://localhost:${portNum}/channel/${channel_id}`,options).then(res=>{
        if(res.status == 200){
            res.json().then(res=>{
                alert("channel"+channel_id+"info updated")
                document.getElementById("view-channel-name").value=""
                document.getElementById("view-description").value=""
                if(property == "private"){
                    document.getElementById("pri-button").click()
                }else if(property == "public"){
                    document.getElementById("pub-button").click()
                }
            })
        }else{
            res.json().then(res=>{
                alert(res["error"])
            })
        }
    })
})

function channelAppend(channel){
    let allChannel = document.getElementById("channels")
    const page = createElement('div', "",{id:"channel", style:"height: 10%; border: 2px solid; display: flex; border-color:black; flex-direction:row;"})
    const box = createElement('div', "", {style:"flex:8;"})
    const rightbox = createElement('div', "", {style:"flex:3;"})
    const viewButton = createElement('button', "view")
    const i = channel["id"]
    const chatButton = createElement('button', "chat",{id:`chat-btn/${i}`})
    const join_btn = createElement('button', "join")
    const leave_btn = createElement('button', "leave")
    if(is_member(channel)){
        join_btn.style.display =  "none"
        leave_btn.style.display = "inline-block"
    }else{
        join_btn.style.display = "inline-block"
        leave_btn.style.display = "none"
    }
    allChannel.appendChild(page);
    page.appendChild(box);
    rightbox.appendChild(viewButton)
    rightbox.appendChild(chatButton)
    rightbox.appendChild(join_btn)
    rightbox.appendChild(leave_btn)
    page.appendChild(rightbox);
    box.appendChild(createElement('h5',`id:${channel["id"]}`,{style:"height:13px"}));
    box.appendChild(createElement('br', '',{style:"height:2px"}));
    box.appendChild(createElement('h5',`name:${channel["name"]}`,{style:"height:15px"}));
    viewButton.addEventListener("click", ()=>{
        document.getElementById("create").style.display="none"
        let view_form = document.getElementById("view-page");
        view_form.style.display = "flex"
        getChannelById(channel)
    })
    join_btn.addEventListener("click",()=>{
        joinChannel(channel)
    })
    leave_btn.addEventListener("click",()=>{
        leaveChannel(channel)
    })
    chatButton.addEventListener("click", ()=>{
        localStorage.setItem("cid",channel["id"])
        getChannelMessage(channel)
    })
}
export function is_member(channel){
    const userId = localStorage.getItem("userId")
    for(var i = 0;i<channel["members"].length;i++){
        if(channel["members"][i]==userId){
            return true
        }
    }
    return false
}
export function getChannelById(channel){
    var name =document.getElementById("view-channel-name")
    var channel_id =document.getElementById("view-channel-id")
    var pp =document.getElementById("view-property")
    const token = localStorage.getItem("token")
    const description = document.getElementById("view-description")
    const creation_time = document.getElementById("creation-time")
    const creator = document.getElementById("creator")
    const options = {
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    var id=channel["id"]
    fetch(`http://localhost:${portNum}/channel/${id}`,options).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                var detail = res
                name.value=detail["name"].toString()
                if(detail["private"]==true){
                    pp.value="private"
                }else{
                    pp.value="public"
                }
                description.value=detail["description"]
                creator.value=detail["creator"]
                creation_time.value=new Date(detail["createdAt"])
                channel_id.value=id
            })
        }else{
            res.json().then(res=>{
                alert("get channel detail trigger:"+res["errror"]);
                return
            })
        }
    })
}
document.getElementById("get-personal").addEventListener("click",()=>{
    document.getElementById("view-page").style.display = "flex"
    const token = localStorage.getItem("token")
    document.getElementById("edit-profile-page").style.display = "block"
    var p_name =document.getElementById("edit-profile-name")
    //var password = document.getElementById("edit-password")
    var p_email =document.getElementById("edit-email")
    const userid = localStorage.getItem("userId")
    const bio = document.getElementById("bio")
    //const imag = document.getElementById("image")
    const options = {
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    //svar id=channel["id"]
    fetch(`http://localhost:${portNum}/user/${userid}`,options).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                var detail = res
                p_name.value=detail["name"]
                p_email.value=detail["email"]
                bio.value=detail["bio"]
                //imag.value = detail["image"]   
            })
        }else{
            res.json().then(res=>{
                alert("get personal detail trigger:"+res["error"]);
                return
            })
        }
    })
})
if(document.getElementById("logout-btn")){
    document.getElementById("logout-btn").addEventListener("click",()=>{
        const token = localStorage.getItem("token")
        const options ={
            method:'POST',
            headers:{
                'Authorization':`Bearer ${token}`
            },
        }
        fetch(`http://localhost:${portNum}/auth/logout`,options).then(res=> {
            if(res.status == 200){
                res.json().then(res=>{
                    console.log("herehere")
                    localStorage.clear();
                    logInPage();
                })
            }else{
                res.json().then(res=>{
                    alert(res["error"]);
                })
            }
        })
    })
}
export function joinChannel(channel){
        const token = localStorage.getItem("token")
        const id = channel["id"]
        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
        }
        fetch(`http://localhost:${portNum}/channel/${id}/join`,options).then(res=>{
            if(res.status === 200){
                res.json().then(res=>{
                    let allChannel = document.getElementById("channels") 
                    removeAllChild(allChannel)
                    channelPage();
                })
            }else{
                res.json().then(res=>{
                    alert(res["error"]);
                })
            }
        })
}
export function leaveChannel(channel){
    const token = localStorage.getItem("token")
    const id = channel["id"]
    const options = {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
    }
    fetch(`http://localhost:${portNum}/channel/${id}/leave`,options).then(res=>{
        if(res.status === 200){
            res.json().then(res=>{
                let allChannel = document.getElementById("channels") 
                removeAllChild(allChannel)
                channelPage();
            })
        }else{
            res.json().then(res=>{
                alert(res["error"]);
            })
        }
    })
}
