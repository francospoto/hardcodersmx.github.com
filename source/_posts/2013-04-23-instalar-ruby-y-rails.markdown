---
layout: post
title: "Instalar Ruby y Rails"
date: 2013-04-23 10:26
comments: true
categories: Ruby Rails RoR
author: "Marco Medina"
---

<img src="http://1.bp.blogspot.com/-20zATidMWZw/T9MIcbm1SpI/AAAAAAAACmo/pnnZs2Ed3Tg/s1600/rubyrails.jpg)" class="left-thumb">

Antes de comenzar para los usuarios de ***Windows*** mi recomendación es que dejen de usarlo, pero por lo pronto necesitaran [Rails Installer](http://railsinstaller.org/) que ya incluye (Ruby, Rails, SQLite, Etc), *Bajo su propio riesgo*.

Si eres usuario ***Mac (OSX) o Linux*** ya debes de tener instalado Ruby pero es mejor hacerlo de esta manera, lo primero que necesitamos es [RVM](https://rvm.io/) (Ruby Version Manager) la cual que nos permitirá gestionar dentro de un mismo ordenador, varios entornos de intérpretes de Ruby y conjuntos de [gemas](http://rubygems.org/) (las gemas en Ruby podríamos decir que son como los JAR en Java o como los plugins de PHP).

<!-- more -->

```bash Puedes seleccionar la versión de Ruby que deseas instalar en este caso la última estable
$ curl -L https://get.rvm.io | bash -s stable --rails --autolibs=enabled # Or, --ruby=1.9.3
```

```bash Verifica que versión de Ruby tienes instalada
ruby -v
```

Con los pasos anteriores también se instaló la gema de Rails pero solo para estar seguros puedes usar el siguiente comando

```bash Instalar gema de Rails
gem install rails
```

Recomendaciones
------------

Ahora ya tienes listo tu entorno de desarrollo para ***Ruby on Rails*** y puedes tomar en cuenta las siguientes recomendaciones:

- **Editor de texto Fancy**
  - Te recomiendo utilizar [Sublime Text](http://www.sublimetext.com/2) es ligero, sencillo y multiplataforma.
- **MySQL como motor de BD**
  - Por default Rails usa SQLite como motor de BD pero yo te recomiendo usar [MySQL](http://dev.mysql.com/downloads/)
```bash Instalar MySQL
#Si usas Mac (OSx) y Tienes Brew
brew install mysql

#Si usas Ubuntu
apt-get install mysql-server
```
¿Que es Ruby on Rails?
----------

Si no tienes idea de por donde empezar puedes probar con los siguientes links:

  - [Try Ruby](http://tryruby.org) "Ruby desde Cero"
  - [Rails for Zombies](http://railsforzombies.org/) "Ruby desde Cero"

Que comience la magia
---

Ahora puedes empezar a codear tu Idea Millonaria en Rails

```bash Crea un nuevo proyecto en Rails
rails new idea_millonaria #Si quieres usar MySQL como DB, -d mysql
```
