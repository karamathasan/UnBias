document.addEventListener('mouseup', function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // Get the selection's bounding rectangle
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Create the popup if not already created
        let popup = document.getElementById('text-popup');
        let button = document.createElement('button');
        if (!popup) {
            popup = document.createElement('div');

            popup.id = 'text-popup';
            popup.style.position = 'absolute';
            popup.style.backgroundColor = '#f4f4f4';
            popup.style.border = '1px solid #ddd';
            popup.style.padding = '10px';
            popup.style.borderRadius = '5px';
            popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
            popup.style.zIndex = '1000';

            // Button styles
            button.id = "button";
            button.textContent = "Click Me";  // Set the text of the button
            button.style.padding = "10px 20px";  // Padding inside the button
            button.style.fontSize = "16px";  // Font size
            button.style.border = "none";  // Remove default border
            button.style.borderRadius = "5px";  // Rounded corners
            button.style.cursor = "pointer";  // Show pointer on hover
            button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";

            popup.appendChild(button);

            document.body.appendChild(popup);
        }
        
        popup.textContent = `Check for Bias?`;
        popup.appendChild(button); // Add the button again to preserve it

        popup.style.left = `${rect.right + window.scrollX}px`;
        popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight - 5}px`; // Position above the selection
        popup.style.display = 'block';
    }
});

// document.addEventListener('mousedown', function (e) {
//     const popup = document.getElementById('text-popup');
//     if (popup && !popup.contains(e.target)) {
//         popup.remove();
//     }
// });
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


