---
layout: post
title: "Patrón Módulo en JavaScript (Module Pattern)"
date: 2014-09-12 12:27
comments: true
categories: [Javascript, Patrones de Diseño]
author: Isaac Zepeda
---

<img src="{{ root_url }}/images/posts/legoblocks.jpg" class="left-thumb">

Los módulos son muy importantes ya que nos permiten mantener nuestro código encapsulado, sin contaminar el ```scope``` global y evitar colisión de nombres. Además nos ayudan a mantener en el proyecto unidades de código separadas y organizadas.

El *Module Pattern* es considerado un Patrón de Diseño y en JavaScript nos ofrece la posibilidad de simular propiedades y métodos privados. Digo "simular" porque las variables y funciones en JavaScript no tienen modificadores de acceso, pero a través de los *closures* podemos simular este comportamiento.

<!-- more -->

El *Module Pattern* se implementa creando una función anónima que se auto-invoca y regresa un objeto literal.

``` javascript
var myModule = (function () {
  var counter = 0;

  return {
    incrementCounter: function () {
      return counter++;
    },

    resetCounter: function () {
      console.log('Valor de counter antes de reset: ' + counter);
      counter = 0;
    }
  }
})();

// Uso:
myModule.incrementCounter();
myModule.incrementCounter();
myModule.resetCounter(); // Imprime 2
```

De esta forma al tener una función anónima creamos un ```scope``` dentro de la función, evitando así contaminar el ámbito global. Regresamos un objeto literal que contiene dos métodos, ambos métodos pueden acceder a la variable ```counter``` ya que se ha creado un ```closure```. Así podemos simular propiedades privadas.

Entonces básicamente el *Module Pattern* se define de la siguiente forma.

``` javascript
var myModule = (function () {
  var privateProperty = 10;

  var privateMethodOne = function () {
    // Algo
  };

  var privateMethodTwo = function () {
    // Algo
  };

  return {
    publicProperty: "foo",
    publicMethodOne: function () {
      //...
    },
    publicMethodTwo: function () {
      // Invocar método privado
      privateMethodOne();
    },
    publicMethodThree: privateMethodTwo //Alias de privateMethodTwo
  }
})();
```

## Revealing Module Pattern (Patrón Módulo Revelado)

El *Revealing Module Pattern* es una variante del *Module Pattern* en el cual definimos nuestras propiedades públicas y privadas dentro la función anónima y en el ```return``` apuntamos a las funciones que deseamos exponer. Así tenemos un buen manejo de código, mas limpio y entendible.

``` javascript
var Counter = (function () {
  var counter = 0;

  var privateMethod = function () {
    // Algo privado
  };

  var incrementCounter = function () {
    return counter++
  };

  var resetCounter = function () {
    console.log('Valor de counter antes de reset: ' + counter);
    counter = 0;
  };

  return {
    increment: incrementCounter,
    reset: resetCounter
  }
})();
```

Podemos ver claramente cuales métodos son los expuestos por el módulo.

Otra de las razones de este patrón es que en el *Module Pattern* cuando necesitas invocar un miembro público se hace necesario usar el ```this```, y hay quienes consideran esto confuso y menos consistente.

``` javascript Module Pattern, usando this
var Module = (function () {
  return {
    methodOne: function () {
      // Something
    },
    methodTwo: function () {
      // Invocar al método público methodOne
      this.methodOne();
    }
  };
});
```

En el *Revealing Module Pattern* ya no se hace necesario el ```this```.

``` javascript Revealing Module Pattern, no usa this
var Module = (function () {
  var methodOne = function () {
    // Something
  };

  var methodTwo = function () {
    // Invocar al método público methodOne
    methodOne();
  };

  return {
    methodOne: methodOne,
    methodTwo: methodTwo
  };
});
```

## Convención para métodos privados

Puede llegar el momento que nuestro módulo crezca demasiado (regularmente sucede) y se hace un poco tedioso tratar de ver cuales métodos y propiedades son públicos y cuales privados. Por esta razón muchos siguen una convención de usar el prefijo ```_``` en el nombre del miembro cuando se trata de un miembro privado.

``` javascript Convención para miembros privados
var myModule = (function () {
  var _privateProperty = 10;

  var _privateMethodOne = function () {
    // Algo
  };

  var _privateMethodTwo = function () {
    // Algo
    _privateMethodOne();
  };

  var publicMethodOne = function () {
    //...
  };

  var publicMethodTwo = function () {
    // ...
  };

  return {
    publicProperty: "foo",
    publicMethodOne: publicMethodOne,
    publicMethodTwo: publicMethodTwo,
    publicMethodThree: _privateMethodTwo //Alias de _privateMethodTwo
  }
})();
```

## Conclusión

Las principales ventajas de usar el *Module Pattern* son la encapsulación y limpieza de tu código. Además de tener miembros privados.

El *Revealing Module Pattern* nos permite ser mas consistentes en nuestros scripts.

Sin embargo hay algunas desventajas:

* Los miembros públicos y privados se acceden de forma distinta y si queremos cambiar la visibilidad en algún momento tendríamos que hacer cambios en cada parte que se usa ese miembro (solo aplica al *Module Pattern*).
* No podemos acceder a los métodos privados desde métodos definidos en el módulo después de su creación.
* No se pueden realizar pruebas de unidad sobre los métodos privados.
* Su extensión es complicada.

## Lectura recomendada

* [Mastering the Module Pattern](http://toddmotto.com/mastering-the-module-pattern/) by [Todd Motto](https://twitter.com/toddmotto)
* [Learning JavaSctipt Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) by [Addy Osmani](https://twitter.com/addyosmani)
* [JavaScript Module Pattern: In-Depth](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) by [Ben Cherry](https://twitter.com/bcherry)
