
/**
 * inputHint
 *
 * jQuery plugin to display form input hints directly and dynamically as value
 * of the input.
 *
 * Basic usage:  On the inputs add 'inputHint' to the class attribute, enter the
 * hint text as the title attribute and call $(selector).inputHint or $.inputHint();
 *
 * Password inputs are handled intelligently. Works on text, password and textarea inputs.
 *
 * (c) 2010, Marc Diethelm
 */

(function($) {

	var options;

	$.fn.inputHint = function() {
		$.inputHint(this.context);
	};

	$.fn.inputHint.defaults = {
		selector: '.inputHint',
		data_name: 'jquery.inputHint'
	};


	$.inputHint = function($context) {

		var forIdLabels = {},
			dom_control_in_label = 'control' in document.createElement('label'),
			dom_labels_in_input = 'labels' in document.createElement('input'),
			$labels = $('label', $context),
			i = 0, label;

		if (!dom_labels_in_input && dom_control_in_label) {
			// map input.id: label.control (if label.control is defined)
			for ( ; label = $labels[i]; i++ ) {
				label.control && $.data(label.control, 'labelEl', label);
			}
		} else if ( !dom_labels_in_input && !dom_control_in_label) {
			for ( ; label = $labels[i]; i++ ) {
				var for_attr = label.htmlFor;
				for_attr && (forIdLabels[for_attr] = label);
			}
		}

		options = $.fn.inputHint.defaults;


		$( options.selector, $context ).each(function() {

			var $this = $(this),
				$label,
				hint,
				parentEl,
				title = this.title,
				is_pwd,
				_data;

			if (!title) {

				if (dom_labels_in_input) { // Yay HTML5 DOM!!! Fast!

					$label = $(this.labels[0]);
					hint = $label.text();
					$.contains(this.labels[0], this) ? $label.html(this) : $label.text('');

				} else if (!dom_labels_in_input && dom_control_in_label) { // Fallback using label.control stored on the input. HTML5 DOM & jQuery.data!

					label = $.data(this, 'labelEl');
					$.removeData(this, 'labelEl');
					if (label) {
						$label = $( label );
						hint = $label.text();
						$.contains(label, this) ? $label.html(this) : $label.text('');
					}

				} else { // no fast method available, use pre-HTML5 DOM
					parentEl = this.parentNode;
					if (parentEl && parentEl.tagName == 'LABEL' ) { // Fallback: is parent a label?
						hint = $( parentEl ).text();
						$( parentEl ).html(this);

					} else if ( this.id && this.id in forIdLabels ) { // is it a for-id label?
						$label = $( forIdLabels[this.id] );
						hint = $label.text();
						$label.text('');
					} else {
						$label = $(parentEl).closest('label'); // is there a label further up?
						if ( $label.length ) { // Fallback: is parent a label?
							hint = '';
							$label.contents().each(function() {
								if (this.nodeType == 3) {
									hint += this.nodeValue;
									$(this).remove();
								}
							});
						}
					}
				}

			} else if (title) {
				hint = title;
			} else { // .inputHint set but no hint found
				return true;
			}
			

			is_pwd = (this.type == 'password');
			_data = {hint: hint, is_pwd: is_pwd};

			if ( this.value == '' ) {
				this.value = hint;
			}

			if ( is_pwd ) {
				try {
					this.type = 'text'; // fails in IE
				} catch (e) {
					var classname = this.className;

					$this.hide();

					_data.helper =

					$('<input type="text" />')
					.addClass(classname)
					.val(hint)
					.insertAfter(this)
					.bind('focus', onFocusChange)
					.bind('blur', onFocusChange)
					.data(options.data_name, {hint: hint, is_pwd: is_pwd, orig: this})
					[0];
				}

				this.autocomplete = 'off';
			}

			$this
			.data(options.data_name, _data)
			.removeAttr('title');

		})
		.bind('focus', onFocusChange)
		.bind('blur', onFocusChange);
	};


	function onFocusChange( event ) {

		var input = event.target,
			$input = $(input),
			hintData = $input.data(options.data_name);

		if ( event.type == 'blur' && input.value == '' ) {

			if ( hintData.is_pwd ) {
				try {
					input.type = 'text';
					input.value = hintData.hint;
				} catch (e) {
					var helper = $input.hide().data(options.data_name).helper;
					$(helper).val(hintData.hint).show();
				}
			} else {
				input.value = hintData.hint;
			}

		} else if ( event.type == 'focus' && input.value == hintData.hint ) {
			input.value = '';

			if ( hintData.is_pwd ) {
				try {
					input.type = 'password';
				} catch (e) {
					var password = $input.val(),
						original = $input.hide().data(options.data_name).orig;
					$(original).val(password).show().focus();
				}
			}
		}

		return true;
	}


})(jQuery);
