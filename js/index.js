/*
    Name: Adam Gaudreau, adam_gaudreau@student.uml.edu
    Computer Science Department, UMass Lowell
    Comp.4610, GUI Programming I
    File: /usr/cs/2018/agaudrea/public_html/461f2017/hw5/js/index.js
    Created: 9 November 2017
    Last updated by AG: 9 November 2017
*/

// When the document loads, set up the listeners for events
$('document').ready(function() {
    // Hide the later step divs
    $('#step2').hide();
    $('#step3').hide();
    // Setup validate for first form
    $('#step1Form').validate({
        errorClass: "error",
        submitHandler: function() {changePage(1, 2)},
        rules: {
            "num-vehicles": {
                required: true,
                min: 2
            },
            "gas-price": {
                required: true,
                min: 0
            }
        },
        messages: {
            "num-vehicles": {
                required: "Please enter the number of vehicles to compare.",
                range: "You must compare at least 2 vehicles."
            },
            "gas-price": {
                required: "Please enter the current gas price.",
                range: "Gas price can't be negative."
            }
        }
    });
    // Set up navigation on click listeners
    $('#next1').click(function() {$("#step1Form").submit()});
    $('#next2').click(function() {$("#step2Form").submit()});
    $('#prev2').click(function() {changePage(2, 1)});
    $('#prev3').click(function() {changePage(3, 2)});
});

// Change from step to step
function changePage(from, to) {
    var step1 = $('#step1'), step2 = $('#step2'), step3 = $('#step3'), bar = $('.progress-bar');
    var pro2 = $('#prog-main-2'), pro3 = $('#prog-main-3'), cir2 = $('#prog-circ-2'), cir3 = $('#prog-circ-3');
    switch (from) {
        case 1:
            if (to == 2) {
                // Animation things
                step1.slideUp("fast");
                step2.slideDown("fast");
                bar.animate({width: '66.66%'});
                pro2.removeClass("incomplete");
                cir2.addClass("complete");
                // Add all templates
                addTemplates();
            }
            break;
        case 2:
            if (to == 1) {
                step2.slideUp("fast");
                step1.slideDown("fast");
                bar.animate({width: '33.33%'});
                pro2.addClass("incomplete");
                cir2.removeClass("complete");
            }
            if (to == 3) {
                step2.slideUp("fast");
                step3.slideDown("fast");
                bar.animate({width: '100%'});
                pro3.removeClass("incomplete");
                cir3.addClass("complete");
                // Make table
                makeTable();
            }
            break;
        case 3:
            if (to == 2) {
                step3.slideUp("fast");
                step2.slideDown("fast");
                bar.animate({width: '66.66%'});
                pro3.addClass("incomplete");
                cir3.removeClass("complete");
            }
            break;
    }
}

// Add new div for number of vehicles user will enter
function addTemplates() {
    var numTemplates = $('#input-num-vehicles').val();
    var root = $('#option-root'), template = $('#template').clone();
    // Clear root
    root.empty();
    root.append(template);
    for (var i = 1; i <= numTemplates; i++) {
        template.removeAttr("hidden");
        template.find(".vehicle-option").html("Vehicle " + i);
        // Add attributes that JQuery validate will use
        template.find(".msrp").attr("name", "msrpNum" + i);
        template.find(".mpg").attr("name", "mpgNum" + i);
        root.append(template);
        template = $('#template').clone();
    }
    // Add validator for Step 2
    $("#step2Form").validate({
        errorClass: "error",
        submitHandler: function() {changePage(2, 3)}
    });
    for (var i = 1; i <= numTemplates; i++) {
        $("input[name='msrpNum" + i + "']").rules('remove');
        $("input[name='mpgNum" + i + "']").rules('remove');
        $("input[name='msrpNum" + i + "']").rules('add', {
            required: true,
            min: 0,
            messages: {
                required: "MRSP is required.",
                min: "MSRP must be greater than 0."
            }
        });
        $("input[name='mpgNum" + i + "']").rules('add', {
            required: true,
            min: 0,
            messages: {
                required: "MPG is required.",
                min: "MPG must be greater than 0."
            }
        });
    }
}

// Take the data from the templates and make a table
function makeTable() {
    var arrMsrp = [], arrMpg = [];
    var headerRoot = $('#table-prices'), bodyRoot = $('#table-body');
    var gasPrice = $('#input-gas-price').val();
    // Get the values into an array
    $('#option-root').children('div').each(function() {
        arrMsrp.push($(this).find('.msrp').val());
        arrMpg.push($(this).find('.mpg').val());
    });
    // Make the header
    for (var i = 0; i < arrMsrp.length; i++) {
        headerRoot.html(headerRoot.html() + "\n<th>$" + arrMsrp[i] + "</th>");
    }
    // Fill in rows
    for (var i = 0; i < arrMpg.length; i++) {
        bodyRoot.html(function() {
            var result = bodyRoot.html() + "\n<tr>\n<th scope=\"row\">" + arrMpg[i] + " MPG</th>";
            for (var x = 0; x < arrMsrp.length; x++) {
                result += "\n<td>";
                result += "<p class=\"cost-per-mpg\">$" + Math.round((arrMsrp[x] / arrMpg[i])) + "</p>";
                gasAndMsrp = 100000 / arrMpg[i];
                gasAndMsrp *= gasPrice;
                gasAndMsrp += parseInt(arrMsrp[x]);
                result += "<p class=\"actual-cost\">$" + Math.round(gasAndMsrp) + "</p>";
                result += "</td>";
            }
            result += "\n</tr>";
            return result;
        });
    }
}