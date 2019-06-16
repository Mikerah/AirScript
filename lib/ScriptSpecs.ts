// IMPORTS
// ================================================================================================
import { StarkLimits } from '@guildofweavers/air-script';
import { PrimeField } from '@guildofweavers/galois';
import { Dimensions, isPowerOf2 } from './utils';

// CLASS DEFINITION
// ================================================================================================
export class ScriptSpecs {

    field!                  : PrimeField;
    steps!                  : number;
    mutableRegisterCount!   : number;
    readonlyRegisterCount!  : number;
    constraintCount!        : number;
    maxConstraintDegree!    : number;
    globalConstants!        : Map<string, Dimensions>;
    private readonly limits : StarkLimits;

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(limits: StarkLimits) {
        this.limits = limits;
    }

    // PROPERTY SETTERS
    // --------------------------------------------------------------------------------------------
    setField(value: PrimeField) {
        this.field = value;
    }

    setSteps(value: bigint) {
        this.steps = validateSteps(value, this.limits);
    }

    setMutableRegisterCount(value: bigint) {
        this.mutableRegisterCount = validateMutableRegisterCount(value, this.limits);
    }

    setReadonlyRegisterCount(value: bigint) {
        this.readonlyRegisterCount = validateReadonlyRegisterCount(value, this.limits);
    }

    setConstraintCount(value: bigint) {
        this.constraintCount = validateConstraintCount(value, this.limits);
    }

    setMaxConstraintDegree(value: bigint) {
        this.maxConstraintDegree = validateConstraintDegree(value, this.limits);
    }

    setGlobalConstants(value: Map<string, Dimensions>) {
        this.globalConstants = value;
    }
}

// HELPER FUNCTIONS
// ================================================================================================
function validateSteps(steps: number | bigint, limits: StarkLimits): number {
    if (steps > limits.maxSteps) {
        throw new Error(`Number of steps cannot exceed ${limits.maxSteps}`);
    }
    else if (steps < 0) {
        throw new Error('Number of steps must be greater than 0');
    }
    else if (!isPowerOf2(steps)) {
        throw new Error('Number of steps must be a power of 2');
    }
    else if (typeof steps === 'bigint') {
        steps = Number.parseInt(steps as any);
    }

    return steps;
}

function validateMutableRegisterCount(registerCount: number | bigint, limits: StarkLimits): number {
    if (registerCount > limits.maxMutableRegisters) {
        throw new Error(`Number of mutable registers cannot exceed ${limits.maxMutableRegisters}`);
    }
    else if (registerCount < 0) {
        throw new Error('Number of mutable registers must be positive');
    }
    else if (registerCount == 0) {
        throw new Error('You must define at least one mutable register');
    }
    else if (typeof registerCount === 'bigint') {
        registerCount = Number.parseInt(registerCount as any);
    }

    return registerCount;
}

function validateReadonlyRegisterCount(registerCount: number | bigint, limits: StarkLimits): number {
    if (registerCount > limits.maxReadonlyRegisters) {
        throw new Error(`Number of readonly registers cannot exceed ${limits.maxReadonlyRegisters}`);
    }
    else if (registerCount < 0) {
        throw new Error('Number of readonly registers must be positive');
    }
    else if (typeof registerCount === 'bigint') {
        registerCount = Number.parseInt(registerCount as any);
    }

    return registerCount;
}

function validateConstraintCount(constraintCount: number | bigint, limits: StarkLimits): number {
    if (constraintCount > limits.maxConstraintCount) {
        throw new Error(`Number of transition constraints cannot exceed ${limits.maxConstraintCount}`);
    }
    else if (constraintCount < 0) {
        throw new Error('Number of transition constraints must be positive');
    }
    else if (constraintCount == 0) {
        throw new Error('You must define at least one transition constraint');
    }
    else if (typeof constraintCount === 'bigint') {
        constraintCount = Number.parseInt(constraintCount as any);
    }

    return constraintCount;
}

function validateConstraintDegree(constraintDegree: number | bigint, limits: StarkLimits): number {
    if (constraintDegree > limits.maxConstraintDegree) {
        throw new Error(`Degree of transition constraints cannot exceed ${limits.maxConstraintDegree}`);
    }
    else if (constraintDegree < 0) {
        throw new Error('Degree of transition constraints must be positive');
    }
    else if (constraintDegree == 0) {
        throw new Error('Degree of transition constraints cannot be 0');
    }
    else if (typeof constraintDegree === 'bigint') {
        constraintDegree = Number.parseInt(constraintDegree as any);
    }

    return constraintDegree;
}