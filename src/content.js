
const pasteCarbonUrl = (carbonUrl) => {
    let selectionArea = window.getSelection();
    selectionArea.anchorNode.appendChild(`<p>${carbonUrl}</p>`);
    console.log(selectionArea);
    console.log(carbonUrl);
}

const validateCarbonUrl = (carbonUrl, sender) => {
    return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if("carbonUrl" in request){
        const {carbonUrl} = request;
        if(validateCarbonUrl(carbonUrl, sender)){
            pasteCarbonUrl(carbonUrl);
            sendResponse({status: "Successful"});
        }
        else{
            sendResponse({status: "Failed", message: "Invalid Url"});
        }
    }
    else{
        sendResponse({status: "Failed", message: "Url not provided"});
    }
});

console.log("Injected Content Script");

