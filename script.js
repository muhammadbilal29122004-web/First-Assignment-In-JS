document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toast = document.getElementById('toastNotification');

    // --- Theme Switcher Logic ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }

    // --- Tab Switching Logic ---
    loginTab.addEventListener('click', () => {
        switchTab('login');
    });

    signupTab.addEventListener('click', () => {
        switchTab('signup');
    });

    function switchTab(tab) {
        hideToast();
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    // --- Password Toggle Buttons (Data-Target) ---
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                btn.textContent = isPassword ? '🙈' : '👁️';
            }
        });
    });

    // --- Live Password Strength Meter ---
    const signupPassword = document.getElementById('signupPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    signupPassword.addEventListener('input', () => {
        const value = signupPassword.value;
        const result = checkPasswordStrength(value);

        strengthBar.style.width = result.percent + '%';
        strengthBar.style.backgroundColor = result.color;
        strengthText.textContent = value ? result.label : 'Password Strength';
        strengthText.style.color = result.color || 'var(--text-secondary)';
    });

    function checkPasswordStrength(password) {
        if (!password) return { percent: 0, color: '', label: 'Password Strength' };

        let score = 0;
        if (password.length >= 6) score += 1;
        if (password.length >= 10) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score <= 2) {
            return { percent: 25, color: '#ef4444', label: 'Weak ⚠️' };
        } else if (score === 3 || score === 4) {
            return { percent: 70, color: '#f59e0b', label: 'Medium ⚡' };
        } else {
            return { percent: 100, color: '#10b981', label: 'Strong Shield 🔒' };
        }
    }

    // --- Helper Validation Functions ---
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast-notification ${type}`;
        setTimeout(() => {
            // Auto hide after 4 seconds
            toast.style.display = 'none';
        }, 4000);
    }

    function hideToast() {
        toast.style.display = 'none';
        toast.className = 'toast-notification';
    }

    // --- Social Logins ---
    document.getElementById('googleLogin').addEventListener('click', () => {
        showToast('Connecting with Google...', 'success');
    });

    document.getElementById('githubLogin').addEventListener('click', () => {
        showToast('Connecting with GitHub...', 'success');
    });

    // --- Login Form Submit ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const pass = document.getElementById('loginPassword');
        const emailErr = document.getElementById('loginEmailError');
        const passErr = document.getElementById('loginPasswordError');
        const submitBtn = document.getElementById('loginSubmit');

        emailErr.textContent = '';
        passErr.textContent = '';

        let valid = true;
        if (!email.value.trim()) {
            emailErr.textContent = 'Please enter your email.';
            valid = false;
        } else if (!isValidEmail(email.value.trim())) {
            emailErr.textContent = 'Enter a valid email address.';
            valid = false;
        }

        if (!pass.value.trim()) {
            passErr.textContent = 'Please enter your password.';
            valid = false;
        }

        if (valid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showToast(`Welcome back, ${email.value.trim()}! Login successful.`, 'success');
                loginForm.reset();
            }, 1200);
        }
    });

    // --- Sign Up Form Submit ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const pass = document.getElementById('signupPassword');
        const terms = document.getElementById('agreeTerms');

        const nameErr = document.getElementById('signupNameError');
        const emailErr = document.getElementById('signupEmailError');
        const passErr = document.getElementById('signupPasswordError');
        const termsErr = document.getElementById('termsError');
        const submitBtn = document.getElementById('signupSubmit');

        nameErr.textContent = '';
        emailErr.textContent = '';
        passErr.textContent = '';
        termsErr.textContent = '';

        let valid = true;
        if (!name.value.trim()) {
            nameErr.textContent = 'Please enter your name.';
            valid = false;
        }

        if (!email.value.trim()) {
            emailErr.textContent = 'Please enter your email.';
            valid = false;
        } else if (!isValidEmail(email.value.trim())) {
            emailErr.textContent = 'Enter a valid email address.';
            valid = false;
        }

        if (!pass.value.trim()) {
            passErr.textContent = 'Please enter a password.';
            valid = false;
        } else if (pass.value.length < 6) {
            passErr.textContent = 'Password must be at least 6 characters.';
            valid = false;
        }

        if (!terms.checked) {
            termsErr.textContent = 'You must agree to the terms.';
            valid = false;
        }

        if (valid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showToast(`Account created for ${name.value.trim()}! 🎉`, 'success');
                signupForm.reset();
                strengthBar.style.width = '0%';
                strengthText.textContent = 'Password Strength';
                strengthText.style.color = 'var(--text-secondary)';
                setTimeout(() => switchTab('login'), 1500);
            }, 1200);
        }
    });
});
