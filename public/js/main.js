/**********************************************
 * Kunal Janjirala Portfolio - main.js
 * Description: Handles all interactive features
 **********************************************/

/* ===== Typed.js Initialization ===== */
const typed = new Typed('#typed-text', {
    strings: ["AI/ML Engineer", "GenAI Specialist", "MLOps Enthusiast", "Cloud Architect"],
    typeSpeed: 60,
    backSpeed: 40,
    loop: true,
});

/* ===== Theme Toggle Logic ===== */
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Apply saved theme on load
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Toggle theme and save preference
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

/* ===== Scroll To Top Button ===== */
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== Smooth Scrolling for Anchor Links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ===== Utility: Debounce Function for Performance ===== */
function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), delay);
    };
}
/**********************************************
 * Chatbot Widget Logic
 **********************************************/

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotPopup = document.getElementById('chatbot-popup');
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');

// Toggle Chatbot Visibility
function toggleChatbot() {
    if (chatbotPopup.style.display === 'flex') {
        chatbotPopup.style.display = 'none';
    } else {
        chatbotPopup.style.display = 'flex';
    }
}

/* ===== Send Message to AI Assistant ===== */
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';

    // Placeholder for AI streaming
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.classList.add('ai', 'typing-cursor');   // Apply blinking only during typing
    messagesDiv.appendChild(aiMessageDiv);

    scrollChatToBottom();

    let fullResponse = "";

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            fullResponse += chunkValue;         // Build full response
            aiMessageDiv.textContent += chunkValue;  // Show live typing
            scrollChatToBottom();
        }

        // Once complete, parse Markdown properly
        aiMessageDiv.classList.remove('typing-cursor'); 
        aiMessageDiv.innerHTML = marked.parse(fullResponse);


    } catch (error) {
        aiMessageDiv.textContent = "⚠️ Error fetching AI response.";
        console.error('Streaming Fetch Error:', error);
    }
}



/* ===== Append Message to Chat Window ===== */
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender);

    if (sender === 'ai') {
        // Convert Markdown to HTML
        msgDiv.innerHTML = marked.parse(text);
    } else {
        // For user, keep it plain text
        msgDiv.textContent = `You: ${text}`;
    }

    messagesDiv.appendChild(msgDiv);
}


/* ===== Remove Last AI Placeholder ===== */
function removeLastAIPlaceholder() {
    const aiMessages = messagesDiv.querySelectorAll('.ai');
    if (aiMessages.length > 0) {
        aiMessages[aiMessages.length - 1].remove();
    }
}

/* ===== Auto-Scroll Chat to Bottom ===== */
function scrollChatToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/* ===== Enter Key to Send Message ===== */
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

/**********************************************
 * End of Chatbot Logic
 **********************************************/
/**********************************************
 * Resume Viewer Modal Logic
 **********************************************/

const resumeModal = document.getElementById('resume-modal');

// Open Resume Viewer
function openResume() {
    resumeModal.style.display = 'flex';
}

// Close Resume Viewer
function closeResume() {
    resumeModal.style.display = 'none';
}

// Fullscreen Resume
function openFullscreen() {
    const iframe = document.querySelector('#resume-modal iframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) { // Safari
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE11
        iframe.msRequestFullscreen();
    }
}

/**********************************************
 * Close Modal on Outside Click
 **********************************************/
window.addEventListener('click', function(event) {
    if (event.target === resumeModal) {
        closeResume();
    }
});

/**********************************************
 * Page Loader Animation Logic
 **********************************************/
const pageLoader = document.getElementById('page-loader');
window.addEventListener('load', () => {
    if (pageLoader) {
        pageLoader.style.display = 'none';
    }
});

/**********************************************
 * Button Hover Sound Effects (Optional UX Add-on)
 **********************************************/
const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

/**********************************************
 * SVG Divider Animation (Future Ready)
 **********************************************/
const svgDividers = document.querySelectorAll('.svg-divider svg path');
svgDividers.forEach((path, index) => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s ease';
        path.style.strokeDashoffset = '0';
    }, 500 * index);
});

/**********************************************
 * Contact Links - Open in New Tab + Tooltip
 **********************************************/
document.querySelectorAll('footer a, .social-links a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('title', 'Open in new tab');
});

/**********************************************
 * Global Keyboard Shortcuts (Optional)
 **********************************************/
document.addEventListener('keydown', (e) => {
    // Ctrl + R = Resume
    if (e.ctrlKey && e.key === 'r') {
        openResume();
    }

    // Ctrl + D = Toggle Theme
    if (e.ctrlKey && e.key === 'd') {
        toggleTheme();
    }

    // Esc closes modal/chatbot
    if (e.key === 'Escape') {
        closeResume();
        chatbotPopup.style.display = 'none';
    }
});

/**********************************************
 * Easter Egg Hint (Add Konami Code / Hidden Message)
 **********************************************/
let easterEggBuffer = [];
document.addEventListener('keydown', (e) => {
    easterEggBuffer.push(e.key);
    if (easterEggBuffer.slice(-6).join('') === 'kunal!') {
        alert("👨‍💻 Hello, hacker! You're now in Dev Mode.");
    }
});

/**********************************************
 * Final Clean Up Utilities
 **********************************************/

// Auto-resize textarea for future forms
const textareas = document.querySelectorAll('textarea');
textareas.forEach((ta) => {
    ta.addEventListener('input', () => {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
    });
});

// Footer year dynamic (future enhancement)
const yearSpan = document.getElementById('footer-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Console Log Credit
console.log("%cCrafted with ❤️ by Kunal Janjirala", "color: #00fff7; font-weight: bold; font-size: 16px;");
