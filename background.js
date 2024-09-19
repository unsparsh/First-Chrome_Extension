chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      let tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.get({sessions: []}, function(result) {
        let sessions = result.sessions;
        sessions.push({ date: new Date().toLocaleString(), tabs: tabUrls });
        chrome.storage.local.set({ sessions });
      });
    });
  });
  