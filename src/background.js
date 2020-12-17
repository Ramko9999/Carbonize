const getUserSettings = () => {
    return {
        background: {
            red: 31,
            green: 12,
            blue: 12,
            alpha: 1
        },
        theme: "blackboard",
        language: "auto", 
        font: {
            family: "Hack",
            size: "14px"
        },
        dropShadow: {
            doesExists: false,
            offset:"31px",
            blur:"68px"  
        },
        window: {
            type: "boxy",
            hasControls: false
        },
        padding:{
            vertical: "29px",
            horizontal: "27px"
        },
        autoWidth: true,
        line: {
            hasNumbers: true,
            height: 154
        }
    }
}

const verifySelection = (selectionCode, pageUrl) => {
    if(selectionCode === ""){
        return false;
    }
    if(pageUrl.match(/https:/) && pageUrl.match(/medium.com/)){
       return true; 
    }
    return false;
};


const buildCarbonUrl = (selectionCode) => {
    const settings = getUserSettings();
    const url = ["https://carbon.now.sh/?"];
    if("background" in settings){
        const {red, green, blue, alpha} = settings.background;
        let backgroundParams = `bg=rgba%28${red}%2C${green}%2C${blue}%2C${alpha}%29&`;
        url.push(backgroundParams);
    }
    if("language" in settings){
        url.push(`l=${settings.language}&`);
    }
    if("theme" in settings){
        url.push(`t=${settings.theme}&`);
    }
    if("dropShadow" in settings){
        const {doesExist, offset, blur} = settings.dropShadow;
        if(doesExist){
            url.push(`ds=true&dsyoff=${offset}&dsblur=${blur}&`);
        }
        else{
            url.push(`ds=false&`);
        }
    }
    if("window" in settings){
        const {hasControls, type} = settings.window;
        let windowParams = `wc=${hasControls}&wt=${type}&`;
        url.push(windowParams);
    }
    if("autoWidth" in settings){
        url.push(`wa=${settings.autoWidth}&`);
    }
    if("padding" in settings){
        const {vertical, horizontal} = settings.padding;
        let paddingParams = `pv=${vertical}&ph=${horizontal}&`;
        url.push(paddingParams);
    }
    if("line" in settings){
        const {height, hasNumbers} = settings.line;
        let lineParams = `&ln=${hasNumbers}&lh=${height}%25&`;
        url.push(lineParams);
    }
    if("font" in settings){
        const {family, size} = settings.font;
        let fontParams = `fm=${family}&fs=${size}&`;
        url.push(fontParams);
    }
    url.push("wm=false&");
    url.push(`code=${selectionCode}`);
    return url.join("");
}


chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id: "carbonize",
        title: "carbonize",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((clickData) => {
    const {selectionText, pageUrl, menuItemId} = clickData;
    if(menuItemId === "carbonize"){
        if(verifySelection(selectionText, pageUrl)){
            let snippetUrl = buildCarbonUrl(selectionText);
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                const tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, {carbonUrl:snippetUrl}, (response) => {
                    console.log(JSON.stringify(response));
                });
            })
        }
        else{
            console.log("Site doesn't match url");
        }
    }
});