// Global Variables:
var currPage = null;

// Main:
async function main() {
    currPage = await askBackendScript("getCurrentTab");
    if (!isCurrentPageWidgtPage()) return;

    //do chrome.runtime.onMessage.addListener((message, sender, sendResponse) then update dom when backend tells you to.
    

    window.addEventListener("beforeunload", async () => {
        if (chrome?.runtime?.id) await askBackendScript("sessionEnd", ["widgetPage"]);
    });
}




async function createFolder() {
    const folderHandle = await window.showDirectoryPicker();
    const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    
}

















//Checks if current tab is SNOW Widget Editor:
function isCurrentPageWidgtPage() {
    if (!currPage || !currPage.url) return false;
    const params = new URLSearchParams(new URL(currPage.url).search);
    //return params && params.get('id') === "widget_editor"; //TODO UNCOMMENT AFTER TEST
    return true;//TODO change this to return false after testing
}


async function askBackendScript(myStr, myArgs=[]) {
    return await new Promise((res) => chrome.runtime.sendMessage({ type: myStr, args: myArgs }, (response) => res(response)));
}

const widgetPageObserver = new MutationObserver(() => {
    if (document.body && document.readyState === "complete") {
        setTimeout(() => {
            main();
        }, 1000);
        widgetPageObserver.disconnect();
    }
});

if(document.URL !== "https://vscode.dev/") widgetPageObserver.observe(document.documentElement, { childList: true, subtree: true });