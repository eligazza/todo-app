window.addEventListener('load', function () {
     
    // en el caso de que exista el token, redirigir a la pagina de tareas
    if(token) {
        location.replace('./mis-tareas.html')
    }

    //^ VARIABLES GLOBALES
    
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const formulario = document.querySelector('form');
    const botonIngresar = document.querySelector('form button');


    //^ COMPROBACIONES DEL LADO DEL CLIENTE

    validarRecuadro(inputEmail, validarEmail, "Ingrese un email válido");
    validarRecuadro(inputPassword, validarContrasenia, "La contraseña incluye al menos una minúscula, una mayúscula y un número");

    // habilitar el boton
    inputPassword.addEventListener('keyup', () => {
        if (validarContrasenia(inputPassword.value)) {
            botonIngresar.removeAttribute('disabled');
        } else if (!validarContrasenia(inputPassword.value)) {
            botonIngresar.setAttribute('disabled', 'true');
        }
    })

    //^ ENVIO DE CREDENCIALES AL SERVIDOR Y ALMACENADO DE TOKEN
    
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();
        realizarLogin();
    })
    
    //& FUNCION AUXILIAR
    
    function realizarLogin() {
    
        const objeto = {
            email: inputEmail.value,
            password: inputPassword.value
        }
        
        const carga = {
            'method': 'POST',
            'headers': {
                'content-type': 'application/json' 
            },
            'body': JSON.stringify(objeto) 
        }

        fetch(`${url}users/login`, carga)
        .then(res => {
            switch (res.status) {
                case 400:
                alert("Contraseña incorrecta, intente de nuevo")
                location.reload();
                  break;
                case 404:
                alert("El usuario no existe")
                location.reload();
                  break;
                case 500:
                alert("Error del servidor")
                location.reload();
                  break;
              }
            return res.json();
        })
        .then(data => {
            // guardamos el token en el local Storage
            localStorage.setItem('token', JSON.stringify(data.jwt));
            formulario.reset();
            location.replace('./mis-tareas.html');
        })
        .catch(error => alert(error))
    }
        
});
