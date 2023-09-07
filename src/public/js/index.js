const socket = io();
let user; //Va a ser con el que se va a identificar el usuario
let chatBox = document.getElementById('chatBox'); //Referencia al cuadro donde se escribe

Swal.fire({
    title: "Identifícate",
    input: "text", //Indicamos que debe escribir un texto para continuar
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir el nombre de usuario para continuar'
        //Esta validacion se da si el usuario presiona continuar sin haber colocado nada
    },
    allowOutsideClick: false //Impide que salga de la alerta haciendo click fuera
}).then(result=>{
    user=result.value
    //Cuando el usuario se identifica lo asignamos a la variable

    socket.emit('authenticate');

    socket.on('messageLogs', data => {
        let log = document.getElementById('messageLogs');
        let messages = "";
        data.forEach(message=>{
            messages = messages+`${message.user} dice: ${message.message}</br>`
        })
        log.innerHTML = messages;
    });

    socket.on('userConnected', data => {
        // Mostrar una notificación usando Swal toast
        Swal.fire({
            text:"Nuevo usuario conectado",
            toast:true,
            position:"top-right"
        });
    });
});


chatBox.addEventListener('keyup', evt=>{
    if(evt.key==="Enter"){ //Cuando se apriete enter se envia el msj
        if(chatBox.value.trim().length > 0){
            socket.emit("message",{user:user, message:chatBox.value});
            chatBox.value="";
        }
    }
});

socket.on('messageLogs',data=>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message=>{
        messages = messages+`${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML = messages;
})