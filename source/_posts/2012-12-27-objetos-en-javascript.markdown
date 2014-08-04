---
layout: post
title: "Objetos en Javascript"
date: 2012-12-27 19:00
comments: true
categories: [Javascript]
author: Isaac Zepeda
---

En Javascript hay diversas formas de crear objetos, todas son válidas y sirven para cumplir diversos propósitos. Javascript está basado en prototipos y no en clases (como Java o C#). En este tutorial veremos:

* Objetos simples.
* Objetos literales.
* Funciones como constructores.
* Herencia.

<!-- more -->

Objetos Simples
---------------

La forma más simple de crear un objeto es instanciar un objeto de tipo ```Object``` y agregarle las propiedades y métodos dinámicamente:

```javascript Objetos simples
var persona = new Object();
persona.nombre = "Isaac";
persona.edad = 28;
persona.imprimir = function() {
	alert(this.nombre + ' ' + this.edad);
};

persona.imprimir(); // Mostrará un alert "Isaac 28"
```

Cuando agregamos propiedades de forma dinámica, estas solo se agregan al objeto en cuestión y nuevos objetos instanciados no tendrán estas propiedades:

```javascript
var persona = new Object();
persona.nombre = "Isaac";

var persona2 = new Object();

alert(persona.nombre); // Muestra "Isaac"
alert(persona2.nombre); // Muestra "undefined"
```

Objetos Literales
------------------

<del>También podemos crear objetos usando el Javascript Object Notation (JSON).</del>

**Nota Aclaratoria:** usar objetos literales no significa usar JSON, JSON es una notación basada ó influenciada por la sintaxis de los objetos literales de Javascript. Un object literal es una manera de definir un objeto conforme a la sintaxis definida de Javascript. JSON en cambio es un formato de intercambio de información que se codifica con un formato similar al definido para los objetos literales. _(Gracias a Alberto Ávila por esta aclaración en sus comentarios)_

En un objeto literal las propiedades son creadas como lista de pares key/value.

```javascript Objetos literales
var persona = {
	nombre: "Isaac",
	edad: 28,
	imprimir: function() {
		alert(this.nombre + " " + this.edad);
	}
};

persona.nombre = "Isaac Zepeda"; // Puedo modificar sus propiedades
persona.imprimir(); // E invocar sus métodos
```

Funciones como constructores
----------------------------

Como pueden notar cuando construimos objetos simples o literales no hay manera de crear nuevas o varias instancias de estos objetos, digamos que necesito un objeto ```Persona``` y crear varias instancias de el, aquí es donde entran las funciones como constructores:

```javascript Funciones como constructores
function Persona() {
	// Para definir variables de instancia usamos la palabra reservada 'this'
	this.nombre = "Isaac";
	this.edad = 28;

	// Esta es una variable local a la función y no puede ser accedida desde fuera.
	var count;
}

// Para instanciar un nuevo objeto usamos la palabra reservada new
var persona1 = new Persona();
var persona2 = new Persona();
alert(persona1.nombre); // Isaac

persona2.nombre = "Pancho";
alert(persona2.nombre); // Pancho

// undefined, no se puede acceder ya que es una variable local no de instancia
alert(persona1.count);
```

Ahora podemos pasarle valores al constructor para que establezca ```nombre``` y ```edad``` con el valor que nos plazca, y si no están definidos que tome un valor por default usando el operador ```||```.

```javascript Constructor con argumentos
function Persona(nombre, edad) {
	// si nombre es indefinido o nulo tomará el valor "Isaac"
	this.nombre = nombre || "Isaac";
	this.edad = edad || 28;
}

var p1 = new Persona("Alberto", 17);
var p2 = new Persona();
```

### Agregando Métodos

Hay dos maneras de agregar métodos, la primera es agregarlos como cualquier otra propiedad dentro del constructor y la otra definiéndolo es su ```prototype```.

```javascript Defiendo el método dentro del constructor
function Persona() {
	this.nombre = "Isaac";

	this.caminar = function() {
		alert(this.nombre + " está caminando");
	}
}
```

```javascript Definiendo el método es su prototype
function Persona() {
	this.nombre = "Isaac";
}

Persona.prototype.caminar = function() {
	alert(this.nombre + " está caminando");
}
```

Ambos funcionan correctamente, pero hay pequeñas diferencias.

Si se define el método dentro del constructor cada vez que se instancie el objeto creará una propiedad con un objeto de tipo función, así si el objeto ```Persona``` se instancia 3 veces se crearán 3 funciones en memoria que hacen lo mismo. En cambio si lo creamos en el ```prototype``` la función se creará solo una vez, y todas las instancias de ```Persona``` apuntarán a la misma función, usando menos memoria y mejorando un poco el performance.

Sin embargo, cuando creamos un método en el ```prototype```, este no puede acceder a las variables locales del constructor:

```javascript Accediendo a variables locales
function Persona() {
	var count = 1;

	this.caminar = function() {
		alert(count); // Muestra 1;
	}
}

Persona.prototype.correr = function() {
	alert(count); // Dará error ya que count no esta definida
}
```

El ```prototype``` es un objeto que tienen todos los objetos en Javascript, cuando queremos acceder a una propiedad ```Persona.nombre``` Javascript busca la propiedad en el objeto mismo, si no lo encuentra va lo busca al ```prototype```, si no la encuentra busca dentro del ```prototype``` del objeto ```prototype```, esto se conoce como _prototype-chain_ y nos sirve para la herencia.

Herencia
--------

A través del _prototype-chain_ podemos tener herencia en Javascript.

Supongamos que tenemos un tipo padre ```Mamifero``` que tiene el método ```caminar``` y ```ver```. Luego tenemos un hijo ```Humano``` que sobreescribe al método ```caminar``` y agrega un nuevo método ```correr```.

Para heredar ```Humano``` de ```Mamifero```, el objeto ```prototype``` de ```Humano``` debe contener una instancia de su padre, en este caso ```Mamifero```.

```javascript Herencia
// Definimos al padre
function Mamifero() {
	this.extremidades = 4;
}

Mamifero.prototype.ver = function() {
	alert('El mamífero ve.');
}

Mamifero.prototype.caminar = function() {
	alert('El mamífero camina con ' + this.extremidades + ' extremidades.');
}

// Definimos al hijo
function Humano() {
	this.extremidades = 2;
	this.nombre = "Isaac";
}

// Le decimos quien es su padre
Humano.prototype = new Mamifero();

// Reescribimos y agregamos los métodos de Humano
Humano.prototype.caminar = function() {
	alert('El humano camina con ' + this.extremidades + ' extremidades.');
}

Humano.prototype.correr = function() {
	alert('El humano corre');
}

var perro = new Mamifero();
var persona = new Humano();

perro.ver(); // Método definidio en Mamifero
perro.caminar(); // Llama al método en Mamifero

persona.ver(); // Llama al método definido en Mamifero
persona.caminar(); // Llama al método sobreescrito en Humano
persona.correr(); // Llama al método definido en Humano que no existe en Mamifero
```

El objeto ```Humano.prototype``` es un objeto de tipo ```Mamifero``` (línea 21), luego agreamos dinámicamente métodos a ese prototipo (líneas 24, 25). Como ```Mamifero``` es un objeto el también tiene un propiedad ```prototype``` al cual se le defineron 2 métodos (líneas 6, 10).

Entonces, cuando invocamos el método ```persona.caminar()``` Javascript busca en el objeto mismo, no lo encuentra y busca en su prototipo (```Humano.prototype.caminar```), lo encuentra y lo invoca.

Cuando invocamos el método ```persona.ver()``` Javascript busca en el objeto mismo, no lo encuentra, luego busca en su prototipo (```Humano.prototype.ver```), no lo encuentra, y se va en la cadena de prototipos hasta que lo encuentre en este caso ```Humano.prototype.prototype.ver```, ya que ```Humano.prototype.prototype``` apunta a ```Mamifero.prototype```.

Espero que haya quedado claro esto del ```prototype```.

Bibliografía
-------------

Para saber más acerca de los objetos y de la propiedad ```prototype```:

* [How Javascript objects work](http://helephant.com/2008/08/17/how-javascript-objects-work/)
* [Prototypes in JavaScript](http://net.tutsplus.com/tutorials/javascript-ajax/prototypes-in-javascript-what-you-need-to-know/)
* [How does JavaScript .prototype work?](http://stackoverflow.com/questions/572897/how-does-javascript-prototype-work)
* [Prototype or inline, what is the difference?](http://stackoverflow.com/questions/6163186/prototype-or-inline-what-is-the-difference)
* [Prototype chaining, Constructor, Inheritance](http://stackoverflow.com/questions/5529285/prototype-chaining-constructor-inheritance)
* [Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html)

Bienvenidos sean sus comentarios, sugerencias, dudas, etc.
