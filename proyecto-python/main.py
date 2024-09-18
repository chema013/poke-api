import requests
import json
import re

class PokemonClass:
    def __init__(self, base_url="https://pokeapi.co/api/v2/pokemon/"):
        self.base_url = base_url

    def fetch_pokemons(self, limit=10, offset=0):
        url = f"{self.base_url}?limit={limit}&offset={offset}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_pokemon_pagination(self, page, limit=10):
        offset = (page - 1) * limit
        url = f"https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}"
        
        resp = requests.get(url)
        
        if resp.status_code == 200:
            datos = resp.json()
            return datos['results']
        else:
            print(f"Error al obtener datos: {resp.status_code}")
            return []

    def generate_pokemon_list_file(self, data, filename="pokemon_list"):
        fullFilename = filename + '.json'
        pokemon_list = [{"name": item["name"], "url": item["url"]} for item in data["results"]]
        with open(fullFilename, "w") as file:
            json.dump(pokemon_list, file, indent=4)
        print(f"El archivo {fullFilename} se ha generado exitosamente!!!")
    
    def validate_no_ext(self, strIn):
        pattern = r'^[a-zA-Z0-9-_]+$'
        return bool(re.fullmatch(pattern, strIn))
    
    def is_int(self, str):
        try:
            int(str)
            return True
        except ValueError:
            return False

    def show_menu(self):
        print("\n---------------------------------------")
        print("Menú:")
        print("1. Generar JSON con todos los pokemons.")
        print("2. Consultar pokemons con paginacion de 10 registros.")
        print("3. Salir.")

def main():
    pokemonClass = PokemonClass()
    
    while True:
        pokemonClass.show_menu()
        opcion = input("Selecciona la opción: ")
        print("\n---------------------------------------")
        
        if opcion == '1':
            while True:
                fileName = input("Introduce el nombre del archivo JSON que deseas generar: ")
                if(pokemonClass.validate_no_ext(fileName) == False):
                    print("\n!!! El nombre del archivo solo puede llevar números letras y/o guiones.")
                else:
                    break
            data = pokemonClass.fetch_pokemons(limit=2000)
            pokemonClass.generate_pokemon_list_file(data, filename=fileName)
        elif opcion == '2':
            while True:
                page = input("Selecciona la página: ")
                if not pokemonClass.is_int(page):
                    print("\n!!! La página debe ser un número.")
                else:
                    break
            
            data = pokemonClass.get_pokemon_pagination(page=int(page))
            
            formatted_json = json.dumps(data, indent=4, sort_keys=True)
            print("Respuesta: \n")
            print(formatted_json)
        if opcion == '3':
            print("Saliendo del programa.")
            break

if __name__ == "__main__":
    main()
