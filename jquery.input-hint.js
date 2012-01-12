
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
		$.inputHint(this.context);
	};


	$.fn.inputHint.defaults = {
		selector: ".inputHint"
	};


	$.inputHint = function($context) {

		var options = $.fn.inputHint.defaults;

		$( options.selector, $context ).each(function() {

			var $this = $(this),
				hint,
				parentElement = this.parentNode,
				title = this.getAttribute("title"),
				is_password,
				_data;

			if ( parentElement.tagName == "LABEL" ) {
				hint = $( parentElement ).text();
				$( parentElement ).html(this);

			} else if ( title ) {
				hint = title;
			} else { // if you forgot to set a text I'm not wasting any cycles on you, biatch!
				return true;
			}

			is_password = (this.getAttribute("type") == "password");
			_data = {hint: hint, is_password: is_password};

			if ( this.value == "" ) {
				this.value = hint;
			}

			if ( is_password ) {
				try {
					this.setAttribute("type", "text"); // fails in IE
				} catch (e) {
					var classname = this.className;

					$this.hide();

					_data.helper =

					$('<input type="text" />')
					.addClass(classname)
					.val(hint)
					.insertAfter(this)
					.bind("focus", onInputFocus)
					.bind("blur", onInputFocus)
					.data("inputHint", {hint: hint, is_password: is_password, original: this})
					[0];
				}

				this.setAttribute("autocomplete", "off");
			}

			$this
			.data("inputHint", _data)
			.removeAttr("title");

		})
		.bind("focus", onInputFocus)
		.bind("blur", onInputFocus);
	};


	function onInputFocus( event ) {

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
					var password = $input.val(),
						original = $input.hide().data("inputHint").original;
					$(original).val(password).show().focus();
				}
			}
		}

		return true;
	}


})(jQuery);
