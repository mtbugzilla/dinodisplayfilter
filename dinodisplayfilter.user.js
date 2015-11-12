// ==UserScript==
// @name        Dino-RPG Display Filter
// @version     0.1
// @description Affichage sélectif des dinoz pour Dino-RPG
// @namespace   https://github.com/mtbugzilla/
// @grant       none
// @downloadURL https://github.com/mtbugzilla/dinodisplayfilter/raw/master/dinodisplayfilter.user.js
// @copyright   2015, Bugzilla, badconker
// @include     http://www.dinorpg.com/user/*
// ==/UserScript==
//

function saveHiddenDinoz(listId) {
    localStorage.setItem(listId, $('.dinList input').map(function () {
        if (! $(this).prop('checked')) {
            return $(this).val();
        }
    }).get());
}

function addCheckBoxes(listId) {
    $('.dinList li').each(function () {
        var $input = $('<input type="checkbox" checked="checked" />');
        $input.val($(this).find('.swf').attr('id').replace("swf_dino_", ""));
        $input.on('change', function () {
            if ($(this).prop('checked')) {
                $('#swf_dino_' + $(this).val()).show();
            } else {
                $('#swf_dino_' + $(this).val()).hide();
            }
            saveHiddenDinoz(listId);
        });
        $input.css("margin-right", "2px");
        $input.prependTo($(this).find('.name'));
    });
}

function hideDinoz(listId) {
    if (localStorage.getItem(listId)) {
        localStorage.getItem(listId).split(',').forEach(function(dinoId) {
            $('#swf_dino_' + dinoId).hide();
            $('#swf_dino_' + dinoId).siblings('.name').find('input').prop('checked', false);
        });
    }
}

function addInfoBox(listId) {
    TXT_HELP = "Cliquez sur les cases à cocher situées à côté du nom des dinoz pour déterminer s'il doivent être affichés ou pas. Ou bien choisissez une de ces actions: ";
    TXT_OPT_NOP = "(Ne rien changer)";
    TXT_OPT_ALL = "Montrer tous les dinoz";
    TXT_OPT_NONE = "Cacher tous les dinoz";
    TXT_OPT_FROZEN = "Cacher les dinos congelés";
    var helpbox = $('<div>' + TXT_HELP + '</div>');
    helpbox.css({ "width": "573px",
                  "margin": "4px 0px 8px 0px",
                  "padding": "4px",
                  "border": "2px solid #52646b",
                  "box-shadow": "0px 4px 4px rgba(0, 0, 0, 0.5)",
                  "background-color": "#4e5162",
                  "color": "#fff",
                  "font-size": "10pt"
                });
    helpbox.attr("title", "Script Dino-RPG Display Filter");
    var selectmenu = $('<select></select>');
    selectmenu.append('<option value="nop">' + TXT_OPT_NOP + '</option>');
    selectmenu.append('<option value="showall">' + TXT_OPT_ALL + '</option>');
    selectmenu.append('<option value="hideall">' + TXT_OPT_NONE + '</option>');
//    selectmenu.append('<option value="frozen">' + TXT_OPT_FROZEN + '</option>');
    selectmenu.on('change', function () {
        var choice = $(this).val();
        if (choice === "showall") {
            $('.dinList li').each(function () {
                $(this).find('.swf').show();
                $(this).find('input').prop('checked', true);
            });
            saveHiddenDinoz(listId);
        } else if (choice === "hideall") {
            $('.dinList li').each(function () {
                $(this).find('.swf').hide();
                $(this).find('input').prop('checked', false);
            });
            saveHiddenDinoz(listId);
        } else if (choice === "frozen") {
            // not implemented
        }
    });
    helpbox.append(selectmenu);
    $('#centerContent .user > table').after('<div class="clear"></div>').after(helpbox);
}

function init() {
    var userId = document.URL.substr(document.URL.lastIndexOf("/") + 1);
    var listId = 'ddf_hide_' + userId;
    addCheckBoxes(listId);
    hideDinoz(listId);
    addInfoBox(listId);
}

init();
