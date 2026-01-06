// AI Placement Support Assistant - Core Logic

const KNOWLEDGE_BASE = {
    "[INTERVIEW_PYTHON]": [
        "Python: High-level, interpreted, easy-to-read programming language.",
        "List: Ordered, mutable collection in Python."
    ],
    "[INTERVIEW_ML]": [
        "Machine Learning: Systems learn from data without explicit programming.",
        "Overfitting: Model performs well on training data but poorly on new data."
    ],
    "[HR]": [
        "Tell me about yourself: Education, skills, projects, career goal.",
        "Strengths: Skills relevant to the job role."
    ],
    "[RESUME]": [
        "Summary: Short, role-focused overview.",
        "Skills: List only confident skills.",
        "Projects: Problem, tools, impact."
    ],
    "[COMPANY_TCS]": [
        "Focus: Aptitude, basic coding, communication.",
        "Pattern: Written → Technical → HR."
    ],
    "[COMPANY_INFOSYS]": [
        "Focus: OOPS, DBMS, problem solving.",
        "Pattern: Online → Technical → HR."
    ],
    "[CODING_PYTHON]": [
        "Prime number: Check divisibility up to sqrt(n).",
        "Reverse string: Use slicing or loop."
    ]
};

// UI Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const navItems = document.querySelectorAll('.nav-item');
const sectionTitle = document.getElementById('current-section-title');
const sectionDesc = document.getElementById('current-section-desc');

// LangChain-like Memory Instance
class ChatMemory {
    constructor() {
        this.history = [];
    }
    add(role, content) {
        this.history.push({ role, content });
    }
    getHistory() {
        return this.history;
    }
}

const memory = new ChatMemory();

// AI Retrieval & Logic
function getAIResponse(query) {
    const q = query.toLowerCase();
    let response = "";

    // Retrieval Logic (Mimicking Vector Search/Keyword matching)
    if (q.includes("python") || q.includes("list")) {
        response += "<strong>Python Interview Prep:</strong>\n<ul>";
        KNOWLEDGE_BASE["[INTERVIEW_PYTHON]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }
    
    if (q.includes("ml") || q.includes("learning") || q.includes("overfitting")) {
        response += "<strong>Machine Learning Basics:</strong>\n<ul>";
        KNOWLEDGE_BASE["[INTERVIEW_ML]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    if (q.includes("hr") || q.includes("yourself") || q.includes("strength")) {
        response += "<strong>HR Round Guidance:</strong>\n<ul>";
        KNOWLEDGE_BASE["[HR]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    if (q.includes("resume") || q.includes("skills") || q.includes("summary")) {
        response += "<strong>Resume Enhancement:</strong>\n<ul>";
        KNOWLEDGE_BASE["[RESUME]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    if (q.includes("tcs")) {
        response += "<strong>TCS Preparation:</strong>\n<ul>";
        KNOWLEDGE_BASE["[COMPANY_TCS]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    if (q.includes("infosys")) {
        response += "<strong>Infosys Preparation:</strong>\n<ul>";
        KNOWLEDGE_BASE["[COMPANY_INFOSYS]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    if (q.includes("prime") || q.includes("reverse") || q.includes("coding") || q.includes("string")) {
        response += "<strong>Coding Logic:</strong>\n<ul>";
        KNOWLEDGE_BASE["[CODING_PYTHON]"].forEach(item => response += `<li>${item}</li>`);
        response += "</ul>";
    }

    // Default response if no match
    if (!response) {
        response = "I'm sorry, I can only provide information from my specific placement knowledge base. Try asking about Python, ML, HR, Resume tips, or specific companies like TCS and Infosys.";
    }

    return response;
}

// Chat Functionality
function addMessage(role, content) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
        <span class="message-time">${time}</span>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to memory
    memory.add(role, content);
}

async function handleSend() {
    const query = userInput.value.trim();
    if (!query) return;

    userInput.value = '';
    userInput.style.height = 'auto';
    addMessage('user', query);

    // Simulate AI thinking
    setTimeout(() => {
        const response = getAIResponse(query);
        addMessage('mentor', response);
    }, 600);
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Auto-expand textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Sidebar Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const section = item.getAttribute('data-section');
        updateSection(section);
    });
});

function updateSection(section) {
    const sections = {
        'interview-prep': { title: 'Interview Prep', desc: 'Technical & HR interview preparation modules.' },
        'resume-help': { title: 'Resume Help', desc: 'Guidelines for building a professional resume.' },
        'company-prep': { title: 'Company Prep', desc: 'Specific insights for TCS and Infosys.' },
        'coding-practice': { title: 'Coding Practice', desc: 'Logic and algorithms for placement tests.' }
    };

    sectionTitle.textContent = sections[section].title;
    sectionDesc.textContent = sections[section].desc;
    
    addMessage('mentor', `Switched to <strong>${sections[section].title}</strong> mode. How can I help you in this area?`);
}
