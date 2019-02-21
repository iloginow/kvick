'use strict';

var Kvick = (function () {
    function Kvick() {
        console.log('Hello from Kvick');
    }
    Kvick.prototype.hello = function () {
        return 'Hello from Kvick';
    };
    return Kvick;
}());

module.exports = Kvick;
