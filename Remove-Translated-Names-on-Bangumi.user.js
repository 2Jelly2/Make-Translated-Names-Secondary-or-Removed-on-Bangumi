// ==UserScript==
// @name         移除Bangumi译名
// @namespace    https://github.com/2Jelly2/Remove-Translated-Names-on-Bangumi
// @version      0.01
// @description  Remove Translated Names on Bangumi
// @author       時計坂しぐれ
// @match        https://chii.in/*/list/*
// @match        https://bgm.tv/*/list/*
// @match        https://bangumi.tv/*/list/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var subjects = document.getElementsByTagName("h3");

for (var i = 0; i <= subjects.length; i++)
{
    var full = subjects[i].innerHTML;

    if (full.match(/<small(([\s\S])*?)small>/g) != null)
    {
        var translatedTag = full.replace(/<small(([\s\S])*?)small>/g, '');
        var translatedRaw = translatedTag.match(/(?<=>)[^<>]+(?=<)/g);

        var originalTag = full.replace(/<a(([\s\S])*?)a>/g, '');
        var originalRaw = originalTag.match(/(?<=>)[^<>]+(?=<)/g);

        full = translatedTag.replace(translatedRaw, originalRaw);
        document.getElementsByTagName("h3")[i].innerHTML = full;
    }
}


})();
