// --- FORM LOAD ------------------------------------------------------------ \\

handleInitialisingEvent();

// --- FORM READY ----------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_ready')
  .on('_KDF_ready', function (event, kdf) {
    handleOnReadyEvent(event, kdf);

    const updateProfileField = (elementId, changeLinkId, removeLinkId, data, isSecure = false, isAddress = false, isRestrictedChange = false) => {
      const valueElement = document.getElementById(elementId);
      const changeLink = document.getElementById(changeLinkId);
      const removeLink = removeLinkId ? document.getElementById(removeLinkId) : null;

      const hasValue = data !== null && typeof data !== 'undefined' && data !== '';

      if (!hasValue) {
        valueElement.textContent = "Not provided";
        changeLink.textContent = "Add";
        if (removeLink) {
          removeLink.style.display = 'none';
        }
      } else {
        if (isSecure) {
          valueElement.textContent = '••••••••••••';
        } else if (isAddress) {
          valueElement.innerHTML = data;
        } else {
          valueElement.textContent = data;
        }

        if (isRestrictedChange) {
          changeLink.style.display = 'none';
          if (removeLink) {
            removeLink.style.display = 'inline-block';
          }
        } else {
          changeLink.textContent = "Change";
          changeLink.style.display = 'inline-block';
          if (removeLink) {
            removeLink.style.display = 'inline-block';
          }
        }
      }
    };

    const formatTitleCase = (str) => {
      if (!str) return '';
      return str.replace(/\b(\w)/g, char => char.toUpperCase());
    };

    const buildAddressMarkup = (address) => {
      return `${address.property}, ${address.streetName}<br>${address.city},<br>${address.postcode}`;
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return null;
      const dateObject = new Date(dateString);
      return {
        uk: {
          date: dateObject.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        }
      };
    };

    updateProfileField('name-value', 'name-change-link', null, kdf.profileData['profile-FullName']);
    updateProfileField('phone-value', 'phone-change-link', null, kdf.profileData['profile-TelephoneNumber']);
    updateProfileField('email-value', 'email-change-link', null, kdf.profileData['profile-Email']);

    updateProfileField('password-value', 'password-change-link', 'password-remove-link', '••••••••••••', true);

    const formattedAddress = {
      property: formatTitleCase(kdf.profileData['profile-AddressNumber']),
      streetName: formatTitleCase(kdf.profileData['profile-AddressLine1']),
      city: kdf.profileData['profile-AddressLine4'],
      postcode: kdf.profileData['profile-Postcode'],
    };
    const fullAddress = buildAddressMarkup(formattedAddress);
    updateProfileField('address-value', 'address-change-link', null, fullAddress, false, true);

    updateProfileField('ni-value', 'ni-change-link', 'ni-remove-link', kdf.profileData['profile-NationalInsuranceNumber'], true);
    updateProfileField('passport-value', 'passport-change-link', 'passport-remove-link', kdf.profileData['profile-PassportNumber'], true);
    updateProfileField('nhs-value', 'nhs-change-link', 'nhs-remove-link', kdf.profileData['profile-HealthNumber'], true);
    updateProfileField('driving-licence-value', 'driving-licence-change-link', 'driving-licence-remove-link', kdf.profileData['profile-DrivingLicenceNumber'], true);

    updateProfileField('dob-value', 'dob-change-link', 'dob-remove-link', formatDateTime(kdf.profileData['profile-DateOfBirth'])?.uk.date, false, false, true);
    updateProfileField('birth-place-value', 'birth-place-change-link', 'birth-place-remove-link', kdf.profileData['profile-PlaceOfBirth'], false, false, true);
    updateProfileField('nationality-value', 'nationality-change-link', 'nationality-remove-link', kdf.profileData['profile-Nationality']);
    updateProfileField('language-value', 'language-change-link', 'language-remove-link', kdf.profileData['profile-LanguagePreference']);
    updateProfileField('status-value', 'status-change-link', 'status-remove-link', kdf.profileData['profile-MaritalStatus']);
    updateProfileField('occupation-value', 'occupation-change-link', 'occupation-remove-link', kdf.profileData['profile-Occupation']);
  });

// --- PAGE CHANGES --------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_pageChange')
  .on('_KDF_pageChange', function (event, kdf, currentpageid, targetpageid) {
    handlePageChangeEvent(event, kdf, currentpageid, targetpageid);
  });

// --- FIELD CHANGES -------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_fieldChange')
  .on('_KDF_fieldChange', function (event, kdf, field) {
    handleFieldChangeEvent(event, kdf, field);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_optionSelected')
  .on('_KDF_optionSelected', function (event, kdf, field, label, val) {
    handleOptionSelectedEvent(event, kdf, field, label, val);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_rowSelected')
  .on('_KDF_rowSelected', function (event, kdf, tableid, row) {

  });

// --- MAP ACTIONS ---------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_mapReady')
  .on('_KDF_mapReady', function (event, kdf, type, name, map, positionLayer, markerLayer, marker, projection) {
    handleMapReadyEvent(event, kdf, type, name, map, positionLayer, markerLayer, marker, projection);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_mapClicked')
  .on('_KDF_mapClicked', function (event, kdf, type, name, map, positionLayer, markerLayer, marker, lat, lon, plat, plon) {
    handleMapClickEvent(event, kdf, type, name, map, positionLayer, markerLayer, marker, lat, lon, plat, plon);
  });

$('#dform_cpe_my_profile')
  .off('_Selected_Layer')
  .on('_Selected_Layer', function (event, kdf, layerName, layerAttributes) {
    handleSelectedMapLayerEvent(event, kdf, layerName, layerAttributes);
  });

$("#dform_cpe_my_profile")
  .off("_KDF_clearAttribute")
  .on("_KDF_clearAttribute", function (event, kdf) {
    handleClearMapFieldsEvent(event, kdf);
  });

// --- OBJECT --------------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_objectidSet')
  .on('_KDF_objectidSet', function (event, kdf, type, id) {
    handleObjectIdSet(event, kdf, type, id);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_objectdataLoaded')
  .on('_KDF_objectdataLoaded', function (event, kdf, response, type, id) {
    handleObjectIdLoaded(event, kdf, response, type, id);
  });

// --- CUSTOM ACTIONS ------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_custom')
  .on('_KDF_custom', function (event, kdf, response, action, actionedby) {
    handleSuccessfulAction(event, kdf, response, action, actionedby);
    console.log(action, response);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_customError')
  .on('_KDF_customError', function (event, customaction, xhr, settings, thrownError) {
    handleFailedAction(event, customaction, xhr, settings, thrownError);
  });

// --- SAVE FORM ------------------------------------------------------------ \\

$('#dform_cpe_my_profile')
  .off('_KDF_save')
  .on('_KDF_save', function (event, kdf) {
    handleFormSave(event, kdf);
  });

$('#dform_cpe_my_profile')
  .off('_KDF_saveError')
  .on('_KDF_saveError', function (event, kdf) {
    handleFailedSave();
  });

// --- COMPLETE FORM -------------------------------------------------------- \\

$('#dform_cpe_my_profile')
  .off('_KDF_complete')
  .on('_KDF_complete', function (event, kdf) {
    handleFomComplate(event, kdf);
  });

// --- FUNCTIONS ------------------------------------------------------------ \\
