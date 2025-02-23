document.getElementById('toggleSwitch').addEventListener('change', function() {
    const toggleStatus = this.checked;
    
    // Here, you can handle what happens when the toggle is on/off
    if (toggleStatus) {
        console.log("Bias Detection Enabled");
        // Insert logic to enable bias detection (e.g., enabling text highlighting or triggering the detection functionality)
    } else {
        console.log("Bias Detection Disabled");
        // Insert logic to disable bias detection
    }
});