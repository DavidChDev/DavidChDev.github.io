let sendImage = false;
let base64String = "";
let message = "";
let completeMessage = "";
let monthName = "";
let newURL = window.location.protocol + "//" + window.location.host;
const currentDate = new Date(Date.now());
let dominio = 'https://server-api-production.up.railway.app/';
// let dominio = 'http://localhost:3000/'


const fetchAuth = url => {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            return false;
        }
        else {
            return response.json();
        }
    }).catch(err => console.log(err))
}

const fetchSendMessage = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
        .then(response => { return response.status === 401 ? alert('Sin autorización') : response.json() })
        .catch(err => console.log(err + 'Error'))
}

const fetchLogin = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data),
        credentials: 'include'
    }).then(response => response.json())
        .catch(err => console.log(err + 'Error'))
}

const fetchLogout = url => {
    return fetch(url, {
        method: 'GET',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        credentials: 'include'
    }).then(response => response.json())
        .catch(err => console.log(err + 'Error'))
}

const fetchClients = url => {
    return fetch(url, {
        method: 'GET',
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

const logout = async () => {
    const url = dominio + 'auth/logout';

    const logout = await fetchLogout(url);
    if (logout) {
        localStorage.removeItem('expiresIn')
        window.location.href = newURL + '/login.html'
    }

}

const clientList = async () => {
    const url = dominio + 'client/'

    const list = await fetchClients(url)

    const newList = list.clients.map((currenValue, index, array) => {
        const opcion = document.createElement('option');
        opcion.value = currenValue.cliente
        opcion.innerHTML = currenValue.cliente
        clientSelect.appendChild(opcion)
    });
}

const clientNumbers = async () => {
    const url = dominio + 'whatsapp/contact';

    const numberList = await fetchClients(url)
    // console.log(numberList.allContacts)
    if (numberList.allContacts === false) {
        return console.log('No hay una sesión activa')
    } else {
        const newList = numberList.allContacts.map((currenValue, index, array) => {
            const opcion = document.createElement('option');
            opcion.value = currenValue[1]
            opcion.innerHTML = currenValue[0]
            celphoneSelect.appendChild(opcion)
        });
    }
}

const isAuth = async () => {
    const url = dominio + 'whatsapp/auth';
    const result = await fetchAuth(url);
    const isActive = result.isAuth;
    // console.log(isActive)
    if (!isActive) {
        alert('Por favor inicie sesión en WhatsApp')
        window.location.href = newURL + '/qr.html'
    } else {
        console.log("Sesión activa")
        clientNumbers();
        clientList();
    }
}

const btnsub = document.querySelector('#btnsub');
const btnprev = document.querySelector('#btnprev');
const form = document.querySelector('#form');
const celphoneP = document.querySelector('#celphone option[value="false"]');
const nameP = document.querySelector('#name option[value="false"]');
const celphoneSelect = document.querySelector('#celphone');
const taxContainer = document.querySelector('#taxContainer');
const taxInput = document.querySelector('#tax');
const switchInput = document.querySelector('#switch');
const fileContainer = document.querySelector('#fileContainer');
const radioInput = Array.from(document.getElementsByName("radio"));
const clientSelect = document.querySelector('#name');
const messageTo = document.querySelector('#message')
const receptor = document.querySelector('#receptor')
const emisor = document.querySelector('#emisor')
const month = document.querySelector('#month');
const qrcode = document.querySelector('#qrcode');


month.addEventListener('change', (e) => {
    monthName = month.value
})

radioInput.forEach(element => {
    element.addEventListener('click', (e) => {
        switch (element.value) {
            case 'radio-1':
                taxInput.removeAttribute('disabled');
                if (taxInput.value === '') {
                    alert("Digite un monto de impuesto")
                    element.checked = false
                    return
                }
                if (monthName === '') {
                    alert('Fecha inválida')
                    element.checked = false
                    return
                }
                break;
            case 'radio-2':
                if (monthName === '') {
                    alert('Fecha inválida')
                    element.checked = false
                    return
                }
                taxInput.setAttribute('disabled', 'true')
                break;
            case 'radio-3':
                if (monthName === '') {
                    alert('Fecha inválida')
                    element.checked = false
                    return
                }
                taxInput.setAttribute('disabled', 'true')
                break;
            case 'radio-4':
                if (monthName === '') {
                    alert('Fecha inválida')
                    element.checked = false
                    return
                }
                taxInput.removeAttribute('disabled');
                if (taxInput.value === '') {
                    alert("Digite un monto de impuesto")
                    element.checked = false
                    return
                }
                break;
            default:
                break;
        }
    })
});

switchInput.addEventListener('change', (e) => {
    if (switchInput.checked) {
        fileContainer.style.display = null
        sendImage = true
    } else {
        fileContainer.style.display = 'none';
        sendImage = false
    }
})

taxInput.addEventListener('change', (e) => {
    const newtax = parseInt(taxInput.value)
    tax = newtax.toLocaleString('es-CR');
    taxInput.value = tax.toString();
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dt = currentDate;
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

    const formatCurrentDate = `${padL(dt.getDate())}/${padL(dt.getMonth() + 1)}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`

    const client = clientSelect.value;
    const celphone = celphoneSelect.value;
    const celphoneName = celphoneSelect.options[celphoneSelect.selectedIndex].text;
    btnsub.setAttribute('aria-busy', 'true')
    if (celphone === 'false' || client === 'false') {
        return alert('Datos incompletos')
    }

    radioInput.forEach(element => {
        if (element.checked) {
            switch (element.value) {
                case 'radio-1':
                    taxInput.removeAttribute('disabled');
                    if (taxInput.value === '') {
                        alert('Digite un impuesto')
                        element.checked = false
                        return
                    }
                    if (monthName === '') {
                        alert('Fecha inválida')
                        element.checked = false
                        return
                    }
                    message = `su impuesto correspondiente para el mes de *${monthName}* es de: *${tax}* colones.`
                    break;
                case 'radio-2':
                    if (monthName === '') {
                        alert('Fecha inválida')
                        element.checked = false
                        return
                    }
                    taxInput.setAttribute('disabled', 'true')
                    message = `no tiene pendientes para el mes de *${monthName}*. (Declaración presentada con saldo a favor de periodos anteriores.)`
                    break;
                case 'radio-3':
                    if (monthName === '') {
                        alert('Fecha inválida')
                        element.checked = false
                        return
                    }
                    taxInput.setAttribute('disabled', 'true')
                    message = `no tiene pendientes para el mes de *${monthName}*. (Declaración presentada en 0.)`
                    break;
                case 'radio-4':
                    if (monthName === '') {
                        alert('Fecha inválida')
                        element.checked = false
                        return
                    }
                    taxInput.removeAttribute('disabled');
                    if (taxInput.value === '') {
                        alert('Digite un impuesto')
                        element.checked = false
                        return
                    }
                    message = `su saldo *a favor* correspondiente al mes de *${monthName}* es de: *${tax}* colones.`
                    break;
                default:
                    break;
            }
        } else {

            return
        }
    });

    radioInput.forEach(element => {
        if (element.checked === true) {
            element.checked = false
        }
    });

    completeMessage = '*' + client + '*' + ' ' + message

    const url = dominio + 'whatsapp/sendmessage';
    const data = {
        number: celphone,
        completeMessage,
        sendImage,
        base64String
    }

    //? send copy to David
    const dataCopy = {
        number: '50685042820',
        completeMessage: '*' + client + '*' + ' ' + message + ' ' + 'Enviado a: ' + '*' + celphoneName + '*' + ' el: ' + formatCurrentDate,
        sendImage,
        base64String
    }

    let sendMessage = '';
    let sendCopyMessage = ''

    if (message) {
        sendMessage = await fetchSendMessage(url, data)
        sendCopyMessage = await fetchSendMessage(url, dataCopy)
    } else {
        return alert('Seleccione un tipo mensaje')
    }

    if (!sendMessage) {
        alert('No se pudo establecer conexión con el API');
    }
    if (!sendCopyMessage) {
        alert('No se pudo enviar la copia del mensaje');
    }

    if (sendMessage && sendCopyMessage) {
        alert('Mensaje enviado correctamente');
        btnsub.removeAttribute('aria-busy')
    }
    // btnsub.removeAttribute('aria-busy')
    // taxInput.removeAttribute('disabled')
    radioInput.checked = false
    clientSelect.value = nameP.value
    celphoneSelect.value = celphoneP.value
    taxInput.value = ''
    completeMessage = ''
    messageTo.innerHTML = ''
    emisor.innerHTML = ''
    receptor.innerHTML = ''

})

btnprev.addEventListener('click', (e) => {
    e.preventDefault();
    const celphone = celphoneSelect.value;
    const client = clientSelect.value;
    if (client !== 'false' && celphone !== 'false') {
        radioInput.forEach(element => {
            switch (element.value) {
                case 'radio-1':
                    if (element.checked) {
                        message = `su impuesto correspondiente para el mes de *${monthName}* es de: *${tax}* colones.`
                    }
                    break;
                case 'radio-2':
                    if (element.checked) {
                        message = `no tiene pendientes para el mes de *${monthName}*. (Declaración presentada con saldo a favor de periodos anteriores.)`
                    }
                    break;
                case 'radio-3':
                    if (element.checked) {
                        message = `no tiene pendientes para el mes de *${monthName}*. (Declaración presentada en 0.)`
                    }
                    break;
                case 'radio-4':
                    if (element.checked) {
                        message = `su saldo *a favor* correspondiente al mes de *${monthName}* es de: *${tax}* colones.`
                    }
                    break;
                default:
                    break;
            }
        });
        const receptorName = celphoneSelect.options[celphoneSelect.selectedIndex].text;
        emisor.innerHTML = 'De: <strong>Elmer Chavarría Aguilar</strong>';
        receptor.innerHTML = `Para: <strong>${receptorName}</strong>`;
        completeMessage = '*' + client + '*' + ' ' + message;
        messageTo.innerHTML = completeMessage;
    } else {
        alert('Seleccione todas las opciones requeridas');
    }
})

function imageUploaded() {
    const file = document.querySelector(
        'input[type=file]')['files'][0];

    const reader = new FileReader();

    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");

        imageBase64Stringsep = base64String;

        // alert(imageBase64Stringsep);
        // console.log(base64String);
    }
    reader.readAsDataURL(file);

}

document.addEventListener('DOMContentLoaded', (e) => {
    if (!localStorage.getItem('expiresIn')) {
        window.location.href = newURL + '/login.html';
        return
    } else {
        isAuth();
    }
})
