// Global Variables:
const VSCODE_URL = "https://typehere.cc/";//"https://vscode.dev";
var WIDGET_PAGE_ID = null;
var EDITOR_PAGE_ID = null;
var HTML = null;
var SCSS = null;
var CLIENT_SCRIPT = null;
var SERVER_SCRIPT = null;
var LINK_SCRIPT = null;
//HERE REMOVE LATER:
var TEST_SCRIPT = null;

chrome.runtime.onInstalled.addListener(() => {
    console.log("Background Script For Extension Is Running!");
});

// Listen for messages from content scripts to save state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getCurrentTab") getCurrentTab().then((tab) => sendResponse(tab)).catch(_ => sendResponse(null));
    if (message.type === "sessionLaunch") sessionLaunch(message.args[0]);
    return true;
});

//Get current active tab:
async function getCurrentTab() {
    if (!chrome || !chrome.tabs) return null;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return (tabs.length > 0) ? tabs[0] : null;
}

//Launch Session:
async function sessionLaunch(widgetPageId) {
    WIDGET_PAGE_ID = widgetPageId;

    //Get Data From Fields:
    TEST_SCRIPT = await doOnPageDom(WIDGET_PAGE_ID, [], getDataFromWidgetPage);

    //open vscode
    EDITOR_PAGE_ID = (await openVSCode()).id;
    console.log(EDITOR_PAGE_ID)
    logger(EDITOR_PAGE_ID, EDITOR_PAGE_ID, "log");


    //At this point we have both WIDGET_PAGE_ID & EDITOR_PAGE_ID
    //create data on vscode
    //create live code sync

}

//Runs functions on targeted DOM:
async function doOnPageDom(myTabId, myFuncArgs, myFunc) {
    return new Promise((res) => chrome.scripting.executeScript({ target: { tabId: myTabId }, args: myFuncArgs, func: myFunc }, (ans) => {
        if (ans && ans.length > 0) res(ans[0].result);
    }));
}

//Grabs data from SNOW Widget Editor:
function getDataFromWidgetPage() {
    //This widget cannot call an outside function (looking at different DOM)
    function DOMGrabAndButtonClick(checkboxId, elementId) {
        //TODO TEMP FOR DEV, REMOVE WHEN IMPLIMENTING ON Widget editor
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        const checkbox = document.getElementById(checkboxId);
        console.log(checkbox);
        if (checkbox) {
            if (!checkbox.dataset.clicked) {
                if (!checkbox.checked) {
                    button.click();
                }
                checkbox.dataset.clicked = "true";
            }
            checkbox.disabled = true;
        }
        var element = document.getElementById(elementId);
        if (element) return element;
        return null;
    }

    //TODO: Uncomment & add Id's 
    // return {
    //     HTML: DOMGrabAndButtonClick("", ""),
    //     SCSS: DOMGrabAndButtonClick("", ""),
    //     CLIENT_SCRIPT: DOMGrabAndButtonClick("", ""),
    //     SERVER_SCRIPT: DOMGrabAndButtonClick("", ""),
    //     LINK_SCRIPT: DOMGrabAndButtonClick("", "")
    // }

    //TODO: Delete after test
    return DOMGrabAndButtonClick("", "");
}



async function openVSCode() {
    const tabs = await chrome.tabs.query({});
    var currTab = await tabs.find(tab => tab.url && tab.url.includes(VSCODE_URL));
    if (currTab) {
        await chrome.tabs.update(currTab.id, { active: true });
    } else {
        currTab = await chrome.tabs.create({ url: VSCODE_URL });
    }
    console.log(1)
    await waitForTabLoad(currTab.id);
    console.log(2)
    return currTab;

}


async function waitForTabLoad(tabId) {
    let isLoading = true;
    while (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const tabs = await chrome.tabs.query({ active: true, windowId: tabId });
        if (tabs.length > 0) {
            const tab = tabs[0];
            if (tab.status === "complete") {
                isLoading = false;
            }
        } else {
            console.error("No active tab found.");
            isLoading = false;
        }
    }
}










// Listen for tab switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    console.log("activeTab", tabId);
});















//For Dev
function logger(pageId, message, type) {
    if (message === undefined) message = "undefined";
    if (message === null) message = "null";
    message = String(message);
    doOnPageDom(pageId, [message, type], (message, type) => {
        if (type === 'log') console.log(message);
        if (type === 'warn') console.warn(message);
        if (type === 'error') console.error(message);
    });
}








// TEMPPPP

/*

//On Button Click:
async function sessionLaunchButton() {
    //open vscode
    EditorPage = await openVSCode();


    //create data on vscode
    //create live code sync

    callDoOnPageDom(EditorPage.id, [], () => {
        const t = document.getElementById("typingCanvas")
        if (t) t.value = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    });
}


//Grabs data from SNOW Widget Editor:
function getDataFromWidgetPage() {
    //This widget cannot call an outside function (looking at different DOM)
    function DOMGrabAndButtonClick(checkboxId, elementId) {

        //TODO TEMP FOR DEV, REMOVE WHEN IMPLIMENTING ON Widget editor
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


        const checkbox = document.getElementById(checkboxId);
        console.log(checkbox);
        if (checkbox) {
            if (!checkbox.dataset.clicked) {
                if (!checkbox.checked) {
                    button.click();
                }
                checkbox.dataset.clicked = "true";
            }
            checkbox.disabled = true;
        }
        var element = document.getElementById(elementId);
        if (element) return element;
        return null;
    }

    //TODO: Uncomment & add Id's 
    // HTML = DOMGrabAndButtonClick("", "");
    // SCSS = DOMGrabAndButtonClick("", "");
    // ClientScript = DOMGrabAndButtonClick("", "");
    // ServerScript = DOMGrabAndButtonClick("", "");
    // LinkScript = DOMGrabAndButtonClick("", "");

    //TODO: Delete after test
    TEST_SCRIPT = DOMGrabAndButtonClick("", "");
}


async function openVSCode() {
    const tabs = await chrome.tabs.query({});
    var currTab = await tabs.find(tab => tab.url && tab.url.includes(vscodeURL));
    if (currTab) {
        await chrome.tabs.update(currTab.id, { active: true });
    } else {
        currTab = await chrome.tabs.create({ url: vscodeURL });
    }
    await waitForTabLoad(currTab.id);
    return currTab;

}


async function waitForTabLoad(tabId) {
    let isLoading = true;
    while (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        const [tab] = await chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT });
        if (tab && tab.status === "complete") {
            isLoading = false;
        }
    }
}

*/