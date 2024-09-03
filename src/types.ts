export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface PokemonResult {
  name: string;
  image: string;
  type: string;
}

export interface PokeAPIResponse {
  results: Pokemon[];
  next: string | null;
}
