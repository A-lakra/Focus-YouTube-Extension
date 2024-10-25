let workTimerInterval;
let breakTimerInterval;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTimers') {
        startTimers(message.workTime, message.breakTime);
        sendResponse({ status: 'timersStarted' });
    } else if (message.action === 'resetTimers') {
        resetTimers();
        sendResponse({ status: 'timersReset' });
    } else if (message.action === 'startBreak') {
        startBreakTimer();
        sendResponse({ status: 'breakStarted' });
    }
    return true;
});

function startTimers(workTime, breakTime) {
    clearInterval(workTimerInterval);
    chrome.storage.local.set({
        timeRemaining: workTime,
        timerRunning: true,
        isBreak: false,
    });

    workTimerInterval = setInterval(() => {
        chrome.storage.local.get(['timeRemaining', 'timerRunning'], data => {
            if (data.timerRunning && data.timeRemaining > 0) {
                chrome.storage.local.set({
                    timeRemaining: data.timeRemaining - 1
                });
            } else if (data.timeRemaining <= 0) {
                clearInterval(workTimerInterval);
                chrome.storage.local.set({
                    timerRunning: false
                });
                alert('Work time is up!');
                chrome.runtime.sendMessage({ action: 'startBreak' });
            }
        });
    }, 1000);
}

function startBreakTimer() {
    clearInterval(breakTimerInterval);
    chrome.storage.local.set({
        timeRemaining: breakTime,
        timerRunning: true,
        isBreak: true,
    });

    breakTimerInterval = setInterval(() => {
        chrome.storage.local.get(['timeRemaining', 'timerRunning'], data => {
            if (data.timerRunning && data.timeRemaining > 0) {
                chrome.storage.local.set({
                    timeRemaining: data.timeRemaining - 1
                });
            } else if (data.timeRemaining <= 0) {
                clearInterval(breakTimerInterval);
                chrome.storage.local.set({
                    timerRunning: false
                });
                alert('Break time is up!');
            }
        });
    }, 1000);
}

function resetTimers() {
    clearInterval(workTimerInterval);
    clearInterval(breakTimerInterval);
    chrome.storage.local.set({
        timeRemaining: 0,
        timerRunning: false,
        isBreak: false,
    });
}
