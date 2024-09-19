document.getElementById('save-btn').addEventListener('click', function() {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      let tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.get({sessions: []}, function(result) {
        let sessions = result.sessions;
        sessions.push({ date: new Date().toLocaleString(), tabs: tabUrls });
        chrome.storage.local.set({ sessions });
        loadSessions();
      });
    });
  });
  
  function loadSessions() {
    chrome.storage.local.get('sessions', function(result) {
      let sessionsDiv = document.getElementById('saved-sessions');
      sessionsDiv.innerHTML = '';
      if (result.sessions && result.sessions.length > 0) {
        result.sessions.forEach((session, index) => {
          let sessionElement = document.createElement('div');
          sessionElement.innerHTML = `<p>Session from ${session.date}</p>
                                      <button class="restore-btn" data-index="${index}">Restore</button>`;
          sessionsDiv.appendChild(sessionElement);
        });
        addRestoreListeners();
      }
    });
  }
  
  function addRestoreListeners() {
    document.querySelectorAll('.restore-btn').forEach(button => {
      button.addEventListener('click', function() {
        let index = this.getAttribute('data-index');
        chrome.storage.local.get('sessions', function(result) {
          let session = result.sessions[index];
          session.tabs.forEach(tab => {
            chrome.tabs.create({ url: tab });
          });
        });
      });
    });
  }
  
  loadSessions();
  