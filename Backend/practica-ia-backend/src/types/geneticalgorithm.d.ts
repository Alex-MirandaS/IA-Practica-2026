declare module 'geneticalgorithm' {
  export type GeneticAlgorithmConfig<T> = {
    population: T[];
    populationSize?: number;
    mutationFunction: (entity: T) => T;
    crossoverFunction: (mother: T, father: T) => [T, T];
    fitnessFunction: (entity: T) => number;
  };

  export type GeneticAlgorithmInstance<T> = {
    evolve: () => void;
    best: () => T;
  };

  export default function geneticalgorithm<T>(config: GeneticAlgorithmConfig<T>): GeneticAlgorithmInstance<T>;
}
