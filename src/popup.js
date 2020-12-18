
const copyToClipboard = (carbonUrl) => {
    return () => {
        console.log(carbonUrl);
        return navigator.clipboard.writeText(carbonUrl);
    }
}

const changeButtonCallback = (asyncCallback) => {
    const copyCallback = () => {
        asyncCallback().then((_)=>{
            chrome.browserAction.setBadgeText({text:""}); 
        });
    }   
    const copyButton = document.getElementById("copy-button");
    copyButton.disabled = false;
    copyButton.innerText = "Click to copy url!";
    copyButton.onclick = copyCallback;
}

const disableCopyButton = () => {
    const copyButton = document.getElementById("copy-button");
    copyButton.disabled = true;
    copyButton.innerText = "Nothing to copy...";
}

const initalize = () => {
    chrome.storage.sync.get(["carbonUrl"], (data)=>{
        let carbonUrl = data.carbonUrl;
        if(carbonUrl !== ""){
            changeButtonCallback(copyToClipboard(carbonUrl));
        }
        else{
            disableCopyButton();
        }
    });
}

initalize();

