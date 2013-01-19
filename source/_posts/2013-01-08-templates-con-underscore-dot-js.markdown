---
layout: post
title: "Templates con Underscore.js"
date: 2013-01-08 21:00
comments: true
categories: [Javascript, Underscore.js]
author: Isaac Zepeda
---

En este post veremos como compilar templates del lado de cliente con Javascript y [Underscore.js](http://underscorejs.org/), por que usar templates del lado del cliente, disfrutenlo y dejen sus comentarios.

<!-- more -->

¿Qué es Underscore.js?
----------------------
[Underscore.js](http://underscorejs.org/) es una librería de Javascript que contiene alrededor de 80 funciones que nos hacen la vida en Javascript más sencilla. Tiene funciones como **map**, **each**, entre otras muchas.

Los templates son sólo una parte de todas sus aplicaciones, que veremos a continuación.

¿Para que me sirven templates del lado del cliente?
---------------------------------------------------

Actualmente muchas aplicaciones estan hechas en Javascript que consume una API o un servicio, esta API regresa muchas veces los datos en JSON.

Por ejemplo, tenemos un listado de personas y en nuestro cliente hacemos una llamada AJAX que nos regresa los datos de esas personas en JSON y luego tenemos que desplegar esa información en una tabla. Cuando no usamos Templates lo que tenemos que hacer es recorrer ese arreglo de objetos e ir creando en una cádena el HTML y luego ponerla en el lugar del DOM que queremos, por ejemplo usando jQuery:

```javascript No usando templates
$(document).ready(function() {
	$.get(
		'/url/recurso',
		function(data) {
			// Suponiendo que data tiene id, nombre, edad
			var html = '<table><tr><th>ID</th><th>Nombre</th><th>Edad</th></tr>';
			for (var i = 0; i < data.length; i++) {
				html += '<tr>'
					+ '<td>' + data[i].id + '</td>'
					+ '<td>' + data[i].nombre + '</td>'
					+ '<td>' + data[i].edad + '</td>'
					+ '</tr>';
			}
			html += '</table>';
			$('#contenedor').html(html);
		}	
	);
});
```

Puede haber muchas variantes de lo anterior, pero sería algo similar. Esto podría funcionar por un tiempo, pero cuando la aplicación crezca esto se va a volver tedioso, poco escalable y difícil de mantener. Aquí es donde entran al rescate los templates del lado del cliente.

Usando Templates
-----------------

En Underscore.js la función a usar para generar los templates será ```_.template(templateString, [data], [settings])```. El primer argumento es un string que contiene el html a compilar. El segundo es un objeto javascript con las variables que se usaremos en el template. 

Cuando usamos solo el primer argumento la función nos regresará una función que después ejecutaremos, la cual nos regresará un string con el html compilado.

<iframe style="width: 100%; height: 220px" src="http://jsfiddle.net/keogh/XZQQA/embedded/js,html,result/presentation"></iframe>

Cuando usamos los dos primeros argumentos la función regresará un string con HTML compilado listo para meterlo al DOM.

<iframe style="width: 100%; height: 150px" src="http://jsfiddle.net/keogh/uxyvy/embedded/js,html,result/presentation"></iframe>

Los Tags
--------

Dentro del HTML a compilar queremos imprimir variables y a veces ejecutar código, esto va dentro de unos tags especiales, los cuales pueden cambiarse (más de eso adelante). Underscore.js tiene 3 tags por default, cada uno con diferentes funcionalidades:

* **Evaluate:** ```<% ... %>``` Ejecuta código Javascript.
* **Interpolate:** ```<%= ... %>``` Sirve para imprimir variables. (También podemos imprimir variables usando el *evaluate* y la función ```print``` de Javascript ```<% print(nombre); %>)```.
* **Escape:** ```<%- ... %>``` Sirve para código HTML escapado.

Las Variables
--------------

Las variables se pasan al compilador como un [objeto literal](/blog/2012/12/27/objetos-en-javascript/), ya sea como segundo parámetro de ```_.template``` o como primer parámetro de la función que nos regresa cuando usamos solo el primer parámetro en ```_.template```.

En el template el nombre de la variable sera el *key* de los elementos del objeto literal, y el valor de la variable será el *value* de los elementos del objeto literal.

```javascript Variables en el template
var data = {
	nombre: "Isaac",
	edad: 28
}

// nombre para obtener "Isaac" y edad para obtener "28"
$('#contenido').html( _.template("Hola <%= nombre %> tienes <%= edad %> años", data) );
```

A Seguir Templeteando
----------------------

Cuando el template es más complejo, como el primer ejemplo, escribir el código HTML como string para pasarlo como primer argumento sería poco efectivo. Entonces lo que haremos será tener el código HTML junto con el javascript a compilar dentro de una etiqueta ```<script type="text/template">...</script>```.

Entonces siguiendo esto tendríamos (el template esta en la pestaña HTML):

<iframe style="width: 100%; height: 350px" src="http://jsfiddle.net/keogh/JUvnD/embedded/js,html,result/presentation"></iframe>

En lugar de un ```for``` podríamos usar la función ```each``` de Underscore.js.

<iframe style="width: 100%; height: 350px" src="http://jsfiddle.net/keogh/46haD/embedded/js,html,result/presentation"></iframe>

Tags Personalizados
-------------------

En lugar de usar el *ERB-style* podemos crear nuestros propios tags, ya sea porque nos sentimos más cómodos usando *\{\{ ... \}\}* u otros. Por ejemplo, cuando estás en Ruby on Rails los tags usados son los mismos que usa underscore.js por default ```<% ... %>```, esto traera problemas.

Entonces podemos definir 3 nuevos tags: *\{\{ ... \}\}* para *evaluate*, *\{\{= ... \}\}* para *interpolate*, y *\{\{- ... \}\}* para *escape*.

Esto lo hacemos mandadole un objeto como tercer parámetro a ```_.template``` o definirlo globalmente para todos las compilaciones que haremos en nuestra aplicación con la variable ```_.templateSettings```

```javascript Tags Personalizados
// Usando como tercer parámetro
_.template("Hola {{= nombre }}", {nombre: "Isaac"}, {interpolate: /\{\{\=(.+?)\}\}/g,});

// Definiedolo globalmente
_.templateSettings = {
	interpolate: /\{\{\=(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g,
	escape: /\{\{\-(.+?)\}\}/g
}
```

Fuente: [http://stackoverflow.com/questions/7514922/rails-with-underscore-js-templates](http://stackoverflow.com/questions/7514922/rails-with-underscore-js-templates)

Con esto podemos modificar nuestro ejemplo y cambiar los tags:

<iframe style="width: 100%; height: 350px" src="http://jsfiddle.net/keogh/RxunZ/embedded/js,html,result/presentation"></iframe>

Fin
---

Con esto terminamos el post de templates del lado del cliente usando Underscore.js, si quieres aprender más de Underscore.js y todas sus funciones visita [http://underscorejs.org](http://underscorejs.org).

En entregas posteriores trataré de desentrañar todas las funciones de Underscore.js con ejemplos. No olviden dejar sus comentarios, dudas, etc.

A Codear!!
