// Initialize API configuration
const API_URL = "https://gloria-ai-backend.onrender.com/chat";

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

// Format chat history for context
function formatChatHistory() {
    return chatHistory.map(msg => 
        `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`
    ).join('\n');
}

// Handle sending message
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat and history
        addMessage(message, 'user');
        chatHistory.push({ sender: 'user', text: message });
        userInput.value = '';
        
        // Show loading indicator
        const loadingMessage = addMessage('...', 'assistant');
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    system_message: "You are Gloria, a friendly and approachable research assistant. You're highly knowledgeable about research methodology, statistical analysis, and data interpretation. However, you're also a master of humor and love making conversations fun. Adapt your tone based on the user's questions. Your nickname is The Research Queen. You also help January G. Msemakweli with online research consultations through his website: https://www.januarymsemakweli.com/",
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.95
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            // Remove loading message
            loadingMessage.remove();
            
            // Process and add Gloria's response
            const aiResponse = result.response || 'Sorry, I could not generate a response.';
            addMessage(aiResponse, 'assistant');
            chatHistory.push({ sender: 'assistant', text: aiResponse });

        } catch (error) {
            console.error('Error:', error);
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
    const welcomeMessage = "Hello! I'm Gloria, your research assistant. I can help you with research methodology, data analysis, and academic writing. How can I assist you today?";
    addMessage(welcomeMessage, 'assistant');
    chatHistory.push({ sender: 'assistant', text: welcomeMessage });
}); 