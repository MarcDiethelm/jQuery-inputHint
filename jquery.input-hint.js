
/**
 * inputHint
 *
 * jQuery plugin to display form input hints directly and dynamically as value
 * of the input.
 *
 * Basic usage:  On the inputs add 'inputHint' to the class attribute, enter the
 * hint text as the title attribute and call $.inputHint();
 *
 * Password inputs are handled intelligently. Works on text and password inputs.
 * (Textarea probably coming soon...)
 *
 * (c) 2010, Marc Diethelm
 */

(function($) {

	$.fn.inputHint = function() {

	};


	$.fn.inputHint.defaults = {
		selector: "input.inputHint"
	};


	$.inputHint = function() {

		var options = $.fn.inputHint.defaults;

		$( options.selector ).each(function() {

			var $this = $(this),
				hint = this.getAttribute("title"),
				is_password = (this.getAttribute("type") == "password" ? true : false);

			if ( this.value == "" ) {
				this.setAttribute("value", hint);
			}

			if ( is_password ) {
				this.setAttribute("type", "text");
			}

			$this
			.data("inputHint", {hint: hint, is_password: is_password})
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
			input.value = hintData.hint;

			if ( hintData.is_password ) {
				input.setAttribute("type", "text");
			}

		} else if ( event.type == "focus" && input.value == hintData.hint ) {
			input.value = "";

			if ( hintData.is_password ) {
				input.setAttribute("type", "password");
			}
		}

		return true;
	}


})(jQuery);
