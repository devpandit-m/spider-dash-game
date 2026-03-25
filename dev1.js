const chain = document.getElementById('chain');
const body = document.body;

// 1. Lamp Pull & Shutter Control (Dark/Light Mode)
chain.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    chain.style.transform = "translateX(-50%) translateY(25px)";
    setTimeout(() => { chain.style.transform = "translateX(-50%) translateY(0px)"; }, 200);
});

// 2. Navigation between Sections (Login/Signup)
function showSection(id) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// 3. Password Toggle
function togglePass(id, icon) {
    const field = document.getElementById(id);
    if (field.type === "password") {
        field.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        field.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// 4. Registration Handler (Name aur Password dono save honge)
function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const conf = document.getElementById('reg-conf').value;

    if (!name || !email || !pass || pass !== conf) { 
        alert("Please fill all details correctly!"); 
        return; 
    }

    // Save user data (including name)
    const userData = { name: name, pass: pass };
    localStorage.setItem('user_' + email, JSON.stringify(userData));
    
    alert("Registration Successful! Now Login.");
    document.getElementById('signup-form').reset();
    showSection('login-section');
}

// 5. Login Handler (Game Redirect Logic)
function handleLogin() {
    const emailInp = document.getElementById('login-user').value;
    const passInp = document.getElementById('login-pass').value;
    
    const data = localStorage.getItem('user_' + emailInp);
    
    if (data && JSON.parse(data).pass === passInp) {
        const user = JSON.parse(data);
        
        // --- SECURITY PERMISSION SET KARNA ---
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentPlayer', user.name);
        
        alert("Login Successful! Starting Game...");
        window.location.href = "index.html"; // <--- Game file ka link
    } else {
        alert("Invalid Email or Password!");
    }
}

// 6. Reset Logic
function handleReset() {
    const email = document.getElementById('reset-email').value;
    if (localStorage.getItem('user_' + email)) {
        const newP = "Neon@" + Math.floor(1000 + Math.random() * 9000);
        let user = JSON.parse(localStorage.getItem('user_' + email));
        user.pass = newP;
        localStorage.setItem('user_' + email, JSON.stringify(user));
        document.getElementById('new-pass-text').innerText = newP;
        document.querySelector('.pass-display-box').style.display = "block";
    } else alert("Email not found!");
}

function copyPass() {
    const pText = document.getElementById('new-pass-text').innerText;
    navigator.clipboard.writeText(pText).then(() => {
        alert("Copied!");
        document.querySelector('.pass-display-box').style.display = "none";
    });
}
