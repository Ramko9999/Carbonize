const getDefaultSettings = () => {
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
            vertical: "0px",
            horizontal: "0px"
        },
        autoWidth: true,
        line: {
            hasNumbers: true,
            height: 133
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
    const settings = getDefaultSettings();
    const carbonUrl = new URL("https://carbon.now.sh");
    if("background" in settings){
        const {red, green, blue, alpha} = settings.background;
        carbonUrl.searchParams.append("bg",`rgba%28${red}%2C${green}%2C${blue}%2C${alpha}%29` )
    }
    if("language" in settings){
        carbonUrl.searchParams.append("l", settings.language);
    }
    if("theme" in settings){
        carbonUrl.searchParams.append("t", settings.theme);
    }
    if("dropShadow" in settings){
        const {doesExist, offset, blur} = settings.dropShadow;
        if(doesExist){
            carbonUrl.searchParams.append("ds", true);
            carbonUrl.searchParams.append("dsyoff", offset);
            carbonUrl.searchParams.append("dsblur", blur);
        }
        else{
            carbonUrl.searchParams.append("ds", false);
        }
    }
    if("window" in settings){
        const {hasControls, type} = settings.window;
        carbonUrl.searchParams.append("wc", hasControls);
        carbonUrl.searchParams.append("wt", type);
    }
    if("autoWidth" in settings){
        carbonUrl.searchParams.append("wa", settings.autoWidth);
    }
    if("padding" in settings){
        const {vertical, horizontal} = settings.padding;
        carbonUrl.searchParams.append("pv", vertical);
        carbonUrl.searchParams.append("ph", horizontal);
    }
    if("line" in settings){
        const {height, hasNumbers} = settings.line;
        carbonUrl.searchParams.append("ln", hasNumbers);
        carbonUrl.searchParams.append("lh", `${height}%25`);
    }
    if("font" in settings){
        const {family, size} = settings.font;
        carbonUrl.searchParams.append("fm", family);
        carbonUrl.searchParams.append("fs", size);
    }
    carbonUrl.searchParams.append("wm", false);
    carbonUrl.searchParams.append("code", encodeURIComponent(selectionCode));
    return carbonUrl.toString();
}


chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id: "carbonize",
        title: "Carbonize",
        contexts: ["selection"]
    });
    chrome.browserAction.setBadgeBackgroundColor({color: "#F00"});
    const defaultOptions = {
        theme: "blackboard",
        language: "auto",
        carbonUrl: ""
    };

    chrome.storage.sync.set(defaultOptions);
});

chrome.contextMenus.onClicked.addListener((clickData) => {
    const {selectionText, pageUrl, menuItemId} = clickData;
    if(menuItemId === "carbonize"){
        if(verifySelection(selectionText, pageUrl)){

            let snippetUrl = buildCarbonUrl(selectionText);
            chrome.storage.sync.set({carbonUrl: snippetUrl}, ()=>{
                chrome.browserAction.setBadgeText({text: " "});
            });
        }
        else{
            console.log("Site doesn't match url");
        }
    }
});