
const copyToClipboard = (carbonUrl) => {
    return () => {
        console.log(carbonUrl);
        return navigator.clipboard.writeText(carbonUrl);
    }
}

const enableCopyButton = (asyncCallback) => {
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


const onUpdateSuccessful = () => {
    console.log("Updated");
}

const putThemeOptions = () => {

    const updateTheme = (theme) => {
        chrome.storage.sync.set({theme:theme}, () => {
            onUpdateSuccessful();
            setThemeOption(theme);
            closeModal();
        });
    }

    const setThemeOption = (theme) => {
        let themeSummary = document.getElementById("theme-summary");
        themeSummary.innerText = `Theme : ${theme}`;
    }

    const closeModal = ()=>{
        let themeDetails = document.getElementById("theme-details");
        themeDetails.open = false;
    }

    chrome.storage.sync.get(["theme"], (data)=>{
        if("theme" in data && data.theme){
            setThemeOption(data.theme);
        }
    });

    let themeSelectMenu = document.getElementById("theme-selection-list");
    let themes = ["cobalt", "dracula", "blackboard", "lucario", "monokai"];
    themes.forEach((theme) => {
        let button = document.createElement("button");
        button.className = "SelectMenu-item";
        button.role = "menuitem";
        button.innerText = theme;
        button.onclick = (event) => {
            updateTheme(theme);
        }
        themeSelectMenu.appendChild(button);
    });
}

const putLanguageOptions = () => {
    const updateLanguage = (language) => {
        chrome.storage.sync.set({language:language}, () => {
            setLanguageOption(language);
            onUpdateSuccessful();
            closeModal();
        });
    }

    const closeModal = () => {
        let languageDetails = document.getElementById("language-details");
        languageDetails.open = false;
    }

    const setLanguageOption = (language) => {
        let langSummary = document.getElementById("language-summary");
        langSummary.innerText = `Language : ${language}`;
    }

    chrome.storage.sync.get(["language"], (data) => {
        if("language" in data && data.language){
            setLanguageOption(data.language);
        }
    });

    let languageSelectionMenu = document.getElementById("language-selection-list");
    let languages = ['c', 'python', 'java', 'javascript', 'typescript', 'text', 'auto'];
    languages.forEach((language) => {
        let button = document.createElement("button");
        button.className = "SelectMenu-item";
        button.role = "menuitem";
        button.innerText = language;
        button.onclick = (event) => {
            updateLanguage(language);
        }
        languageSelectionMenu.appendChild(button);
    });
}

const putOptions = () => {
    putThemeOptions();
    putLanguageOptions();
}

const initalize = () => {
    putOptions();
    chrome.storage.sync.get(["carbonUrl"], (data)=>{
        let carbonUrl = data.carbonUrl;
        if(carbonUrl !== ""){
            enableCopyButton(copyToClipboard(carbonUrl));
        }
        else{
            disableCopyButton();
        }
    });
}

initalize();

