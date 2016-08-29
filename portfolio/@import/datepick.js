$.extend($.datepicker, { _checkOffset: function (inst, offset, isFixed) { return offset } });
$(function () {
    var displayFormat = "dd-M-yy";
    var advanceReturnDays = 2;

    var namesToHide = ["AM", "AD", "RM", "RD"], name;
    while ((name = namesToHide.pop()))
        $('select[name="' + name + '"]').each(function () {
            $(this).replaceWith($('<input type="hidden" />').attr({ name: this.name, value: $(this).val() }));
        });

    $('input[name="AM"],input[name="RM"]').each(function () {
        var value = this.value ? $.datepicker.parseDate('yy-mm-dd', this.value + "-" + $(this).next('input').val()) : null;
        var dateText = value ? $.datepicker.formatDate(displayFormat, value) : null;
        $('<input type="text" class="flightDate searchDate" />').val(dateText).insertAfter(this);
    });

    $('input[type="date"]').each(function () {
        $(this).replaceWith(
            $('<input type="text" class="flightDate" />').attr({
                id: this.id, name: this.name, value: this.getAttribute('value'),
                min: this.getAttribute('min'), max: this.getAttribute('max')
            })
        );
    });

    $('input.flightDate').datepicker({
        dateFormat: displayFormat,
        minDate: -1,
        maxDate: "+1Y",
        beforeShow: function (input, inst) {
            var showBeneath = $(this).closest('form').is('.flight_search_simple');
            var widget = $(inst).datepicker('widget');
            setTimeout(function () {
                if (!showBeneath)
                    widget.css({
                        'margin-left': '-17.6em',
                        'margin-top': '-2.4em'
                    });
                else
                    widget.css({
                        'margin-left': '-8.8em',
                        'left': '136px'
                    });
            }, 1);
            var dateLimits = { minDate: $(this).attr("min"), maxDate: $(this).attr("max") };
            if (dateLimits.minDate || dateLimits.maxDate) return dateLimits;
        }
    })
    .on('change', function () {
        var value = $(this).datepicker('getDate');
        this.value = value ? $.datepicker.formatDate(displayFormat, value) : '';
    });

    $('input.searchDate')
        .on('change', function () {
            var value = $(this).datepicker('getDate');
            var parts = value ? $.datepicker.formatDate('yy-mm-dd', value).split('-') : null;

            var iD = $(this).next('input[name$="D"]')[0];
            var iM = $(this).prev('input[name$="M"]')[0];

            if (iD && iM) {
                iD.value = parts ? parts.pop() : '';
                iM.value = parts ? parts.join('-') : '';

                if (iM.name != "RM")
                    $('input[name="RM"]').next('input.searchDate').each(function () {
                        var returnDate = $(this).datepicker('getDate');
                        if (!returnDate || (returnDate < value)) {
                            var nextDate = new Date(value - 0 + (advanceReturnDays * 24 * 60 * 60 * 1000));
                            $(this).datepicker('setDate', nextDate).trigger('change');
                        }
                    });
            }
        })
        .datepicker("option", {
            onSelect: function () { $(this).trigger('change'); }
        });
});