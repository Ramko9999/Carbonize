
const fields = ["theme", "language", "font"];

const background = {
    red: 31,
    green: 12,
    blue: 12,
    alpha: 1
};

const screen = {
    type: "boxy",
    hasControls: false
};

const padding = {
    vertical: "0px",
    horizontal: "0px"
};

const line = {
    hasNumbers: true,
    height: 133
};

const isValidCode = (code, pageUrl) => {
    if (code === "") {
        return false;
    }
    if (pageUrl.match(/https:/) && pageUrl.match(/medium.com/)) {
        return true;
    }
    return false;
}

const buildCarbonUrl = (code) => {
    chrome.storage.sync.get(fields, (settings) => {
        const snippetUrl = getCarbonUrl(code, settings);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            const message = {
                url: snippetUrl,
                type: "COPY"
            };
            chrome.tabs.sendMessage(tab.id, message);
        });
    });
}


const getCarbonUrl = (code, settings) => {
    const carbonUrl = new URL("https://carbon.now.sh");
    
    const {red, green, blue, alpha} = background;
    carbonUrl.searchParams.append("bg", `rgba%28${red}%2C${green}%2C${blue}%2C${alpha}%29`)
    
    carbonUrl.searchParams.append("l", settings.language);
    
    carbonUrl.searchParams.append("t", settings.theme);
    carbonUrl.searchParams.append("ds", false);

    const {hasControls, type} = screen;
    carbonUrl.searchParams.append("wc", hasControls);
    carbonUrl.searchParams.append("wt", type);
    
    carbonUrl.searchParams.append("wa", false);
    
    const {vertical, horizontal} = padding;
    carbonUrl.searchParams.append("pv", vertical);
    carbonUrl.searchParams.append("ph", horizontal);
    
    const { height, hasNumbers } = line;
    carbonUrl.searchParams.append("ln", hasNumbers);
    carbonUrl.searchParams.append("lh", `${height}%25`);

    carbonUrl.searchParams.append("fm", settings.font);
    carbonUrl.searchParams.append("fs", "14px");
    
    carbonUrl.searchParams.append("wm", false);
    carbonUrl.searchParams.append("code", encodeURIComponent(code));
    return carbonUrl.toString();
}

chrome.contextMenus.onClicked.addListener((clickData) => {
    const { selectionText, pageUrl, menuItemId } = clickData;
    if (menuItemId === "carbonize") {
        if (isValidCode(selectionText, pageUrl)) {
            buildCarbonUrl(selectionText);
        }
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "carbonize",
        title: "Carbonize",
        contexts: ["selection"]
    });

    chrome.browserAction.setBadgeBackgroundColor({ color: "#F00" });
    const defaultOptions = {
        theme: "blackboard",
        language: "auto",
        font: "Hack"
    };
    chrome.storage.sync.set(defaultOptions);
});
