// ==UserScript==
// @name        Dino-RPG Display Filter
// @description Selective display of the dinoz for the game Dino-RPG
// @version     0.6
// @author      Bugzilla @ Twinoid.fr
// @namespace   https://github.com/mtbugzilla/
// @grant       none
// @downloadURL https://github.com/mtbugzilla/dinodisplayfilter/raw/master/dinodisplayfilter.user.js
// @run-at      document-start
// @include     http://www.dinorpg.com/user/*
// @include     http://en.dinorpg.com/user/*
// @include     http://es.dinorpg.com/user/*
// @include     http://www.dinorpg.de/user/*
// ==/UserScript==
//

var HEIGHT_SHOWN = "175px";
var HEIGHT_HIDDEN = "30px";

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
                $('#swf_dino_' + $(this).val()).show().parent().css("height", HEIGHT_SHOWN);
            } else {
                $('#swf_dino_' + $(this).val()).hide().parent().css("height", HEIGHT_HIDDEN);
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
            $('#swf_dino_' + dinoId).hide().parent().css("height", HEIGHT_HIDDEN);
            $('#swf_dino_' + dinoId).siblings('.name').find('input').prop('checked', false);
        });
    }
}

function addInfoBox(listId, language) {
    var TXT_HELP, TXT_OPT_NOP, TXT_OPT_ALL, TXT_OPT_NONE, TXT_OPT_FROZEN;
    if (language === "fr") {
        TXT_HELP = "Cliquez sur les cases à cocher situées à côté du nom des dinoz pour déterminer s'ils doivent être affichés ou pas. Ou bien choisissez une de ces actions : ";
        TXT_OPT_NOP = "(Ne rien changer)";
        TXT_OPT_ALL = "Montrer tous les dinoz";
        TXT_OPT_NONE = "Cacher tous les dinoz";
        TXT_OPT_FROZEN = "Cacher les dinos congelés";
    } else if (language === "es") {
        TXT_HELP = "Haga clic en las casillas de verificación junto a los nombres de los dinoz para determinar si se deben mostrar o no. O elegir una de estas acciones:";
        TXT_OPT_NOP = "(No hacer nada)";
        TXT_OPT_ALL = "Mostrar todos los dinoz";
        TXT_OPT_NONE = "Ocultar todos los dinoz";
        TXT_OPT_FROZEN = "Ocultar dinoz congelados";
    } else if (language === "de") {
        TXT_HELP = "Klicken Sie auf die Kontrollkästchen neben den Namen der Dinoz, um festzustellen, ob sie angezeigt werden oder nicht. Oder wählen Sie eine der folgenden Aktionen:";
        TXT_OPT_NOP = "(Nichts)";
        TXT_OPT_ALL = "Zeige alle Dinoz";
        TXT_OPT_NONE = "Hide all die Dinoz";
        TXT_OPT_FROZEN = "Hide gefrorenen Dinoz";
    } else {
        TXT_HELP = "Click on the check boxes located next to the name of your dinoz to determine whether they should be displayed or not.  Or pick one of these actions: ";
        TXT_OPT_NOP = "(Do nothing)";
        TXT_OPT_ALL = "Display all dinoz";
        TXT_OPT_NONE = "Hide all dinoz";
        TXT_OPT_FROZEN = "Hide frozen dinoz";
    }
    var infobox = $('<div>' + TXT_HELP + '</div>');
    infobox.css({ "width": "573px",
                  "margin": "4px 0px 8px 0px",
                  "padding": "4px",
                  "border": "2px solid #52646b",
                  "box-shadow": "0px 4px 4px rgba(0, 0, 0, 0.5)",
                  "background-color": "#4e5162",
                  "color": "#fff",
                  "font-size": "10pt"
                });
    infobox.attr("title", "Script Dino-RPG Display Filter");
    var selectmenu = $('<select></select>');
    selectmenu.append('<option value="nop">' + TXT_OPT_NOP + '</option>');
    selectmenu.append('<option value="showall">' + TXT_OPT_ALL + '</option>');
    selectmenu.append('<option value="hideall">' + TXT_OPT_NONE + '</option>');
    selectmenu.append('<option value="frozen">' + TXT_OPT_FROZEN + '</option>');
    selectmenu.on('change', function () {
        var choice = $(this).val();
        if (choice === "showall") {
            $('.dinList li').each(function () {
                $(this).find('.swf').show().parent().css("height", HEIGHT_SHOWN);
                $(this).find('input').prop('checked', true);
            });
            saveHiddenDinoz(listId);
        } else if (choice === "hideall") {
            $('.dinList li').each(function () {
                $(this).find('.swf').hide().parent().css("height", HEIGHT_HIDDEN);
                $(this).find('input').prop('checked', false);
            });
            saveHiddenDinoz(listId);
        } else if (choice === "frozen") {
            $('.dinList li').each(function () {
                if ($(this).find('embed').attr("flashvars").indexOf("congel") >= 0) {
                    $(this).find('.swf').hide().parent().css("height", HEIGHT_HIDDEN);
                    $(this).find('input').prop('checked', false);
                }
            });
            saveHiddenDinoz(listId);
        }
    });
    infobox.append(selectmenu);
    $('#centerContent .user > table').after('<div class="clear"></div>').after(infobox);
}

var timer_ref = null;

function RunAtDocumentStart() {
    var userId = document.URL.substr(document.URL.lastIndexOf("/") + 1);
    var listId = 'ddf_hide_' + userId;
    if (localStorage.getItem(listId)) {
        // use plain Javascript as jQuery may not be available yet
        var hide_array = localStorage.getItem(listId).split(',').reverse();
        var hide_func = function() {
            var i = hide_array.length;
            while (i--) {
                var el = document.getElementById('swf_dino_' + hide_array[i]);
                if (el) {
                    el.style.display = "none";
                    hide_array.splice(i, 1);
                }
            }
        };
        hide_func();
        if ((hide_array.length > 0) && (document.readyState === "loading")) {
            timer_ref = setInterval(function() {
                hide_func();
                if (document.readyState != "loading") {
                    clearInterval(timer_ref);
                    timer_ref = null;
                }
           }, 300);
        }
    }
}

function RunAtDocumentEnd() {
    var userId = document.URL.substr(document.URL.lastIndexOf("/") + 1);
    var listId = 'ddf_hide_' + userId;
    if (timer_ref != null) {
        clearInterval(timer_ref);
        timer_ref = null;
    }
    var language = "en";
    if (document.location.host === "www.dinorpg.com") {
        language = "fr";
    } else if (document.location.host === "es.dinorpg.com") {
        language = "es";
    } else if (document.location.host === "es.dinorpg.com") {
        language = "de";
    }
    addCheckBoxes(listId);
    hideDinoz(listId);
    addInfoBox(listId, language);
}

RunAtDocumentStart();
if (document.readyState === "loading") {
    document.addEventListener ("DOMContentLoaded", RunAtDocumentEnd);
} else {
    RunAtDocumentEnd();
}
