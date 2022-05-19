const { range } = require("lodash");

class PsiDataExtractor {
    
    static extractPrivateParamsOnLoad(params) {
        const zeroString = '0000000000000000000000000000000000000000000000000000000000000000';
        let data = Buffer(params.slice()[5]).toString('hex');

        const pos = data.lastIndexOf('0033') + 4;
        let args = data.substring(pos);

        let argArray = [];
        let privateArgs = [];
        let newDataStr = '';
        let privateArgsStr = '';

        let i = 0;
        while (i < args.length) {
            argArray.push(args.substring(i, i + 64));
            i += 64;
        }

        privateArgs = argArray.slice(5, 5 + parseInt(argArray[2]));

        for (i in range(0,5)) {
            newDataStr += argArray[i];
            privateArgsStr += argArray[i];
        }

        for (i in range(0, parseInt(argArray[4]))) {
            newDataStr += zeroString;
        }

        const blindedTransaction = data.substring(0, pos) + newDataStr;

        for (i in range(0, privateArgs.length)) {
            privateArgsStr += privateArgs[i];
        }

        return [Buffer.from(blindedTransaction, 'hex'), Buffer.from(privateArgsStr, 'hex')];
    }

    static extractPrivateParamsOnConsume(params) {
        const zeroString = '0000000000000000000000000000000000000000000000000000000000000000';
        let data = Buffer(params.slice()[5]).toString('hex');

        let args = data.substring(8);   // The length in hex symbols for the method call is 8

        let argArray = [];
        let privateArgs = [];
        let newDataStr = '';
        let privateArgsStr = '';

        let i = 0;
        while (i < args.length) {
            argArray.push(args.substring(i, i + 64));
            i += 64
        }

        privateArgs = argArray.slice(2, 2 + parseInt(argArray[1]));

        for (i in range(0, 2)) {
            newDataStr += argArray[i];
            privateArgsStr += argArray[i];
        }

        for (i in range(0, parseInt(argArray[1]))) {
            newDataStr += zeroString;
        }

        const blindedTransaction = data.substring(0, 8) + newDataStr;

        for (i in range(0, privateArgs.length)) {
            privateArgsStr += privateArgs[i];
        }

        return [Buffer.from(blindedTransaction, 'hex'), Buffer.from(privateArgsStr, 'hex')];
    }

}

module.exports = PsiDataExtractor;