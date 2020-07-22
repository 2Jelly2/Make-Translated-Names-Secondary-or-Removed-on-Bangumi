// ==UserScript==
// @name         移除Bangumi译名
// @namespace    https://github.com/2Jelly2/Remove-Translated-Names-on-Bangumi
// @version      0.02
// @description  Remove Translated Names on Bangumi
// @author       時計坂しぐれ
// @match        https://chii.in/*/list/*
// @match        https://bgm.tv/*/list/*
// @match        https://bangumi.tv/*/list/*
// @match        https://chii.in/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;

    // Exchange original names and translated ones,
    // with *false* to remove translated names without exchange.
    var listPageModify = true;

    // Translated names on Subject Pages are remained by default,
    // with *true* to enable modification.
    var subjectPageModify = false;

    if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/subject/) == null)
    // Modify on List Pages
    {
        var subjects = document.getElementsByTagName("h3");
        modifyListPage(subjects);
    }
    else
    {
    // Modify on Subject Pages
        if (subjectPageModify == true)
        {
            var infobox = document.getElementById("infobox").getElementsByTagName("li");
            modifySubjectPage(infobox);
        }
    }


    function modifyListPage(subjects)
    {
        for (var i = 0; i <= subjects.length; i++)
        {
            var fullTag = subjects[i].innerHTML;

            if (fullTag.match(/<small(([\s\S])*?)small>/g) != null)
            {
                var translatedTag = fullTag.replace(/<small(([\s\S])*?)small>/g, '');
                var translatedRaw = translatedTag.match(/(?<=>)[^<>]+(?=<)/g);

                var originalTag = fullTag.replace(/<a(([\s\S])*?)a>/g, '');
                var originalRaw = originalTag.match(/(?<=>)[^<>]+(?=<)/g);

                if (listPageModify)
                {
                    fullTag = fullTag.replace(originalRaw, 'TBD');
                    fullTag = fullTag.replace(translatedRaw, originalRaw);
                    fullTag = fullTag.replace('TBD', translatedRaw);
                }
                else
                {
                    fullTag = translatedTag.replace(translatedRaw, originalRaw);
                }
                document.getElementsByTagName("h3")[i].innerHTML = fullTag;
            }
        }
    }


    function modifySubjectPage(infobox)
    {
        for (var j = 0; j <= infobox.length; j++)
        {
            var currentBox = infobox[j].innerHTML;

            if (currentBox.startsWith("<span class=\"tip\">中文名: </span>"))
            {
                document.getElementById("infobox").getElementsByTagName("li")[j].innerHTML = null;
                break;
            }
        }
    }

    
})();
