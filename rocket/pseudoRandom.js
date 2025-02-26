class PseudoRandom {
    static DEFAULT_RANDOM_MAX = 4294967296;
    static DEFAULT_MULTIPLIER = 123456785;

    constructor(randomMax = PseudoRandom.DEFAULT_RANDOM_MAX, a = PseudoRandom.DEFAULT_MULTIPLIER) {
        this.seed = 1;
        this.randomMax = randomMax;
        this.a = a;
        this.c = this.randomMax + 1;
    }

    srand(seed) {
        this.seed = seed;
    }

    rand() {
        this.seed = (this.a * this.seed + this.c) % this.randomMax;
        return this.seed;
    }
}