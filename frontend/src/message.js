import { channelPage } from "./channel.js"
import { createElement } from "./login.js"
import { removeAllChild } from "./login.js"
var allMessage = {};
var current_content;
var userid = localStorage.getItem("userId")
var edit_messageid;
var reaction;
const token = localStorage.getItem("token")
const message_page = document.getElementById("channel-message")


export function getChannelMessage(channel){
    const cid = channel["id"]
    fetch(`http://localhost:5005/message/${cid}?start=0`,{
        method:"GET",
        headers:{
            'Content-type':'application/json',
            'Authorization':'Bearer '+ token,
        }
    }).then((res)=>{
        if(res.status===200){
            res.json().then(res=>{
                allMessage[cid] = res["messages"]
                document.querySelectorAll('.message').forEach(element=>element.remove())
                appendMessage(cid)
            })
        }else{
            res.json().then((data)=>{
                alert("error")
            })
        }
    })
}
const addMessageFunc = (cid) => {
    var i;
    const message_delete = document.getElementsByClassName('message-delete');
    for(i = 0;i < message_delete.length;i++){
        message_delete[i].addEventListener('click',(event)=>{
            const messageid = event.target.parentElement.parentElement.parentElement.id;
            fetch(`http://localhost:5005/message/${cid}/${messageid}`,{
            method:"DELETE",
            headers:{'Content-type':'application/json','Authorization':'Bearer '+ token},
            }).then((res)=>{
                if(res.status===200){
                    res.json().then(res=>{
                        document.getElementById(`chat-btn/${cid}`).click()
                    })
                }else{
                    res.json().then((data)=>{
                        alert("error")
                    })
                }
            })
        })
    }
    const message_edit = document.getElementsByClassName('message-edit');
    const edit_message_page = document.getElementById("edit-message-page")
    for(i = 0;i < message_edit.length;i++){
        message_edit[i].addEventListener('click',(event)=>{
            edit_messageid = event.target.parentElement.parentElement.parentElement.id;
            current_content = event.target.parentElement.parentElement.children[1].innerText;
            edit_message_field.value = current_content;
            edit_message_page.style.display = 'block'
        })
    }
    const message_react = document.getElementsByClassName("message-react");
    for(i=0; i < message_react.length;i++){
        message_react[i].addEventListener('click',(event)=>{
        const message = event.target.parentElement.parentElement.parentElement;
        const emoji_bar = message.children[1].children[4];
        event.target.parentElement.style.display = 'none';
        emoji_bar.style.display = 'block'
        reaction = 'react'
        })
    }
    const message_unreact = document.getElementsByClassName("message-unreact");
    for(i=0; i < message_unreact.length;i++){
        message_unreact[i].addEventListener('click',(event)=>{
            const message = event.target.parentElement.parentElement.parentElement;
            const emoji_bar = message.children[1].children[4];
            event.target.parentElement.style.display = 'none';
            emoji_bar.style.display = 'block'
            reaction = 'unreact'
        })
    }
    const emoji_buttons = document.getElementsByClassName('emoji');
    for(i=0; i < emoji_buttons.length;i++){
        emoji_buttons[i].addEventListener('click',(event)=>{
            const messageid = event.target.parentElement.parentElement.parentElement.id;
            const jsonString = JSON.stringify({
                'react':event.target.innerText
            })
            const options = {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':'Bearer '+ token,
                },
                body:jsonString
            }
            fetch(`http://localhost:5005/message/${reaction}/${cid}/${messageid}`,options)
            .then(res=>{
                if(res.status===200){
                    res.json().then(res=>{
                        document.getElementById(`chat-btn/${cid}`).click()
                    })
                }else{
                    res.json().then((data)=>{
                        alert("error")
                    })
                }
            })
        })
    }
    const message_pin = document.getElementsByClassName('message-pin');
    for(i=0; i < message_pin.length;i++){
        message_pin[i].addEventListener('click',(event)=>{
            const messageid = event.target.parentElement.parentElement.parentElement.id;
            //console.log(event.target.parentElement.parentElement)
            const pin_state = event.target.innerText;
            if(pin_state === 'Pin'){
                fetch(`http://localhost:5005/message/pin/${cid}/${messageid}`,{
                    method:"POST",
                    headers:{
                        'Authorization':'Bearer '+ token,
                    }
                }).then((res)=>{
                    if(res.status===200){
                        document.getElementById(`chat-btn/${cid}`).click()
                    }else{
                        res.json().then(res=>{
                            alert("error")
                        })
                    }
                })
            }else{
                fetch(`http://localhost:5005/message/unpin/${cid}/${messageid}`,{
                    method:"POST",
                    headers:{
                        'Authorization':'Bearer '+ token,
                    }
                }).then((res)=>{
                    if(res.status===200){
                        document.getElementById(`chat-btn/${cid}`).click()
                    }else{
                        res.json().then(res=>{
                            alert("error")
                        })
                    }
                })
            }
        })
    }
    const close_edit = document.getElementById("close-edit-message-page")
    const submit_edit = document.getElementById("submit-edit-message-page")
    const edit_message_field = document.getElementById("edit-message-field")

    close_edit.addEventListener('click',() => {
        edit_message_page.style.display = 'none';
    })
    submit_edit.addEventListener('click',()=>{
        var new_content;
        edit_message_page.display = 'none';
        new_content = edit_message_field.value;
        const jsonString = JSON.stringify({
            'message':new_content,
            'image':''
        })
        const options = {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
            },
            body:jsonString
        }
    fetch(`http://localhost:5005/message/${cid}/${edit_messageid}`,options)
    .then((res)=>{
        if(res.status === 200){
            document.getElementById(`chat-btn/${cid}`).click()
        }else{
            res.json().then(res=>{
                alert(res["error"]);
            })
        }
        })
    })
}
const appendMessage = (cid) =>{
    var sendtime;
    const message = allMessage[cid];
    //console.log(channel_message[cid])
    if(message.length > 0){
        for (var i = message.length - 1; i>=0; i--){
            const message_box = document.getElementById("message-box").cloneNode(true)
            message_box.style.display = "flex"
            if(message[i]['edited']){
                sendtime = message[i]['editedAt'];
                message_box.children[1].children[0].innerText = 'Edited at ' + sendtime;
            }else{
                sendtime = message[i]['sentAt'];
                message_box.children[1].children[0].innerText = sendtime;
            }
            getUsers(message[i]['sender'],message_box.children[0].children[0])
            message_box.children[1].children[1].innerText = message[i]['message'];
            if(message[i]['image']!=undefined && message[i]['image'] !=""){
                const pic = createElement("img","",{style:"height:62px; width:62px"})
                pic.src = message[i]['image']
                message_box.children[1].children[2].style.display = "block"
                message_box.children[1].children[2].appendChild(pic)
            }
            message_box.id = message[i]['id'];
            message_box.classList.add('message');
            if(message[i]['reacts'].length){
                //console.log(message[i]['reacts']);
                var allReact = '';
                var react;
                for (var j = 0; j<message[i]['reacts'].length;j++){
                    react = message[i]['reacts'][j];
                    allReact += react['react']
                }
                message_box.children[2].children[1].innerText = allReact;
                message_box.children[2].children[1].style.display = 'block';
            }
            if(message[i]['sender'] === userid) {
                message_box.classList.add('my-message');
                message_box.children[1].classList.add('my-time-and-message');
                message_box.children[1].children[3].children[0].style.display = 'block';
                message_box.children[1].children[3].children[1].style.display = 'block';
            }
            message_box.children[1].addEventListener('mouseenter',(event)=>{
                event.target.children[3].style.display = 'inline-block'
            })
            message_box.children[1].addEventListener('mouseleave',event=>{ 
                event.target.children[3].style.display = 'none';
                event.target.children[4].style.display = 'none';
            })
            if (message[i]['pinned']) {
                message_box.children[2].children[0].style.display = 'block';
                message_box.children[1].children[3].children[3].innerText = 'Unpin';
                message_page.prepend(message_box)
            }else{
                message_page.appendChild(message_box);
            }
        }
        addMessageFunc(cid);
    }
}
   
const getUsers = (tid, namespan) =>{ 
    //console.log(tid)
    fetch(`http://localhost:5005/user/${tid}`,{
        method:'GET',
        headers:{'Authorization':'Bearer ' + token},
    })
    .then(res => res.json())
    .then((data)=>{
        namespan.innerText = data['name'];
    })
    .catch(() => {
        //console.log(tid)
        alert("error")
    })
}
