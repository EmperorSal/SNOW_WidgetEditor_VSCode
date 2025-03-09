// Global Variables:
var WidgetPage = null;
var EditorPage = null;
var HTML = null;
var SCSS = null;
var ClientScript = null;
var ServerScript = null;
var LinkScript = null;
const vscodeURL = "https://typehere.cc/";//"https://vscode.dev";
//HERE REMOVE LATER:
var TestScript = null;

//Main:
async function main() {
    const wrongPageText = document.getElementById("extension_NotSNOWEditorText");
    const launchButtonWrapper = document.getElementById("extension_sessionLaunchButtonWrapper");
    const launchButton = document.getElementById("extension_sessionLaunchButton");

    //Get Widget Page:
    WidgetPage = await getCurrentTab();

    //Check if WidgetPage is on the widget editor:
    if (!isCurrentPageWidgtPage()) return;

    wrongPageText.style.display = "none";
    launchButtonWrapper.style.display = "flex";

    //Button Click Event Listener:
    if (launchButton) launchButton.addEventListener("click", function () { sessionLaunchButton() });
}


//Returns the current tab:
async function getCurrentTab() {
    if (!chrome || !chrome.tabs) return null;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return null;
    return tabs[0];
}

//Checks if current tab is SNOW Widget Editor:
function isCurrentPageWidgtPage() {
    if (WidgetPage === null) return false;
    const params = new URLSearchParams(new URL(WidgetPage.url).search);
    //return params && params.get('id') === "widget_editor"; //TODO UNCOMMENT AFTER TEST
    return true;//TODO change this to return false after testing
}

//On Button Click:
async function sessionLaunchButton() {
    //Get Data From Fields:
    await doOnPageDom(WidgetPage.id, [], getDataFromWidgetPage);

    //open vscode
    EditorPage = await openVSCode();
    //create data on vscode
    //create live code sync

    doOnPageDom(EditorPage.id, [], () => {
        const t = document.getElementById("typingCanvas")
        if (t) t.value = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    });

    //const tab = await openVSCode();
    //pushDataToVSCode(tab);
}


//Runs scripts on targeted DOM:
async function doOnPageDom(myTabId, myFuncArgs, myFunc) {
    await chrome.scripting.executeScript({
        target: { tabId: myTabId },
        args: myFuncArgs,
        func: myFunc
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
    TestScript = DOMGrabAndButtonClick("", "");
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

async function requestHostPermission(url) {
    const granted = await chrome.permissions.request({
        origins: [url]
    });
    if (granted) {
        console.log(`Permission granted for ${url}`);
    } else {
        console.error(`Permission denied for ${url}`);
    }
}


















//Logs on current tab (For Dev):
async function logger(message, type) {
    const currPage = await getCurrentTab();
    if (!currPage) return;
    if (message === undefined) message = "undefined";
    if (message === null) message = "null";
    message = String(message);
    doOnPageDom(currPage.id, [message, type], (message, type) => {
        if (type === 'log') console.log(message);
        if (type === 'warn') console.warn(message);
        if (type === 'error') console.error(message);
    });
}














function pushDataToVSCode(tab) {
    alert(tab.url);
}


main();