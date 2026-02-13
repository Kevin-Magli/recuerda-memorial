const form = document.querySelector("#register-form");



function performRegistration() {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const users = getUsers();
    
    if (!name || !email || !password) {
        alert("Preencha todos os campos.");
        return
    }

    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert("Esse email já está cadastrado.");
        return
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };
    
    users.push(newUser);
    saveUsers(users)
    
    localStorage.setItem("currentUser", newUser.id);

    window.location.href = "/dashboard.html";
    
}

function performLogin() {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const users = getUsers();

    if (!email || !password) {
        alert("Preencha todos os campos.");
        return
    }

    const user = users.find(user =>
        user.email === email && user.password === password
    );

    if (!user) {
        alert("email ou senha inválidos.");
        return;
    }

    localStorage.setItem("currentUser", user.id);
    window.location.href = "/dashboard.html";
}

function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


form.addEventListener("submit", (event) => {

    event.preventDefault();

    const action = event.submitter.value;
    
    if (action === "register") {
        performRegistration();
    }
    
    if (action === "login") {
        performLogin();
    }
})