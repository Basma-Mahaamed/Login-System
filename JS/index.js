// Tab functionality
function showTab(tab) {
  document.getElementById("signupForm").style.display =
    tab === "signup" ? "block" : "none";
  document.getElementById("loginForm").style.display =
    tab === "login" ? "block" : "none";
  document.querySelector(".tab-active").classList.remove("tab-active");
  document.querySelector(`.tab-${tab}`).classList.add("tab-active");
}

// All inputs
var signupName = document.getElementById("signupName");
var signupEmail = document.getElementById("signupEmail");
var signupPassword = document.getElementById("signupPassword");
var signinEmail = document.getElementById("signinEmail");
var signinPassword = document.getElementById("signinPassword");

// To get base URL (localhost)
var baseURL = location.origin;

console.log(baseURL);

// To say welcome on the home page
var username = localStorage.getItem("sessionUsername");
if (username) {
  document.getElementById("username").innerHTML = "Welcome " + username;
  document.getElementById("authContainer").style.display = "none";
  document.getElementById("welcomeContainer").style.display = "block";
  fetchData();
}

var signUpArray = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];

// Check if inputs are empty
function isEmpty() {
  return (
    signupName.value !== "" &&
    signupEmail.value !== "" &&
    signupPassword.value !== ""
  );
}

// Check if email exists
function isEmailExist() {
  return signUpArray.some(
    (user) => user.email.toLowerCase() === signupEmail.value.toLowerCase()
  );
}

function signUp() {
  if (!isEmpty()) {
    document.getElementById("exist").innerHTML =
      '<span class="text-danger">All inputs are required</span>';
    return false;
  }
  if (isEmailExist()) {
    document.getElementById("exist").innerHTML =
      '<span class="text-danger">Email already exists. Please try another email.</span>';
    return false;
  }

  var signUp = {
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value,
  };

  signUpArray.push(signUp);
  localStorage.setItem("users", JSON.stringify(signUpArray));
  document.getElementById("exist").innerHTML =
    '<span class="text-success">Success! Redirecting to login...</span>';
  setTimeout(() => showTab("login"), 1500);
  return true;
}

// Check if login inputs are empty
function isLoginEmpty() {
  return signinEmail.value !== "" && signinPassword.value !== "";
}

function login() {
  if (!isLoginEmpty()) {
    document.getElementById("incorrect").innerHTML =
      '<span class="text-danger">All inputs are required</span>';
    return false;
  }
  var email = signinEmail.value;
  var password = signinPassword.value;
  var user = signUpArray.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (user) {
    localStorage.setItem("sessionUsername", user.name);
    document.getElementById("authContainer").style.display = "none";
    document.getElementById("welcomeContainer").style.display = "block";
    document.getElementById("username").innerHTML = "Welcome " + user.name;
    fetchData();
  } else {
    document.getElementById("incorrect").innerHTML =
      '<span class="text-danger">Incorrect email or password</span>';
  }
}

function logout() {
  localStorage.removeItem("sessionUsername");
  document.getElementById("username").innerHTML = "";
  document.getElementById("authContainer").style.display = "block";
  document.getElementById("welcomeContainer").style.display = "none";
}

 // Fetch data from API
 function fetchData() {
  fetch("https://forkify-api.herokuapp.com/api/search?q=pizza")
    .then((response) => response.json())
    .then((data) => {
      let recipes = data.recipes;
      let output = "";
      recipes.forEach((recipe) => {
        output += `
          <div class="col-12 col-md-4 col-lg-3 recipe-container">
            <div class="recipe-frame">
              <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-image">
            </div>
            <p class="recipe-title">${recipe.title}</p>
          </div>
        `;
      });
      document.getElementById("data").innerHTML = output;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Truncate string function
function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}
