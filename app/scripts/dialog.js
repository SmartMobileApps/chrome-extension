/**
 * @fileoverview Content script file helper to handle login form.
 */


'use strict';
var yuno = yuno || {};

/**
 * Intialied by login form dialog box.
 */
yuno.dialog = {
    genPopup: function(html, selTmpl) {
        var s;
        var dialogEle = $yuno(
            '<div class="reset yuno-white_content" id="' +
            (!selTmpl ? yuno.dialog.loginDialogID : yuno.dialog.tempDialogID) +
            '">' + html + '</div><div id="fade" class="yuno-black_overlay"></div>');
        // .css({
        //     position: 'absolute',
        //     top: '21%',
        //     border: '1px solid rgba(0, 0, 0, 0.3)',
        //     '-webkit-box-shadow': '0 3px 7px rgba(0, 0, 0, 0.3)',
        //     '-webkit-background-clip': 'padding-box',
        //     'background-clip': 'padding-box'
        //   });
        $yuno(
            selTmpl ?
            '#' + yuno.dialog.tempDialogID :
            '#' + yuno.dialog.loginDialogID).remove();
        $yuno('#fade').remove();

        $yuno('body').append(dialogEle);


        // this needs to happen before showModal(), else the selection is lost
        if (selTmpl) {
            s = window.getSelection();
            // var parent = s.anchorNode.parentNode;
            // document.getElementById('yuno-parentXpath').value =
            //   yuno.contentScript.getXPath(parent);

            document.getElementById('yuno-selection').value = s.toString();

            if (s.toString() && s.toString().length > 0) {
                //dialogEle.get(0).showModal();
                $yuno('#fade').show();
                dialogEle.show();
            } else {
                alert('Please select some text');
            }
        } else {
            // dialogEle.get(0).showModal();
            $yuno('#fade').show();
            dialogEle.show();
        }

        var newRule = 'yuno-heading{ color: #222; font-size: ' +
            '26px; display: block; padding-bottom: 5px; text-align: ' +
            'center; border-bottom: 1px solid #999; margin-bottom: 15px; }';
        newRule += 'yuno-a{display: inline; float: right; padding-right: 5px; ' +
            'cursor: pointer; color: #787878; font-size: 15px;}';
        newRule += 'yuno-p{display: block; width: 100%;padding: 5px;}';
        newRule += 'yuno-p input{width: 63%;}';
        newRule += 'yuno-status{display:block}';
        newRule += 'yuno-form{width: 400px; display: block; padding: 10px; }';
        newRule += 'yuno-footer{display: block; background: #eee; padding: 10px;' +
            ' margin-left: -24px; margin-right: 6px; margin-bottom: -24px;' +
            ' margin-top: 10px; border-top: 1px solid #787878;}';

        $yuno('style').append(newRule);

        // var closeDialog = document.getElementById('closeDialog');
        // closeDialog.onclick = function() {
        //   $yuno(
        //     selTmpl ?
        //       '#yuno_ext_templateDialog' : '#yuno_ext_loginDialog'
        //   ).get(0).close();
        // };
    },
    genChartsPopup: function(context) {
        context = $yuno(context);
        var scriptTag = '<script type="text/javascript" ' +
            'src="https://www.google.com/jsapi"></script>';
        var s;
        var closeHTML = '<div id="yuno-heading">Yuno' +
            '<yuno-a href="javascript:" id="yuno-closeDialog">x</yuno-a>' +
            '</div>';
        var dialogEle = $yuno(
            '<div style="width: 70%;" class="reset yuno-white_content" id="' +
            yuno.dialog.chartsDialogID +
            '">' + closeHTML + '<div style="width: 22000px;" id="' + yuno.dialog.chartID + '"></div>' +
            '</div><div id="fade" class="yuno-black_overlay"></div>');

        context.find('#' + yuno.dialog.chartsDialogID).remove();
        context.find('#fade').remove();
        // $yuno('head').append(scriptTag);
        context.find('body').append(dialogEle);


        // dialogEle.get(0).showModal();
        context.find('#fade').show();
        dialogEle.show();
        var closeDialog = document.getElementById('yuno-closeDialog');
        if (closeDialog) {
            closeDialog.onclick = function() {
                $yuno('#fade').remove();
                $yuno('#' + yuno.dialog.chartsDialogID).remove();
            };
        }

    },
    init: function(html, type) {
        var s = window.getSelection();
        var selection = s.toString();
        var parent = s.anchorNode.parentNode;
        var xpath = yuno.contentScript.getXPath(parent);

        yuno.dialog.genPopup(html, type);

        var loginButton = document.getElementById('yuno-loginSubmit');
        if (loginButton) {
            loginButton.onclick = function() {
                document.getElementById('yuno-status').style.display = 'none';
                var usernameObj = document.getElementById('yuno-username');
                var passwordObj = document.getElementById('yuno-password');

                if (usernameObj.value &&
                    usernameObj.value.length > 0 &&
                    passwordObj.value &&
                    passwordObj.value.length > 0) {

                    var config = {
                        'username': usernameObj.value,
                        'password': passwordObj.value,
                        'type': 'login'
                    };

                    chrome.runtime.sendMessage(config, function(response) {
                        //console.log(response);
                    });
                } else {
                    document.getElementById('yuno-status').style.display = 'block';
                    yuno.dialog.message('Please enter valid credentials', 'white');
                }
            };
        }

        var saveTempBtn = document.getElementById('yuno-saveTemplate');
        if (saveTempBtn) {
            saveTempBtn.onclick = function() {
                document.getElementById('yuno-status').style.display = 'none';
                var title = document.getElementById('templateyuno-Label');
                var content = document.getElementById('yuno-selection');

                if (title.value &&
                    title.value.length > 0 &&
                    content.value &&
                    content.value.length > 0) {
                    var screenCurrent = window.getSelection();
                    if (screenCurrent.toString() && screenCurrent.toString().length > 0) {
                        var selection = screenCurrent.toString();
                        var parent = screenCurrent.anchorNode.parentNode;
                        xpath = xpath;
                    }
                    var config = {
                        'title': title.value,
                        'content': content.value,
                        'url': document.URL,
                        'xpath': xpath,
                        'type': 'saveToTemplate'
                    };

                    chrome.runtime.sendMessage(config, function(response) {
                        console.log(response);
                    });
                } else {
                    document.getElementById('yuno-status').style.display = 'block';
                    yuno.dialog.message('Please Enter valid data', 'white');
                }
            };
        }

        var closeDialog = document.getElementById('yuno-closeDialog');
        if (closeDialog) {
            closeDialog.onclick = function() {
                if (document.getElementById(yuno.dialog.loginDialogID)) {
                    $yuno('#fade').remove();
                    $yuno('#' + yuno.dialog.loginDialogID).remove();
                } else if (document.getElementById(yuno.dialog.tempDialogID)) {
                    $yuno('#fade').remove();
                    $yuno('#' + yuno.dialog.tempDialogID).remove();
                }
            };
        }
    },
    getXPath: function(element) {
        var xpath = '';
        for (; element && element.nodeType === 1; element = element.parentNode) {
            //alert(element);
            var id = $yuno(
                element.parentNode).children(element.tagName).index(element) + 1;

            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
    },
    loginDialogID: 'yuno_ext_loginDialog',
    tempDialogID: 'yuno_ext_templateDialog',
    chartsDialogID: 'yuno-chartsDialog',
    chartID: 'yuno-chartID',
    message: function(message, color) {
        $yuno('#yuno-status').html(message).css({
            color: color
        });
    }
};
