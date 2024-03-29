// DIMENSIONS
// ================================================================================================
// [rows, columns]
export type Dimensions = [number, number];

export function isScalar(dim: Dimensions) {
    return (dim[0] === 0 && dim[1] === 0);
}

export function isVector(dim: Dimensions) {
    return (dim[0] > 0 && dim[1] === 0);
}

export function isMatrix(dim: Dimensions) {
    return (dim[1] > 0);
}

// OTHER
// ================================================================================================
export function isPowerOf2(value: number | bigint): boolean {
    if (typeof value === 'bigint') {
        return (value !== 0n) && (value & (value - 1n)) === 0n;
    }
    else {
        return (value !== 0) && (value & (value - 1)) === 0;
    }
}

export function validateVariableName(variable: string, dimensions: Dimensions) {

    const errorMessage = `Variable name '${variable}' is invalid:`;

    if (isScalar(dimensions)) {
        if (variable != variable.toLowerCase()) {
            throw new Error(`${errorMessage} scalar variable names cannot contain uppercase characters`);
        }
    }
    else if (isVector(dimensions)) {
        if (variable != variable.toUpperCase()) {
            throw new Error(`${errorMessage} vector variable names cannot contain lowercase characters`);
        }
    }
    else {
        if (variable != variable.toUpperCase()) {
            throw new Error(`${errorMessage} matrix variable names cannot contain lowercase characters`);
        }
    }
}