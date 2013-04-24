---
layout: post
title: "Chat básico con Socket.io"
date: 2012-12-11 16:52
comments: true
categories: [node.js, socket.io, javascript]
author: "Isaac Zepeda"
---

[Socket.io](http://socket.io) es una librería para manejar websockets a través de [Node.js](http://nodejs.org). Esto nos permite usar websockets en cualquier navegador con una sola librería.

Los websockets son una comunicación duplex, esto es enviar y recibir información al servidor al mismo tiempo.

*Actualización: Demo agregado*

Flujo del chat
--------------

Básicamente el flujo del chat será el siguiente:

* Al abrir el cliente nos lanzará un prompt pidiendonos un nick.
* El servidor contendrá un arreglo con los nicks en línea. 
* Cuando un user se conecte el servidor agregará el nuevo nick al arreglo y emitirá la lista de los nicks al cliente.
* Cuando un user se desconecte removerá el nick de la lista y emitirá la lista de los nicks al cliente.
* Cuando el cliente reciba una lista de nicks borrará la lista actual y imprirá los nuevos nicks.
* Escribiremos un mensaje y se lo enviaremos al servidor (node.js).
* Luego el servidor enviará el mensaje a todos los sockets que esten conectados, incluyendo al que emitió el mensaje.
* El cliente al recibir un mensaje lo pondrá en la lista de mensajes.

<!-- more -->

Requisitos
----------

Instalar [Node.js](http://nodejs.org), en GNU/Linux [recomiendo usar alguna de estas formas](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) y en Mac o Windows lo mejor sería [descargar el instalable](http://nodejs.org/download/).

Instalar [Socket.io](http://socket.io), si instalaron el npm (Node Packaged Modules) lo pueden instalar con un simple comando:

```bash Instalar socket.io
# Ejecutar comando en la carpeta que tendrá el archivo js del servidor (node.js)
npm install socket.io
```

Descargar [jQuery](http://jquery.com/), este nos facilitará la vida.

A codear!
---------

Un chat es una aplicación cliente-servidor. Nuestro **cliente** corre en un navegador y estará conformado por un archivo HTML (presentación de la información), un css (estilos) y Javascript (que controla la comunicación con el servidor y todo el dinamismo). El **servidor** estará conformado por un archivo javascript que ejecutaremos con node.js.

Primero creamos un html que será parte del cliente.

```html index.html
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/chat.css" />
</head>
<body>

	<div id="container">
		<section id="messages-container">
			<div id="messages"></div>
		</section>
		<section id="users"></section>
		
		<div class="clear"></div>

		<section id="msg-input">
			<input name="message" size="50" type="text" placeholder="Mensaje..." />
		</section>
	</div>

	<script type="text/javascript" src="http://localhost:8080/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
	<script type="text/javascript" src="js/chat.js"></script>
</body>
</html>
```

En línea 21 estamos agregando el javascript de socket.io, esto funcionará solo si tenemos corriendo nuestro archivo node.js en el servidor (un poco de esto más adelante).

Ahora el CSS

```css css/chat.css
#container {
	margin: 10px 0px 0px 10px;
	padding: 10px;
}

#messages-container {
	float: left;
	border: 1px solid #CCCCCC;
	width: 800px;
	height: 300px;
	overflow: auto;
}

#users {
	float: left;
	margin-left: 10px;
	border: 1px solid #CCC;
	overflow: auto;
	height: 300px;
	width: 200px;
}

.clear {
	clear: both;
}

#msg-input {
	margin-top: 20px;
}

#msg-input input {
	width: 800px;
	height: 30px;
}
```

Javascript en el servidor
-------------------------

Ahora creamos un archivo javascript que será el que corra en el lado del servidor. Básicamente lo que se hace aquí es recibir mensajes del cliente y emitir mensajes al cliente o clientes que estan conectados.

Cuando emitimos un mensaje a los clientes le decimos el nombre del mensaje seguido por las variables que queremos emitir al servidor.

Node.js está basado en eventos por lo tanto para recibir mensajes, registramos dicho mensaje y pasamos una función como callback que se ejecutará cuando dicho mensaje sea recibido y donde cada parámetro del callback será una variable emitida por la otra parte.

Piece of cake!

```javascript chat-server.js
// Este archivo, por simplicidad, debe de estar en 
// la misma carpeta donde instalaste socket.io

// Importamos socket.io y asignamos el puerto por donde recibirá la conexión
var io = require("socket.io").listen(8080);
var nicks = [];

// Cuando alguien se conecte
io.sockets.on("connection", function(socket) {

	// Cuando el cliente emita el mensaje nick
	socket.on("nick", function(nick) {
		nicks.push(nick); // Guardamos el nick
		io.sockets.emit("nicks", nicks); // Emitimos al cliente todos los nicks

		// Cuando el cliente ya haya enviando su nick
		// y emita un mensaje
		socket.on("msg", function(msg) {
			// Emitimos el nick y el mensaje a todos los sockets conectados (clientes).
			// Podemos usar la variable nick gracias a que sucede un closure :)
			io.sockets.emit("msg", nick, msg);
		});

		// Cuando alguien se desconecte
		// eliminamos el nick del arreglo
		// y emitimos de nuevo todos los nicks
		socket.on("disconnect", function() {
			nicks.splice(nicks.indexOf(nick), 1);
			io.sockets.emit("nicks", nicks);
		});
	});
});
```

Con esto ya queda listo el javascript del lado del servidor, ahora tenemos que levantar el servidor:

```bash Levantar el servidor de node.js
nodejs chat-server.js
```

Para terminar el proceso presionamos CTRL+C. Recuerda que cada vez que modifiques el chat-server.js hay que terminar el servidor y volverlo a levantar.

Javascript en el cliente
------------------------

Al igual que el javascript del servidor, el cliente recibe y emite mensajes, además de que manipula el DOM, usando jQuery.

```javascript js/chat.js
$(function() {
	// Nos conectamos al server, esto emite un
	// mensaje de "connection"
	var socket = io.connect("http://localhost:8080");

	// Cuando la conección es exitosa le preguntamos al user
	// su nick mediante un prompt y lo emitimos al servidor
	socket.on("connect", function() {
		socket.emit("nick", prompt("Nick?"));
	});

	$('#msg-input input').keypress(function(e) {
		if (e.which == 13) {
			// Cuando se presiona enter en el input
			// emitimos el contenido de dicho input
			socket.emit("msg", $(this).val());
			$(this).val('');
		}
	});

	// Cuando el cliente recibe un mensaje, creamos un div
	// Ponemos el nick y el mensaje dentro y lo agregamos
	// a la lista de mensajes
	socket.on("msg", function(nick, msg) {
		$(document.createElement("div"))
		.html("<strong>" + nick + ": </strong>" + msg)
		.appendTo("#messages");

		// Esto nos permite mantener visible el último mensaje
		$('#messages-container').scrollTop($('#messages').height());
	});

	// Cuando el cliente recibe una lista de nicks
	socket.on("nicks", function(nicks) {
		$("#users").html('');
		for (var i = 0; i < nicks.length; i++) {
			$(document.createElement("li")).text(nicks[i]).appendTo("#users");
		}
	});

});
```

Una pequeña explicación. En la línea 21 estamos escuchando el mensaje "msg" y cuando el servidor lo emita se ejecutala funcion que esta como segundo parámetro y esta recibe dos parámetros, si recordamos el código chat-server.js en la línea 21:

```javascript
...
io.sockets.emit("msg", nick, msg);
...
```

Estamos emitiendo el mensaje "msg" a todos los sockets conectados con el método emit que, en este caso, recibe 3 parámetros: el primero el nombre del mensaje y luego el nick y el msg. Como se puede ver el envio y recepción de variables entre servidor y cliente es muy transparente.

Demo
-----

Después de un rato de moverle a un par de proveedores de hosting para node.js termine usando [dotcloud](http://dotcloud.com) y ya quedó el demo tan solicitado :).

[http://soygeek.com.mx/demos/chat](http://soygeek.com.mx/demos/chat)

Si no haya nadie conectado con quien probar lo que pueden hacer es abrir el demo en dos pestañas de su navegador poner nicks diferentes y empezar a testear :).

Fin
----

Esta fue una versión simple de un chat web. Obviamente podemos hacer más cosas como guardar las conversaciones, hacer login, seleccionar avatar, pero se los dejo a su imaginación.

No olviden dejar sus comentarios, dudas y así. A hardcodear!!
