// Initialize API configuration
const API_URL = "https://gloria-ai-backend.onrender.com";

// Chat history to maintain context
let chatHistory = [];

// Add message to chat
function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
}

// Handle sending message
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show loading indicator
        const loadingMessage = addMessage('...', 'assistant');
        
        try {
            console.log('Sending request to:', `${API_URL}/chat`);
            
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    system_message: "You are Gloria, a friendly and approachable research assistant.",
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.95
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Response data:', result);
            
            // Remove loading message
            loadingMessage.remove();
            
            // Add Gloria's response
            const aiResponse = result.response || 'Sorry, I could not generate a response.';
            addMessage(aiResponse, 'assistant');
            
        } catch (error) {
            console.error('Error details:', error);
            loadingMessage.remove();
            addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
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
    fetch(API_URL)
        .then(response => response.json())
        .then(data => console.log('API Status:', data))
        .catch(error => console.error('API Error:', error));

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // Enter key press (without Shift)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        autoResizeTextarea(userInput);
    });

    // Add initial welcome message
    addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", 'assistant');
}); 