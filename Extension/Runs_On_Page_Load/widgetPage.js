// Global Variables:
var currPage = null;

// Main:
async function main() {
    currPage = await askBackendScript("getCurrentTab");
    if (!isCurrentPageWidgtPage()) return;

    window.addEventListener("beforeunload", async () => {
        if (chrome?.runtime?.id) await askBackendScript("sessionEnd", ["widgetPage"]);
    });



    await sendDataToBackendScript();


    try {
        var keepGettingData = true;
        while (keepGettingData) {
            const data = await getDataFromBackendScript().catch((err) => {
                keepGettingData = false;
                console.warn(err);
            })
            await new Promise(_ => setTimeout(_, 1000));
        }
    } catch (err) {
        console.warn(err);
    }
}



async function sendDataToBackendScript(){

}

async function getDataFromBackendScript() {
    // return new Promise(res => askBackendScript("getDataToWidgetPage").then(data => res(data)).catch(() => res(null)));
}











//Checks if current tab is SNOW Widget Editor:
function isCurrentPageWidgtPage() {
    if (!currPage || !currPage.url) return false;
    const params = new URLSearchParams(new URL(currPage.url).search);
    //return params && params.get('id') === "widget_editor"; //TODO UNCOMMENT AFTER TEST
    return true;//TODO change this to return false after testing
}


async function askBackendScript(myStr, myArgs = []) {
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

if (document.URL !== "https://vscode.dev/") widgetPageObserver.observe(document.documentElement, { childList: true, subtree: true });