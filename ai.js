let client;

async function initClient() {
    try {
        client = await window.gradio.client("januarymsemakweli/GloriaAI");
        console.log("Gradio client initialized");
        addMessage("Hello! I'm Gloria, your research assistant. How can I help you today?", false);
    } catch (error) {
        console.error("Failed to initialize Gradio client:", error);
    }
}

function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    document.getElementById('chatMessages').appendChild(messageDiv);
    return messageDiv;
}

async function handleChat() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    addMessage(message, true);
    userInput.value = '';
    
    try {
        const loadingMessage = addMessage("Thinking...", false);
        const result = await client.predict(message, api_name="/chat");
        loadingMessage.remove();
        addMessage(result.data[0], false);
    } catch (error) {
        console.error('Error:', error);
        addMessage("I apologize, but I encountered an error. Please try again.", false);
    }
}

document.addEventListener('DOMContentLoaded', initClient);

document.getElementById('sendButton').addEventListener('click', handleChat);

document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
