class math {
    constructor(number) {
        this.number = number
    }

    isBiggerThan(number) {
        return this.number > number
    }

    isSmallerThan(number) {
        return this.number < number
    }

    isEqualTo(number) {
        return this.number === number
    }

    percentRandom() {
        return (this.number / 100) > Math.random()
    }

    clamp(max, min) {
        return Math.min(Math.max(this.number, min), max)
    }

    parseNumber() {
        return this.number - 0
    }

    parseInt() {
        return parseInt(this.number)
    }
}

module.exports = math