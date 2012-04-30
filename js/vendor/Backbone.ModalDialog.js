(function($) {
var ModalView = window.ModalView = Backbone.View.extend({
  name: "ModalView",
  modalBlanket: null,
  modalContainer: null,
  defaultOptions: {
    fadeInDuration:150,
    fadeOutDuration:150,
    showCloseButton:true,
    bodyOverflowHidden:false
  },
  initialize: function() {
  },
  events: {
  },
 showModalBlanket: function() {
    return this.ensureModalBlanket().fadeIn( this.options.fadeInDuration);
  },
  hideModalBlanket: function() {
    return this.modalBlanket.fadeOut( this.options.fadeOutDuration);
  },
  ensureModalContainer: function() {
    if( this.modalContainer == null) {
      this.modalContainer = $("<div id='modalContainer'>")
        .appendTo(document.body)
        .draggable();
    }

    return this.modalContainer;
  },
  ensureModalBlanket: function() {
    this.modalBlanket = $("#modal-blanket");

    if (this.modalBlanket.length == 0) {
      this.modalBlanket = $("<div id='modal-blanket'>")
        .css({
          top: $(document).scrollTop(), // Use document scrollTop so it's on-screen even if the window is scrolled
          height: $(document).height(), // Span the full document height...
        })
        .appendTo( document.body)
        .hide();
    }

    return this.modalBlanket;
  },
  keyup: function(event) {
    if (event.keyCode == 27) {
      this.hideModal();
    }
  },
  click: function(event) {
    if (!jQuery.contains( this.el, event.target)) {
      this.hideModal();
    }
  },
  setFocusOnFirstFormControl: function() {
    var controls = $("input, select, email, url, number, range, date, month, week, time, datetime, datetime-local, search, color", $(this.el));
    if (controls.length > 0) {
      $(controls[0]).focus();
    }
  },
  hideModal: function() {
    this.hideModalBlanket();
    $(document.body).unbind("keyup", this.keyup);
    $(document.body).unbind("click", this.click);

    if (this.options.bodyOverflowHidden === true) {
      $(document.body).css( "overflow", this.originalBodyOverflowValue);
    }

    var container = this.modalContainer;
    $(this.modalContainer)
      .fadeOut(
        this.options.fadeOutDuration,
        function() {
          container.remove();
        }
      );
  },
  showModal: function(options) {
    this.options = $.extend({}, this.defaultOptions, options);

    // Set the center alignment padding + border see css style
    var $el = $(this.el);

    var centreY = $(window).height() / 2;
    var positionY = centreY  - ($el.height() / 2);
    var positionX = centreY - ($el.width() / 2);

    // Overriding the coordinates with explicit values if they are passed in
    if ( typeof (this.options.x) !== "undefined") {
      positionX = this.options.x;
    }

    if (typeof (this.options.y) !== "undefined") {
      positionY = this.options.y;
    }

    $el.addClass("modal");

    this.showModalBlanket();
    this.keyup = _.bind(this.keyup, this);
    this.click = _.bind(this.click, this);
    $(document.body).keyup(this.keyup); // This handler is unbound in hideDialog()
    $(document.body).click(this.click); // This handler is unbound in hideDialog()

    if (this.options.bodyOverflowHidden === true) {
      this.originalBodyOverflowValue = $(document.body).css("overflow");
      $(document.body).css("overflow", "hidden");
    }

    this.ensureModalContainer()
      .empty()
      .append($el)
      .css({
        "top": positionY + "px",
        "left": positionX + "px",
      });

    this.setFocusOnFirstFormControl();

    if (this.options.showCloseButton) {
      var view = this;
      var image = $("<a href='#' id='modalCloseButton'>&#160;</a>")
        .appendTo(this.modalContainer)
        .click(function (event) {
          event.preventDefault();
          view.hideModal();
        });
    }

    this.modalContainer.animate(
      { opacity: 1 },
      this.options.fadeInDuration,
      function() { }
    );
  }
});
}(jQuery));
