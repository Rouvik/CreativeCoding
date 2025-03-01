class PseudoRandom {
    static DEFAULT_RANDOM_MAX = 4294967296;
    static DEFAULT_MULTIPLIER = 123456785;

    constructor(seed  = 1, randomMax = PseudoRandom.DEFAULT_RANDOM_MAX, a = PseudoRandom.DEFAULT_MULTIPLIER) {
        this.seed = seed;
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