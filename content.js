// this script is going to be listing to user keystrokes to detect if they type any sensitive info so we can warn them!

const keywords = {"personal-password":"123456", "personal-email":"rafayel.latif@gmail.com", "api_key":"apikey"}
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

    for (const [keyword, value] of Object.entries(keywords)) {
        if (keyword.toLowerCase().includes("api") && typed.includes(value)) {
            alert(`Warning: You typed a sensitive keyword - ${keyword}`)
            return true
        }
    }

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