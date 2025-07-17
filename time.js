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