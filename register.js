document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent form from submitting normally

    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;

    // Input validation: Check if fields are empty
    if (!username || !password) {
        document.getElementById("error-msg").textContent = "Both fields are required!";
        document.getElementById("success-msg").textContent = "";
        return;
    }

    // Optionally, you could add more checks, like password strength validation
    if (password.length < 6) {
        document.getElementById("error-msg").textContent = "Password must be at least 6 characters!";
        document.getElementById("success-msg").textContent = "";
        return;
    }

    // Send data to backend
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",  // Indicating we're sending JSON
        },
        body: JSON.stringify({ username, password }),  // Sending form data as JSON
    });

    const data = await response.json();  // Parse the response from backend

    // Handle success/error response
    if (response.ok) {
        console.log("Registration successful. Redirecting...");
        document.getElementById("success-msg").textContent = data.success;
        document.getElementById("error-msg").textContent = "";
        
        // Redirect to login page after registration success
        window.location.href = "/login";  // Redirect to login page
    } else {
        console.log("Registration failed:", data.error);
        document.getElementById("error-msg").textContent = data.error;
        document.getElementById("success-msg").textContent = "";
    }
});








// document.getElementById("register-form").addEventListener("submit", async (e) => {
//     e.preventDefault();  // Prevent form from submitting normally

//     const username = document.getElementById("register-username").value.trim();
//     const password = document.getElementById("register-password").value;

//     // Input validation: Check if fields are empty
//     if (!username || !password) {
//         document.getElementById("error-msg").textContent = "Both fields are required!";
//         document.getElementById("success-msg").textContent = "";
//         return;
//     }

//     // Optionally, you could add more checks, like password strength validation
//     // Example: password must be at least 6 characters long
//     if (password.length < 6) {
//         document.getElementById("error-msg").textContent = "Password must be at least 6 characters!";
//         document.getElementById("success-msg").textContent = "";
//         return;
//     }

//     // Send data to backend
//     const response = await fetch("/register", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",  // Indicating we're sending JSON
//         },
//         body: JSON.stringify({ username, password }),  // Sending form data as JSON
//     });

//     const data = await response.json();  // Parse the response from backend

//     // Handle success/error response
//     if (response.ok) {
//         document.getElementById("success-msg").textContent = data.success;
//         document.getElementById("error-msg").textContent = "";
//         // Optionally, redirect to login page or dashboard after successful registration
//         window.location.href = "/login";  // Example redirection
//     } else {
//         document.getElementById("error-msg").textContent = data.error;
//         document.getElementById("success-msg").textContent = "";
//     }
// });




















// // document.getElementById("register-form").addEventListener("submit", async (e) => {
// //     e.preventDefault();

// //     const username = document.getElementById("register-username").value.trim();
// //     const password = document.getElementById("register-password").value;

// //     const response = await fetch("/register", {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ username, password }),
// //     });

// //     const data = await response.json();

// //     if (response.ok) {
// //         document.getElementById("success-msg").textContent = data.success;
// //         document.getElementById("error-msg").textContent = "";
// //     } else {
// //         document.getElementById("error-msg").textContent = data.error;
// //         document.getElementById("success-msg").textContent = "";
// //     }
// // });
