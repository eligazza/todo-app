window.addEventListener('load', function () {
    
    //^ VARIABLES GLOBALES 
    
    const inputNombre = document.querySelector('#inputNombre');
    const inputApellido = document.querySelector('#inputApellido');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const inputPasswordRepetida = document.querySelector('#inputPasswordRepetida');
    const errores = document.querySelector('#errores');
    const formulario = document.querySelector('form');
    const botonCrearCuenta = document.querySelector('form button');

    //^ VALIDACION DEL LADO DEL CLIENTE
    
    validarRecuadro(inputNombre, validarTexto, "El nombre solo debe contener letras");
    validarRecuadro(inputApellido, validarTexto, "El apellido solo debe contener letras");
    validarRecuadro(inputEmail, validarEmail, "Escriba un formato de email válido");
    validarRecuadro(inputPassword, validarContrasenia, "Debe ser una combinación de mayúsculas, minúsculas y números");
    // la logica de la validación del ultimo recuadro es distinta
    // agrego la habilitacion del botón en este mismo paso
    inputPasswordRepetida.addEventListener('change', () => {
        const resultado = compararContrasenias(inputPassword.value, inputPasswordRepetida.value);
        resultado ? marcarVerde(inputPasswordRepetida) : marcarRojo(inputPasswordRepetida);
        resultado ? errores.innerText = '' : errores.innerText = "Las contraseñas no coinciden";
    })    
    inputPasswordRepetida.addEventListener('keyup', () => {
        (inputPasswordRepetida.value.length <= 3) ? botonCrearCuenta.setAttribute('disabled', 'true') : botonCrearCuenta.removeAttribute('disabled');
        }
    )    

    //^ ENVIO DE INFORMACION PARA REGISTRO
    formulario.addEventListener('submit', event => {
        event.preventDefault(); // si no hago esto, se envía todo a ningun lado sin hacer comprobaciones ni preparar el pedido a la API como dice el código
        realizarRegistro(); // hago el registro
    })
    
    //& FUNCIONES AUXILIARES

    function realizarRegistro() {
        
        const objeto = { 
            firstName: inputNombre.value,
            lastName: inputApellido.value,
            email: inputEmail.value,
            password: inputPassword.value
        }
        console.log("Objeto preparado...");
        
        const carga = {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify(objeto)
        }
        console.log("La carga fue preparada correctamente...");
        
        fetch(`${url}users`, carga)

            .then(res => {
                if (!res.ok) {
                    console.log("Algo anduvo mal, reintente por favor")
                    location.reload();
                }
                return res.json()
            })

            .then(data => {
                console.log("Información enviada correctamente:");
                // guardamos el token en el local Storage
                localStorage.setItem('token', JSON.stringify(data.jwt));
                formulario.reset(); // borro el formulario
                location.replace('./index.html'); // redirijo al login
            })

            .catch(error => alert(error))
    }

})