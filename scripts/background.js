// chrome.runtime.onInstalled.addListener(() => {

// });

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "checkBias",
//         title: "Check Bias",
//         contexts: ["selection"]
//     });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     console.log(info.menuItemId)
//     if (info.menuItemId === "checkBias") {
//         // console.log("checking bias")
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: ()=>{console.log("checking bias")},
//             args: [info.selectionText]
//         });
//     }
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            console.error("No active tab found.");
            sendResponse({ status: "error", message: "No active tab found." });
            return;
        }

        let activeTab = tabs[0];

        if (message.action === "ENABLE_DETECTION") {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: enableBiasDetection
            }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ status: "enabled" });
                }
            });
        } else if (message.action === "DISABLE_DETECTION") {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: disableBiasDetection
            }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ status: "disabled" });
                }
            });
        }
    });

    return true; // Keep async response open
});

//  Define these functions to prevent "is not defined" errors
function enableBiasDetection() {
    console.log("Enabling Bias Detection");
    chrome.storage.local.set({ biasDetectionEnabled: true });
}

function disableBiasDetection() {
    console.log("Disabling Bias Detection");
    chrome.storage.local.set({ biasDetectionEnabled: false });
}
