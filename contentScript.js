function createFactPopup(fact) {
    const popup = document.createElement('div');
    popup.setAttribute('id', 'factPopup');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '15px';
    popup.style.border = '1px solid #ddd';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    popup.style.zIndex = '10000';
    popup.innerText = fact;

    document.body.appendChild(popup);
    
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 10000); // The popup will disappear after 10 seconds
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "showFact") {
        createFactPopup(request.fact);
    }
});
