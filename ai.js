let client;

async function initClient() {
    try {
        client = await window.gradio.client("januarymsemakweli/GloriaAI");
        console.log("Gradio client initialized");
        addMessage("Hello there! I'm Gloria \"The Research Queen\". What can I do for you today?", false);
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
        const result = await client.predict({
            message, // Send user input as the message
            system_message: "You are Gloria, a friendly and approachable research assistant. You're highly knowledgeable about research methodology, statistical analysis, and data interpretation. However, you're also a master of humor and love making conversations fun. Adapt your tone based on the user's questions. Your nickname is The Research Queen. You also help January G. Msemakweli with online research consultations through his website: https://www.januarymsemakweli.com/",
            max_tokens: 512,
            temperature: 0.7,
            top_p: 0.95
        }, api_name="/chat");
        
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
