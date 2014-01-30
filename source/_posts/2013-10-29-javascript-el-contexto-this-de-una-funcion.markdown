---
layout: post
title: "JavaScript: El contexto (this) de una función"
date: 2013-10-29 18:18
comments: true
categories: 
author: "Isaac Zepeda"
---

<img src="{{ root_url }}/images/posts/jscode.jpg" class="left-thumb">

El contexto de una función básicamente es el valor del ```this```. Dentro de una función usamos esta palabra reservada para referirnos al objeto en ejecución, tal como se hace en otros lenguajes como Java (o el ```self``` de Ruby).

Sin embargo, el valor del contexto puede ser algo tricky y más cuando se va iniciando en este mundillo de Javascript, ya que puede tener diversos valores. Entonces, ¿Cuál es valor de ```this```? Bueno, depende, depende de como la función es invocada.

<!-- more -->

Cuando una función es invocada recibe dos parámetros implícitos adicionales (además de los parámetros que le pasemos en la invocación): ```this``` y ```arguments```. El valor del ```this``` es determinado por como es invocada la función. 

Existen 4 formas de invocar una función, se conocen como *invocation patterns*: Como método, función, constructor y usando ```apply``` (este último incluye ```call```).

## Como método

Primero definimos un [objeto literal](http://hardcoders.mx/blog/2012/12/27/objetos-en-javascript/).

``` javascript El this en un método
var myObject = {
  value: 0,
  increment: function (inc) {
    this.value += inc;
  } 
};

myObject.increment(1);
console.log(myObject.value); // 2

myObject.increment(5);
console.log(myObject.value); // 7
```

El ```this``` apunta al objeto ```myObject``` pudiendo modificar sus attributos. Esta asignación del ```this``` sucede en la invocación, es como si la función ```increment``` dijera ¿Quién me invocó?, en este caso ```myObject``` por lo tanto el valor de ```this``` es ```myObject```.

## Como función

Cuando una función no es una propiedad de un objeto, entonces es invocada como función: ```sum(3,3)```. Cuando esto pasa el ```this``` dentro de la función toma el valor del objeto global. En caso de un script ejecutándose en el navegador, el ```this``` toma el valor del objeto ```window```.

``` javascript 
function sum(x, y) {
  this.x = x;
  this.y = y;
  return x + y
}

sum(2,1);
console.log(window.x); // 2, el this == window
console.log(window.y); // 1

sum(5, 7);
console.log(window.x); // 5
console.log(window.y); // 7
```

## Como constructor

Si una función es invocada usando ```new``` se crea un objeto que apunta al ```prototype``` de la función, y el ```this``` toma el valor de este nuevo objeto.

```javascript
var Person = function (name) {
  this.name = name;
};

Person.prototype.getName = function () {
  return this.name;
};

var p = new Person('Isaac');
p.getName(); // Isaac, el this == p
```

## Usando apply y call

Aquí es donde viene lo interesante. El ```apply``` y ```call``` hacen lo mismo: Invocar un función con un contexto en específico. Es decir, nosotros el especificamos el valor del ```this```.

Vamos a usar la función ```Person``` definida en la sección anterior:

```javascript Usando el apply
var isaac = new Person('Isaac');
var zepeda = new Person('Zepeda');

isaac.getName(); // Isaac
isaac.getName.apply(zepeda); // 'Zepeda'

// Otra manera
Person.prototype.getName.apply(zepeda); // 'Zepeda'

// Ahora usando call
Person.prototype.getName.call(isaac); // 'Isaac'
```

En la línea 5 invocamos el metodo ```getName``` pero le decimos que el ```this``` será igual al argumento pasado en el ```apply``` o ```call```. 

Ahora la diferencia entre ```apply``` y ```call``` radica en como le pasamos argumentos a la función que estamos invocando. En el ```apply``` los argumentos deben de ir en un ```array```, mientras que en el ```call``` los argumentos se pasan separados por comas.

```javascript
var increment = function (inc) {
  this.value += inc; 
};

var myObject = {
  value: 2
};

// El segundo argumento es un array donde cada elemento corresponde en orden 
// con los argumentos de la función a la que se le hace apply
increment.apply(myObject, [5]); // El this.value == myObject.value
myObject.value; // 7

// En el call los argumentos se pasan separados por coma .call(obj, arg1, arg2, arg3..)
increment.call(myObject, 1);
myObject.value; // 8
```

## Bibliografía

* [JavaScript: The Good Parts](http://www.amazon.com/JavaScript-Good-Parts-ebook/dp/B0026OR2ZY/ref=sr_1_1?ie=UTF8&qid=1391114482&sr=8-1&keywords=javascript+the+good+parts), Douglas Crockford, O'Reilly.
* [Secrets of the JavaScript Ninja](http://www.amazon.com/Secrets-JavaScript-Ninja-John-Resig/dp/193398869X/ref=sr_1_1?ie=UTF8&qid=1391114440&sr=8-1&keywords=secret+javascript+ninja), John Resig y Bear Bibeault.
* [La Internetz](http://google.com)

Saludos!






















