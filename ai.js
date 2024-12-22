// Initialize API configuration
const BACKEND_URL = "https://gloria-ai.onrender.com";

// Chat history to maintain context
let chatHistory = [];

// Add message to chat
function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    document.getElementById('chatMessages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Handle sending message
async function sendMessage(message) {
    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        if (data.response) {
            addMessage(data.response, false);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage("Sorry, I encountered an error. Please try again.", false);
    }
}

// Auto-resize textarea
function autoResizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
    element.style.height = Math.min(element.scrollHeight, 120) + 'px';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');

    // Test API connection
    fetch(BACKEND_URL)
        .then(response => response.json())
        .then(data => console.log('API Status:', data))
        .catch(error => console.error('API Error:', error));

    // Send button click
    sendButton.addEventListener('click', async () => {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            await sendMessage(message);
        }
    });

    // Enter key press (without Shift)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('sendButton').click();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        autoResizeTextarea(userInput);
    });

    // Add initial welcome message
    addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", false);
}); 