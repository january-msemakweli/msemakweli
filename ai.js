let client; // Not used directly but kept in case of further use

async function initClient() {
    try {
        console.log("Gradio client placeholder, initializing chat.");
        // Display the opening message
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
    
    // Display the user's message in the chat window
    addMessage(message, true);
    userInput.value = ''; // Clear input field
    
    try {
        // Display a loading message while waiting for a response
        const loadingMessage = addMessage("Thinking...", false);

        // Call the FastAPI backend
        const response = await fetch("https://gloria-ai.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: message,
                system_message: "You are Gloria, a friendly and approachable research assistant. You're highly knowledgeable about research methodology, statistical analysis, and data interpretation. However, you're also a master of humor and love making conversations fun. Adapt your tone based on the user's questions. Your nickname is The Research Queen. You also help January G. Msemakweli with online research consultations through his website: https://www.januarymsemakweli.com/",
                max_tokens: 512,
                temperature: 0.7,
                top_p: 0.95
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from Gloria AI");
        }

        const data = await response.json();

        // Remove the loading message
        loadingMessage.remove();

        // Display the bot's response
        addMessage(data.response, false);
    } catch (error) {
        console.error("Error:", error);

        // Remove the loading message and display an error message
        addMessage("I apologize, but I encountered an error. Please try again.", false);
    }
}

// Initialize the chat interface when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initClient);

// Attach event listeners for sending messages
document.getElementById('sendButton').addEventListener('click', handleChat);

document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
