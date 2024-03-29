"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const chevrotain_1 = require("chevrotain");
const lexer_1 = require("./lexer");
const errors_1 = require("./errors");
// PARSER DEFINITION
// ================================================================================================
class AirParser extends chevrotain_1.CstParser {
    constructor() {
        super(lexer_1.allTokens, { errorMessageProvider: errors_1.parserErrorMessageProvider });
        this.script = this.RULE('script', () => {
            this.CONSUME(lexer_1.Define);
            this.CONSUME(lexer_1.Identifier, { LABEL: 'starkName' });
            this.CONSUME(lexer_1.Over);
            this.SUBRULE(this.fieldDeclaration, { LABEL: 'fieldDeclaration' });
            this.CONSUME(lexer_1.LCurly);
            this.MANY(() => {
                this.OR([
                    { ALT: () => {
                            this.SUBRULE(this.constantDeclaration, { LABEL: 'staticConstants' });
                        } },
                    { ALT: () => {
                            this.CONSUME(lexer_1.Transition);
                            this.SUBRULE2(this.literalExpression, { LABEL: 'mutableRegisterCount' });
                            this.CONSUME1(lexer_1.Registers);
                            this.CONSUME(lexer_1.In);
                            this.SUBRULE3(this.literalExpression, { LABEL: 'steps' });
                            this.CONSUME(lexer_1.Steps);
                            this.SUBRULE(this.transitionFunction, { LABEL: 'transitionFunction' });
                        } },
                    { ALT: () => {
                            this.CONSUME(lexer_1.Enforce);
                            this.SUBRULE4(this.literalExpression, { LABEL: 'constraintCount' });
                            this.CONSUME(lexer_1.Constraints);
                            this.SUBRULE(this.transitionConstraints, { LABEL: 'transitionConstraints' });
                        } },
                    { ALT: () => {
                            this.CONSUME(lexer_1.Using);
                            this.SUBRULE6(this.literalExpression, { LABEL: 'readonlyRegisterCount' });
                            this.CONSUME(lexer_1.Readonly);
                            this.CONSUME2(lexer_1.Registers);
                            this.SUBRULE(this.readonlyRegisters, { LABEL: 'readonlyRegisters' });
                        } }
                ]);
            });
            this.CONSUME(lexer_1.RCurly);
        });
        // FINITE FIELD
        // --------------------------------------------------------------------------------------------
        this.fieldDeclaration = this.RULE('fieldDeclaration', () => {
            this.CONSUME(lexer_1.Prime);
            this.CONSUME(lexer_1.Field);
            this.SUBRULE(this.literalParenExpression, { LABEL: 'modulus' });
        });
        // STATIC CONSTANTS
        // --------------------------------------------------------------------------------------------
        this.constantDeclaration = this.RULE('constantDeclaration', () => {
            this.CONSUME(lexer_1.Identifier, { LABEL: 'constantName' });
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => this.SUBRULE(this.literalAddExpression, { LABEL: 'value' }) },
                { ALT: () => this.SUBRULE(this.literalVector, { LABEL: 'vector' }) },
                { ALT: () => this.SUBRULE(this.literalMatrix, { LABEL: 'matrix' }) }
            ]);
            this.CONSUME(lexer_1.Semicolon);
        });
        this.literalVector = this.RULE('literalVector', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => this.SUBRULE(this.literalExpExpression, { LABEL: 'elements' })
            });
            this.CONSUME(lexer_1.RSquare);
        });
        this.literalMatrix = this.RULE('literalMatrix', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => this.SUBRULE(this.literalMatrixRow, { LABEL: 'rows' })
            });
            this.CONSUME(lexer_1.RSquare);
        });
        this.literalMatrixRow = this.RULE('literalMatrixRow', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => this.SUBRULE(this.literalExpression, { LABEL: 'elements' })
            });
            this.CONSUME(lexer_1.RSquare);
        });
        // READONLY REGISTERS
        // --------------------------------------------------------------------------------------------
        this.readonlyRegisters = this.RULE('readonlyRegisters', () => {
            this.CONSUME(lexer_1.LCurly);
            this.AT_LEAST_ONE(() => {
                this.OR([
                    { ALT: () => {
                            this.SUBRULE(this.staticRegisterDefinition, { LABEL: 'staticRegisters' });
                        } },
                    { ALT: () => {
                            this.SUBRULE(this.secretRegisterDefinition, { LABEL: 'secretRegisters' });
                        } },
                    { ALT: () => {
                            this.SUBRULE(this.publicRegisterDefinition, { LABEL: 'publicRegisters' });
                        } }
                ]);
            });
            this.CONSUME(lexer_1.RCurly);
        });
        this.staticRegisterDefinition = this.RULE('staticRegisterDefinition', () => {
            this.CONSUME1(lexer_1.StaticRegister, { LABEL: 'name' });
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => { this.CONSUME2(lexer_1.Repeat, { LABEL: 'pattern' }); } },
                { ALT: () => { this.CONSUME2(lexer_1.Spread, { LABEL: 'pattern' }); } }
            ]);
            this.OPTION(() => {
                this.CONSUME(lexer_1.Binary, { LABEL: 'binary' });
            });
            this.SUBRULE(this.literalVector, { LABEL: 'values' });
            this.CONSUME(lexer_1.Semicolon);
        });
        this.secretRegisterDefinition = this.RULE('secretRegisterDefinition', () => {
            this.CONSUME1(lexer_1.SecretRegister, { LABEL: 'name' });
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => { this.CONSUME2(lexer_1.Repeat, { LABEL: 'pattern' }); } },
                { ALT: () => { this.CONSUME2(lexer_1.Spread, { LABEL: 'pattern' }); } }
            ]);
            this.OPTION(() => {
                this.CONSUME(lexer_1.Binary, { LABEL: 'binary' });
            });
            this.CONSUME(lexer_1.LSquare);
            this.CONSUME(lexer_1.Ellipsis);
            this.CONSUME(lexer_1.RSquare);
            this.CONSUME(lexer_1.Semicolon);
        });
        this.publicRegisterDefinition = this.RULE('publicRegisterDefinition', () => {
            this.CONSUME1(lexer_1.PublicRegister, { LABEL: 'name' });
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => { this.CONSUME2(lexer_1.Repeat, { LABEL: 'pattern' }); } },
                { ALT: () => { this.CONSUME2(lexer_1.Spread, { LABEL: 'pattern' }); } }
            ]);
            this.OPTION(() => {
                this.CONSUME(lexer_1.Binary, { LABEL: 'binary' });
            });
            this.CONSUME(lexer_1.LSquare);
            this.CONSUME(lexer_1.Ellipsis);
            this.CONSUME(lexer_1.RSquare);
            this.CONSUME(lexer_1.Semicolon);
        });
        // TRANSITION FUNCTION AND CONSTRAINTS
        // --------------------------------------------------------------------------------------------
        this.transitionFunction = this.RULE('transitionFunction', () => {
            this.CONSUME(lexer_1.LCurly);
            this.OR([
                { ALT: () => {
                        this.SUBRULE(this.statementBlock, { LABEL: 'statements' });
                    } },
                { ALT: () => {
                        this.SUBRULE(this.whenStatement, { LABEL: 'statements' });
                    } }
            ]);
            this.CONSUME(lexer_1.RCurly);
        });
        this.transitionConstraints = this.RULE('transitionConstraints', () => {
            this.CONSUME(lexer_1.LCurly);
            this.OR([
                { ALT: () => {
                        this.SUBRULE(this.statementBlock, { LABEL: 'statements' });
                    } },
                { ALT: () => {
                        this.SUBRULE(this.whenStatement, { LABEL: 'statements' });
                    } }
            ]);
            this.CONSUME(lexer_1.RCurly);
        });
        // STATEMENTS
        // --------------------------------------------------------------------------------------------
        this.statementBlock = this.RULE('statementBlock', () => {
            this.MANY(() => {
                this.SUBRULE(this.statement, { LABEL: 'statements' });
            });
            this.SUBRULE(this.outStatement);
        });
        this.statement = this.RULE('statement', () => {
            this.CONSUME(lexer_1.Identifier, { LABEL: 'variableName' });
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => this.SUBRULE(this.expression, { LABEL: 'expression' }) },
                { ALT: () => this.SUBRULE(this.vector, { LABEL: 'expression' }) },
                { ALT: () => this.SUBRULE(this.matrix, { LABEL: 'expression' }) }
            ]);
            this.CONSUME(lexer_1.Semicolon);
        });
        this.outStatement = this.RULE('outStatement', () => {
            this.CONSUME(lexer_1.Out);
            this.CONSUME(lexer_1.Colon);
            this.OR([
                { ALT: () => this.SUBRULE(this.expression, { LABEL: 'expression' }) },
                { ALT: () => this.SUBRULE(this.vector, { LABEL: 'vector' }) }
            ]);
            this.CONSUME(lexer_1.Semicolon);
        });
        // WHEN STATEMENT
        // --------------------------------------------------------------------------------------------
        this.whenStatement = this.RULE('whenStatement', () => {
            this.CONSUME(lexer_1.When);
            this.CONSUME(lexer_1.LParen);
            this.OR1([
                { ALT: () => {
                        this.CONSUME(lexer_1.StaticRegister, { LABEL: 'condition' });
                    } },
                { ALT: () => {
                        this.CONSUME(lexer_1.SecretRegister, { LABEL: 'condition' });
                    } },
                { ALT: () => {
                        this.CONSUME(lexer_1.PublicRegister, { LABEL: 'condition' });
                    } }
            ]);
            this.CONSUME(lexer_1.RParen);
            this.CONSUME1(lexer_1.LCurly);
            this.OR2([
                { ALT: () => {
                        this.SUBRULE1(this.statementBlock, { LABEL: 'tBlock' });
                    } }
            ]);
            this.CONSUME1(lexer_1.RCurly);
            this.CONSUME(lexer_1.Else);
            this.CONSUME2(lexer_1.LCurly);
            this.OR3([
                { ALT: () => {
                        this.SUBRULE2(this.statementBlock, { LABEL: 'fBlock' });
                    } }
            ]);
            this.CONSUME2(lexer_1.RCurly);
        });
        // VECTORS AND MATRIXES
        // --------------------------------------------------------------------------------------------
        this.vector = this.RULE('vector', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => {
                    this.OR([
                        { ALT: () => this.SUBRULE(this.expression, { LABEL: 'elements' }) },
                        { ALT: () => this.SUBRULE(this.vectorDestructuring, { LABEL: 'elements' }) }
                    ]);
                }
            });
            this.CONSUME(lexer_1.RSquare);
        });
        this.vectorDestructuring = this.RULE('vectorDestructuring', () => {
            this.CONSUME(lexer_1.Ellipsis);
            this.CONSUME(lexer_1.Identifier, { LABEL: 'vectorName' });
        });
        this.matrix = this.RULE('matrix', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => this.SUBRULE(this.matrixRow, { LABEL: 'rows' })
            });
            this.CONSUME(lexer_1.RSquare);
        });
        this.matrixRow = this.RULE('matrixRow', () => {
            this.CONSUME(lexer_1.LSquare);
            this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma,
                DEF: () => this.SUBRULE(this.expression, { LABEL: 'elements' })
            });
            this.CONSUME(lexer_1.RSquare);
        });
        // EXPRESSIONS
        // --------------------------------------------------------------------------------------------
        this.expression = this.RULE('expression', () => {
            this.SUBRULE(this.addExpression);
        });
        this.addExpression = this.RULE('addExpression', () => {
            this.SUBRULE(this.mulExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.AddOp);
                this.SUBRULE2(this.mulExpression, { LABEL: 'rhs' });
            });
        });
        this.mulExpression = this.RULE('mulExpression', () => {
            this.SUBRULE(this.expExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.MulOp);
                this.SUBRULE2(this.expExpression, { LABEL: 'rhs' });
            });
        });
        this.expExpression = this.RULE('expExpression', () => {
            this.SUBRULE(this.atomicExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.ExpOp);
                this.SUBRULE2(this.atomicExpression, { LABEL: 'rhs' });
            });
        });
        this.atomicExpression = this.RULE('atomicExpression', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.parenExpression) },
                { ALT: () => this.SUBRULE(this.conditionalExpression) },
                { ALT: () => this.CONSUME(lexer_1.Identifier) },
                { ALT: () => this.CONSUME(lexer_1.MutableRegister) },
                { ALT: () => this.CONSUME(lexer_1.StaticRegister) },
                { ALT: () => this.CONSUME(lexer_1.SecretRegister) },
                { ALT: () => this.CONSUME(lexer_1.PublicRegister) },
                { ALT: () => this.CONSUME(lexer_1.IntegerLiteral) }
            ]);
        });
        this.parenExpression = this.RULE('parenExpression', () => {
            this.CONSUME(lexer_1.LParen);
            this.SUBRULE(this.expression);
            this.CONSUME(lexer_1.RParen);
        });
        this.conditionalExpression = this.RULE('conditionalExpression', () => {
            this.OR([
                { ALT: () => {
                        this.CONSUME(lexer_1.StaticRegister, { LABEL: 'register' });
                    } },
                { ALT: () => {
                        this.CONSUME(lexer_1.SecretRegister, { LABEL: 'register' });
                    } },
                { ALT: () => {
                        this.CONSUME(lexer_1.PublicRegister, { LABEL: 'register' });
                    } }
            ]);
            this.CONSUME(lexer_1.QMark);
            this.SUBRULE1(this.expression, { LABEL: 'tExpression' });
            this.CONSUME(lexer_1.Pipe);
            this.SUBRULE2(this.expression, { LABEL: 'fExpression' });
        });
        // LITERAL EXPRESSIONS
        // --------------------------------------------------------------------------------------------
        this.literalExpression = this.RULE('literalExpression', () => {
            this.SUBRULE(this.literalAddExpression);
        });
        this.literalAddExpression = this.RULE('literalAddExpression', () => {
            this.SUBRULE(this.literalMulExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.AddOp);
                this.SUBRULE2(this.literalMulExpression, { LABEL: 'rhs' });
            });
        });
        this.literalMulExpression = this.RULE('literalMulExpression', () => {
            this.SUBRULE(this.literalExpExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.MulOp);
                this.SUBRULE2(this.literalExpExpression, { LABEL: 'rhs' });
            });
        });
        this.literalExpExpression = this.RULE('literalExpExpression', () => {
            this.SUBRULE(this.literalAtomicExpression, { LABEL: 'lhs' });
            this.MANY(() => {
                this.CONSUME(lexer_1.ExpOp);
                this.SUBRULE2(this.literalAtomicExpression, { LABEL: 'rhs' });
            });
        });
        this.literalAtomicExpression = this.RULE('literalAtomicExpression', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.literalParenExpression) },
                { ALT: () => this.CONSUME(lexer_1.IntegerLiteral) },
            ]);
        });
        this.literalParenExpression = this.RULE('literalParenExpression', () => {
            this.CONSUME(lexer_1.LParen);
            this.SUBRULE(this.literalExpression);
            this.CONSUME(lexer_1.RParen);
        });
        this.performSelfAnalysis();
    }
}
// EXPORT PARSER INSTANCE
// ================================================================================================
exports.parser = new AirParser();
//# sourceMappingURL=parser.js.map