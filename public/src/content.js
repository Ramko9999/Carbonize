
const copyUrlToClipboard  = (carbonUrl) => {
    return navigator.clipboard.writeText(carbonUrl);
}

const showToast = (duration, message, color) => {
    let toastContainer = document.createElement("div");
    toastContainer.innerText = message;
    toastContainer.className = "toast";
    toastContainer.style.backgroundColor = color;

    document.body.appendChild(toastContainer);
    setTimeout(()=>{
        document.body.removeChild(toastContainer);
    }, duration);
}

const getCopiedCode = () => {
    return window.getSelection().toString();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {type} = request
    if(type === "BUILD"){
        const {url} = request;
        sendResponse({status: "OK"});
        copyUrlToClipboard(url).then(()=> {
            console.log('Finished Copying!');
            showToast(1000, "Linked Copied!", "green");
        });
    }
    else if(type === "COPY"){
        sendResponse({
            status: "OK",
            code: getCopiedCode()
        });
    }
    else if(type === "ERROR"){
        const {errorMessage} = request;
        showToast(1000, errorMessage, "red");
    }
    else{
        sendResponse({status: "FAILURE"});
    }
});

