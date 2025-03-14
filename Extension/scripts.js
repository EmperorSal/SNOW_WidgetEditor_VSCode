// Global Variables:
var currPage = null;

//Main:
async function main() {
    currPage = await callGetCurrentTab();
    if (!isCurrentPageWidgtPage()) return;

    const launchButtonWrapper = document.getElementById("extension_sessionLaunchButtonWrapper");
    const launchButton = document.getElementById("extension_sessionLaunchButton");
    const wrongPageText = document.getElementById("extension_NotSNOWEditorText");
    
    //Show Session Button
    if (launchButtonWrapper) launchButtonWrapper.style.display = "flex";
    if (wrongPageText) wrongPageText.style.display = "none";

    //Button Click Event Listener:
    if (launchButton) launchButton.addEventListener("click", async function () {
        await sessionLaunchButton();
        
        /*await doOnPageDom(currPage.id, [], () => {
            [...document.querySelectorAll('a.monaco-button')].find(a => a.textContent.trim() === "Open Folder").click();
        });

        await doOnPageDom(currPage.id, [], () => document.documentElement.requestFullscreen());
        */
    });

}


//Checks if current tab is SNOW Widget Editor:
function isCurrentPageWidgtPage() {
    if (!currPage || !currPage.url) return false;
    const params = new URLSearchParams(new URL(currPage.url).search);
    //return params && params.get('id') === "widget_editor"; //TODO UNCOMMENT AFTER TEST
    return true;//TODO change this to return false after testing
}

async function callGetCurrentTab() {
    return await new Promise((res) => chrome.runtime.sendMessage({ type: "getCurrentTab" }, (response) => res(response)));
}

async function sessionLaunchButton() {
    await chrome.runtime.sendMessage({ type: "sessionLaunch", args: [currPage.id] });
}

async function doOnPageDom(myTabId, myFuncArgs, myFunc) {
    return new Promise((res) => chrome.scripting.executeScript({ target: { tabId: myTabId }, args: myFuncArgs, func: myFunc }, (ans) => {
        if (ans && ans.length > 0) res(ans[0].result);
    }));
}

main();