/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}
export const send_message = (pic)=>{
    const cid = localStorage.getItem("cid")
    const token = localStorage.getItem("token")
    const content_to_send = document.getElementById("send-box").value;
    //console.log(content_to_send)
    const jsonString = JSON.stringify({
        'message':content_to_send,
        'image':pic
    })
    const options = {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token
            },
            body:jsonString
        }
    fetch(`http://localhost:5005/message/${cid}`,options)
    .then((res)=>{
        if(res.status === 200){
            document.getElementById("send-box").value = ''
            document.getElementById(`chat-btn/${cid}`).click()
        }else{
            res.json().then(res=>{
                alert(res["error"]);
            })
        }
        })
    }
