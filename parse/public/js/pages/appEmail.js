/*
 *  Document   : appEmail.js
 *  Author     : pixelcave
 *  Description: Custom javascript code used in Email Center page
 */

var AppEmail = function() {

    return {
        init: function() {
            // Choose one of the highlight classes for the message list rows: 'active', 'success', 'warning', 'danger'
            var rowHighlightClass = 'warning';

            /* Add/Remove row highlighting on checkbox click */
            $('tbody input:checkbox').click(function() {
                var checkedStatus   = $(this).prop('checked');
                var tableRow        = $(this).closest('tr');

                if (checkedStatus) {
                    tableRow.addClass(rowHighlightClass);
                } else {
                    tableRow.removeClass(rowHighlightClass);
                }
            });

            /* Show/Hide Message view - Just for preview */
            var origin = $(location).attr('pathname');
            console.log(origin);
            if (origin=="/merchant-transaction"){
                var inboxList = $('#merchant-transaction-message-list');
                var inboxView = $('#merchant-transaction-message-view');
            }else if (origin=="/admin-inbox"){
                var inboxList = $('#admin-inbox-message-list');
                var inboxView = $('#admin-inbox-message-view');
            }else if (origin=="/merchant-inbox"){
                var inboxList = $('#merchant-inbox-message-list');
                var inboxView = $('#merchant-inbox-message-view');
            }else if (origin=="/user-inbox"){
                var inboxList = $('#user-inbox-message-list');
                var inboxView = $('#user-inbox-message-view');
            }
            
            console.log("a: " + inboxList);
            console.log("b: " + inboxView);

            inboxList.find('h4 > a').on('click', function(){
                inboxList
                    .removeClass('animation-fadeInQuick2Inv')
                    .addClass('display-none');

                inboxView
                    .removeClass('display-none')
                    .addClass('animation-fadeInQuick2');
            });

            inboxView.find('#message-view-back').on('click', function(){
                inboxView
                    .removeClass('animation-fadeInQuick2')
                    .addClass('display-none');

                inboxList
                    .removeClass('display-none')
                    .addClass('animation-fadeInQuick2Inv');
            });
        }
    };
}();