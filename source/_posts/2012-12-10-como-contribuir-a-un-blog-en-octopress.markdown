---
layout: post
title: "Como contribuir a un blog en octopress"
date: 2012-12-10 18:24
comments: true
categories: [octopress]
author: "Alberto Avila"
---

[Octropress](http://octopress.org/) es un framework para [Jekyll](http://github.com/mojombo/jekyll), que permite generar tu blog y entre otras gracias está preparado para publicarlo fácilmente en [GitHub Pages](http://pages.github.com).

Este sitio esta hecho en Octopress, por lo que después de leer esta guía introductoria, y tomando de base [el ultimo post](/blog/2012/12/06/como-contribuir-a-un-proyecto-en-github/), estarías ya listo para contribuir tu contenido a hardcoders.

<!-- more --> 

Requisitos
----------

¿Que necesitas para iniciar?, principalmente [ruby](http://www.ruby-lang.org/), que para estas alturas ya es casi seguro que lo tengas en tu equipo, ¿o no?.

Adicionalmente requieres de [git](http://git-scm.com/), no es estrictamente necesario pero sin el no hay manera que contribuyas de vuelta los cambios, a menos que tu fetiche sea enviar patchfiles por correo.

Por ultimo, requieres tener a la mano una guía de [markdown](http://daringfireball.net/projects/markdown/syntax) para resolver cualquier duda al momento de que estés formateando tu post.


fork y clone
-------

Primero requieres tener una copia del repositorio del blog, tomaremos como ejemplo el [repositorio de este mismo blog](https://github.com/hardcodersmx/hardcodersmx.github.com).

El primer paso es clonar el repositorio en github para tener una copia que puedas modificar, para luego hacer un clone en tu equipo.

```bash Crea un clone de el repositorio 
# No olvides cambiar albertein por tu nombre de usuario de github
git clone git@github.com:albertein/hardcodersmx.github.com
```

source y master
---------------

Octopress maneja todo usando dos ramas principales, una de ellas es `master`, la cual contiene el   sitio ya generado. Debido a que ustedes no harán un deploy al sitio al menos que estén manejando su propio blog, esto lo ignoraremos en este articulo.

La rama que nos interesa es `source`, en ella se tiene la plataforma de octopress así como el fuente de los posts y paginas. En esta rama es donde necesitas crear tus posts, por lo que hay que asegurarse que te encuentres en esa rama.

```bash Cambiar a source
git checkout source
```


Feature branch
--------------

Es una buena practica crear tu post en una rama especifica para eso, en hardcoders recomendamos que el nombre de la ralla se componga de una descripción corta del articulo cambiando espacios por underscores y agregando el prefijo _post, ej: `post_contribuir_blog_octopress.

```bash Crea tu feature branch
# Recuerda asegurarte que te encuentres en la rama source antes de esto
git checkout -b post_contibuir_blog_octropess
```

Crear post
----------

Para crear un post vamos a hacer uso de unas rake tasks que Octopress ah puesto a nuestra disposición, para iniciar basta con ejecutar la tarea `rake new_post` y enviar el titulo del post como parámetro, ej:

```bash No olvides poner el titulo de tu post
rake new_post["Como contribuir a un blog en octopress"]
```

Esto les generara un archivo markdown en el path `source/_posts/`, el nombre del archivo es el titulo en formato url friendly con el timestamp de prefijo, este es el archivo que tenemos que editar para crear el post.


Editar contenido
----------------

Una vez creado tenemos que editar el archivo generado para poder poner el contenido de nuestro post. Hay un par de cosas que se tienen que hacer antes de incluir el contenido del articulo.

1. Indicar el autor, ej: `author: "Alberto Avila"`
2. Incluir las categorías, ej: `categories: [git, octopress]`

Ya solo queda crear el contenido del articulo, solo recuerden incluir el snippet `<!-- more -->` para indicar el fin de la introducción que se muestra en la pagina principal, y continuar con el resto del articulo.

Formato
-------

Los post están formateados usando Markdown, adicionalmente pueden leer [como compartir code snippets](http://octopress.org/docs/blogging/code/).

Preview
-------

Mientras se trabaja con el formato de la entrada es muy posible que se desea pre-visualizar el resultado de el avance hasta el momento, para hacer esto vasta con tener corriendo siempre una tarea.

```bash Pre-visualizar tus avances.
rake preview
```

Esto tarea mantiene vigilado el sistema de archivos, y genera automáticamente el sitio cada que detecta un cambio, además, corre un servidor web en el puerto 4000, por lo que para pre-visualizar el sitio basta con dirigirte a http://localhost:4000 en tu browser.

Publicar
--------

Una vez conforme con el resultado solo hace falta compartir los cambios para que pueda ser publicado.

```bash Publicando tus cambios
# Primero ocupamos agregar al stage nuestro post y hacerle commit
# Recuerda usar un commit message apropiado
git add source/_posts/12-12-10-como-contribuir-a-un-blog-en-octopress.markdown
git commit -m 'Added "como contribuir a un blog en octropress" post'

# Ahora necesitamos actualizar nuestro fork en github para hacer públicos tus cambios.
# Recuerda usar el nombre de tu rama

git push origin post_contibuir_blog_octropess

```

Ahora puedes ir a github, buscar tu fork, ir a la vista de la rama que estas usando y solicitar el pull request.


Aclaración
----------

Si el interés radica en colaborar con nosotros y todo esto se te hace demasiado laborioso siempre puedes enviarnos un correo con tu entrada en texto llano o (preferentemente) Markdown, y nosotros lo publicamos atribuyéndote el crédito. :)

