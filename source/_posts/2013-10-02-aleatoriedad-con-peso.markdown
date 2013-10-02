---
layout: post
title: "Aleatoriedad con Peso"
date: 2013-10-02 11:55
comments: true
categories: Lua, Games Development, Matemáticas
author: "Oscar Obeso"
---

En los videojuegos, la probabilidad es una herramienta que nos da el alcance de poder realizar un juego con resultados provenientes de un azar controlado. Cuando se aplican probabilidad y estadísticas en un videojuego, el producto es un agrado consistente que no se nota a simple vista, pero que provoca que un jugador sienta que el juego tiene resultados congruentes, y no es simplemente un resultado azaroso total.

Esto lo tenía muy claro desde siempre. Sólo basta recordar algunos de los viejos clásicos “Tycooneros”, donde siempre existía una probabilidad de que ocurriera cierto evento, y era grato ver que dicha probabilidad seguía las reglas naturales del azar. Cada evento tenía su peso, y cada peso cumplía con su cometido. La probabilidad formaba y forma parte importante de los videojuegos, para darle esa sazón de realidad y coherencia a los resultados de cada acción que realizabas. 

Hoy, después de varios golpes de cabeza y páginas de algunos conceptos básicos de la probabilidad, me construí un algoritmo que, aunque puede no ser la manera más eficiente, resultó ser eficaz al momento de querer obtener un número a base de un conjunto de probabilidades.

Partiendo de un arreglo de probabilidades, puedo lanzar un resultado acorde con las probabilidades especificadas, y así lograr obtener un resultado naturalmente real. Iniciemos con un simple ejemplo:

Se tiene una caja con 10 pelotas, de las cuales 3 son negras, 4 rojas, 1 verde y 2 azules. Por lo tanto la probabilidad de cada una sería la siguiente: 

Negra: 0.3 
Roja: 0.4 
Verde: 0.1
 Azul: 0.2
Iniciemos creando dos arreglos, 1 con el nombre del objeto, y otro con la respectiva probabilidad de cada uno.
<code>
local pelotas = {“Negra”,”Roja”,”Verde”,”Azul”}
local probabilidades = {0.3, 0.4, 0.1, 0.2}
</code>
Ahora, crearemos el método WeightedRandom, el cual te regresará un número del 1 al 4 al azar (siendo que tenemos 4 tipos de pelotas) pero tomará en cuenta el respectivo peso de cada una de ellas al momento de tomar la decisión.
<code>
function WeightedRandom(array)
local rn = 0 //La variable donde se alocará un número aleatorio
local auxarr = {} // Un arreglo auxiliar donde pondremos los valores acumulados
for i=1,table.getn(array) do
if (i > 1) then
auxarr[i] = auxarr[i-1]+array[i] //Vamos acumulando los valores anteriores.
else
auxarr[i] = array[i]
end
end
//Este ciclo nos crea un nuevo arreglo, que es el que nos ayudará a decidir cuál de los //números es el elegido. El arreglo que aquí se forma es el siguiente: //{0.3,0.7,0.9,1}
//Una vez creado nuestro arreglo auxiliar, procedemos a generar un número aleatorio
rn = (math.random(1,1000))/1000 //<-- Aquí generaremos un número entre el 0 y el 1, //subiendo de 0.001++ de esta manera, tendremos mucha más precisión. 
for i=1,table.getn(auxarr) do //Ahora, verificamos en qué sección del arreglo cayó el //número y regresamos el valor una vez lo hayamos encontrado.
if rn <= auxarr[i] then
return i
end
end
end
</code>
Ahora hagamos un par de pruebas, para ver qué tan exacto es nuestro código

<code>
helparr = {}
for i=1,1000000 do //Iteramos 1000000 de veces. La tendencia de la //probabilidad es que, mientras más grande es el número de //intentos, más tiende a su probabilidad cada objeto.
local result = WeightedRandom(probabilidades)
if (helparr[result] == nil) then
helparr[result] = 1
else
helparr[result] = helparr[result]+1
end
end
for i=1,table.getn(helparr) do
print(pelotas[i].. " : "..helparr[i]/1000000)
end
/*
imprime:

Negra : 0.300286
Roja : 0.398842
Verde : 0.099572
Azul : 0.2013
*/
</code>
 Si observan, cada una de las pelotas está muy cerca de su probabilidad, lo que indica que el algoritmo tiene buena precisión.
Ahora, ¿qué pasa cuando los valores que indicamos no logran una sumatoria de 1?
Digamos, yo quiero poner un peso x a cada objeto, más sin embargo, no sé cuántos objetos pueden existir, puede que algunas veces solo se trate con dos objetos, puede que otras con 4, etc. Por lo tanto, no puedo especificarles a cada uno un valor que forme la sumatoria de uno en conjunto con otros, pero sí les puedo dar un peso de importancia. Para este caso, se normalizan los valores, y a partir de esto, se les genera un nuevo valor dependiendo de los demás participantes, de esta manera generando otro número aleatorio con peso. Haciendo el método aún más dinámico.
Veamos un ejemplo de esta situación:
El usuario tiene opción a adquisición de ciertos productos, de los cuales, cada vez que compra uno, este se agrega a su “caja mágica” de donde sacará uno producto al azar cada vez que se active dicha caja. Digamos que entre los productos están una pelota de baloncesto, una pelota de golf, una pelota de futbol  y una pelota de boliche. Digamos que mientras más grande es la pelota, mayor probabilidad tiene de salir pero no están todas en la caja en un principio. Mientras más vaya comprando, más se irán agregando a la caja, estando disponibles como opción al momento de abrir la caja y tomar un objeto al azar. Para ello realizamos lo siguiente:
-Otorgamos un peso a cada objeto, en relación a los demás. Podemos utilizar el mismo método de generar una sumatoria entre todos que de igual a 1, para poder ubicarnos mejor:
Pelota de baloncesto: 0.4
Pelota de Futbol: 0.3
Pelota de Boliche:0.25
Pelota de golf: 0.05
Una vez generados los pesos, hagamos tres pares de arreglos imaginarios: el primer par será la caja teniendo solo la pelota de baloncesto y la pelota de futbol, con sus respectivas probabilidades. El segundo, será la misma caja pero con la pelota de boliche. Y el tercero, será un arreglo con todas las pelotas y todas las probabilidades.
<code>
local pelotas1 = {“Baloncesto”,”Futbol”}
local prob1 = {0.4,0.3}
local pelotas2 = {“Baloncesto”,”Futbol”,”Boliche”}
local prob2 = {0.4,0.3,0.25}
local pelotas 3 = {“Baloncesto”,”Futbol”,”Boliche”,”Golf”}
local prob3 = {0.4,0.3,0.25,0.05}
</code>
Ahora, utilizaremos el mismo método WeightedRandom pero con algunas modificaciones, donde podramos ‘normalizar’ los valores obtenidos, para que estos nos den igual a 1. Lo que haremos será aplicar una simple regla de 3:
<code>
function WeightedRandom(array)

//Normalizando los Valores
local sum = 0 // Variable donde se acumularán la suma de valores.
local rn = 0 //La variable donde guardaremos el número aleatorio 
local auxarr = {} // El arreglo auxiliar
for i=1,table.getn(array) do // Sumamos todos los valores
sum = sum + array[i]
end

//Hacemos lo mismo que en el anterior, solo que ahora dividimos el
//valor del arreglo entre la suma, para que este se normalice. //Pues queremos que la suma de los valores nos de igual a 1.
for i=1,table.getn(array) do
if (i > 1) then
auxarr[i] = auxarr[i-1]+array[i]/sum
else
auxarr[i] = array[i]/sum
end
end

//Realizamos el azar, y voilá, nos regresará el número que toca.

rn = (math.random(1,1000))/1000
for i=1,table.getn(auxarr) do
if rn <= auxarr[i] then
return i
end
end
return table.getn(auxarr) // Este return es un “por si las moscas” //debido a que existe cierta posibilidad de que, por falta de //decimales, la suma total no de a 1 si no a algo como 0.998~ y, //Por lo que, si nos diera un 1, en el random, nunca encontraría  //lugar.
end
</code>

Y con las modificaciones hechas, podemos realizar un par de pruebas:
<code>
helparr1 = {}
helparr2 = {}
helparr3 = {}
for i=1,1000000 do
local result1 = WeightedRandom(prob1)
local result2 = WeightedRandom(prob2)
local result3 = WeightedRandom(prob3)
if (helparr1[result1] == nil) then
helparr1[result1] = 1
else
helparr1[result1] = helparr1[result1]+1
end
if (helparr2[result2] == nil) then
helparr2[result2] = 1
else
helparr2[result2] = helparr2[result2]+1
end
if (helparr3[result3] == nil) then
helparr3[result3] = 1
else
helparr3[result3] = helparr3[result3]+1
end
end

print("-------------Prueba 1---------------")
for i=1,table.getn(helparr1) do
print(pelotas1[i].. " : "..helparr1[i]/1000000)
end
print("-------------------------------------")

print("-------------Prueba 2----------------")
for i=1,table.getn(helparr2) do
print(pelotas2[i].. " : "..helparr2[i]/1000000)
end
print("-------------------------------------")

print("--------------Prueba 3---------------")
for i=1,table.getn(helparr3) do
print(pelotas3[i].. " : "..helparr3[i]/1000000)
end
print("--------------------------------------")

--[[
Imprime:
-------------Prueba 1---------------
Baloncesto : 0.571195
Futbol : 0.428805
-------------------------------------
-------------Prueba 2----------------
Baloncesto : 0.421145
Futbol : 0.313976
Boliche : 0.264879
-------------------------------------
--------------Prueba 3---------------
Baloncesto : 0.400662
Futbol : 0.299869
Boliche : 0.249288
Golf : 0.050181
--------------------------------------
--]]
</code>
Como ven, este método es más dinámico, pues nos permite meter a la caja el número de objetos que queramos, siempre y cuando estos tengan un peso respectivo y relacionado con los otros objetos, sin necesidad de que éste sume 1.
Y así, es como es posible incluir la probabilidad dentro de un videojuego, ahora solo falta usar tu imaginación para crear las situaciones probables dentro de tu mundo aleatoriamente controlado.