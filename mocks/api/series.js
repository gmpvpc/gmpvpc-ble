module.exports = {
    path: '/api/series/:id',
    template: () => {
        let randValue = (min, max) => Math.round((Math.random() * (max - min) + min)*100)/100;
        return {
            hits: [
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                },
                {
                    duration: randValue(0.3,0.9),
                    velocity: randValue(0.6,2),
                    accuracy: randValue(0.5,1)
                }
            ],
            ref: {
                name: "a",
                numberOfSequences: 10,
                combinations: [
                    {
                        index: 1,
                        name: "Coup droit",
                        duration: randValue(0.3,0.9),
                        velocity: randValue(0.6,2),
                        accuracy: randValue(0.5,1)
                    }
                ]
            }
        };
    }
};