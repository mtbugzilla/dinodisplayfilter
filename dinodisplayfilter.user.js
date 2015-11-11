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

function addCheckBoxes(userId) {
    //création des checkbox
    $('.dinList li').each(
        function () {
            var $input = $('<input type="checkbox" checked="checked" />');
            $input.val($(this).find('.swf').attr('id').replace("swf_dino_", ""));
            $input.on('change', function () {
                if ($(this).prop('checked')) {
                    $('#swf_dino_' + $(this).val()).show();
                } else {
                    $('#swf_dino_' + $(this).val()).hide();
                }
                //enregistrement des #id des div à cacher en localstorage
                localStorage.setItem('hidelist_' + userId, $('.dinList input').map(function () {
                    if (! $(this).prop('checked')) {
                        return $(this).val();
                    }
                }).get());
            });
            //ajout de la checkbox à la li
            $input.prependTo($(this).find('.name'));
        }
    );

    if (1) {
        //récupération des dino cachés
        if (localStorage.getItem('hidelist' + userId)) {
            $(localStorage.getItem('hidelist' + userId)).each(function () {
                $('#swf_dino_' + this).hide();
                $('#swf_dino_' + this).siblings('.name').find('input').prop('checked', false);
            });
        }
    }
}

function init() {
    var userId = document.URL.substr(document.URL.lastIndexOf("/") + 1);
    console.log("test:", userId);
    addCheckBoxes(userId);
}

init();
