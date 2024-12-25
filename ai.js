// Base URL for the backend server
const backendUrl = 'https://gloria-ai-january-msemakwelis-projects.vercel.app';

// Initialize the chatbox with a welcome message
function initChat() {
    addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", false);
}

// Add a new message to the chatbox
function addMessage(text, isUser) {
    const chatMessages = document.getElementById('chatMessages');

    // Create the message container
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;

    // Create the message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;

    // Append content to the message container
    messageDiv.appendChild(messageContent);

    // Append the message container to the chat
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
}

// Handle user input and send a message
async function handleChat() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // Add the user's message to the chat
    addMessage(message, true);
    userInput.value = '';

    // Add a loading message for the assistant
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message assistant';
    loadingMessage.innerHTML = '<div class="message-content">Thinking...</div>';
    document.getElementById('chatMessages').appendChild(loadingMessage);

    try {
        // Send the user's message to the backend
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from the server.');
        }

        const data = await response.json();

        // Remove the loading message and add the assistant's response
        loadingMessage.remove();
        addMessage(data.response, false);
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.remove();
        addMessage('Sorry, something went wrong. Please try again.', false);
    }
}

// Clear the chatbox
function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    initChat();
}

// Event listeners for user interactions
document.addEventListener('DOMContentLoaded', () => {
    initChat();

    document.getElementById('sendButton').addEventListener('click', handleChat);

    document.getElementById('userInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    document.getElementById('clearChat').addEventListener('click', clearChat);
});
