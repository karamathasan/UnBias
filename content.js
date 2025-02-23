// Function to get the highlighted text from the webpage
function getHighlightedText() {
    const selection = window.getSelection();
    return selection.toString().trim(); // Retrieve and trim the highlighted text
}

// send to python server
function sendToPythonServer(highlightedText) {
    fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: highlightedText })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Sentiment analysis result:", data);
    })
    .catch(error => {
        console.error("Error sending data to Python server:", error);
    });
}

// Example usage: When the user highlights text and clicks a button, you can call this function
document.getElementById("analyzeButton").addEventListener("click", () => {
    const highlightedText = getHighlightedText();
    if (highlightedText) {
        // Send the highlighted text to the background or content script (depending on how you set up the extension)
        sendToPythonServer(highlightedText);
    } else {
        console.log("No text highlighted.");
    }
});