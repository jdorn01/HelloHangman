(function(win, doc, $){
    var Hangman = win.Hangman = win.Hangman || {};
    var activeAlert,
        alertQueue = [],
        template = '<div class="mask"><div class="alert-container"><span class="button close">OK</span></div></div>';

    Hangman.Alert = function(message){
        this._text = message;
        if (!activeAlert){
            activeAlert = this;
            this.render();
        } else {
            alertQueue.push(this);
        }
    };

    Hangman.Alert.prototype = {
        _text: '',
        _element: null,
        get: function(property){
             return this['_' + property];
        },
        set: function(property, value){
            return this['_' + property] = value;
        },
        render: function(){
            this._element = $(template);

            var self = this,
                message = self.get('text') ? '<span class="message">' + self.get('text') + '</span>' : '';

            $(message).prependTo(this._element.find('.alert-container'));

            self._element.find('.close').click(function(){
                self.dispose();
            });

            $(doc.body).append(self._element);
        },
        dispose: function(){
            this._element.remove();
            delete this._element;
            activeAlert = alertQueue.shift()
            if (activeAlert) {
                activeAlert.render();
            }
        }
    };

    $(win).keypress(function(e){
        if (activeAlert && e.which == 13) {
            activeAlert.dispose();
        }
    });

    $.extend({}, win.Hangman, Hangman);
    //win.Hangman = Hangman;
})(window, document, jQuery);