﻿var WEBSITE = "rapidscada.net";

function createLayout() {
    var articleElems = $("body").children();
    articleElems.detach();

    var layoutElem = $("<div class='sd-contents-wrapper'>" +
        "<!--googleoff: index--><div class='sd-contents'></div><!--googleon: index--></div>" +
        "<div class='sd-article-wrapper'><div class='sd-article'></div></div>");
    $("body").append(layoutElem);
    $("body").css("overflow", "hidden");
    $("div.sd-article").append(articleElems);

    updateLayout();
    createSearch();
    createContents();
    createCounter();

    styleIOS($("div.sd-contents-wrapper"));
    styleIOS($("div.sd-article-wrapper"));
}

function updateLayout() {
    var divContentsWrapper = $("div.sd-contents-wrapper");
    var divArticleWrapper = $("div.sd-article-wrapper");

    var winH = $(window).height();
    var contW = divContentsWrapper[0].getBoundingClientRect().width; // fractional value is required
    divContentsWrapper.outerHeight(winH);
    divArticleWrapper.outerHeight(winH);
    divArticleWrapper.outerWidth($(window).width() - contW);
}

function createSearch() {
    var protocol = window.location.protocol;

    if (protocol === "http:" || protocol === "https:") {
        var searchHtml =
            "<script>" +
            "  (function() {" +
            "    var cx = '003943521229341952511:vsuy-pqfiri';" +
            "    var gcse = document.createElement('script');" +
            "    gcse.type = 'text/javascript';" +
            "    gcse.async = true;\n" +
            "    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;" +
            "    var s = document.getElementsByTagName('script')[0];" +
            "    s.parentNode.insertBefore(gcse, s);" +
            "  })();" +
            "</script>" +
            "<gcse:search></gcse:search>";

        $("div.sd-contents").append(searchHtml);
    }
}

function createContents() {
    var context = createContext();
    addContents(context);

    if (typeof onContentsCreated === "function") {
        onContentsCreated();
    }

    // scroll contents
    var selItem = $(".sd-contents-item.selected:first");
    if (selItem.length > 0) {
        // delay is needed to load search panel that affects contents height
        setTimeout(function () {
            context.contents.parent().scrollTop(selItem.offset().top);
        }, 200);
    }
}

function createContext() {
    var siteRoot = location.origin + "/";
    var docRoot = siteRoot + "content/latest/en/";
    var lang = "en";

    var href = location.href;
    var contentIdx = href.indexOf("/content/") + 1;

    if (contentIdx > 0) {
        siteRoot = href.substring(0, contentIdx);
        var parts = href.substring(contentIdx).split("/");

        if (parts.length >= 3) {
            var ver = parts[1];
            lang = parts[2];
            docRoot = siteRoot + "content/" + ver + "/" + lang + "/";
        }
    }

    return {
        contents: $("div.sd-contents"),
        siteRoot: siteRoot,
        docRoot: docRoot,
        lang: lang
    };
}

function createCounter() {
    if (location.href.indexOf(WEBSITE) >= 0) {
        var counterScript = '<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(42248389, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/42248389" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->';
        $("body").prepend(counterScript);
    }
}

function addArticle(context, link, title, opt_level) {
    var url = context.docRoot + link;
    var itemInnerHtml = link ? "<a href='" + url + "'>" + title + "</a>" : title;
    var levClass = opt_level ? " level" + opt_level : "";
    var selClass = link && url === location.href.split("#")[0] ? " selected" : "";

    var contentsItem = $("<div class='sd-contents-item" + levClass + selClass + "'>" + itemInnerHtml + "</div>");
    context.contents.append(contentsItem);
}

function copyContentsToArticle() {
    var selItem = $(".sd-contents-item.selected:first");

    if (selItem.length) {
        var stopClass = selItem.attr("class").replace(" selected", "");
        var reqClass = selItem.next(".sd-contents-item").attr("class");
        var divArticle = $(".sd-article");

        var titleText = selItem.find("a").text();
        document.title = titleText + " - " + document.title;
        $("<h1>").text(titleText).appendTo(divArticle);

        selItem.nextAll().each(function () {
            var curClass = $(this).attr("class");

            if (curClass === reqClass) {
                var linkElem = $(this).find("a");
                if (linkElem.length) {
                    $("<p>").append(linkElem.clone()).appendTo(divArticle);
                }
            } else if (curClass === stopClass) {
                return false;
            }
        });
    }
}

function iOS() {
    return /iPad|iPhone|iPod/.test(navigator.platform);
}

function styleIOS(jqElem) {
    if (iOS()) {
        jqElem.css({
            "overflow": "scroll",
            "-webkit-overflow-scrolling": "touch"
        });
    }
}

$(document).ready(function () {
    if ($("body").hasClass("home")) {
        // add counter only to home page
        createCounter();
    } else {
        // create layout of article page
        createLayout();

        $(window).resize(function () {
            updateLayout();
        });
    }
});
