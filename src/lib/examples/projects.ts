export const projects = {
    demo: {
        instrument: "demo",
        envelopes: [
            {
                key: "amp",
                name: "Amp",
                a: 0.01,
                d: 0.15,
                s: 0.5,
                r: 0.3786875
            },
            {
                key: "mod",
                name: "Mod",
                a: 0.23731811523437502,
                d: 0.15,
                s: 0.5,
                r: 0.125
            }
        ],
        params: [
            {
                key: "op1fb",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "op2ratio",
                rangeA: 0.5,
                rangeB: 5
            },
            {
                key: "op2gain",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "op2fb",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "op3ratio",
                rangeA: 0.5,
                rangeB: 11
            },
            {
                key: "op3gain",
                rangeA: 0.25,
                rangeB: 1
            },
            {
                key: "op3fb",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "i",
                rangeA: 0,
                rangeB: 0
            },
            {
                key: "loop",
                rangeA: 1,
                rangeB: 1
            },
            {
                key: "loopsize",
                rangeA: 1,
                rangeB: 1
            },
            {
                key: "rate",
                rangeA: 1,
                rangeB: 1
            },
            {
                key: "begin",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "end",
                rangeA: 1,
                rangeB: 0
            },
            {
                key: "grainrate",
                rangeA: 8,
                rangeB: 16
            },
            {
                key: "grainsize",
                rangeA: 0.1,
                rangeB: 1
            },
            {
                key: "grainpan",
                rangeA: 0,
                rangeB: 1
            },
            {
                key: "cutoff",
                rangeA: 50,
                rangeB: 100
            },
            {
                key: "res",
                rangeA: 0,
                rangeB: 25
            },
            {
                key: "tablesize",
                rangeA: 256,
                rangeB: 256
            },
            {
                key: "rows",
                rangeA: 16,
                rangeB: 16
            },
            {
                key: "xlfo",
                rangeA: 0.02,
                rangeB: 0.3
            },
            {
                key: "ylfo",
                rangeA: 0.2,
                rangeB: 0.03
            },
            {
                key: "semitone",
                rangeA: 0,
                rangeB: 0
            },
            {
                key: "octave",
                rangeA: 0,
                rangeB: 0
            },
            {
                key: "vol",
                rangeA: 0.75,
                rangeB: 0.75
            },
            {
                key: "pan",
                rangeA: 0,
                rangeB: 0
            },
            {
                key: "reverb",
                rangeA: 0,
                rangeB: 100
            },
            {
                key: "rsize",
                rangeA: 50,
                rangeB: 100
            },
            {
                key: "delay",
                rangeA: 0,
                rangeB: 100
            },
            {
                key: "dtime",
                rangeA: 10,
                rangeB: 2000
            },
            {
                key: "dcolour",
                rangeA: 25,
                rangeB: 50
            },
            {
                key: "dfb",
                rangeA: 10,
                rangeB: 50
            },
            {
                key: "chorus",
                rangeA: 0,
                rangeB: 100
            },
            {
                key: "chdepth",
                rangeA: 0,
                rangeB: 100
            },
            {
                key: "dist",
                rangeA: 0,
                rangeB: 10
            },
            {
                key: "crush",
                rangeA: 0,
                rangeB: 100
            },
            {
                key: "hicut",
                rangeA: 0,
                rangeB: 0
            },
            {
                key: "locut",
                rangeA: 0,
                rangeB: 25
            },
            {
                key: "op2ratio",
                rangeA: 0.5,
                rangeB: 20
            },
            {
                key: "op2gain",
                rangeA: 0,
                rangeB: 10
            },
            {
                key: "semitone",
                rangeA: -12,
                rangeB: 12
            },
            {
                key: "pan",
                rangeA: -1,
                rangeB: 1
            },
            {
                key: "reverb",
                rangeA: 0,
                rangeB: 100
            }
        ],
        connections: [
            [
                "op2ratio",
                "z0"
            ],
            [
                "op2gain",
                "y0"
            ],
            [
                "pan",
                "x0"
            ],
            [
                "semitone",
                "y0"
            ],
            [
                "reverb",
                "z0"
            ]
        ],
        midi: {
            0: {
                id: "qubit-0-2",
                label: "Q01 ψ"
            },
            1: {
                id: "qubit-0-1",
                label: "Q01 φ"
            },
            2: {
                id: "qubit-0-0",
                label: "Q01 θ"
            },
            3: {
                id: "qubit-1-2",
                label: "Q11 ψ"
            },
            4: {
                id: "qubit-1-1",
                label: "Q11 φ"
            },
            5: {
                id: "qubit-1-0",
                label: "Q11 θ"
            },
            6: {
                label: "Env2 D",
                id: "env-2-d"
            },
            7: {
                label: "Env2 S",
                id: "env-2-s"
            },
            8: {
                label: "Env2 R",
                id: "env-2-r"
            },
            9: {
                label: "Measure",
                id: "measure"
            },
            10: {
                label: "Drone",
                id: "drone"
            },
            11: {
                label: "Q1 θ",
                id: "qubit-0-2"
            },
            12: {
                label: "Q1 φ",
                id: "qubit-0-1"
            },
            13: {
                label: "Q1 ψ",
                id: "qubit-0-0"
            }
        },
        circuit: {
            numQubits: 1,
            params: [],
            options: {
                params: {},
                hybrid: false,
                hybridOptions: {
                    optimizer: "Powell",
                    tolerance: 0.001,
                    costFunction: {
                        python: "",
                        javascript: ""
                    }
                }
            },
            gates: [
                [
                    {
                        id: "ICFGsqofmG1OIMiAnL",
                        name: "u3",
                        connector: 0,
                        options: {
                            params: {
                                theta: 0,
                                phi: 0,
                                lambda: 0
                            }
                        }
                    }
                ]
            ],
            customGates: {},
            cregs: {}
        },
        numQubits: 1,
        seconds: 5
    }
};