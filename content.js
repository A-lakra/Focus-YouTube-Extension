chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'applyMode') {
        applyMode(message.mode);
        sendResponse({ status: 'done' });
    }
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



