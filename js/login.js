let newURL = window.location.protocol + "//" + window.location.host;
let dominio = 'https://server-api-production.up.railway.app/';
// let dominio = 'http://localhost:3000/'


const username = document.querySelector('#username');
const password = document.querySelector('#password');
const loginForm = document.querySelector('#loginForm');
const btningresar = document.querySelector('#btningresar');

const fetchLogin = (url, data) => {
    return fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data),
        credentials: 'include'
    }).then(response => response.json())
        .catch(err => console.log(err + 'Error'))
}

document.addEventListener('DOMContentLoaded', (e) => {
    
    let newURL = window.location.protocol + "//" + window.location.host;
    const currentDate = new Date(Date.now())
    const expiresIn = localStorage.getItem('expiresIn');
    const expiresInDate = new Date(expiresIn);
    // console.log(expiresInDate);
    // console.log(currentDate);
    // console.log(expiresInDate > currentDate)
    if (expiresInDate > currentDate) {
        window.location.href = newURL + '/index.html'
        return
    } else {
        return localStorage.removeItem('expiresIn') 
    }
})

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username_API = username.value;
    const password_API = password.value;
    btningresar.setAttribute('aria-busy', 'true');

    if (username_API === '' || password_API === '') return
    const url = dominio + 'auth/login';
    const data = {
        username: username_API,
        password: password_API
    }

    const isLogin = await fetchLogin(url, data);

    if (isLogin.username) {
        localStorage.setItem('expiresIn', isLogin.expiresIn);
        btningresar.removeAttribute('aria-busy');
        window.location.href = newURL + '/index.html';
    } else {
        btningresar.removeAttribute('aria-busy');
        alert('Credenciales incorrectos');
    }
})


