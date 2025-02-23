async function getBiasDetectionEnabled() {
    return new Promise((resolve) => {
        chrome.storage.local.get('biasDetectionEnabled', (result) => {
            resolve(result.biasDetectionEnabled || false);
        });
    });
}

document.addEventListener('mouseup', function () {
    const selectedText = window.getSelection().toString().trim();
    getBiasDetectionEnabled().then((biasDetectionEnabled)=>{
        if (selectedText && biasDetectionEnabled) {
            // Get the selection's bounding rectangle
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
    
            // Create the popup if not already created
            let popup = document.getElementById('text-popup');
            if (!popup) {
                popup = document.createElement('div');
                let textContainer = document.createElement('div'); // New element for text
                let button = document.createElement('button');
    
                popup.id = 'text-popup';
                popup.style.position = 'absolute';
                popup.style.backgroundColor = '#f4f4f4';
                popup.style.border = '1px solid #ddd';
                popup.style.padding = '10px';
                popup.style.borderRadius = '5px';
                popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
                popup.style.zIndex = '1000';
    
                // Text container styles
                textContainer.id = 'popup-text';
                textContainer.style.marginBottom = '10px';
                textContainer.style.color = "rgba(0,0,0,1)"
                textContainer.style.display = "flex";
                textContainer.style.flexDirection = "row";
                popup.style.alignItems = 'center';
                
                // Button styles
                button.id = "button";
                button.textContent = "Click Me";
                button.style.padding = "10px 20px";
                button.style.fontSize = "16px";
                button.style.border = "none";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    
                // Add text and button to popup
                popup.appendChild(textContainer);
                popup.appendChild(button);
    
                // Add the popup to the body
                document.body.appendChild(popup);
            }
    
            // Update only the text content
            const textContainer = document.getElementById('popup-text');
            // textContainer.textContent = `Selected Text: ${selectedText}`;
            textContainer.textContent = `Check for Bias`;
    
            // Position the popup near the selection
            popup.style.display = 'flex'; // Flexbox layout
            popup.style.flexDirection = 'row'; // Horizontal layout
            popup.style.alignItems = 'center'; // Align items vertically
            popup.style.gap = '20px'; // Space between items
    
            popup.style.left = `${rect.right + window.scrollX}px`;
            popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight - 5}px`;
            // popup.style.display = 'block';
        }
    })
});

// deselect
document.addEventListener('mousedown', function (e) {
    const popup = document.getElementById('text-popup');
    if (popup && !popup.contains(e.target)) {
        popup.remove();
    }
});
// // Function to get the highlighted text from the webpage
// function getHighlightedText() {
//     const selection = window.getSelection();
//     return selection.toString().trim(); // Retrieve and trim the highlighted text
// }

// Example usage: When the user highlights text and clicks a button, you can call this function
// document.addEventListener("mouseup", () => {
//     const highlightedText = getHighlightedText();
//     if (highlightedText) {
//         // Send the highlighted text to the background or content script (depending on how you set up the extension)
//         sendToPythonServer(highlightedText);
//     } else {
//         console.log("No text highlighted.");
//     }
// });

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
