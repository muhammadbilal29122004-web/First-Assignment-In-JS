document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const notification = document.getElementById('notification');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    });

    // Clear error messages on input
    emailInput.addEventListener('input', () => {
        emailError.textContent = '';
        hideNotification();
    });

    passwordInput.addEventListener('input', () => {
        passwordError.textContent = '';
        hideNotification();
    });

    // Validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show banner notification
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
    }

    function hideNotification() {
        notification.style.display = 'none';
        notification.className = 'notification';
    }

    // Form submission handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validate Email
        if (!emailValue) {
            emailError.textContent = 'Please enter your email.';
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Validate Password
        if (!passwordValue) {
            passwordError.textContent = 'Please enter your password.';
            isValid = false;
        } else if (passwordValue.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (isValid) {
            // Simulated successful login
            showNotification(`Welcome, ${emailValue}! Login successful.`, 'success');
            loginForm.reset();
            passwordInput.setAttribute('type', 'password');
            togglePasswordBtn.textContent = '👁️';
        } else {
            showNotification('Please correct the highlighted errors.', 'error');
        }
    });
});
