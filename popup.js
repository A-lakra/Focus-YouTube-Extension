document.addEventListener('DOMContentLoaded', function() {
    const modes = ['focus', 'superFocus', 'normal'];
    const modeButtons = {};

    modes.forEach(mode => {
        modeButtons[mode] = document.getElementById(mode);
        modeButtons[mode].addEventListener('click', () => setMode(mode));
    });

      // Load selected mode from storage on popup open
      chrome.storage.local.get('selectedMode', data => {
        const selectedMode = data.selectedMode || 'normal'; // Default to 'normal' if no mode is stored
        setMode(selectedMode);
    });

    function setMode(mode) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: applyMode,
                args: [mode],
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            });
        });

        // Highlight selected mode button
        modes.forEach(m => {
            if (m === mode) {
                modeButtons[m].classList.add('active');
            } else {
                modeButtons[m].classList.remove('active');
            }
        });

              // Save selected mode to storage
              chrome.storage.local.set({ selectedMode: mode });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startTimer');
    const resetButton = document.getElementById('resetTimer');
    const workInput = document.getElementById('workTime');
    const breakInput = document.getElementById('breakTime');
    const timerDisplay = document.getElementById('timerDisplay');

    startButton.addEventListener('click', () => {
        const workTime = parseInt(workInput.value, 10) * 60 || 25 * 60;
        const breakTime = parseInt(breakInput.value, 10) * 60 || 5 * 60;
        chrome.runtime.sendMessage({ action: 'startTimers', workTime, breakTime });
    });

    resetButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'resetTimers' });
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.timeRemaining) {
            const timeRemaining = changes.timeRemaining.newValue;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (timeRemaining <= 0) {
                alert('Time up!');
                chrome.runtime.sendMessage({ action: 'startBreak' });
            }
        }
    });
});







function applyMode(mode) {
    if (mode === 'focus') {
        document.querySelector('#comments').style.display = 'none';
    } else if (mode === 'superFocus') {
        document.querySelector('#comments').style.display = 'none';
        document.querySelector('#related').style.display = 'none';
    } else if (mode === 'normal') {
        document.querySelector('#comments').style.display = 'block';
        document.querySelector('#related').style.display = 'block';
    }
}

