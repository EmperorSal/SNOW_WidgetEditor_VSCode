// Global Variables:
const VSCODE_URL = "https://vscode.dev";
var WIDGET_PAGE_ID = null;
var EDITOR_PAGE_ID = null;
var HTML = null;
var SCSS = null;
var CLIENT_SCRIPT = null;
var SERVER_SCRIPT = null;
var LINK_SCRIPT = null;
var IS_DEV_LAUNCHED_FROM_EXTENSION = false;
var inASession = false;
//HERE REMOVE LATER:
var TEST_SCRIPT = null;

// Listen for messages from content scripts to save state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getCurrentTab") getCurrentTab().then((tab) => sendResponse(tab)).catch(() => sendResponse(null));
    if (message.type === "sessionLaunch") sessionLaunch(message.args[0]).then(() => sendResponse("Success")).catch(() => sendResponse(null));
    if (message.type === "sessionEnd") sessionEnd(message.args[0]).then(() => sendResponse("Success")).catch(() => sendResponse(null));
    if (message.type === "didComeFromExtension") sendResponse(IS_DEV_LAUNCHED_FROM_EXTENSION);
    // if (message.type === "getDataToWidgetPage") sendResponse("SENT DATA!");
    return true;
});

//Get current active tab:
async function getCurrentTab() {    
    if (!chrome || !chrome.tabs) return null;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return (tabs.length > 0) ? tabs[0] : null;
}

//End Session:
async function sessionEnd(args) {
    if(args === "vsCodePage"){
        if(!inASession) IS_DEV_LAUNCHED_FROM_EXTENSION = false;
        inASession = false;
    }
    return true;
}

//Launch Session:
async function sessionLaunch(widgetPageId) {
    inASession = true;
    IS_DEV_LAUNCHED_FROM_EXTENSION = true;

    WIDGET_PAGE_ID = widgetPageId;

    //Get Data From Fields:
    TEST_SCRIPT = await doOnPageDom(WIDGET_PAGE_ID, [], getDataFromWidgetPage);

    //open vscode:
    EDITOR_PAGE_ID = (await openVSCode()).id;

    //TODO LEFT OFF HERE
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
        await chrome.tabs.reload(currTab.id);
        await chrome.tabs.update(currTab.id, { active: true });
    } else {
        currTab = await chrome.tabs.create({ url: VSCODE_URL });
    }
    await waitForTabLoad(currTab.id);
    return currTab;
}

async function waitForTabLoad(tabId) {
    while (true) {
        const tabs = await chrome.tabs.query({})
        const tab = await tabs.find(tab => tab.id === tabId)
        if (!tab) {
            console.warn("No Tab Found in loading");
            break;
        }
        if (tab.status === "complete") {
            break;
        } else {
            console.warn("Tab Still Loading!");
        }
        await new Promise(res => setTimeout(res, 300));
    }
}

















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

chrome.runtime.onInstalled.addListener(() => {
    console.log("Background Script For Extension Is Running!");
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    console.log("Switched to Tab: ", tabId);
});
