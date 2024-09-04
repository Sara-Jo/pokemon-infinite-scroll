import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemon } from "./api";
import "./App.css";
import React, { useCallback, useEffect, useRef } from "react";
import { PokemonResult } from "./types";

function App() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemon"],
      queryFn: fetchPokemon,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.isLast ? undefined : lastPage.nextPage;
      },
    });

  const observerElem = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  // Intersection Observer 설정 및 해제
  useEffect(() => {
    const currentElem = observerElem.current;
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [observerCallback]);

  return (
    <div className="main">
      <h1 className="title">Pokemon</h1>
      <div className="pokemon-list">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map((pokemon: PokemonResult, index: number) => (
              <div key={index} className="pokemon-card">
                <h3>{pokemon.name}</h3>
                <img src={pokemon.image} alt={pokemon.name} />
                <p>{pokemon.type}</p>
              </div>
            ))}
          </React.Fragment>
        ))}
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
      <div ref={observerElem}></div>
    </div>
  );
}

export default App;
