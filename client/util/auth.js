console.log("working");

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (form) {
        form.addEventListener('submit', (e) => {
            if (password.value !== confirmPassword.value) {
                // Sets the error and blocks submission
                confirmPassword.setCustomValidity(confirmPassword.title);
            } else {
                // Clears the error so the form can proceed
                confirmPassword.setCustomValidity('');
            }
        });

        // Reset the validation message when the user types
        // so they aren't stuck with an error bubble after fixing it
        confirmPassword.addEventListener('input', () => {
            confirmPassword.setCustomValidity('');
        });
    }
});