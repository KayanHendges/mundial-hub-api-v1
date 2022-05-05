"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
function ensureAuthenticated(request, response) {
    return new Promise((resolve, reject) => {
        const authToken = request.headers.authorization;
        if (!authToken) {
            response.status(401).json({
                code: 401,
                message: "Token is missing"
            });
        }
        else {
            const [, token] = authToken.split(" ");
            try {
                (0, jsonwebtoken_1.verify)(token, "cf2dd495-ea1f-49cf-be17-52d23d900e71");
                resolve();
            }
            catch (erro) {
                const errorMessage = erro.toString();
                if (errorMessage == 'JsonWebTokenError: jwt malformed') {
                    response.status(401).json({
                        code: 401,
                        message: "Token is invalid"
                    });
                }
                if (errorMessage == 'TokenExpiredError: jwt expired') {
                    response.status(401).json({
                        code: 401,
                        message: "Token expired"
                    });
                }
            }
        }
    });
}
exports.default = ensureAuthenticated;
