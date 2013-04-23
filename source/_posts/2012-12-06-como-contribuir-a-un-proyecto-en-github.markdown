---
layout: post
title: "Como contribuir a un proyecto en github"
date: 2012-12-06 17:24
comments: true
categories: [git, github]
author: "Alberto Avila"
---

git como herramienta de versionamiento ha ganado mucha popularidad, y con el github como repositorio de código (Algunos podrían incluso decir que la influencia es en sentido contrario). Por lo que no es raro que la mayoria de herramientas y librearías que usas en el día a día estén hospedadas en github, lo que hace realmente valioso que se tenga al menos conocimientos rudimentarios de git, y más aun saber como poder contribuir parches ó cambios a tus proyectos preferidos.

Espero que esta breve guía ayude a familiarizar a los no iniciados en un workflow sencillo que permita colaborar en una gran cantidad de proyectos de software.

<!-- more --> 

Estas trabajando y encontraste un bug en una librería, esta librería está escrita en un lenguaje que conoces y decides aventarte y resolver el problema. 

Tomaremos como base que conoces los comandos básicos de git y que ya tienes tu cuenta creada y configurada en github para poder trabajar, si no es así puedes consultar el libro [Pro Git](http://git-scm.com/book) completamente gratuito.

Creando tu fork
---------------

El primer paso es crear un fork del repositorio al cual quieres colaborar, los manteiners del proyecto no confían en cualquier persona random del internet para que muevan su código, por lo que si quieres hacer tus cambios necesitas primero crear un fork, que no es mas que crear una copia del repositorio en tu cuenta de github local en la cual tu tengas control total. 

Clona tu fork en tu equipo
--------------------------

Supongamos que creaste un fork de [el repositorio de esta web](https://github.com/hardcodersmx/hardcodersmx.github.com), ahora requieres hacer un clone. ej:

``` bash Clonar tu repositorio (reemplaza albertein por tu usuario)
git clone git@github.com:albertein/hardcodersmx.github.com
```

Con esto tendrás una copia local (clone) de tu fork en github, ya estamos casi listos para iniciar a trabajar.

Crea tu feature branch
----------------------

En este momento estas listo para corregir el bug, pero antes de ponerte a tirar código hay algo mas que se tiene que hacer. 

La mayoría de los proyectos, si no es que casi todos, prefieren que todos tus cambios lo hagas en un feature branch, esto es, que crees una nueva rama de desarrollo para que crees tus cambios, esto es útil para aislar tus cambios de todo lo demás, y te puede ser útil si en medio del desarrollo encuentras algún otro bug, en lugar de dejar todo embarrado en la misma rama deberás crear una nueva rama para ese otro feature y así el mantainer del proyecto puede aplicar los cambios individualmente.

Recuerda siempre usar un nombre descriptivo para la rama que vas a crear.

```bash Crea tu feature branch (Dentro de tu proyecto, ¡claro!)
git checkout -b fix_issue_123
```

El comando anterior crea la nueva rama y te cambiá a ella para que puedas trabajar.

¡Realiza tus cambios!
---------------------

¡Ahora si!, realiza todos los cambios que requieras, agrega al stage tus archivos y haz un commit con un mensaje descriptivo.

```bash Ejemplo
#Edita test1.foo
#Edita test2.foo
git add test1.foo test2.foo
git commit -m 'Added two test cases for feature 123'
```

Rebase
------

Este paso puede ser opcional, dependiendo del tiempo que te haya tomado realizar tus cambios y del proyecto al que quieras contribuir.

Durante el tiempo que tomaste en crear tus cambios el desarrollo del proyecto original continuo, por lo que es muy probable que tengas que realizar un rebase o mínimo un merge convencional para que puedan integrar tus cambios.

Para eso primero ocupamos obtener todos los cambios que hayan ocurrido en el repositorio original

```bash Obtener cambios desde mainstream

# Los nuevos cambios los integraremos sobre master 
# y no sobre nuestro feature branch
git checkout master 

# Para obtener los nuevos cambios ocupamos agregar un "remote" para que git
# pueda localizar el repositorio convencional, usualmente al remote que apunta al
# repositorio tradicional se le llama mainstream
git remote add mainstream git@github.com:hardcodersmx/hardodersmx.github.com 

# Posteriormente bajamos todos los cambios, si hiciste caso y no desarrollaste nada 
# sobre master no deberías de tener ningún problema ni conflicto.
git pull mainstream master
```

Ya que contamos todos con todos los nuevos cambios en el repositorio es hora de hacer un rebase, al hacer un rebase aplicamos todos los commits que se encuentren en mainstream (master) y no en nuestra feature branch, para posteriormente aplicar el commit de nuestra rama al ultimo, como si fuera el ultimo cambio que se hubiera realizado. Recomiendo leer [3.6 Git Branching - Rebasing](http://git-scm.com/book/en/Git-Branching-Rebasing) para comprender completamente este paso.

```bash Hacer el rebase
# Primero nos regresamos a nuestro feature branch
git checkout fix_issue_123

#Para hacer el rebase desde master a nuestra rama actual
git rebase master
```

Si llega a ocurrir cualquier conflicto en este punto tenemos que corregirlo y continuar con el proceso.

Subir cambios
-------------
Todo esta listo, el problema es que nadie mas que tu puede ver tus cambios, es hora de subir tus cambios a github.

```bash push a origin
# Necesitamos subir nuestro feature branch a github para que el mundo lo vea
git push origin fix_issue_123
```

Pull request
------------

Ahora tan solo tienes que ir a github, cambiar a tu feature branch y hacer el pull request. Recuerda poner un mensaje entendible y conciso de que se trata. Después de eso tan solo falta darle seguimiento y esperar a que se apruebe.

Aclaración
----------

No todos los proyectos de software se manejan de la misma manera, algunos pueden requerir un rebase mientras otros no, e incluso algunos pueden tener otro mecanismo distinto al pull request, recuerda siempre buscar si el proyecto tiene algún lineamiento para el contribuidor.

¡Happy hacking!


