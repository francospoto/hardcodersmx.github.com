---
layout: post
title: "Autenticación con token en Ruby on Rails y Devise"
date: 2013-05-12 13:05
comments: true
categories: [Ruby, Rails, RoR, Devise]
author: Miguel Machado
---

Un pequeño y sencillo tutorial para crear una autenticación basada en tokens en Ruby on Rails y [Devise](https://github.com/plataformatec/devise). Para este tutorial se requiere conocimiento básico en Rails y tener Rails y Devise instalado.

<!-- more -->

Este tutorial toma por hecho que ya tienen instalado y funcionando [Devise](https://github.com/plataformatec/devise) en su proyecto. 

1. Editar el archivo de configuración de devise en tu proyecto 

```
/config/initializers/devise.rb
```

Agregamos estas dos líneas que tal vez ya están comentadas 

``` ruby
config.skip_session_storage = [:http_auth, :token_auth]
config.token_authentication_key = :auth_token
```

2. Crear la migración que agregue los campos necesarios para el uso de Token’, en mi caso el modelo que uso para Devise es User y la tabla users.

``` ruby
class AddTokenToUsers < ActiveRecord::Migration
	def self.up
		change_table(:users) do |t|
			# Token authenticatable
			t.string :authentication_token
		end
		
		add_index :users, :authentication_token, :unique => true
	end

	def self.down
		raise ActiveRecord::IrreversibleMigration
	end
end
```


3.- Creamos nuestro controlador para el manejo de Tokens, creamos nuestro controlador desde la consola que en este caso lo llamaremos Tokens 

```
rails generate controller Tokens
```

Una vez creado nos vamos al archivo generado que en mi caso seria ``` app/controllers/tokens_controller.rb ```

y escribimos un código similar a este:

``` ruby tokens_controller.rb
class TokensController < ApplicationController
	
	skip_before_filter :verify_authenticity_token
  respond_to :json
  
  # crear token POST /tokens.json
	def create
		# tomamos las variables del POST
		email = params[:email]
		password = params[:password]

		# aquí mandamos un mensaje por si no nos hacen un post a /tokens sin .json
		if request.format != :json
			render :status=>406, :json=>{:message=>"solo se aceptan peticiones json :("}
			return
		end
	
		# aquí mandamos un mensaje por si no nos mandaron las variables email o password
		if email.nil?  || password.nil?
			render :status=>400,
	    	:json=>{:message=>"Algo anda mal con tu POST :("}
			return
		end
	
		#buscamos el usuario por el email
		@user = User.find_by_email(email.downcase)
	
		#enviamos un mensaje por si no existe el usuario
   	if @user.nil?
      render :status=>401, :json=>{:message=>"tu email o password son incorrectos :("}
     	return
   	end
	
		#generamos el token y lo guardamos
   	@user.ensure_authentication_token!
	
		#validamos el password y si es correcto devolvemos el token :)
   	if @user.valid_password?(password)
   		render :status=>200, :json=>{:token=>@user.authentication_token}
   	else
    	render :status=>401, :json=>{:message=>"tu email o password son incorrectos :("}
   	end
 	end

	# elimar token DELETE /tokens/sznxbcmshad.json
 	def destroy
		# buscamos el usuario por el token
		@user = User.find_by_authentication_token(params[:id])
		
		# si lo encontramos eliminamos el token y si no le mandamos un mensaje
		if @user
			@user.reset_authentication_token!
			render :status=>200, :json=>{:token=>params[:id]}
		else 
			render :status=>404, :json=>{:message=>'token no valido.', :token => params[:id]}
		end
 	end

	# esta función la hicimos solo para obtener los datos del usuario con la sesión abierta
 	def getUser
		# de nuevo si no nos piden un json los mandamos a volar 
		if request.format != :json
			render :status=>406, :json=>{:message=>"solo json :("}
			return
		end

		# aqui les mandamos el json del usuario
		user = current_user
		render :status=>200, :json=>{:user=>user}
  end

end
```

Ya creado nuestro controlador le damos acceso en archivo de rutas de nuestro proyecto.

``` ruby config/routes.rb
resources :tokens,:only => [:create, :destroy] do
	collection do 
		get 'user', :action => 'getUser'
	end
end
```
Con esto ya tenemos habilitado a Devise para que funcione con tokens :)

por ejemplo si quisiéramos enviar un post al un controlador llamado categories la url sería:
``` localhost:3000/categories?auth_token=t0k3n-t0k3n ```

Si quisiéramos iniciar sesión tendríamos que enviar un POST a ```http://localhost:3000/tokens.json``` con el email y el password, esto nos regresara un json con el objeto token, y si quieres obtener los datos del usuario tomamos la variable token y mandamos un GET a ```http://localhost:3000/tokens/user.json?auth_token=t0k3n-t0k3n```

que nos regresara un json con los datos del usuario y para cerrar la sesión solo tendriamos que mandar un DELETE a ```http://localhost:3000/tokens/t0k3n-t0k3n.json``` y listo :).
