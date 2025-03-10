// Global Variables:
const VSCODE_URL = "https://vscode.dev";
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
    if (message.type === "sessionLaunch") sessionLaunch(message.args[0]).then(_ => sendResponse(_));
    if(message.type === "editorPageInit") editorPageInit().then(_ => sendResponse(EDITOR_PAGE_ID));
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

    //create permissions on VSCode

    //doOnPageDom(EDITOR_PAGE_ID, [], editorPageSetup);


    // prevent default on left click with workspace and on hover do not show icons
    // setings.json is read-only
    // press F11 for full screen toggle.









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
            console.error("No Tab Found in loading");
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


async function editorPageInit(){

}







async function editorPageSetup() {
    document.querySelector("iframe").removeAttribute("sandbox");

    const t = [...document.querySelectorAll('a.monaco-button')].find(a => a.textContent.trim() === "Open Folder");
    console.log(t);
    if (t) t.click();


    const event = new KeyboardEvent('keydown', {
        key: 'F11',
        code: 'F11',
        keyCode: 122,
        which: 122,
        bubbles: true,
        cancelable: false
    });

    document.dispatchEvent(event);
}








//This function gets passed through a different DOM and cannot call outside functions
function editorPermissions() {

    //Make this run when on vs code open not here
    //make vscode open them too
    //make it clear prev files
    //only ask once for folder?
    //

    async function requestFolderAcess() {
        try {
            const folderHandle = await window.showDirectoryPicker();
            const entries = [];

            for await (const entry of folderHandle.values()) {
                entries.push(entry);
            }
            if (entries.length > 0) {
                alert("Please select an empty folder.");
                return;
            }


            const requiredFiles = ["index.html", "styles.css", "client.js", "server.js", "link.js"];
            for (const fileName of requiredFiles) {
                const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(`// Auto-generated file: ${fileName}`);
                await writable.close();
            }

            alert("Folder opened and files created in VSCode.dev!");
        } catch {
            console.warn("Failed to setup Location Folder");
        }
    }

    requestFolderAcess();
}











// Listen for tab switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    console.log("Switched to Tab: ", tabId);
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
