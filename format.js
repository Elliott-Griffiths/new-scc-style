// --- VARIABLES ------------------------------------------------------------ \\

const validateAccountDetails = (details) => {
  const requiredKeys = [
    'CPE-token',
    'userType',
    'title',
    'forename',
    'surname',
    'dateOfBirth',
    'email',
    'phone',
    'property',
    'streetName',
    'city',
    'postcode',
    'uprm'
  ];

  for (const key of requiredKeys) {
    const value = details[key];
    if (value === null || typeof value === 'undefined' || value === '') {
      return false;
    }

    switch (key) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return false;
        }
        break;
      case 'dateOfBirth':
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value) || isNaN(new Date(value))) {
          return false;
        }
        break;
      case 'postcode':
        const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
        if (!postcodeRegex.test(value)) {
          return false;
        }
        break;
      case 'phone':
        const phoneRegex = /^\+?[0-9\s()-.]{7,25}$/;
        if (!phoneRegex.test(value)) {
          return false;
        }
        break;
    }
  }
  return true;
};

// --- FORM LOAD ------------------------------------------------------------ \\

handleInitialisingEvent();

// --- FORM READY ----------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_ready')
  .on('_KDF_ready', function (event, kdf) {
    handleOnReadyEvent(event, kdf);
    // $('#redirectUrl').attr("href", KDF.getParams()['redirectUrl']);
    $('#dform_widget_button_but_submit_about_you').click(function () {
      const accountDetails = {
        'CPE-token': KDF.getVal('CPE-token'),
        'userType': KDF.getVal('userType'),
        'title': KDF.getVal('sel_title'),
        'forename': KDF.getVal('txt_firstname'),
        'surname': KDF.getVal('txt_surname'),
        'dateOfBirth': KDF.getVal('dt_date_of_birth'),
        'email': KDF.getVal('eml_address'),
        'phone': KDF.getVal('tel_phone_number'),
        'property': KDF.getVal('txt_property_about_you'),
        'streetName': KDF.getVal('dform_widget_txt_street_name_about_you'),
        'city': KDF.getVal('txt_city_about_you'),
        'postcode': KDF.getVal('txt_postcode_about_you'),
        'uprm': KDF.getVal('txt_uprn_about_you')
      };

      if (validateAccountDetails(accountDetails)) {
        KDF.customdata('cpe-create-account', this.id, true, true, accountDetails);
      } else {
        KDF.checkProgress();
        window.scrollTo(0, 0);
      }
    });
  });

// --- PAGE CHANGES --------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_pageChange')
  .on('_KDF_pageChange', function (event, kdf, currentpageid, targetpageid) {
    handlePageChangeEvent(event, kdf, currentpageid, targetpageid);
  });

// --- FIELD CHANGES -------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_fieldChange')
  .on('_KDF_fieldChange', function (event, kdf, field) {
    handleFieldChangeEvent(event, kdf, field);
  });

$('#dform_cpe_create_account')
  .off('_KDF_optionSelected')
  .on('_KDF_optionSelected', function (event, kdf, field, label, val) {
    handleOptionSelectedEvent(event, kdf, field, label, val);
  });

// --- OBJECT --------------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_objectidSet')
  .on('_KDF_objectidSet', function (event, kdf, type, id) {
    handleObjectIdSet(event, kdf, type, id);
  });

$('#dform_cpe_create_account')
  .off('_KDF_objectdataLoaded')
  .on('_KDF_objectdataLoaded', function (event, kdf, response, type, id) {
    handleObjectIdLoaded(event, kdf, response, type, id);
  });

// --- CUSTOM ACTIONS ------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_custom')
  .on('_KDF_custom', function (event, kdf, response, action, actionedby) {
    handleSuccessfulAction(event, kdf, response, action, actionedby);

    if (action === "cpe-create-account") {
      KDF.gotoPage('registered', true, true, false);
    }
  });

$('#dform_cpe_create_account')
  .off('_KDF_customError')
  .on('_KDF_customError', function (event, customaction, xhr, settings, thrownError) {
    handleFailedAction(event, customaction, xhr, settings, thrownError);
  });

// --- SAVE FORM ------------------------------------------------------------ \\

$('#dform_cpe_create_account')
  .off('_KDF_save')
  .on('_KDF_save', function (event, kdf) {
    handleFormSave(event, kdf);
  });

$('#dform_cpe_create_account')
  .off('_KDF_saveError')
  .on('_KDF_saveError', function (event, kdf) {
    handleFailedSave();
  });

// --- COMPLETE FORM -------------------------------------------------------- \\

$('#dform_cpe_create_account')
  .off('_KDF_complete')
  .on('_KDF_complete', function (event, kdf) {
    handleFomComplate(event, kdf);
  });

// --- FUNCTIONS ------------------------------------------------------------ \\
