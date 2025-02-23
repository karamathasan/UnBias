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