import axios from "axios";
import { PokeAPIResponse, PokemonResult, PokemonDetails } from "./types";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export const fetchPokemon = async ({
  pageParam = 0,
}): Promise<{
  results: PokemonResult[];
  nextPage: number;
  isLast: boolean;
}> => {
  const response = await axios.get<PokeAPIResponse>(POKE_API_BASE_URL, {
    params: {
      offset: pageParam,
      limit: 10,
    },
  });

  const results: PokemonResult[] = await Promise.all(
    response.data.results.map(async (pokemon) => {
      const details = await axios.get<PokemonDetails>(pokemon.url);
      const data = details.data;
      return {
        name: data.name,
        image: data.sprites.front_default,
        type: data.types.map((typeInfo) => typeInfo.type.name).join(", "),
      };
    })
  );

  return {
    results,
    nextPage: pageParam + 10,
    isLast: !response.data.next,
  };
};
