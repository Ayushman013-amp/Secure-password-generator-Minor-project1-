/**
 * ==========================================================================
 * SECURE PASSWORD GENERATOR - MAIN JAVASCRIPT
 * --------------------------------------------------------------------------
 * Author: Internship Project Submission
 * Architecture: Clean, Modular, Event-Driven Vanilla JavaScript
 * Features: Dynamic Generation, Cryptographic Randomness, Entropy Calculation,
 *           Strength Metering, Clipboard Copying, Custom Ripple Animations.
 * ==========================================================================
 */

// Wait for the DOM to be fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize application
  initApp();
});

/* --------------------------------------------------------------------------
   1. GLOBAL CONSTANTS & CHARACTER SETS
   -------------------------------------------------------------------------- */
const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  // Characters that look ambiguous and might be excluded if option enabled
  ambiguous: 'iI1lLo0O'
};

/* --------------------------------------------------------------------------
   2. DOM ELEMENT REFERENCES
   -------------------------------------------------------------------------- */
const DOM = {
  // Inputs & Password Display
  passwordInput: document.getElementById('passwordOutput'),
  lengthSlider: document.getElementById('lengthSlider'),
  lengthDisplay: document.getElementById('lengthDisplay'),
  btnDecreaseLength: document.getElementById('btnDecreaseLength'),
  btnIncreaseLength: document.getElementById('btnIncreaseLength'),
  charCountMeta: document.getElementById('charCountMeta'),

  // Checkboxes
  chkUppercase: document.getElementById('chkUppercase'),
  chkLowercase: document.getElementById('chkLowercase'),
  chkNumbers: document.getElementById('chkNumbers'),
  chkSymbols: document.getElementById('chkSymbols'),
  chkExcludeAmbiguous: document.getElementById('chkExcludeAmbiguous'),

  // Action Buttons
  btnGenerate: document.getElementById('btnGenerate'),
  btnCopy: document.getElementById('btnCopy'),
  btnRegenerate: document.getElementById('btnRegenerate'),
  btnToggleVisibility: document.getElementById('btnToggleVisibility'),

  // Strength Indicator Elements
  strengthBadge: document.getElementById('strengthBadge'),
  meterSegments: document.querySelectorAll('.meter-segment'),
  entropyValue: document.getElementById('entropyValue'),
  crackTimeValue: document.getElementById('crackTimeValue'),

  // UI Feedback & Notifications
  validationError: document.getElementById('validationError'),
  toastNotification: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage')
};

/* --------------------------------------------------------------------------
   3. INITIALIZATION & EVENT LISTENERS
   -------------------------------------------------------------------------- */

/**
 * Initializes app state, attaches event listeners, and auto-generates initial password.
 */
function initApp() {
  // Synchronize range slider CSS background fill property
  updateSliderTrackFill();

  // Attach Event Listeners
  attachEventListeners();

  // Auto-generate initial password on load
  generatePassword();
}

/**
 * Binds all DOM element events to their corresponding handler functions.
 */
function attachEventListeners() {
  // Slider Length Change
  DOM.lengthSlider.addEventListener('input', (e) => {
    updateLength(e.target.value);
    generatePassword();
  });

  // Length Stepper Buttons (+ / -)
  if (DOM.btnDecreaseLength) {
    DOM.btnDecreaseLength.addEventListener('click', () => {
      const newLen = Math.max(4, parseInt(DOM.lengthSlider.value, 10) - 1);
      updateLength(newLen);
      generatePassword();
    });
  }

  if (DOM.btnIncreaseLength) {
    DOM.btnIncreaseLength.addEventListener('click', () => {
      const newLen = Math.min(30, parseInt(DOM.lengthSlider.value, 10) + 1);
      updateLength(newLen);
      generatePassword();
    });
  }

  // Option Checkbox Toggles -> Instant Auto Generate
  const checkboxes = [
    DOM.chkUppercase,
    DOM.chkLowercase,
    DOM.chkNumbers,
    DOM.chkSymbols,
    DOM.chkExcludeAmbiguous
  ];

  checkboxes.forEach((chk) => {
    if (chk) {
      chk.addEventListener('change', () => {
        validateOptions();
        generatePassword();
      });
    }
  });

  // Main Action Buttons
  DOM.btnGenerate.addEventListener('click', (e) => {
    triggerRippleEffect(e);
    generatePassword();
  });

  if (DOM.btnRegenerate) {
    DOM.btnRegenerate.addEventListener('click', () => {
      // Rotate icon briefly on click
      DOM.btnRegenerate.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        DOM.btnRegenerate.style.transform = '';
      }, 300);
      generatePassword();
    });
  }

  DOM.btnCopy.addEventListener('click', () => {
    copyPassword();
  });

  if (DOM.btnToggleVisibility) {
    DOM.btnToggleVisibility.addEventListener('click', () => {
      togglePasswordVisibility();
    });
  }

  // Keyboard Shortcuts for Accessibility
  document.addEventListener('keydown', (e) => {
    // Press 'Space' key (if not focused on input or button) to regenerate
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      generatePassword();
    }
    // Press 'c' or 'Cmd+C' or 'Ctrl+C' when not editing text to copy
    if ((e.key === 'c' || e.key === 'C') && (e.ctrlKey || e.metaKey)) {
      copyPassword();
    }
  });
}

/* --------------------------------------------------------------------------
   4. CORE PASSWORD GENERATION LOGIC
   -------------------------------------------------------------------------- */

/**
 * Main function to generate a secure random password based on user selections.
 */
function generatePassword() {
  // Step 1: Validate that at least one character type is checked
  if (!validateOptions()) {
    DOM.passwordInput.value = '';
    calculateStrength('');
    return;
  }

  const length = parseInt(DOM.lengthSlider.value, 10);
  let availableChars = '';
  const guaranteedChars = [];

  // Build character pool and collect at least one character from each selected set
  if (DOM.chkUppercase.checked) {
    let set = CHARACTER_SETS.uppercase;
    if (DOM.chkExcludeAmbiguous.checked) {
      set = filterAmbiguous(set);
    }
    availableChars += set;
    guaranteedChars.push(getRandomChar(set));
  }

  if (DOM.chkLowercase.checked) {
    let set = CHARACTER_SETS.lowercase;
    if (DOM.chkExcludeAmbiguous.checked) {
      set = filterAmbiguous(set);
    }
    availableChars += set;
    guaranteedChars.push(getRandomChar(set));
  }

  if (DOM.chkNumbers.checked) {
    let set = CHARACTER_SETS.numbers;
    if (DOM.chkExcludeAmbiguous.checked) {
      set = filterAmbiguous(set);
    }
    availableChars += set;
    guaranteedChars.push(getRandomChar(set));
  }

  if (DOM.chkSymbols.checked) {
    let set = CHARACTER_SETS.symbols;
    if (DOM.chkExcludeAmbiguous.checked) {
      set = filterAmbiguous(set);
    }
    availableChars += set;
    guaranteedChars.push(getRandomChar(set));
  }

  // Fill the remaining length with random selections from the full available pool
  const passwordArray = [...guaranteedChars];
  const remainingLength = length - guaranteedChars.length;

  for (let i = 0; i < remainingLength; i++) {
    passwordArray.push(getRandomChar(availableChars));
  }

  // Shuffle the final array to eliminate predictable patterns (guaranteed chars at start)
  const finalPassword = shufflePassword(passwordArray).join('');

  // Update DOM Output with optional shuffle animation effect
  animatePasswordOutput(finalPassword);

  // Calculate & Update Strength Indicator and Meta stats
  calculateStrength(finalPassword, availableChars.length);
  updateMetaDisplay(finalPassword.length);
}

/**
 * Returns a cryptographically secure random character from a given string set.
 * Uses window.crypto for superior randomness over Math.random().
 * @param {string} charSet - String of allowed characters
 * @returns {string} - Single random character
 */
function getRandomChar(charSet) {
  if (!charSet || charSet.length === 0) return '';
  const randomArray = new Uint32Array(1);
  window.crypto.getRandomValues(randomArray);
  const randomIndex = randomArray[0] % charSet.length;
  return charSet[randomIndex];
}

/**
 * Shuffles an array in random order using Fisher-Yates (Knuth) Shuffle algorithm.
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shufflePassword(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    const j = randomArray[0] % (i + 1);
    // Swap elements
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Filters out ambiguous characters (i, I, 1, l, L, o, 0, O) from a character set.
 * @param {string} set - Original string set
 * @returns {string} - Filtered string set
 */
function filterAmbiguous(set) {
  return set.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char)).join('');
}

/**
 * Adds a fast slot-machine text shuffle animation when generating a new password.
 * @param {string} targetPassword - Final generated password
 */
function animatePasswordOutput(targetPassword) {
  DOM.passwordInput.value = targetPassword;
  DOM.passwordInput.classList.add('shuffling');

  // Remove animation class after brief delay
  setTimeout(() => {
    DOM.passwordInput.classList.remove('shuffling');
  }, 120);
}

/* --------------------------------------------------------------------------
   5. COPY TO CLIPBOARD FUNCTIONALITY
   -------------------------------------------------------------------------- */

/**
 * Copies the generated password to the user's clipboard and triggers UI feedback.
 */
async function copyPassword() {
  const password = DOM.passwordInput.value;

  if (!password) {
    showNotification('No password generated to copy!', 'error');
    return;
  }

  try {
    // Primary API: Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(password);
    } else {
      // Fallback API for older browser environments
      DOM.passwordInput.select();
      document.execCommand('copy');
    }

    // Show Success Notification Toast
    showNotification('Copied Successfully!');

    // Visual button feedback
    DOM.btnCopy.classList.add('copied');
    setTimeout(() => {
      DOM.btnCopy.classList.remove('copied');
    }, 1500);

  } catch (err) {
    console.error('Copy failed: ', err);
    showNotification('Failed to copy to clipboard', 'error');
  }
}

/* --------------------------------------------------------------------------
   6. PASSWORD STRENGTH & ENTROPY CALCULATION
   -------------------------------------------------------------------------- */

/**
 * Calculates strength category and entropy bits for a given password.
 * @param {string} password - The generated password string
 * @param {number} poolSize - Total size of available character pool
 */
function calculateStrength(password, poolSize = 0) {
  if (!password || password.length === 0) {
    updateStrengthUI('Weak', 0, 0, 'Instant');
    return;
  }

  // 1. Calculate Password Entropy (E = L * log2(N))
  // L = password length, N = size of pool of unique possible characters
  const entropy = Math.round(password.length * Math.log2(poolSize || 26));

  // 2. Determine Diversity Score (1 to 4)
  let diversityScore = 0;
  if (/[A-Z]/.test(password)) diversityScore++;
  if (/[a-z]/.test(password)) diversityScore++;
  if (/[0-9]/.test(password)) diversityScore++;
  if (/[^A-Za-z0-9]/.test(password)) diversityScore++;

  // 3. Determine Strength Category based on Entropy & Diversity
  let category = 'Weak';
  let scoreLevel = 1; // 1: Weak, 2: Medium, 3: Strong, 4: Very Strong

  if (entropy < 36 || password.length < 8) {
    category = 'Weak';
    scoreLevel = 1;
  } else if (entropy < 56 || password.length < 12 || diversityScore < 2) {
    category = 'Medium';
    scoreLevel = 2;
  } else if (entropy < 80 || diversityScore < 3) {
    category = 'Strong';
    scoreLevel = 3;
  } else {
    category = 'Very Strong';
    scoreLevel = 4;
  }

  // 4. Estimate Time to Crack
  const crackTime = estimateTimeToCrack(entropy);

  // 5. Update UI Indicators
  updateStrengthUI(category, scoreLevel, entropy, crackTime);
}

/**
 * Estimates human-readable time required to crack the password via brute-force.
 * Assumes a modern hardware benchmark of 100 Billion guesses per second.
 * @param {number} entropy - Entropy in bits
 * @returns {string} - Formatted crack time estimate
 */
function estimateTimeToCrack(entropy) {
  if (entropy <= 0) return 'Instant';

  const guesses = Math.pow(2, entropy);
  const guessesPerSecond = 1e11; // 100 Billion / sec
  const seconds = guesses / guessesPerSecond;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;

  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)}k years`;
  return 'Centuries+';
}

/**
 * Updates strength badge, meter bar segments, and text counters in DOM.
 * @param {string} category - "Weak" | "Medium" | "Strong" | "Very Strong"
 * @param {number} level - Numeric level 1 to 4
 * @param {number} entropy - Entropy bits
 * @param {string} crackTime - Crack time string
 */
function updateStrengthUI(category, level, entropy, crackTime) {
  // Update Badge Text & CSS Class
  DOM.strengthBadge.textContent = category;
  DOM.strengthBadge.className = 'strength-badge'; // Reset classes
  const classKey = category.toLowerCase().replace(' ', '-');
  DOM.strengthBadge.classList.add(classKey);

  // Update Meter Segments (4 segments)
  DOM.meterSegments.forEach((segment, index) => {
    segment.className = 'meter-segment'; // Reset
    if (index < level) {
      segment.classList.add(`active-${classKey}`);
    }
  });

  // Update Secondary Info
  DOM.entropyValue.textContent = `${entropy} bits`;
  DOM.crackTimeValue.textContent = crackTime;
}

/* --------------------------------------------------------------------------
   7. UI CONTROL HELPERS & VALIDATION
   -------------------------------------------------------------------------- */

/**
 * Updates password length counter display and slider track fill width.
 * @param {number|string} newLength - New length value
 */
function updateLength(newLength) {
  const val = Math.min(30, Math.max(4, parseInt(newLength, 10) || 12));
  DOM.lengthSlider.value = val;
  DOM.lengthDisplay.textContent = val;
  updateSliderTrackFill();
}

/**
 * Dynamically updates custom slider progress bar fill using CSS variable.
 */
function updateSliderTrackFill() {
  const min = parseInt(DOM.lengthSlider.min, 10) || 4;
  const max = parseInt(DOM.lengthSlider.max, 10) || 30;
  const val = parseInt(DOM.lengthSlider.value, 10);
  const percentage = ((val - min) / (max - min)) * 100;
  DOM.lengthSlider.style.setProperty('--slider-progress', `${percentage}%`);
}

/**
 * Validates if at least one character type option is checked.
 * Shows or hides error banner accordingly.
 * @returns {boolean} - True if valid, false if invalid
 */
function validateOptions() {
  const isAnyChecked =
    DOM.chkUppercase.checked ||
    DOM.chkLowercase.checked ||
    DOM.chkNumbers.checked ||
    DOM.chkSymbols.checked;

  if (!isAnyChecked) {
    DOM.validationError.classList.add('show');
    DOM.btnGenerate.disabled = true;
    return false;
  } else {
    DOM.validationError.classList.remove('show');
    DOM.btnGenerate.disabled = false;
    return true;
  }
}

/**
 * Toggles the password output field between masked ('password') and readable ('text').
 */
function togglePasswordVisibility() {
  const currentType = DOM.passwordInput.type;
  const newType = currentType === 'password' ? 'text' : 'password';
  DOM.passwordInput.type = newType;

  // Update Eye Icon
  if (DOM.btnToggleVisibility) {
    const svgIcon = DOM.btnToggleVisibility.querySelector('svg');
    if (newType === 'text') {
      // Eye Off Icon
      svgIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
      DOM.btnToggleVisibility.setAttribute('data-tooltip', 'Hide Password');
    } else {
      // Eye Icon
      svgIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
      DOM.btnToggleVisibility.setAttribute('data-tooltip', 'Show Password');
    }
  }
}

/**
 * Updates character count in meta description beneath password box.
 * @param {number} count - Character count
 */
function updateMetaDisplay(count) {
  if (DOM.charCountMeta) {
    DOM.charCountMeta.textContent = `${count} Chars`;
  }
}

/**
 * Displays a toast notification at the bottom of the screen.
 * @param {string} message - Text to display
 * @param {string} type - 'success' | 'error'
 */
function showNotification(message, type = 'success') {
  DOM.toastMessage.textContent = message;

  if (type === 'error') {
    DOM.toastNotification.style.borderColor = 'rgba(239, 68, 68, 0.5)';
  } else {
    DOM.toastNotification.style.borderColor = 'rgba(167, 139, 250, 0.4)';
  }

  DOM.toastNotification.classList.add('show');

  // Auto hide after 2.5 seconds
  setTimeout(() => {
    DOM.toastNotification.classList.remove('show');
  }, 2500);
}

/**
 * Creates a CSS ripple effect on button click.
 * @param {MouseEvent} event - Click event
 */
function triggerRippleEffect(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('btn-ripple');

  const existingRipple = button.getElementsByClassName('btn-ripple')[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);
}
