// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (!tabs || tabs.length === 0) {
//             console.error("No active tab found.");
//             sendResponse({ status: "error", message: "No active tab found." });
//             return;
//         }

//         let activeTab = tabs[0];

//         if (message.action === "ENABLE_DETECTION") {
//             chrome.scripting.executeScript({
//                 target: { tabId: activeTab.id },
//                 func: enableBiasDetection
//             }, () => {
//                 if (chrome.runtime.lastError) {
//                     sendResponse({ status: "error", message: chrome.runtime.lastError.message });
//                 } else {
//                     sendResponse({ status: "enabled" });
//                 }
//             });
//         } else if (message.action === "DISABLE_DETECTION") {
//             chrome.scripting.executeScript({
//                 target: { tabId: activeTab.id },
//                 func: disableBiasDetection
//             }, () => {
//                 if (chrome.runtime.lastError) {
//                     sendResponse({ status: "error", message: chrome.runtime.lastError.message });
//                 } else {
//                     sendResponse({ status: "disabled" });
//                 }
//             });
//         }
//     });

//     return true; // Keep async response open
// });
