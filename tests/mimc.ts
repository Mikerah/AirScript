import { parseScript } from '../index';

const script = `
define MiMC over prime field (2^256 - 351 * 2^32 + 1) {

    // constants used in transition function and constraint computations
    alpha: 3;

    // transition function definition
    transition 1 register in 2^16 steps {
        out: $r0^3 + $k0;
    }

    // transition constraint definition
    enforce 1 constraint {
        out: $n0 - ($r0^3 + $k0);
    }

    // readonly registers accessible in transition function and constraints
    using 1 readonly register {
        $k0: repeat [
            42, 43, 170, 2209, 16426, 78087, 279978, 823517, 2097194, 4782931,
            10000042, 19487209, 35831850, 62748495, 105413546, 170859333
        ];
    }
}`;

const air = parseScript(script);
console.log(`degree: ${air.maxConstraintDegree}`);

const pContext = air.createContext([], []);
const trace = air.generateExecutionTrace([3n], pContext);
const pPoly = air.field.interpolateRoots(pContext.executionDomain, trace[0]);
const pEvaluations = air.field.evalPolyAtRoots(pPoly, pContext.evaluationDomain);

const qEvaluations = air.evaluateExtendedTrace([pEvaluations], pContext);
const vContext = air.createContext([]);

const x = air.field.exp(vContext.rootOfUnity, 2n);
const rValues = [pEvaluations[2]];
const nValues = [pEvaluations[10]];
const qValues = air.evaluateConstraintsAt(x, rValues, nValues, [], vContext);

console.log(qEvaluations[0][2] === qValues[0]);