chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveAsTxt",
    title: "Save as TXT",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "saveAsDocx",
    title: "Save as DOCX",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "saveAsPdf",
    title: "Save as PDF",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "saveAsHtml",
    title: "Save as HTML",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "supportThisProject",
    title: "Support this project",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab.id) return;

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id, allFrames: false },
      files: ["contentScript.js"],
    })
    .then(() => {
      chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
    });
});
