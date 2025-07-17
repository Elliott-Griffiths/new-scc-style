// Ensure validation messages are hidden on load for both time and date fields
// $('.time-field').find('.dform_validationMessage').hide();
// $('.date-field').find('.dform_validationMessage').hide();

// --- Time Input Event Listeners ---
$('.time-hour, .time-minute').on('input', function (e) {
  const nextFieldId = $(this).hasClass('time-hour') ?
    'dform_widget_num_incident_occured_minute' :
    'dform_widget_sel_incident_occured_ampm';
  inputTime(this.id, nextFieldId);
});

$('.time-ampm').on('change blur', function () {
  const parentId = $(this).closest('.time-field').attr('id');
  const hourVal = $('#dform_widget_num_incident_occured_hour').val();
  const minuteVal = $('#dform_widget_num_incident_occured_minute').val();
  const ampm = $(this).val();

  const hour = (hourVal !== '' && hourVal !== null && hourVal !== undefined) ? parseInt(hourVal, 10) : NaN;
  const minute = (minuteVal !== '' && minuteVal !== null && minuteVal !== undefined) ? parseInt(minuteVal, 10) : NaN;

  handleTimeValidation(parentId, hour, minute, ampm);
});

$('.time-field').on('focusout', function (e) {
  if (!$(this).has(e.relatedTarget).length && e.relatedTarget !== this) {
    const parentId = $(this).attr('id');
    const hourVal = $('#dform_widget_num_incident_occured_hour').val();
    const minuteVal = $('#dform_widget_num_incident_occured_minute').val();
    const ampm = $('#dform_widget_sel_incident_occured_ampm').val();

    const hour = (hourVal !== '' && hourVal !== null && hourVal !== undefined) ? parseInt(hourVal, 10) : NaN;
    const minute = (minuteVal !== '' && minuteVal !== null && minuteVal !== undefined) ? parseInt(minuteVal, 10) : NaN;

    handleTimeValidation(parentId, hour, minute, ampm);
  }
});

// Add a listener to the native HTML5 time input to display its value
$('#dform_widget_time_incident_occured[type="time"]').on('input change', function () {
  $('#display_formatted_24hr').text($(this).val());
});

// --- Date Input Event Listeners ---
$('.date-dd, .date-mm, .date-yy').on("input", function (e) {
  const currentId = this.id;
  let nextFieldId = null;
  if ($(this).hasClass('date-dd')) {
    nextFieldId = `${currentId.slice(0, -2)}mm`;
  } else if ($(this).hasClass('date-mm')) {
    nextFieldId = `${currentId.slice(0, -2)}yy`;
  }
  inputDate(currentId, nextFieldId);
}); // Removed .on("blur") from here

// Main validation trigger for the entire date component: when any child loses focus AND
// the focus moves outside the parent container.
$('.date-field').on('focusout', function (e) {
  if (!$(this).has(e.relatedTarget).length && e.relatedTarget !== this) {
    const parentId = $(this).attr('id');
    // Pad with leading zero if needed before parsing for validation
    const ddVal = $('#dform_widget_num_passport_issued_dd').val();
    const mmVal = $('#dform_widget_num_passport_issued_mm').val();

    if (ddVal) $('#dform_widget_num_passport_issued_dd').val(ddVal.padStart(2, "0"));
    if (mmVal) $('#dform_widget_num_passport_issued_mm').val(mmVal.padStart(2, "0"));

    const dd = (ddVal !== '' && ddVal !== null && ddVal !== undefined) ? parseInt(ddVal, 10) : NaN;
    const mm = (mmVal !== '' && mmVal !== null && mmVal !== undefined) ? parseInt(mmVal, 10) : NaN;
    const yy = (($('#dform_widget_num_passport_issued_yy').val() !== '' && $('#dform_widget_num_passport_issued_yy').val() !== null && $('#dform_widget_num_passport_issued_yy').val() !== undefined)) ? parseInt($('#dform_widget_num_passport_issued_yy').val(), 10) : NaN;
    handleDateValidation(parentId, dd, mm, yy);
  }
});

// Add a listener to the native HTML5 date input to display its value
$('#dform_widget_dt_passport_issued[type="date"]').on('input change', function () {
  $('#display_formatted_native_date').text($(this).val());
});

// --- Time Functions ---
/**
 * Handles the validation logic for the time input fields.
 * @param {string} parentId - The base ID for the time field container.
 * @param {number} hour - The hour value.
 * @param {number} minute - The minute value.
 * @param {string} ampm - The AM/PM value.
 */
function handleTimeValidation(parentId, hour, minute, ampm) {
  const baseMessage = "Enter a valid time";

  $(`#${parentId} .time-hour, #${parentId} .time-minute, #${parentId} .time-ampm`).removeClass('dform_fielderror');
  $(`#${parentId}`).find('.dform_validationMessage').text(baseMessage).hide();

  let hasError = false;
  let errorMsg = "";
  const errorFields = [];
  const timeFields = ['time-hour', 'time-minute', 'time-ampm'];

  const errorConditions = [
    {
      condition: isNaN(hour) && isNaN(minute) && !ampm,
      message: "Please enter the hour, minute, and select AM or PM.",
      fields: timeFields
    },
    {
      condition: !isNaN(hour) && !isNaN(minute) && !ampm,
      message: "Please select AM or PM.",
      fields: ['time-ampm']
    },
    {
      condition: !isNaN(hour) && isNaN(minute) && ampm,
      message: "Please enter the minute.",
      fields: ['time-minute']
    },
    {
      condition: isNaN(hour) && !isNaN(minute) && ampm,
      message: "Please enter the hour.",
      fields: ['time-hour']
    },
    {
      condition: !isNaN(hour) && isNaN(minute) && !ampm,
      message: "Please enter the minute and select AM or PM.",
      fields: ['time-minute', 'time-ampm']
    },
    {
      condition: isNaN(hour) && !isNaN(minute) && !ampm,
      message: "Please enter the hour and select AM or PM.",
      fields: ['time-hour', 'time-ampm']
    },
    {
      condition: isNaN(hour) && isNaN(minute) && ampm,
      message: "Please enter the hour and minute.",
      fields: ['time-hour', 'time-minute']
    },
    {
      condition: hour > 12 || hour < 1,
      message: "Hour must be between 1 and 12.",
      fields: ['time-hour']
    },
    {
      condition: minute > 59 || minute < 0,
      message: "Minute must be between 00 and 59.",
      fields: ['time-minute']
    },
    {
      condition: (isNaN(hour) || isNaN(minute) || !ampm),
      message: baseMessage,
      fields: timeFields
    }
  ];

  for (const condition of errorConditions) {
    if (condition.condition) {
      hasError = true;
      errorMsg = condition.message;
      errorFields.push(...condition.fields);
      break;
    }
  }

  if (hasError) {
    errorFields.forEach(field => {
      $(`#${parentId} .${field}`).addClass('dform_fielderror');
    });
    $(`#${parentId}`).find('.dform_validationMessage').text(errorMsg).show();
    $(`#dform_widget_txt_incident_occured`).val('');
    $(`#dform_widget_time_incident_occured[type="time"]`).val('');

    $('#display_formatted_ampm').text('N/A');
    $('#display_formatted_24hr').text('N/A');
    return;
  }

  if (hour !== null && !isNaN(hour) && minute !== null && !isNaN(minute) && ampm) {
    const formattedAmpm = formatTimeInput(hour, minute, ampm);
    const formatted24hr = formatTimeForSubmission(hour, minute, ampm);

    $(`#dform_widget_txt_incident_occured`).val(formattedAmpm);
    $(`#dform_widget_time_incident_occured[type="time"]`).val(formatted24hr);

    $('#display_formatted_ampm').text(formattedAmpm);
    $('#display_formatted_24hr').text(formatted24hr);
  }
  $(`#dform_widget_txt_incident_occured`).change();
  $(`#dform_widget_time_incident_occured[type="time"]`).change();
}

/**
 * Handles auto-tabbing to the next input field when max length is reached.
 * @param {string} id - The ID of the current input field.
 * @param {string} nextID - The ID of the next input field to focus on.
 */
function inputTime(id, nextID) {
  const maxLength = $(`#${id}`).attr('maxlength');
  let value = $(`#${id}`).val();

  if (value.length >= maxLength) {
    $(`#${id}`).val(value.substring(0, maxLength));
    if (nextID) {
      $(`#${nextID}`).focus();
    } else {
      $(`#${id}`).blur();
    }
  }
}

/**
 * Formats the time for display in the hidden text input (e.g., "9:15am").
 * @param {number} hour - The hour (1-12).
 * @param {number} minute - The minute (0-59).
 * @param {string} ampm - "AM" or "PM".
 * @returns {string} The formatted time string.
 */
function formatTimeInput(hour, minute, ampm) {
  const paddedMinute = minute.toString().padStart(2, '0');
  return `${hour}:${paddedMinute}${ampm.toLowerCase()}`;
}

/**
 * Formats the time for submission (24-hour format, e.g., "09:15" or "15:25").
 * @param {number} hour - The hour (1-12).
 * @param {number} minute - The minute (0-59).
 * @param {string} ampm - "AM" or "PM".
 * @returns {string} The formatted time string in 24-hour format.
 */
function formatTimeForSubmission(hour, minute, ampm) {
  let hours24 = hour;
  if (ampm === 'PM' && hour !== 12) {
    hours24 += 12;
  } else if (ampm === 'AM' && hour === 12) {
    hours24 = 0; // 12 AM is 00 in 24-hour format
  }
  const paddedHour = hours24.toString().padStart(2, '0');
  const paddedMinute = minute.toString().padStart(2, '0');
  return `${paddedHour}:${paddedMinute}`;
}

// --- Date Functions ---
function handleDateValidation(parentId, dd, mm, yy) {
  const baseMessage = "Enter the date your passport was issued";

  $(`#${parentId} .date-dd, #${parentId} .date-mm, #${parentId} .date-yy`).removeClass("dform_fielderror");
  $(`#${parentId}`).find(".dform_validationMessage").text(baseMessage).hide();

  let hasError = false;
  let errorMsg = "";
  const errorFields = [];
  const dateFields = ["date-dd", "date-mm", "date-yy"];

  const errorConditions = [
    {
      condition: isNaN(dd) && isNaN(mm) && isNaN(yy),
      message: "Please enter the day, month, and year.",
      fields: dateFields,
    },
    {
      condition: !isNaN(dd) && !isNaN(mm) && isNaN(yy),
      message: "Please enter the year.",
      fields: ["date-yy"],
    },
    {
      condition: !isNaN(dd) && isNaN(mm) && !isNaN(yy),
      message: "Please enter the month.",
      fields: ["date-mm"],
    },
    {
      condition: isNaN(dd) && !isNaN(mm) && !isNaN(yy),
      message: "Please enter the day.",
      fields: ["date-dd"],
    },
    {
      condition: !isNaN(dd) && isNaN(mm) && isNaN(yy),
      message: "Please enter the month and year.",
      fields: ["date-mm", "date-yy"],
    },
    {
      condition: isNaN(dd) && !isNaN(mm) && isNaN(yy),
      message: "Please enter the day and year.",
      fields: ["date-dd", "date-yy"],
    },
    {
      condition: isNaN(dd) && isNaN(mm) && !isNaN(yy),
      message: "Please enter the day and month.",
      fields: ["date-dd", "date-mm"],
    },
    // Range validations
    {
      condition: dd > 31 || dd < 1,
      message: "Day must be between 1 and 31.",
      fields: ["date-dd"],
    },
    {
      condition: mm > 12 || mm < 1,
      message: "Month must be between 1 and 12.",
      fields: ["date-mm"],
    },
    {
      condition: yy.toString().length !== 4, // Assuming year must be 4 digits
      message: "Year must be a 4-digit number.",
      fields: ["date-yy"],
    },
    // Fallback for any other unexpected state
    {
      condition: (isNaN(dd) || isNaN(mm) || isNaN(yy)),
      message: baseMessage,
      fields: dateFields
    }
  ];

  for (const condition of errorConditions) {
    if (condition.condition) {
      hasError = true;
      errorMsg = condition.message;
      errorFields.push(...condition.fields);
      break;
    }
  }

  if (hasError) {
    errorFields.forEach((field) => {
      $(`#${parentId} .${field}`).addClass("dform_fielderror");
    });
    $(`#${parentId}`).find(".dform_validationMessage").text(errorMsg).show();
    $(`#dform_widget_txt_passport_issued`).val("");
    $(`#dform_widget_dt_passport_issued[type="date"]`).val("");
    $('#display_formatted_date').text('N/A');
    $('#display_formatted_native_date').text('N/A');
    return;
  }

  if (dd !== null && !isNaN(dd) && mm !== null && !isNaN(mm) && yy !== null && !isNaN(yy)) {
    if (validDate(parentId, dd, mm, yy, null, baseMessage)) {
      const date = `${yy.toString().padStart(4, "0")}-${mm
        .toString()
        .padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
      const localFormat = new Date(date).toLocaleDateString("en-GB");
      $(`#dform_widget_txt_passport_issued`).val(localFormat);
      $(`#dform_widget_dt_passport_issued[type="date"]`).val(date);
      $('#display_formatted_date').text(localFormat);
      $('#display_formatted_native_date').text(date);
    } else {
      $(`#dform_widget_txt_passport_issued`).val("");
      $(`#dform_widget_dt_passport_issued[type="date"]`).val("");
      $('#display_formatted_date').text('N/A');
      $('#display_formatted_native_date').text('N/A');
      $(`#${parentId} .date-dd, #${parentId} .date-mm, #${parentId} .date-yy`).addClass("dform_fielderror");
    }
  }
  $(`#dform_widget_txt_passport_issued`).change();
  $(`#dform_widget_dt_passport_issued[type="date"]`).change();
}

function checkMaxDay(id, dd, mm, yy) {
  const ddMax = new Date(yy, mm, 0).getDate();
  $(`#${id} .date-dd`).attr("max", ddMax);
  if (dd > ddMax) {
    $(`#${id} .date-dd`).addClass("dform_fielderror");
    $(`#${id}`)
      .find(".dform_validationMessage")
      .text(`Day must be a real date for the selected month and year.`)
      .show();
  } else if (dd) {
    $(`#${id} .date-dd`).removeClass("dform_fielderror");
  }

  if (mm > 12) {
    $(`#${id} .date-mm`).addClass("dform_fielderror");
    $(`#${id}`)
      .find(".dform_validationMessage")
      .text(`Month must be between 1 and 12.`)
      .show();
  } else if (mm) {
    $(`#${id} .date-mm`).removeClass("dform_fielderror");
  }
}

function calculateRelativeDate(relativeDate, now) {
  const match = relativeDate.match(/(-?\d+)([YMD])/);
  if (!match) {
    return new Date(relativeDate); // Try to parse as a normal date
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const newDate = new Date(now);
  switch (unit) {
    case "Y":
      newDate.setFullYear(now.getFullYear() + value);
      break;
    case "M":
      newDate.setMonth(now.getMonth() + value);
      break;
    case "D":
      newDate.setDate(now.getDate() + value);
      break;
  }
  return newDate;
}

function getMinMaxDates(dateElementId) {
  const $dateElement = $(`#${dateElementId}`);
  if ($dateElement.length === 0) {
    return { minDate: null, maxDate: null };
  }
  let minDateAttr = $dateElement.attr("data-mindate");
  let maxDateAttr = $dateElement.attr("data-maxdate");

  const now = new Date();
  let minDate = minDateAttr ? calculateRelativeDate(minDateAttr, now) : null;
  let maxDate = maxDateAttr ? calculateRelativeDate(maxDateAttr, now) : null;

  if (minDate) minDate.setHours(0, 0, 0, 0);
  if (maxDate) maxDate.setHours(0, 0, 0, 0);

  return { minDate, maxDate };
}

function inputDate(id, nextID) {
  const maxLength = $(`#${id}`).attr("maxlength");
  let value = $(`#${id}`).val();
  if (value.length >= maxLength) {
    $(`#${id}`).val(value.substring(0, maxLength));
    if (nextID) {
      $(`#${nextID}`).focus();
    } else {
      $(`#${id}`).blur();
    }
  }
}

function checkDateRelationship(date1, date2, rule) {
  if (rule === "before") {
    return date1 < date2;
  } else if (rule === "after") {
    return date1 > date2;
  }
  return true;
}

function getYearLabel(years) {
  return years === 1 ? "year" : "years";
}

function validDate(id, day, month, year, activeField, baseMessage) {
  const validationMsg = $(`#${id}`).find(".dform_validationMessage").text("").hide();
  const inputDate = new Date(year, month - 1, day);

  // Check for invalid date (e.g., Feb 30th)
  if (inputDate.getFullYear() !== year || inputDate.getMonth() + 1 !== month || inputDate.getDate() !== day) {
    validationMsg.text(`Date must be a real date.`).show();
    return false;
  }

  const dateElementId = id.replace("_date_", "_dt_");
  const { minDate, maxDate } = getMinMaxDates(dateElementId);

  if (minDate && inputDate < minDate) {
    const today = new Date();
    const yearsPast = today.getFullYear() - minDate.getFullYear();
    validationMsg.text(
      yearsPast > 0
        ? `Date cannot be more than ${yearsPast} ${getYearLabel(yearsPast)} in the past`
        : `Date must be today or in the future`
    ).show();
    return false;
  }

  if (maxDate && inputDate > maxDate) {
    const today = new Date();
    const yearsFuture = maxDate.getFullYear() - today.getFullYear();
    validationMsg.text(
      yearsFuture > 0
        ? `Date cannot be more than ${yearsFuture} ${getYearLabel(yearsFuture)} in the future`
        : `Date must be today or in the past`
    ).show();
    return false;
  }

  return true;
}

// Initial update of display spans on load
$(document).ready(function () {
  // Time fields
  const hourVal = $('#dform_widget_num_incident_occured_hour').val();
  const minuteVal = $('#dform_widget_num_incident_occured_minute').val();
  const ampm = $('#dform_widget_sel_incident_occured_ampm').val();

  const hour = (hourVal !== '' && hourVal !== null && hourVal !== undefined) ? parseInt(hourVal, 10) : NaN;
  const minute = (minuteVal !== '' && minuteVal !== null && minuteVal !== undefined) ? parseInt(minuteVal, 10) : NaN;

  if (hour !== null && !isNaN(hour) && minute !== null && !isNaN(minute) && ampm) {
    $('#display_formatted_ampm').text(formatTimeInput(hour, minute, ampm));
    $('#display_formatted_24hr').text(formatTimeForSubmission(hour, minute, ampm));
  } else {
    $('#display_formatted_ampm').text('N/A');
    $('#display_formatted_24hr').text('N/A');
  }

  // Date fields
  const ddVal = $('#dform_widget_num_passport_issued_dd').val();
  const mmVal = $('#dform_widget_num_passport_issued_mm').val();
  const yyVal = $('#dform_widget_num_passport_issued_yy').val();

  const dd = ddVal ? parseInt(ddVal, 10) : NaN;
  const mm = mmVal ? parseInt(mmVal, 10) : NaN;
  const yy = yyVal ? parseInt(yyVal, 10) : NaN;

  if (dd && mm && yy) {
    const date = `${yy.toString().padStart(4, "0")}-${mm
      .toString()
      .padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;
    const localFormat = new Date(date).toLocaleDateString("en-GB");
    $('#display_formatted_date').text(localFormat);
    $('#display_formatted_native_date').text(date);
  } else {
    $('#display_formatted_date').text('N/A');
    $('#display_formatted_native_date').text('N/A');
  }

  // Set min/max for year input based on data attributes
  $('.date-yy')
    .attr("min", function () {
      const minDate = $(this)
        .closest(".container")
        .find("input[type='date']")
        .data("mindate");
      const now = new Date();
      const calculatedMinDate = minDate ? calculateRelativeDate(minDate, now) : null;
      return calculatedMinDate ? calculatedMinDate.getFullYear() : '';
    })
    .attr("max", function () {
      const maxDate = $(this)
        .closest(".container")
        .find("input[type='date']")
        .data("maxdate");
      const now = new Date();
      const calculatedMaxDate = maxDate ? calculateRelativeDate(maxDate, now) : null;
      return calculatedMaxDate ? calculatedMaxDate.getFullYear() : '';
    });
});