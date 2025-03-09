// Global Variables:
var currPage = null;

//Main:
async function main() {
    const launchButtonWrapper = document.getElementById("extension_sessionLaunchButtonWrapper");
    const launchButton = document.getElementById("extension_sessionLaunchButton");
    const wrongPageText = document.getElementById("extension_NotSNOWEditorText");

    currPage = await callGetCurrentTab();

    //Check if WidgetPage is on the widget editor:
    if (!isCurrentPageWidgtPage()) return;

    //Show Session Button
    if (launchButtonWrapper) launchButtonWrapper.style.display = "flex";
    if (wrongPageText) wrongPageText.style.display = "none";

    //Button Click Event Listener:
    if (launchButton) launchButton.addEventListener("click", function () { sessionLaunchButton() });
}

//Checks if current tab is SNOW Widget Editor:
function isCurrentPageWidgtPage() {
    if (!currPage|| !currPage.url) return false;
    const params = new URLSearchParams(new URL(currPage.url).search);
    //return params && params.get('id') === "widget_editor"; //TODO UNCOMMENT AFTER TEST
    return true;//TODO change this to return false after testing
}

async function callGetCurrentTab() {
    return await new Promise((res) => chrome.runtime.sendMessage({ type: "getCurrentTab" }, (response) => res(response)));
}

function sessionLaunchButton() {
    chrome.runtime.sendMessage({ type: "sessionLaunch", args: [currPage.id] });
}

main();