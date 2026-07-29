// auth.js - Authentication logic

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Simulate API Call
    if (window.showLoader) window.showLoader();
    
    setTimeout(() => {
        if (window.hideLoader) window.hideLoader();
        // Redirect to wealth-plan
        window.location.href = 'wealth-plan.html';
    }, 1500);
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Simulate API Call
    if (window.showLoader) window.showLoader();
    
    setTimeout(() => {
        if (window.hideLoader) window.hideLoader();
        // Redirect to wealth-plan after signup
        window.location.href = 'wealth-plan.html';
    }, 1500);
}
