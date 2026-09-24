document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const authTabs = document.getElementById('authTabs');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toast = document.getElementById('toastNotification');

    // --- Dashboard Elements ---
    const userDashboard = document.getElementById('userDashboard');
    const userAvatar = document.getElementById('userAvatar');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Modal Elements ---
    const openForgotModalBtn = document.getElementById('openForgotModal');
    const forgotModal = document.getElementById('forgotModal');
    const closeModalBtn = document.getElementById('closeModal');
    const forgotForm = document.getElementById('forgotForm');
    const forgotEmail = document.getElementById('forgotEmail');
    const forgotEmailError = document.getElementById('forgotEmailError');
    const modalNotice = document.getElementById('modalNotice');
    const forgotSubmit = document.getElementById('forgotSubmit');

    // --- 3D Card Tilt Elements ---
    const tiltCard = document.getElementById('tiltCard');
    const cardGlare = document.getElementById('cardGlare');

    // --- 1. Theme Switcher Logic ---
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

    // --- 2. 3D Card Tilt Effect ---
    if (tiltCard && window.innerWidth > 768) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            cardGlare.style.opacity = '1';
            cardGlare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18), transparent 60%)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            cardGlare.style.opacity = '0';
        });
    }

    // --- 3. Confetti Celebration Engine ---
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnimationId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function triggerConfetti() {
        confettiParticles = [];
        const colors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];
        for (let i = 0; i < 90; i++) {
            confettiParticles.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 50,
                r: Math.random() * 6 + 4,
                d: Math.random() * 90,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() * -18) - 5,
                gravity: 0.45,
                opacity: 1
            });
        }

        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        renderConfetti();
    }

    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = 0;

        confettiParticles.forEach((p) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2 + p.vy;
            p.x += Math.sin(p.d) * 2 + p.vx;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.opacity -= 0.008;

            if (p.opacity > 0) {
                activeParticles++;
                ctx.beginPath();
                ctx.lineWidth = p.r / 1.5;
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });

        if (activeParticles > 0) {
            confettiAnimationId = requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // --- 4. Tab Switching Logic ---
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));

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

    // --- 5. Logged-In User Dashboard Flow ---
    function showDashboard(name, email) {
        authTabs.style.display = 'none';
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        userDashboard.classList.add('active');

        // Initials for avatar
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
        userAvatar.textContent = initials;
        userNameDisplay.textContent = name;
        userEmailDisplay.textContent = email;

        triggerConfetti();
        showToast(`🎉 Logged in as ${name}!`, 'success');
    }

    logoutBtn.addEventListener('click', () => {
        userDashboard.classList.remove('active');
        authTabs.style.display = 'flex';
        switchTab('login');
        showToast('Logged out successfully.', 'success');
    });

    document.getElementById('actionProfile').addEventListener('click', () => {
        showToast('Navigating to user profile...', 'success');
    });

    document.getElementById('actionSecurity').addEventListener('click', () => {
        showToast('Security settings is up to date 🔒', 'success');
    });

    // --- 6. Password Visibility Toggle ---
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

    // --- 7. Password Strength Meter ---
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

    // --- Helpers ---
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast-notification ${type}`;
        setTimeout(() => {
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
        setTimeout(() => {
            showDashboard('Google User', 'google.user@gmail.com');
        }, 1000);
    });

    document.getElementById('githubLogin').addEventListener('click', () => {
        showToast('Connecting with GitHub...', 'success');
        setTimeout(() => {
            showDashboard('GitHub Developer', 'developer@github.com');
        }, 1000);
    });

    // --- 8. Forgot Password Modal ---
    openForgotModalBtn.addEventListener('click', () => {
        forgotModal.classList.add('show');
        forgotEmail.focus();
    });

    function closeForgotModal() {
        forgotModal.classList.remove('show');
        forgotEmailError.textContent = '';
        modalNotice.style.display = 'none';
        forgotForm.reset();
    }

    closeModalBtn.addEventListener('click', closeForgotModal);

    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) closeForgotModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && forgotModal.classList.contains('show')) closeForgotModal();
    });

    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        forgotEmailError.textContent = '';
        modalNotice.style.display = 'none';

        if (!email) {
            forgotEmailError.textContent = 'Please enter your email address.';
            return;
        }

        if (!isValidEmail(email)) {
            forgotEmailError.textContent = 'Please enter a valid email address.';
            return;
        }

        forgotSubmit.classList.add('loading');
        forgotSubmit.disabled = true;

        setTimeout(() => {
            forgotSubmit.classList.remove('loading');
            forgotSubmit.disabled = false;
            modalNotice.className = 'modal-notice success';
            modalNotice.textContent = `A reset code has been sent to ${email} 📩`;
            setTimeout(() => {
                closeForgotModal();
                showToast(`OTP Code sent to ${email}! Check your inbox.`, 'success');
            }, 2500);
        }, 1200);
    });

    // --- 9. Login Submit ---
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
                const derivedName = email.value.split('@')[0].replace('.', ' ');
                const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
                showDashboard(formattedName, email.value.trim());
                loginForm.reset();
            }, 1200);
        }
    });

    // --- 10. Sign Up Submit ---
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
                showDashboard(name.value.trim(), email.value.trim());
                signupForm.reset();
                strengthBar.style.width = '0%';
                strengthText.textContent = 'Password Strength';
                strengthText.style.color = 'var(--text-secondary)';
            }, 1200);
        }
    });
});
