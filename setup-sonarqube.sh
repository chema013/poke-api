#!/bin/bash

# Espera a que SonarQube esté disponible
until $(curl --output /dev/null --silent --head --fail http://localhost:9000); do
    printf '.'
    sleep 10
done

# Cambia la contraseña del usuario admin
curl -u admin:admin \
  -X POST \
  -d "login=admin&password=1234" \
  http://localhost:9000/api/users/change_password

# Genera un nuevo token
curl -u admin:1234 \
  -X POST \
  -d "name=SONAR_TOKEN" \
  http://localhost:9000/api/user_tokens/generate
