/**
 * DonasiBerkat Tasikmalaya - Authentication JavaScript
 * Handles login and registration functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle functionality
    initPasswordToggles();
    
    // Initialize password strength meter
    initPasswordStrengthMeter();
    
    // Initialize login form
    initLoginForm();
    
    // Initialize registration form
    initRegisterForm();
});

/**
 * Hard-coded credentials for demo purposes
 * In a real application, these would be stored in a database
 */
const users = [
    {
        email: 'admin@a.com',
        password: 'admin',
        name: 'Admin DonasiBerkat',
        phone: '081234567890',
        role: 'admin'
    },
    {
        email: 'user@a.com',
        password: 'user',
        name: 'Pengguna',
        phone: '081298765432',
        role: 'user'
    }
];

/**
 * Initialize password toggle functionality
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye-slash';
            }
        });
    });
}

/**
 * Initialize password strength meter
 */
function initPasswordStrengthMeter() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('password-strength');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    if (!passwordInput || !strengthMeter) return;
    
    passwordInput.addEventListener('input', function() {
        const value = this.value;
        let strength = 0;
        let status = '';
        let color = '';
        
        if (value.length === 0) {
            // Password is empty
            strength = 0;
            status = 'Belum dimasukkan';
            color = '';
        } else if (value.length < 8) {
            // Password is too short
            strength = 1;
            status = 'Terlalu pendek';
            color = 'strength-weak';
        } else {
            // Start with a base strength
            strength = 2;
            
            // Add points for complexity
            if (/[A-Z]/.test(value)) strength++;  // Uppercase letter
            if (/[a-z]/.test(value)) strength++;  // Lowercase letter
            if (/[0-9]/.test(value)) strength++;  // Number
            if (/[^A-Za-z0-9]/.test(value)) strength++;  // Special character
            
            // Determine status based on strength
            if (strength <= 3) {
                status = 'Lemah';
                color = 'strength-weak';
            } else if (strength === 4) {
                status = 'Sedang';
                color = 'strength-fair';
            } else if (strength === 5) {
                status = 'Baik';
                color = 'strength-good';
            } else {
                status = 'Kuat';
                color = 'strength-strong';
            }
        }
        
        // Remove all strength classes
        strengthMeter.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
        
        // Add the appropriate class
        if (color) {
            strengthMeter.classList.add(color);
        }
        
        // Update the text
        strengthText.textContent = status;
    });
}

/**
 * Initialize login form validation and submission
 */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('login-error');
        const submitButton = this.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoader = submitButton.querySelector('.btn-loader');
        
        // Show loading state
        buttonText.style.visibility = 'hidden';
        buttonLoader.style.display = 'flex';
        
        // Hide any previous error
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        // Simulate server request delay
        setTimeout(() => {
            const user = authenticateUser(email, password);
            
            if (user) {
                // Store user info in localStorage (in a real app, this would be a secure token)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userRole', user.role);
                
                // Redirect based on user role
                if (user.role === 'admin') {
                    window.location.href = '/admin/dashboard.html';
                } else {
                    window.location.href = '/profil.html';
                }
            } else {
                // Show error message
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                
                // Reset loading state
                buttonText.style.visibility = 'visible';
                buttonLoader.style.display = 'none';
            }
        }, 1000);
    });
}

/**
 * Initialize registration form validation and submission
 */
function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (!registerForm) return;
    
    // Add validation for password confirmation
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm_password');
    
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            if (passwordInput.value !== this.value) {
                this.setCustomValidity('Kata sandi tidak cocok');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('register-error');
        const submitButton = this.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoader = submitButton.querySelector('.btn-loader');
        
        // Show loading state
        buttonText.style.visibility = 'hidden';
        buttonLoader.style.display = 'flex';
        
        // Hide any previous error
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        // Simulate server request delay
        setTimeout(() => {
            // Check if the email is already registered
            const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
            
            if (userExists) {
                // Show error message
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                
                // Reset loading state
                buttonText.style.visibility = 'visible';
                buttonLoader.style.display = 'none';
            } else {
                // In a real app, we would send this data to the server
                // For demo, we'll just simulate success and redirect
                
                // Add the new user to our local array (would be database in real app)
                users.push({
                    email: email,
                    password: password,
                    name: fullname,
                    phone: phone,
                    role: 'user'
                });
                
                // Store user info (in a real app, this would be a secure token)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', fullname);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', 'user');
                
                // Redirect to profile page
                window.location.href = '/profil.html';
            }
        }, 1000);
    });
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object|null} User object if authenticated, null otherwise
 */
function authenticateUser(email, password) {
    return users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
}
