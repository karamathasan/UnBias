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

        // Disable the button during the toggling operation
        toggleButton.disabled = true;

        // Save the toggle status in chrome storage
        chrome.storage.local.set({ 'biasDetectionEnabled': toggleStatus });
        console.log('Bias detection state saved:', toggleStatus);

        // Log and enable/disable logic
        if (toggleStatus) {
            console.log("Bias Detection Enabled");
            // Send message to enable detection in content.js through background.js
            chrome.runtime.sendMessage({ action: "ENABLE_DETECTION" }, (response) => {
                // Re-enable the button after the operation is complete
                toggleButton.disabled = false;

                if (response && response.status === "enabled") {
                    console.log("Bias Detection has been enabled");
                } else {
                    console.error("Error enabling bias detection:", response ? response.message : "Unknown error");
                }
            });
        } else {
            console.log("Bias Detection Disabled");
            // Send message to disable detection in content.js through background.js
            chrome.runtime.sendMessage({ action: "DISABLE_DETECTION" }, (response) => {
                // Re-enable the button after the operation is complete
                toggleButton.disabled = false;

                if (response && response.status === "disabled") {
                    console.log("Bias Detection has been disabled");
                } else {
                    console.error("Error disabling bias detection:", response ? response.message : "Unknown error");
                }
            });
        }
    });
});
