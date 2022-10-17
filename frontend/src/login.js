import { channelPage } from "./channel.js";

const portNum = 5005
export function createElement(tag, data, options = {}) {
    const element = document.createElement(tag);
    if(data){
        element.textContent = data;
    }
    for(let i in options){
        element.setAttribute(i, options[i])
    }
    return element;
}
export function removeAllChild(node) {
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
}
export function logInPage() {
    localStorage.clear();
    document.getElementById("channel-page").style.display="none";
    document.getElementById("container").style.display="";
    const login = createElement('form', '', {id: 'login-form',style:'font-size:30px'});
    const usernameInput = createElement('input', '', {id: 'email', class: 'login-input', type: 'text', required: 'true'});
    const usernameLabel = createElement('label', 'Email ', {for: 'email'});
    const checkSpan = createElement('span', '', {id:'checkEmail',class: 'check'});
    const passwordInput = createElement('input', '', {id: 'password', class: 'login-input', type: 'password', required: 'true'});
    const passwordLabel = createElement('label', 'Password ', {for: 'password'});
    const checkSpan2 = createElement('span', ' ', {id:'checkPass',class: 'check'});
    const loginBtn = createElement('button', 'Log in', {id: 'loginBtn', class: 'form-btn', name: 'Login'});
    const register = createElement('button', 'Register', {id: 'registerLink', class: 'form-btn', name: 'Register'});
    let window = document.getElementById("container")
    window.appendChild(login);
    login.appendChild(createElement('h3', 'Login', {}));
    login.appendChild(usernameLabel);
    login.appendChild(usernameInput);
    login.appendChild(createElement('br', ''));
    login.appendChild(checkSpan);
    login.appendChild(createElement('br', ''));
    login.appendChild(passwordLabel);
    login.appendChild(passwordInput);
    login.appendChild(checkSpan2);
    login.appendChild(loginBtn);
    login.appendChild(register);
    login.appendChild(createElement('br', ''));
    login.appendChild(createElement('div', 'Note: Dear tutor, sometime it may need to login twice to get into channel page since logout was not clicked last time, my apologize', {style:'font-size:20px'}));
    login.appendChild(createElement('div', 'please try to log in twice or register to check other milestones, thank you!', {style:'font-size:20px'}));

    
    usernameInput.onblur=function(){
        let node = document.getElementById("checkEmail")
        var email = document.getElementById("email").value
        if(email === ""){
            node.innerText = "UserName can not be empty";
        } else{
            node.innerText = "";
            return true
        }
    }
    passwordInput.onblur=function(){
        let node2 = document.getElementById("checkPass")
        var password = document.getElementById("password").value
        if(password === ""){
            node2.innerText = "UserName can not be empty";
        } else{
            node2.innerText = "";
            return true
        }
    }
    loginBtn.onclick=function(){
        //console.log("aaaaaa")
        var email = document.getElementById("email").value
        var password = document.getElementById("password").value
        if(password==""||email==""){
            alert("Please use your account to log in ")
            return false
        }
        const data = {"email":email, "password":password};
        const options ={
            method:'POST',
            body:JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            },
        }
        fetch(`http://localhost:${portNum}/auth/login`,options).then(res=> {
            if(res.status == 200){
                res.json().then(res=>{
                    //alert("res in")
                    const token = res["token"];
                    const id = res["userId"];
                    localStorage.setItem('userId',id);
                    localStorage.setItem('token',token);
                    channelPage();
                })
            }else{
                res.json().then(res=>{
                    alert(res["error"]);
                })
            }
        });
    }
    register.onclick=function(){
        RegisterPage();
    }
}
export function RegisterPage(){
    const registerForm = createElement('form', '', {id: 'register-form',style:'font-size:30px'});
    const emailInput = createElement('input', '', {id: 'email', class: 'login-input', type: 'text', required: 'true'});
    const emailLabel = createElement('label', 'Email ', {for: 'email'});
    const checkSpan = createElement('span', '', {id:'checkEmail',class: 'check'});
    const usernameInput = createElement('input', '', {id: 'username', class: 'login-input', type: 'text', required: 'true'});
    const usernameLabel = createElement('label', 'Username ', {for: 'email'});
    const checkSpan2 = createElement('span', '', {id:'checkUsername',class: 'check'});
    const passwordInput = createElement('input', '', {id: 'password', class: 'login-input', type: 'password', required: 'true'});
    const passwordLabel = createElement('label', 'Password ', {for: 'password'});
    const confirmPassInput = createElement('input', '', {id: 'confirm-password', class: 'login-input', type: 'password', required: 'true'});
    const confirmPassLabel = createElement('label', 'Password ', {for: 'password'});
    const checkSpan3 = createElement('span', ' ', {id:'checkPass',class: 'check'});
    const submit = createElement('button', 'Submit', {id: 'submit-btn', class: 'form-btn', name: 'submit'});
    let window = document.getElementById("container")
    removeAllChild(window)
    
    window.appendChild(registerForm);
    registerForm.appendChild(createElement('h3', 'Register', {}));
    registerForm.appendChild(emailLabel);
    registerForm.appendChild(emailInput);
    registerForm.appendChild(createElement('br', ''));
    registerForm.appendChild(checkSpan);
    registerForm.appendChild(createElement('br', ''));
    registerForm.appendChild(usernameLabel);
    registerForm.appendChild(usernameInput);
    registerForm.appendChild(checkSpan2);
    registerForm.appendChild(createElement('br', ''));
    registerForm.appendChild(passwordLabel);
    registerForm.appendChild(passwordInput);
    registerForm.appendChild(createElement('br', ''));
    registerForm.appendChild(confirmPassLabel);
    registerForm.appendChild(confirmPassInput);
    registerForm.appendChild(checkSpan3);
    registerForm.appendChild(createElement('br', ''));
    registerForm.appendChild(submit);
    
    emailInput.onblur=function(){
        let node = document.getElementById("checkEmail")
        var password = document.getElementById("password").value
        if(password === ""){
            node.innerText = "UserName can not be empty";
        } else{
            node.innerText = "";
            return true
        }
    }
    usernameInput.onblur=function(){
        let node = document.getElementById("checkEmail")
        var username = document.getElementById("username").value
        if(username === ""){
            node.innerText = "UserName can not be empty";
        } else{
            node.innerText = "";
            return true
        }
    }
    passwordInput.onblur=function(){
        let node = document.getElementById("checkPass")
        var password = document.getElementById("password").value
        if(password === ""){
            node.innerText = " Please enter password";
        } else{
            node.innerText = "";
            return true
        }
    }
    document.getElementById("submit-btn").addEventListener("click", function(){
        //console.log("here")
        var password = document.getElementById("password").value
        var confirmPass = document.getElementById("confirm-password").value
        var email = document.getElementById("email").value
        var username = document.getElementById('username').value
        //console.log(email)
        //console.log(password)
        if(password!=confirmPass){
            alert("password does not match")
        }
        const data = {"email":email, "password":password, "name":username};
        const options = {
            method:'POST',
            body:JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            },
        }
        fetch(`http://localhost:${portNum}/auth/register`,options).then(res=> {
            //console.log("here")
            if(res.status === 200){
                //console.log("here")
                res.json().then(res=>{
                    var token = res["token"];
                    var id = res["userId"];
                    //storeToken(id,token);
                })
            }else{
                res.json().then(res=>{
                    alert(res["error"]);
                })
            }
        });
    })

}
