// ==UserScript==
// @name         Bangumi 译名次要化或删除
// @namespace    https://github.com/2Jelly2/Make-Translated-Names-Secondary-or-Removed-on-Bangumi
// @version      0.03
// @description  Make Translated Names Secondary or Removed on Bangumi.
// @author       時計坂しぐれ
// @match        https://chii.in/*/list/*
// @match        https://bgm.tv/*/list/*
// @match        https://bangumi.tv/*/list/*
// @match        https://chii.in/person/*
// @match        https://bgm.tv/person/*
// @match        https://bangumi.tv/person/*
// @match        https://chii.in/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;

    // Exchange original names and translated ones on list pages,
    // with *false* to remove translated names without exchange.
    var listPageModify = true;

    // Exchange original names and translated ones on person pages,
    // with *false* to remove translated names without exchange.
    var personPageModify = true;

    // Translated names on Subject Pages are remained by default,
    // with *true* to enable modification.
    var subjectPageModify = false;

    if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/subject/) == null)
    {
        if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/person/) != null)
        // Modify on Person Pages
        {
            modifyPersonPage();
        }
        else
        // Modify on List Pages
        {
            modifyListPage();
        }
    }
    else
    {
    // Modify on Subject Pages
        if (subjectPageModify == true)
        {
            modifySubjectPage();
        }
    }


    function modifyListPage()
    {
        var subjects = document.getElementsByTagName("h3");

        for (var i = 0; i < subjects.length; i++)
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


    function modifyPersonPage()
    {
            if(url.endsWith("works"))
            {
                var subjects = document.getElementsByTagName("h3");

                for (var i = 0; i < subjects.length; i++)
                {
                    var fullTag = subjects[i].innerHTML;

                    if (fullTag.match(/<small(([\s\S])*?)small>/g) != null)
                    {
                        var translatedTag = fullTag.replace(/<small(([\s\S])*?)small>/g, '');
                        var translatedRaw = translatedTag.match(/(?<=>)[^<>]+(?=<)/g)[1];

                        var originalTag = fullTag.replace(/<a(([\s\S])*?)a>/g, '');
                        var originalRaw = originalTag.match(/(?<=>)[^<>]+(?=<)/g)[1];

                        if (personPageModify)
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
            else
            {
                if (!personPageModify)
                {
                    var subjectsP = document.getElementsByClassName("innerLeftItem ll");

                    for (var j = 0; j < subjectsP.length; j++)
                    {
                        var fullTagP = subjectsP[j].innerHTML;
                        document.getElementsByClassName("innerLeftItem ll")[j].innerHTML = fullTagP.replace(/<small(([\s\S])*?)small>/g, '');
                    }
                }
            }
    }


    function modifySubjectPage()
    {
        var infobox = document.getElementById("infobox").getElementsByTagName("li");

        for (var j = 0; j < infobox.length; j++)
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
