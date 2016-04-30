﻿/*
 * Tree view control
 *
 * Author   : Mikhail Shiryaev
 * Created  : 2016
 * Modified : 2016
 */

/*
 * Requires:
 * - jquery
 */

// Rapid SCADA namespace
var scada = scada || {};

scada.treeView = {
    // Expand or collapse tree node
    _toggleTreeNode: function (divExpander) {
        var treeNode = divExpander.parent();
        var childNodes = treeNode.next(".child-nodes");

        if (divExpander.hasClass("expanded")) {
            divExpander.removeClass("expanded");
            childNodes.css("display", "none");
        } else {
            divExpander.addClass("expanded");
            childNodes.css("display", "block");
        }
    },

    // Expand selected tree node
    _expandSelectedTreeNode: function (allNodes) {
        var selNodes = allNodes.filter(".selected");
        var parDivs = selNodes.parentsUntil(".tree-view", ".child-nodes");

        parDivs.prev(".node").children(".expander").addClass("expanded");
        parDivs.css("display", "block");
    },

    // Tune tree view elements and bind events
    prepare: function () {
        var treeViews = $(".tree-view");
        var indentWidth = treeViews.find(".indent:first").width();
        var allNodes = treeViews.find(".node");

        // set width of indents according to their level
        allNodes.each(function () {
            var level = $(this).attr("data-level");
            $(this).children(".indent").width(indentWidth * level);
        });

        // expand selected tree node
        this._expandSelectedTreeNode(allNodes);

        // toggle tree node on click
        var thisTreeView = this;
        allNodes.children(".expander").click(function () {
            thisTreeView._toggleTreeNode($(this));
        });

        allNodes.find("a").click(function (event) {
            if (!$(this).attr("href")) {
                event.preventDefault();
                thisTreeView._toggleTreeNode($(this).parent().siblings(".expander"));
            }
        });
    }
};