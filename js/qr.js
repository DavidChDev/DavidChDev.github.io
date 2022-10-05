let newURL = window.location.protocol + "//" + window.location.host;
let dominio = 'https://server-api-production.up.railway.app/';
// let dominio = 'http://localhost:3000/'

const qrcode = document.querySelector('#qrcode');
const qrcodecontainer = document.querySelector('#qrcodecontainer');
// const progress = document.querySelector('#progress');
const progress = document.querySelector('#progress').indeterminate = true;


const fetchAuth = url => {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            return window.location.href = newURL + '/login.html';
        }
        else {
            return response.json();
        }
    }).catch(err => console.log(err))
}

const fetchQR = url => {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-type": "application/octet-stream"
        }
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

const getQR = async () => {
    url = dominio + 'whatsapp/getqr';
    const qr = await fetchQR(url);
    if (!qr.qrImage || qr.isAuth === true) {
        window.location.href = newURL + '/index.html';
    }
    qrcode.setAttribute('src', qr.qrImage);
}

const isAuth = async () => {
    const url = dominio + 'whatsapp/auth';
    const result = await fetchAuth(url);
    const isActive = result.isAuth;
    if (!isActive || isActive == 'undefined') {
        updateStatus(isActive)
    } else {
        window.location.href = newURL + '/index.html';
    }
}

const updateStatus = (x) => {
    if (!x) {
        setInterval(() => {
            getQR();
            qrcodecontainer.removeAttribute('aria-busy');
            qrcode.style.display = '';
        }, 2000);
    }
}

// const updateProgressBar = (value) => {
//     const currentProgress = progress.value;
//     progress.value =+ 1
//     console.log(currentProgress)
// }

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    qrcodecontainer.setAttribute('aria-busy', true);
    isAuth();
    // setTimeout(() => {
    //     updateProgressBar();
        
    // }, 6000);
})