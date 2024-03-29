"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const chevrotain_1 = require("chevrotain");
const errors_1 = require("./errors");
// LITERALS, REGISTERS, and IDENTIFIERS
// ================================================================================================
exports.IntegerLiteral = chevrotain_1.createToken({ name: "IntegerLiteral", pattern: /0|[1-9]\d*/ });
exports.MutableRegister = chevrotain_1.createToken({ name: "MutableRegister", pattern: /\$[rn]\d{1,2}/ });
exports.StaticRegister = chevrotain_1.createToken({ name: "StaticRegister", pattern: /\$k\d{1,2}/ });
exports.SecretRegister = chevrotain_1.createToken({ name: "SecretRegister", pattern: /\$s\d{1,2}/ });
exports.PublicRegister = chevrotain_1.createToken({ name: "PublicRegister", pattern: /\$p\d{1,2}/ });
exports.Identifier = chevrotain_1.createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });
// KEYWORDS
// ================================================================================================
exports.Define = chevrotain_1.createToken({ name: "Define", pattern: /define/, longer_alt: exports.Identifier });
exports.Over = chevrotain_1.createToken({ name: "Over", pattern: /over/, longer_alt: exports.Identifier });
exports.Prime = chevrotain_1.createToken({ name: "Prime", pattern: /prime/, longer_alt: exports.Identifier });
exports.Binary = chevrotain_1.createToken({ name: "Binary", pattern: /binary/, longer_alt: exports.Identifier });
exports.Field = chevrotain_1.createToken({ name: "Field", pattern: /field/, longer_alt: exports.Identifier });
exports.Transition = chevrotain_1.createToken({ name: "Transition", pattern: /transition/, longer_alt: exports.Identifier });
exports.Registers = chevrotain_1.createToken({ name: "Registers", pattern: /registers?/, longer_alt: exports.Identifier });
exports.In = chevrotain_1.createToken({ name: "In", pattern: /in/, longer_alt: exports.Identifier });
exports.Steps = chevrotain_1.createToken({ name: "Steps", pattern: /steps?/, longer_alt: exports.Identifier });
exports.Enforce = chevrotain_1.createToken({ name: "Enforce", pattern: /enforce/, longer_alt: exports.Identifier });
exports.Constraints = chevrotain_1.createToken({ name: "Constraints", pattern: /constraints?/, longer_alt: exports.Identifier });
exports.Of = chevrotain_1.createToken({ name: "Of", pattern: /of/, longer_alt: exports.Identifier });
exports.Degree = chevrotain_1.createToken({ name: "Degree", pattern: /degree/, longer_alt: exports.Identifier });
exports.For = chevrotain_1.createToken({ name: "For", pattern: /for/, longer_alt: exports.Identifier });
exports.Do = chevrotain_1.createToken({ name: "Do", pattern: /do/, longer_alt: exports.Identifier });
exports.With = chevrotain_1.createToken({ name: "With", pattern: /with/, longer_alt: exports.Identifier });
exports.Nothing = chevrotain_1.createToken({ name: "Nothing", pattern: /nothing/, longer_alt: exports.Identifier });
exports.Out = chevrotain_1.createToken({ name: "Out", pattern: /out/, longer_alt: exports.Identifier });
exports.When = chevrotain_1.createToken({ name: "When", pattern: /when/, longer_alt: exports.Identifier });
exports.Else = chevrotain_1.createToken({ name: "Else", pattern: /else/, longer_alt: exports.Identifier });
exports.Using = chevrotain_1.createToken({ name: "Using", pattern: /using/, longer_alt: exports.Identifier });
exports.Readonly = chevrotain_1.createToken({ name: "Readonly", pattern: /readonly/, longer_alt: exports.Identifier });
exports.Repeat = chevrotain_1.createToken({ name: "Repeat", pattern: /repeat/, longer_alt: exports.Identifier });
exports.Spread = chevrotain_1.createToken({ name: "Spread", pattern: /spread/, longer_alt: exports.Identifier });
exports.Import = chevrotain_1.createToken({ name: "Import", pattern: /import/, longer_alt: exports.Identifier });
exports.From = chevrotain_1.createToken({ name: "From", pattern: /from/, longer_alt: exports.Identifier });
exports.As = chevrotain_1.createToken({ name: "As", pattern: /as/, longer_alt: exports.Identifier });
// OPERATORS
// ================================================================================================
exports.AddOp = chevrotain_1.createToken({ name: "AddOp", pattern: chevrotain_1.Lexer.NA });
exports.Plus = chevrotain_1.createToken({ name: "Plus", pattern: /\+/, categories: exports.AddOp });
exports.Minus = chevrotain_1.createToken({ name: "Minus", pattern: /-/, categories: exports.AddOp });
exports.MulOp = chevrotain_1.createToken({ name: "MulOp", pattern: chevrotain_1.Lexer.NA });
exports.Star = chevrotain_1.createToken({ name: "Star", pattern: /\*/, categories: exports.MulOp });
exports.Slash = chevrotain_1.createToken({ name: "Slash", pattern: /\//, categories: exports.MulOp });
exports.Pound = chevrotain_1.createToken({ name: "Pound", pattern: /#/, categories: exports.MulOp });
exports.ExpOp = chevrotain_1.createToken({ name: "ExpOp", pattern: /\^/ });
// SYMBOLS
// ================================================================================================
exports.LCurly = chevrotain_1.createToken({ name: "LCurly", pattern: /{/ });
exports.RCurly = chevrotain_1.createToken({ name: "RCurly", pattern: /}/ });
exports.LSquare = chevrotain_1.createToken({ name: "LSquare", pattern: /\[/ });
exports.RSquare = chevrotain_1.createToken({ name: "RSquare", pattern: /]/ });
exports.LParen = chevrotain_1.createToken({ name: "LParen", pattern: /\(/ });
exports.RParen = chevrotain_1.createToken({ name: "RParen", pattern: /\)/ });
exports.Comma = chevrotain_1.createToken({ name: "Comma", pattern: /,/ });
exports.Colon = chevrotain_1.createToken({ name: "Colon", pattern: /:/ });
exports.Semicolon = chevrotain_1.createToken({ name: "Semicolon", pattern: /;/ });
exports.Ellipsis = chevrotain_1.createToken({ name: 'Ellipsis', pattern: /\.\.\./ });
exports.Pipe = chevrotain_1.createToken({ name: 'Pipe', pattern: /\|/ });
exports.Tilde = chevrotain_1.createToken({ name: 'Tilde', pattern: /~/ });
exports.Ampersand = chevrotain_1.createToken({ name: 'Ampersand', pattern: /&/ });
exports.QMark = chevrotain_1.createToken({ name: 'QMark', pattern: /\?/ });
exports.EMark = chevrotain_1.createToken({ name: 'EMark', pattern: /!/ });
// WHITESPACE AND COMMENTS
// ================================================================================================
exports.WhiteSpace = chevrotain_1.createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: chevrotain_1.Lexer.SKIPPED
});
exports.Comment = chevrotain_1.createToken({
    name: "Comment",
    pattern: /\/\/.+/,
    group: "comments"
});
// ALL TOKENS
// ================================================================================================
exports.allTokens = [
    exports.WhiteSpace, exports.Comment,
    exports.Define, exports.Over, exports.Prime, exports.Binary, exports.Field, exports.Transition, exports.Registers, exports.In, exports.Steps, exports.Enforce, exports.Constraints, exports.Of,
    exports.Degree, exports.For, exports.Do, exports.With, exports.Nothing, exports.When, exports.Else, exports.Out, exports.Repeat, exports.Spread, exports.Using, exports.Readonly, exports.Import, exports.From, exports.As,
    exports.Plus, exports.Minus, exports.Star, exports.Slash, exports.Pound, exports.ExpOp, exports.MulOp, exports.AddOp,
    exports.LCurly, exports.RCurly, exports.LSquare, exports.RSquare, exports.LParen, exports.RParen, exports.Comma, exports.Colon, exports.Semicolon, exports.Ellipsis, exports.Pipe,
    exports.Tilde, exports.Ampersand, exports.QMark, exports.EMark,
    exports.Identifier,
    exports.MutableRegister, exports.StaticRegister, exports.SecretRegister, exports.PublicRegister,
    exports.IntegerLiteral
];
// EXPORT LEXER INSTANCE
// ================================================================================================
exports.lexer = new chevrotain_1.Lexer(exports.allTokens, { errorMessageProvider: errors_1.lexerErrorMessageProvider });
//# sourceMappingURL=lexer.js.map