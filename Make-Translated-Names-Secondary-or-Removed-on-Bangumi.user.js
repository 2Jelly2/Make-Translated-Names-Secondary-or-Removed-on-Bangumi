// ==UserScript==
// @name         Bangumi 译名次要化或删除
// @namespace    https://github.com/2Jelly2/Make-Translated-Names-Secondary-or-Removed-on-Bangumi
// @version      0.12
// @icon         https://bgm.tv/img/favicon.ico
// @description  Make Translated Names Secondary or Removed on Bangumi.
// @author       時計坂しぐれ
// @supportURL   https://github.com/2Jelly2/Make-Translated-Names-Secondary-or-Removed-on-Bangumi/issues

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand

// @match        https://chii.in/*
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*

// ==/UserScript==
(
    function()
    {
        'use strict';

        const url = location.href;
        const keys = GM_listValues();

        if (!keys.includes("extinctionMode"))
        {
            GM_setValue("extinctionMode", false);
        }

        // Exchange original title names and translated ones
        // - with *false* to enable Exchange Mode. (default)
        // Remove translated title names completely, instead of exchange them with original ones
        // - with *true* to enable Distinction Mode;
        const extinctionMode = GM_getValue("extinctionMode");

        GM_registerMenuCommand("Extinction Mode: " + (extinctionMode ? "🟢Enabled" : "⚪Disabled"), function(event) {
            GM_setValue("extinctionMode", !extinctionMode);
            location.reload();
        });

        if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/$/) != null)
        {
            modifyCards();
            const observer = new MutationObserver
            (
                function (mutations)
                {
                    modifyCards();
                }
            );
            observer.observe(document.body, { childList: true, subtree: true });
        }
        else if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/subject\//) != null)
        {
            modifySubjects();
        }
        else
        {
            modifyItems();
        }


        function modifyCards()
        {
            var cards = document.getElementsByClassName("card");

            for (var i = 0; i < cards.length; i++)
            {
                var card = cards[i];
                var info = card.parentElement.getElementsByTagName("a")[1];

                if (card.getAttribute("ignore") == null)
                {
                    var title = document.getElementsByClassName("card")[i].getElementsByClassName("title")[0].getElementsByTagName("a")[0];

                    if (info.getAttribute("data-subject-name") != null)
                    {
                        title.innerText = info.getAttribute("data-subject-name");
                    }
                    else
                    {
                        if (card.classList.contains("card_tiny"))
                        {
                            title.innerText = card.getElementsByClassName("subtitle")[0].innerText;
                        }
                        else
                        {
                            title.innerText = info.innerText;
                        }
                    }
                    card.setAttribute("ignore", true);
                }
            }
        }

        function modifyItems()
        {
            var subjects = document.querySelectorAll("li.item");

            for (var i = 0; i < subjects.length; i++)
            {
                var subject = subjects[i].getElementsByTagName("h3")[0];

                var subtitle_element = subject.getElementsByTagName("small")[0];
                if (subtitle_element != null)
                {
                    var title_element = subject.getElementsByTagName("a")[0];
                    var translated_name = title_element.innerText;
                    title_element.innerText = subtitle_element.innerText;
                    if (!extinctionMode)
                    {
                        subtitle_element.innerText = translated_name;
                    }
                    else
                    {
                        subtitle_element.parentElement.removeChild(subtitle_element);
                    }
                }
            }
        }

        function modifySubjects()
        {
            if (extinctionMode)
            {
                var infobox_1st_map = document.getElementById("infobox").getElementsByTagName("li")[0];
                if (infobox_1st_map.getElementsByClassName("tip")[0].innerText == "中文名: ")
                {
                    infobox_1st_map.parentElement.removeChild(infobox_1st_map);
                }

                var sections = document.getElementsByClassName("subject_section");
                for (var i = 0; i < sections.length; i++)
                {
                    var relatedSubjects = sections[i].getElementsByClassName("avatar");
                    for (var j = 0; j < relatedSubjects.length; j++)
                    {
                        relatedSubjects[j].removeAttribute("data-original-title");
                    }
                }
            }
        }
    }
)();
