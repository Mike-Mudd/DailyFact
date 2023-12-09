const ALARM_NAME = "dailyFactAlarm";
const FACT_TIME = { hour: 12, minute: 0 }; // Time set for noon

function setDailyAlarm() {
    const now = new Date();
    let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), FACT_TIME.hour, FACT_TIME.minute);

    if (alarmTime.getTime() < now.getTime()) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    chrome.alarms.create(ALARM_NAME, { when: alarmTime.getTime(), periodInMinutes: 24 * 60 });
}

async function fetchFact() {
    const response = await fetch(chrome.runtime.getURL('facts.txt'));
    const text = await response.text();
    let facts = text.split('\n').filter(line => line.trim());
    const shownFacts = await getShownFacts();

    // Filter out shown facts
    facts = facts.filter(fact => !shownFacts.includes(fact));

    if (facts.length === 0) {
        // Reset if all facts have been shown
        await chrome.storage.sync.set({ shownFacts: [] });
        return "All facts have been displayed!";
    }

    const randomIndex = Math.floor(Math.random() * facts.length);
    const selectedFact = facts[randomIndex];

    // Update shown facts list
    shownFacts.push(selectedFact);
    await chrome.storage.sync.set({ shownFacts: shownFacts });

    return selectedFact;
}

function getShownFacts() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('shownFacts', (result) => {
            resolve(result.shownFacts || []);
        });
    });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
        const fact = await fetchFact();

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon16.png',
            title: 'Daily Fact',
            message: fact,
            priority: 2
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    setDailyAlarm();
    chrome.storage.sync.set({ shownFacts: [] }); // Initialize the shown facts storage
});
