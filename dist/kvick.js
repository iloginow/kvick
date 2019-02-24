'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Component = (function () {
    function Component() {
        console.log('Hello from Component');
    }
    Component.prototype.hello = function () {
        return 'Hello from Component';
    };
    return Component;
}());

var Kvick = (function () {
    function Kvick() {
        this.Component = Component;
        console.log('Hello from Kvick');
    }
    Kvick.prototype.hello = function () {
        return 'Hello from Kvick';
    };
    return Kvick;
}());

exports.Kvick = Kvick;
