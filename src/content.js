
const showToast = () => {
         
}

const initialize = () => {
    console.log("Injected...");
    let sectionContent = document.getElementsByClassName("section-content")[0];
    let toast = document.createElement("div");
    toast.className = "carbon-toast";
    toast.innerText = "Carbonize!";
    sectionContent.appendChild(toast);
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {type} = request;
    if(type === "TOAST"){
        showToast();
        sendResponse({status: "OK"});
    }
    else{
        sendResponse({status: "FAILURE"});
    }
});

initialize();