// this script is going to be listing to user keystrokes to detect if they type any sensitive info so we can warn them!

let keywords = {};

// Load keywords from chrome.storage on initialization
chrome.storage.sync.get(['keywords'], (result) => {
    keywords = result.keywords || {
      "personal-password": "123456",
      "personal-email": "example@gmail.com",
      "api_key": "example_apikey"
    };
    console.log("Keywords loaded:", Object.keys(keywords));
});

// Listen for changes to keywords in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.keywords) {
        keywords = changes.keywords.newValue || {};
        console.log("Keywords updated:", Object.keys(keywords));
    }
});

function checkIfPassword(typed)  {
    // Rules: if string is more than 8 chars no spaces, includes numbers and capitals then flag

    for (const [keyword, value] of Object.entries(keywords)) {
        if (typed.includes(value)) {
            alert(`Warning: You typed a sensitive keyword - ${keyword}`)
            return true
        }
    }

    different_words = typed.split(" ")
    for (const word of different_words) {
        if (/\d/.test(word)) {
            if (/[A-Z]/.test(word)) {
                alert("You may have typed a sensitive password - "+ word)
                return true
            }
        }
    }

    return false
}

function checkIfEmail(typed) {
    // simple email regex (will catch typical emails, can produce false positives in some edge cases)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i
    const match = typed.match(emailRegex)
    if (match) {
        alert(`Warning: You typed an email address - ${match[0]}`)
        return true
    }
    return false
}

function checkIfApiKey(typed) {

    const prefixRegex = /\b(?:sk-|api_|AIza|AKIA|SG\.)[A-Za-z0-9\-_]{8,}\b/
    if (prefixRegex.test(typed)) {
        alert("Warning: You may have typed an API key (recognized prefix).")
        return true
    }

    const longTokenRegex = /\b[A-Za-z0-9\-_]{20,}\b/
    if (longTokenRegex.test(typed)) {
        alert("Warning: You may have typed a long token/API key-like string.")
        return true
    }

    return false
}


// document.addEventListener("input", (event)=>{
//     const target = event.target
//     checkIfPassword(target.value)
// })

let previously_typed = ""
document.addEventListener("keydown", (event) => {
    console.log(`Key "${event.key}" pressed  [event: keydown]`);
    // ignore special keys like Shift, Ctrl, etc. but handle Backspace
    if (event.key.length > 1) {
        if (event.key === "Backspace") {
            previously_typed = previously_typed.slice(0, -1)
        }
        return;
    }
    previously_typed += event.key
    if (previously_typed.length > 50) {
        previously_typed = previously_typed.slice(-50) // keep only the last 50 characters
    }
    console.log(`Previously typed: ${previously_typed}`);

    const isPassword = checkIfPassword(previously_typed)
    const isApiKey = checkIfApiKey(previously_typed)
    const isEmail = checkIfEmail(previously_typed)

    if (isPassword || isApiKey || isEmail) {
        previously_typed = "" // reset previously typed if we flag sensitive input
    }
});

document.addEventListener('paste', (event) => {
    // event.clipboardData contains what was pasted
    const pastedText = event.clipboardData.getData('text');
    console.log('User pasted:', pastedText);

    const isPassword = checkIfPassword(pastedText)
    const isApiKey = checkIfApiKey(pastedText)
    const isEmail = checkIfEmail(pastedText)
    
});
