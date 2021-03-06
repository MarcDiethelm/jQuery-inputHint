
/**
 * inputHint
 *
 * jQuery plugin to display form input hints directly and dynamically as value
 * of the input.
 *
 * Basic usage:  On the inputs add 'inputHint' to the class attribute, enter the
 * hint text as the title attribute and call $.inputHint();
 *
 * Password inputs are handled intelligently. Works on text, password and textarea inputs.
 *
 * (c) 2010, Marc Diethelm
 */

(function($) {

	$.fn.inputHint = function() {

	};


	$.fn.inputHint.defaults = {
		selector: ".inputHint"
	};


	$.inputHint = function() {

		var options = $.fn.inputHint.defaults;

		$( options.selector ).each(function() {

			var $this = $(this),
				hint = this.getAttribute("title"),
				is_password = (this.getAttribute("type") == "password" ? true : false),
				_data = {hint: hint, is_password: is_password};

			if ( this.value == "" ) {
				this.value = hint;
			}

			if ( is_password ) {
				try {
					this.setAttribute("type", "text"); // fails in IE
				} catch (e) {
					var classname = this.className;

					$(this).hide();

					_data.helper =

					$('<input type="text" />')
					.addClass(classname)
					.val(hint)
					.insertAfter(this)
					.bind("focus", inputFocusHandler)
					.bind("blur", inputFocusHandler)
					.data("inputHint", {hint: hint, is_password: is_password, original: this})
					.get(0);
				}

				this.setAttribute("autocomplete", "off");
			}

			$this
			.data("inputHint", _data)
			.removeAttr("title");

		})
		.bind("focus", inputFocusHandler)
		.bind("blur", inputFocusHandler);
	};


	function inputFocusHandler( event ) {

		var input = event.target,
			$input = $(input),
			hintData = $input.data("inputHint");

		if ( event.type == "blur" && input.value == "" ) {

			if ( hintData.is_password ) {
				try {
					input.setAttribute("type", "text");
					input.value = hintData.hint;
				} catch (e) {
					var helper = $input.hide().data("inputHint").helper;
					$(helper).val(hintData.hint).show();
				}
			} else {
				input.value = hintData.hint;
			}

		} else if ( event.type == "focus" && input.value == hintData.hint ) {
			input.value = "";

			if ( hintData.is_password ) {
				try {
					input.setAttribute("type", "password");
				} catch (e) {
					var password = $input.val();
					var original = $input.hide().data("inputHint").original;
					$(original).val(password).show().focus();
				}
			}
		}

		return true;
	}


})(jQuery);
