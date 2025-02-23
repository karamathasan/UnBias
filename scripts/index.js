document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    console.log("Popup loaded");

    // Load the saved toggle state from chrome storage
    chrome.storage.local.get('biasDetectionEnabled', (result) => {
        const biasDetectionEnabled = result.biasDetectionEnabled || false;
        toggleButton.checked = biasDetectionEnabled;
    });

    // When the toggle is changed, save the state to chrome storage
    toggleButton.addEventListener('change', () => {
        const toggleStatus = toggleButton.checked;
        // Save the toggle status in chrome storage
        chrome.storage.local.set({ 'biasDetectionEnabled': toggleStatus });
    });
});
