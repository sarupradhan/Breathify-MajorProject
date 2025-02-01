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




















// $("form[name=register-form").submit(function(e) {

//     var $form = $(this);
//     var $error = $form.find(".error");
//     var data = $form.serialize();
  
//     $.ajax({
//       url: "/register",
//       type: "POST",
//       data: data,
//       dataType: "json",
//       success: function(resp) {
//         window.location.href = "/dashboard";
//       },
//       error: function(resp) {
//         $error.text(resp.responseJSON.error).removeClass("error--hidden");
//       }
//     });
  
//     e.preventDefault();
//   });
  
//   $("form[name=login-form").submit(function(e) {
  
//     var $form = $(this);
//     var $error = $form.find(".error");
//     var data = $form.serialize();
  
//     $.ajax({
//       url: "/login",
//       type: "POST",
//       data: data,
//       dataType: "json",
//       success: function(resp) {
//         window.location.href = "/dashboard";
//       },
//       error: function(resp) {
//         $error.text(resp.responseJSON.error).removeClass("error--hidden");
//       }
//     });
  
//     e.preventDefault();
//   });



















// // document.getElementById("login-form").addEventListener("submit", async (e) => {
//     // e.preventDefault();
// // 
//     // const username = document.getElementById("username").value.trim();
//     // const password = document.getElementById("password").value;
// // 
//     // const response = await fetch("/login", {
//         // method: "POST",
//         // headers: {
//             // "Content-Type": "application/json",
//         // },
//         // body: JSON.stringify({ username, password }),
//     // });
// // 
//     // const data = await response.json();
// // 
//     // if (response.ok) {
//         // document.getElementById("error-msg").textContent = "";
//         // alert(data.success);
//         // window.location.href = "/dashboard"; // Redirect to dashboard
//     // } else {
//         // document.getElementById("error-msg").textContent = data.error;
//     // }
// // });
// // 