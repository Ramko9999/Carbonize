
const copyUrlToClipboard  = (carbonUrl) => {
    return navigator.clipboard.writeText(carbonUrl);
}

const showToast = (duration) => {
    let toastContainer = document.createElement("div");
    toastContainer.innerText = "Link Copied!";
    toastContainer.className = "toast";

    document.body.appendChild(toastContainer);
    setTimeout(()=>{
        document.body.removeChild(toastContainer);
    }, duration);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {url, type} = request;
    if(type === "COPY"){
        sendResponse({status: "OK"});
        copyUrlToClipboard(url).then(()=> {
            console.log('Finished Copying!');
            showToast(2000);
        });
    }
    else{
        sendResponse({status: "FAILURE"});
    }
});

