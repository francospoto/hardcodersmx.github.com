---
layout: post
title: "nodejs para novatos - parte 1"
date: 2012-12-28 09:39
comments: true
categories: [nodejs, javascript]
author: "Alberto Avila"
---

Como nuestro amigo [Isaac Zepeda](http://soygeek.com.mx) se fue a lo grande con [su anterior post sobe nodejs](/blog/2012/12/11/chat-basico-con-socket-dot-io/), no me queda más que tratar de escribir una pequeña introducción mas tranquila y civil, sin grandes pretensiones, sobre nodejs, para tratar de ayudarlos a entender de que va todo esto.

<!-- more --> 

Introducción
------------

[Node.js](http://nodejs.org) es una plataforma construida sobre la [v8 engine de google](http://code.google.com/p/v8/), el javascript engine libre que le da vida a chrome. Es decir, es un conjunto de librerías montadas sobre la v8 engine que nos permite correr javascript fuera del browser, y enviarlo al lado del servidor.

¿Que tiene de especial esto?, pues que la manera que esta estructurado hace sencillo realizar aplicaciones de red de manera rápida y escalable (O al menos ese es su pitch). Node.js sigue un modelo event-driven non-blocking (más sobre eso mas adelante) el cual se lleva muy bien con javascript y le permite atender una gran cantidad de usuarios sin mayores problemas.

Con esto dicho vamos de lleno a estamparnos con el clásico hello world con un pequeño twist.

```javascript hello-world.js
console.log('hello');
setTimeout(function() {
  console.log('world');
}, 3000);

```

Si tenemos instalado node lo anterior lo podemos correr con ```node hello-world.js```.

Esto nos imprime ```hello``` y tres segundos después imprime ```world```, esto nos muestra un par de cosas, la primera es que tenemos disponible nuestro viejo amigo ```setTimeout```. La segunda y quizás más importante es que una aplicación de node no termina hasta que no se ejecuten todos sus callbacks pendientes.

Hello world web
---------------

Ahora vamos a hacer un pequeño salto quantico a lo siguiente:

```javascript hello-world-http.js
var http = require('http');

var processRequest = function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');  
};

var server = http.createServer(processRequest);
server.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```
Si corremos esto crearemos un pequeño webserver que escucha en la interfaz local en el puerto ```1337```, este webserver responde a toda petición con el texto ```hello world```, si abren su navegador en ```http://localhost:1337``` pueden ver el resultado.

Ahora el análisis, en la primer linea ```var http = require('http');```, importamos [el modulo http](http://nodejs.org/api/http.html) y lo asignamos a la variable ```http```. 

Todas las librerías integradas en nodejs están definidas en módulos, para *importar* estos módulos tenemos que usar la función ```require```, y asignar el resultado de la llamada a una variable la cual quedara enlazada a la definición del modulo y por medio de ella podremos llamar sus distintos métodos. Uno también puede definir sus propios módulos, y puede usar módulos third-party, pero eso esta fuera del alcance de esta entrada.

Entre la linea 3 y 6 definimos una función la cual usaremos para responder las solicitudes http, esta función espera recibir un request http, y tiene como obligación realizar las llamadas necesarias sobre ```response``` para darle respuesta a la solicitud http. Lo único que hace en este ejemplo es escribir el status code ```200 OK```, escribe el header ```Content-Type: 'plain/text'```, escribe ```hello world```en la respuesta y termina la respuesta.

Por si sola esta función no hace nada, tiene que ser llamada en el contexto correcto para que pueda dar respuesta a las peticiones http.

Ahora en la linea 8 ```var server = http.createServer(processRequest);``` llamamos al método [createServer del modulo http](http://nodejs.org/api/http.html#http_http_createserver_requestlistener), y como parámetro enviamos una referencia a la función ```processRequest```recién definida, esta llamada nos regresara un objeto http server la cual estamos asignando a ```server```. Este objeto mandara llamar a la función que indicamos (```processRequest```) por cada petición http que reciba.

Por ultimo, solo hace falta iniciar el servidor, eso lo logramos con la linea 9 donde realizamos ```server.listen(1337, '127.0.0.1');```, aquí solo indicamos a que interfaz de red y puerto enlazaremos nuestro servidor y logramos que empiece a aceptar peticiones http y estas sean procesadas por nuestra función ```processRequest```.

Comúnmente este ejemplo y otros similares los encontramos un poco diferentes, en lugar de definir el método previamente es común verlo inline, como por ejemplo:

```javascript hello-world-http-2.js
var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');  
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

Primordialmente es una cuestión de estilo, recomiendo usar la versión que les sea mas clara.

Servidor de eco.
----------------

Ahora veamos el siguiente ejemplo:

```javascript echo.js
var net = require('net');

net.createServer(function(socket) {
  console.log('Sup buddy');
}).listen(8080);
```

En este ejemplo usamos el [modulo net](http://nodejs.org/api/net.html) el cual nos permite crear clientes y servidores TCP, si se fijan el ejemplo es muy similar, solo que el callback del método ```createServer``` recibe un solo parámetro, socket.

Cada que nuestro server reciba una nueva conexión TCP, invocara nuestro callback y como parámetro nos enviara el objeto socket que nos sirve para comunicarnos con el cliente que recién se conecta, si queremos leer la información que nos envíen, o bien escribir de vuelta lo haremos sobre este objeto.

En ese caso lo único que estamos haciendo es imprimir en la consola, por lo que si lo corremos ```node echo.js```, y posteriormente nos conectamos, con, por ejemplo telnet, recibiremos el mensaje en la consola. ```telnet localhost 8080```.

Vamos a aumentar el ejemplo ahora con la funcionalidad que realmente estamos buscando:

```javascript echo-v2.js
var net = require('net');

net.createServer(function(socket) {
  socket.on('data', function(data) {
    socket.write(data);
  });
}).listen(8080);
```

Dentro del callback de la nueva conexión tenemos ahora la siguiente llamada ```socket.on('data', ...```. Lo que estamos haciendo es suscribirnos al evento ```data``` del socket que recién recibimos. Este evento se lanza cada que recibimos información por parte del socket, y en el callback nos envía como parámetro los datos recibidos ```function(data) { ... ```.

En este callback lo único que hacemos es escribir de vuelta lo que recibimos al socket con ```socket.write(data);```, con lo cual tenemos un servidor de eco en TCP, es decir, todo lo que recibe lo envía de vuelta a el cliente.

Próximas entregas
-----------------

En las próximas entregas seguiremos explorando Node.js e intentare exponer su modelo asíncrono y como nos afecta al hacer nuestras aplicaciones.

Hasta la próxima :)
