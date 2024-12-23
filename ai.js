let backendUrl = 'https://gloria-ai.onrender.com';

async function initClient() {
    try {
        // Add initial welcome message
        addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", false);
    } catch (error) {
        console.error("Failed to initialize chat:", error);
    }
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleChat() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    addMessage(message, true);
    userInput.value = '';
    
    try {
        const loadingMessage = addMessage("Thinking...", false);
        
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        loadingMessage.remove();
        addMessage(data.response, false);
    } catch (error) {
        console.error('Error:', error);
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    // Add back the initial welcome message
    addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", false);
}

document.addEventListener('DOMContentLoaded', initClient);

document.getElementById('sendButton').addEventListener('click', handleChat);

document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

document.getElementById('clearChat').addEventListener('click', clearChat);