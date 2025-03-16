// Global Variables:
var currPage = null;
const requiredFiles = ["index.html", "styles.css", "client.js", "server.js", "link.js"];

//Main:
async function main() {
    currPage = await askBackendScript("getCurrentTab");

    const launchButtonWrapper = document.getElementById("extension_sessionLaunchButtonWrapper");
    const launchButton = document.getElementById("extension_sessionLaunchButton");
    const wrongPageText = document.getElementById("extension_NotSNOWEditorText");
    
    //Show Session Button
    if (launchButtonWrapper) launchButtonWrapper.style.display = "flex";
    if (wrongPageText) wrongPageText.style.display = "none";

    //Button Click Event Listener:
    if (launchButton) launchButton.addEventListener("click",  async () => {

        // ask for folder creation in empty or correct place.
        // send it to server

        askBackendScript("sessionLaunch", [currPage.id]);
    });
}




async function askBackendScript(myStr, myArgs=[]) {
    return await new Promise((res) => chrome.runtime.sendMessage({ type: myStr, args: myArgs }, (response) => res(response)));
}


// async function doOnPageDom(myTabId, myFuncArgs, myFunc) {
//     return new Promise((res) => chrome.scripting.executeScript({ target: { tabId: myTabId }, args: myFuncArgs, func: myFunc }, (ans) => {
//         if (ans && ans.length > 0) res(ans[0].result);
//     }));
// }

main();