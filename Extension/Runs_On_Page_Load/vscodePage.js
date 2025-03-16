// Global Variables:
var currPage = null;

// Main:
async function main() {
    if (!(await askBackendScript("didComeFromExtension"))) return;
    currPage = await askBackendScript("getCurrentTab");
    await makeLoadDataButton();

    /*
        await doOnPageDom(currPage.id, [], () => {
            
        });

        await doOnPageDom(currPage.id, [], () => document.documentElement.requestFullscreen());
    */

    const loadButton = document.getElementById("extension_dataLoadingPopupButton");
    loadButton.addEventListener('click', async () => {
        await setToLoading();
        
        
        //await createFolder();

        //document.documentElement.requestFullscreen();
        await [...document.querySelectorAll('a.monaco-button')].find(a => a.textContent.trim() === "Open Folder").click();


        await loadingDone();
    });


    window.addEventListener("beforeunload", async (e) => {
        if (chrome?.runtime?.id) await askBackendScript("sessionEnd", ["vsCodePage"]);
    });
}




// My idea is that we will open two select files, the first will create and track and the second will show vscode where it is. 
// there should be a loop as to opening files for both times so if they click cancel it throws an alert and does it again
// make file select for track always go to /documents/ on file opener
// we want a new loading and text to display what's happenning 
// Then we need to save the files at least once so vscode can ask that persmission for trackign actual files to work
// then we start file tracking and test it
// bottom right absolute button to end session


async function createFolder() {
    const folderHandle = await window.showDirectoryPicker();
    const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    
}






















async function askBackendScript(myStr, myArgs=[]) {
    return await new Promise((res) => chrome.runtime.sendMessage({ type: myStr, args: myArgs }, (response) => res(response)));
}

async function loadingDone() {
    const loadDOM = document.getElementById("extension_dataLoadingPopupWrapper");
    if (loadDOM) loadDOM.style.display = "none";
}

async function setToLoading() {
    const button = document.getElementById("extension_dataLoadingPopupButton");
    const loading = document.getElementById("extension_dataLoadingLoader");
    if (button) button.style.display = "none";
    if (loading) loading.style.display = "flex";
}

async function makeLoadDataButton() {
    let injecting = document.createElement('div');
    injecting.innerHTML = `
    <div>
        <style>
            .extension_dataLoadingPopupWrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .extension_dataLoadingPopupButton {
                position: relative;
                width: 100px;
                height: 100px;
                background-image: linear-gradient(120deg, #7afffb, #79fcff, #75eaff, #6eccff, #67a4ff, #5f73ff, #7156ff, #9b4eff, #c547ff, #e940ff, #ff3cfc, #ff3bf2);
                background-position: top left;
                background-size: 100%;
                box-shadow: 0px 0px 400px rgba(255, 59, 242, 1), 0px 0px 200px rgba(255, 59, 242, 0.75), 0px 0px 100px rgba(255, 59, 242, 0.5), 0px 0px 50px rgba(255, 59, 242, 0.35), 0px 0px 25px rgba(255, 59, 242, 0.2);
                border-radius: 100%;
                border: none;
                margin: 0;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #000;
                font-weight: bold;
                font-size: 16px;
            }

            .extension_dataLoadingPopupButton:hover {
                box-shadow: 0px 0px 400px rgba(122, 255, 251, 1), 0px 0px 200px rgba(122, 255, 251, 0.75), 0px 0px 100px rgba(122, 255, 251, 0.5), 0px 0px 50px rgba(122, 255, 251, 0.35), 0px 0px 25px rgba(122, 255, 251, 0.2);
                background-size: 180%;
                transition: all 0.3s ease;
            }

            .extension_dataLoadingPopupButton:active {
                transform: scale(0.9);
                transition: all 0.05s ease;
            }

            .extension_dataLoadingLoader::before,
            .extension_dataLoadingPopupButton::before {
                position: absolute;
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                border: 1px solid rgba(255, 59, 242, 0.8);
                border-radius: 100%;
                pointer-events: none;
                content: "";
                transition: all 0.3s ease;
            }

            .extension_dataLoadingLoader:hover::before,
            .extension_dataLoadingPopupButton:hover::before {
                border: 1px solid rgba(122, 255, 251, 0.6);
                width: calc(100% + 40px);
                height: calc(100% + 40px);
                transition: all 0.3s ease;
            }

            .extension_dataLoadingPopupButton:active::before {
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                transition: all 0.07s ease;
            }

            .extension_dataLoadingLoader::after,
            .extension_dataLoadingPopupButton::after {
                position: absolute;
                width: calc(100% + 40px);
                height: calc(100% + 40px);
                border: 2px dashed rgba(255, 59, 242, 0.4);
                box-shadow: 0px 0px 100px rgba(122, 255, 251, 0.1);
                border-radius: 100%;
                pointer-events: none;
                animation: rotate 30s linear infinite;
                content: "";
                transition: all 0.3s ease;
            }

            .extension_dataLoadingLoader:hover::after,
            .extension_dataLoadingPopupButton:hover::after {
                border: 2px dashed rgba(122, 255, 251, 0.3);
                width: calc(100% + 80px);
                height: calc(100% + 80px);
                transition: all 0.3s ease;
            }

            .extension_dataLoadingPopupButton:active::after {
                width: calc(100% + 40px);
                height: calc(100% + 40px);
                transition: all 0.07s ease;
            }

            .extension_dataLoadingLoader {
                display: none;
                background-position: top left;
                background-size: 100%;
                position: relative;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100px;
                height: 100px;
                border-radius: 100%;
                border: none;
                margin: 0;
                padding: 0;
                transition: all 0.3s ease;
                font-weight: bold;
                font-size: 8px;
                box-shadow: 0px 0px 400px rgba(255, 59, 242, 1), 0px 0px 200px rgba(255, 59, 242, 0.75), 0px 0px 100px rgba(255, 59, 242, 0.5), 0px 0px 50px rgba(255, 59, 242, 0.35), 0px 0px 25px rgba(255, 59, 242, 0.2);
            }

            .extension_dataLoadingLoader:hover{
                box-shadow: 0px 0px 400px rgba(122, 255, 251, 1), 0px 0px 200px rgba(122, 255, 251, 0.75), 0px 0px 100px rgba(122, 255, 251, 0.5), 0px 0px 50px rgba(122, 255, 251, 0.35), 0px 0px 25px rgba(122, 255, 251, 0.2);
            }

            .extension_loadingText {
                margin-top: 20px;
                font-family: "Raleway", sans-serif;
                text-align: center;
                text-transform: uppercase;
                display: inline-block;
            }

            .extension_loading_char {
                opacity: 0;
                animation: extension_loadingText 2s infinite ease-in-out;
                display: inline-block;
                color: #fff;
            }

            .extension_loading_char:nth-child(1) {
                animation-delay: 0.9s;
            }

            .extension_loading_char:nth-child(2) {
                animation-delay: 1s;
            }

            .extension_loading_char:nth-child(3) {
                animation-delay: 1.1s;
            }

            .extension_loading_char:nth-child(4) {
                animation-delay: 1.2s;
            }

            .extension_loading_char:nth-child(5) {
                animation-delay: 1.3s;
            }

            .extension_loading_char:nth-child(6) {
                animation-delay: 1.4s;
            }

            .extension_loading_char:nth-child(7) {
                animation-delay: 1.5s;
            }

            @keyframes extension_loadingText {
                0% {
                    transform: translateY(0%);
                    opacity: 1;
                }

                20% {
                    transform: translateY(-60%);
                    opacity: 1;
                }

                40% {
                    transform: translateY(-100%);
                    opacity: 0;
                }

                60% {
                    opacity: 0;
                }

                80% {
                    opacity: 0;
                }

                100% {
                    opacity: 1;
                }
            }
        </style>
        <div class="extension_dataLoadingPopupWrapper" id="extension_dataLoadingPopupWrapper">
            <button class="extension_dataLoadingPopupButton" id="extension_dataLoadingPopupButton">Load Data Into Session</button>
            <div class="extension_dataLoadingLoader" id="extension_dataLoadingLoader">
                <h2 class="extension_loadingText">
                    <span class="extension_loading_char">L</span>
                    <span class="extension_loading_char">o</span>
                    <span class="extension_loading_char">a</span>
                    <span class="extension_loading_char">d</span>
                    <span class="extension_loading_char">i</span>
                    <span class="extension_loading_char">n</span>
                    <span class="extension_loading_char">g</span>
                </h2>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(injecting);
}

const vscodePageObserver = new MutationObserver(() => {
    if (document.body && document.readyState === "complete") {
        setTimeout(() => {
            main();
        }, 1000);
        vscodePageObserver.disconnect();
    }
});

if(document.URL === "https://vscode.dev/") vscodePageObserver.observe(document.documentElement, { childList: true, subtree: true });