// --- DOM Selections ---
const registerView = document.getElementById('registerView');
const loginView = document.getElementById('loginView');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const regEmailInput = document.getElementById('regEmail');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const registerMessageArea = document.getElementById('registerMessageArea');

const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginMessageArea = document.getElementById('loginMessageArea');

const showLoginLink = document.getElementById('showLoginLink');
const showRegisterLink = document.getElementById('showRegisterLink');

// --- Regex Definitions ---
// Stricter password: 8-15 chars, at least 1 lower, 1 upper, 1 digit, 1 special char
const emailRegex = /^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,15}$/;

// --- Helper Functions ---
function showMessage(areaElement, message, type = 'error') {
   areaElement.innerHTML = `<div class="form-message ${type}">${message}</div>`;
}

function clearMessage(areaElement) {
   areaElement.innerHTML = '';
}

// --- Promise-Based Functions ---

// Simulates validating and saving user data (uses Local Storage)
function registerUser(email, password, confirmPassword) {
   return new Promise((resolve, reject) => {
      // Validation
      if (!email || !password || !confirmPassword) {
         return reject('All fields are required.');
      }
      if (!emailRegex.test(email)) {
         return reject('Invalid email format.');
      }
      if (!passwordRegex.test(password)) {
         return reject('Password must be 8-15 characters and include uppercase, lowercase, number, and special character (@#$%^&*!).');
      }
      if (password !== confirmPassword) {
         return reject('Passwords do not match.');
      }

      // Check if user already exists in Local Storage
      const existingUser = localStorage.getItem(email);
      if (existingUser) {
         return reject('Email already registered. Please login.');
      }

      // --- If all validation passes ---
      // Simulate async save (though localStorage is sync)
      setTimeout(() => {
         // Removed try...catch block around localStorage
         // Store email as key and password as value
         // IMPORTANT: In a real app, NEVER store plain passwords. Hash them first!
         localStorage.setItem(email, password);
         console.log('User registered:', email);
         resolve('Registration successful! Redirecting to login...'); // Resolve with success message

         // Note: If localStorage.setItem fails (e.g., storage full),
         // the error will now be unhandled and might break execution here.
         // A production app would need more robust error handling.

      }, 500); // Simulate network delay
   });
}

// Simulates checking login credentials against Local Storage
function loginUser(email, password) {
   return new Promise((resolve, reject) => {
      // Basic validation
      if (!email || !password) {
         return reject('Email and password are required.');
      }
      if (!emailRegex.test(email)) {
         return reject('Invalid email format.');
      }

      // Simulate async check (though localStorage is sync)
      setTimeout(() => {
         const storedPassword = localStorage.getItem(email);

         if (!storedPassword) {
            // User not found - reject with specific code/message
            reject({ code: 'USER_NOT_FOUND', message: 'Email not registered. Please register first.' });
         } else if (storedPassword === password) {
            // Password matches
            resolve({ email: email, message: `Login successful for ${email}.` }); // Resolve with user info
         } else {
            // Password incorrect
            reject({ code: 'INVALID_PASSWORD', message: 'Incorrect password.' });
         }
      }, 500); // Simulate network delay
   });
}


// --- Event Listeners ---

// Registration Form Submission
registerForm.addEventListener('submit', (event) => {
   event.preventDefault(); // Stop default page reload
   clearMessage(registerMessageArea); // Clear previous messages

   const email = regEmailInput.value.trim();
   const password = regPasswordInput.value.trim();
   const confirmPassword = regConfirmPasswordInput.value.trim();

   // Add visual feedback while processing
   showMessage(registerMessageArea, 'Processing registration...', 'info'); // Use a different style for info

   registerUser(email, password, confirmPassword)
      .then(successMessage => {
         // SUCCESS: User registered and saved
         showMessage(registerMessageArea, successMessage, 'success');
         registerForm.reset(); // Clear registration form
         // Automatically switch to login view after a short delay
         setTimeout(() => {
            // Replaced switchView call
            loginView.classList.remove('hidden');
            registerView.classList.add('hidden');
            clearMessage(registerMessageArea);
            clearMessage(loginMessageArea);
         }, 1500); // Wait 1.5 seconds
      })
      .catch(errorMessage => {
         // FAILURE: Validation or storage error
         // Check if errorMessage is an object (from loginUser reject) or string (from registerUser reject)
         const messageText = (typeof errorMessage === 'object' && errorMessage.message) ? errorMessage.message : errorMessage;
         showMessage(registerMessageArea, messageText, 'error');
      });
});

// Login Form Submission
loginForm.addEventListener('submit', (event) => {
   event.preventDefault(); // Stop default page reload
   clearMessage(loginMessageArea); // Clear previous messages

   const email = loginEmailInput.value.trim();
   const password = loginPasswordInput.value.trim();

   showMessage(loginMessageArea, 'Attempting login...', 'info');

   loginUser(email, password)
      .then(result => {
         // SUCCESS: Login credentials match
         showMessage(loginMessageArea, 'Login successful!', 'success');
         loginForm.reset(); // Clear login form

         // Log the confirmation email format to the console (removed \n)
         console.log("----- Login Confirmation -----");
         console.log(`To: ${result.email}`);
         console.log(`From: system@example.com`);
         console.log(`Subject: Successful Login`);
         console.log(`Hello ${result.email},You have successfully logged into your account.Thank you.`); // Removed newline
         console.log("------------------------------");

         // In a real app, you might redirect to a dashboard here
         setTimeout(() => {
            alert(`Welcome back, ${result.email}!`); // Simple alert for demo
         }, 500);

      })
      .catch(error => {
         // FAILURE: User not found or password incorrect
         if (error && error.code === 'USER_NOT_FOUND') {
            showMessage(loginMessageArea, error.message, 'error');
            // Redirect to registration view after a delay
            setTimeout(() => {
               // Replaced switchView call
               registerView.classList.remove('hidden');
               loginView.classList.add('hidden');
               clearMessage(registerMessageArea);
               clearMessage(loginMessageArea);
            }, 2000); // Wait 2 seconds
         } else if (error && error.code === 'INVALID_PASSWORD') {
            showMessage(loginMessageArea, error.message, 'error');
         }
         else {
            // Generic error from validation or potentially registerUser
            const messageText = (typeof error === 'object' && error.message) ? error.message : error;
            showMessage(loginMessageArea, messageText || 'Login failed. Please try again.', 'error');
         }
      });
});


// Form Switching Links
showLoginLink.addEventListener('click', (event) => {
   event.preventDefault();
   // Replaced switchView call
   loginView.classList.remove('hidden');
   registerView.classList.add('hidden');
   clearMessage(registerMessageArea);
   clearMessage(loginMessageArea);
});

showRegisterLink.addEventListener('click', (event) => {
   event.preventDefault();
   // Replaced switchView call
   registerView.classList.remove('hidden');
   loginView.classList.add('hidden');
   clearMessage(registerMessageArea);
   clearMessage(loginMessageArea);
});

// --- Initial Setup ---
// Replaced DOMContentLoaded listener with direct execution
// Ensure the register view is shown by default when the script runs
registerView.classList.remove('hidden');
loginView.classList.add('hidden');
clearMessage(registerMessageArea);
clearMessage(loginMessageArea);

