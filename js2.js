if (
    action === "retrieve-local-address" ||
    action === "retrieve-national-address" ||
    action === "retrieve-location-from-coordinates"
  ) {
    let {
      subProperty,
      buildingName,
      buildingNumber,
      property,
      streetName,
      locality,
      city,
      postcode,
      fullAddress,
      propertyId,
      uprn,
      easting,
      northing,
      streetId,
      usrn,
      status,
      message,
      ohmsUprn,
      propertyClass,
      managementCode,
      area,
      ward,
      officer,
      areaContact,
      officerContact,
    } = response.data;
    
    const currentPageId = getCurrentPageId();

    const addressSelectionSection = document.querySelector(`#${currentPageId} .address-selection-section`);
    const selectedAddressSpan = document.querySelector(`#${currentPageId} #selected-address`);
    
    if (status == 400 && action === "retrieve-location-from-coordinates") {
      if (addressSelectionSection) {
        addressSelectionSection.classList.add('dform_fielderror');
      }

      if (selectedAddressSpan) {
        selectedAddressSpan.textContent = message;
        selectedAddressSpan.classList.add('dform_validationMessage');
        selectedAddressSpan.style.display = 'block';
      }
      return;
    }

    const addressDataForDisplay = {
      subProperty: subProperty ? formatTitleCase(subProperty) : '',
      buildingName: buildingName ? formatTitleCase(buildingName) : '',
      buildingNumber: buildingNumber ? formatTitleCase(buildingNumber) : '',
      property: property ? formatTitleCase(property) : '',
      streetName: streetName ? formatTitleCase(streetName) : '',
      locality: locality ? formatTitleCase(locality) : '',
      city: city ? formatTitleCase(city) : '',
      postcode: postcode ? postcode.toUpperCase() : ''
    };

    const fullAddressDisplay = buildAddressMarkup(addressDataForDisplay);
    const selectedAddressContainer = document.querySelector(`#${currentPageId} .selected-address-container`);
    if (selectedAddressContainer) {
        selectedAddressContainer.innerHTML = fullAddressDisplay;
    }

    if (addressSelectionSection) {
      addressSelectionSection.classList.add('dform_fieldsuccess');
    }

    if (selectedAddressSpan) {
      selectedAddressSpan.textContent = fullAddressDisplay;
    }

    const addressearchResults = document.querySelector(`#${currentPageId} .address-search-results`);
    const setAddressButton = document.querySelector(`#${currentPageId} .set-address-btn`);
    const buttonContainer = document.querySelector(`#${currentPageId} .address-search-btn-container`);
    const manualAddressElement = document.querySelector(`#${currentPageId} .manual-address-container`);

    property = formatTitleCase(property);
    streetName = formatTitleCase(streetName);
    fullAddress = `${formatTitleCase(property)} ${formatTitleCase(
      streetName
    )}, ${city}, ${postcode}`;

    setValuesToInputFields([
      { alias: "property", value: property },
      { alias: "streetName", value: streetName },
      { alias: "city", value: city },
      { alias: "postCode", value: postcode },
      { alias: "fullAddress", value: fullAddress },
      { alias: "uprn", value: uprn },
      { alias: "usrn", value: usrn },
      { alias: "siteName", value: streetName },
      { alias: "siteCode", value: usrn },
      { alias: "propertyId", value: propertyId },
      { alias: "streetId", value: streetId },
      { alias: "easting", value: easting },
      { alias: "northing", value: northing },
      { alias: "ohmsUprn", value: ohmsUprn },
      { alias: "propertyClass", value: propertyClass },
      { alias: "managementCode", value: managementCode },
      { alias: "area", value: area },
      { alias: "ward", value: ward },
      { alias: "officer", value: officer },
      { alias: "areaContact", value: areaContact },
      { alias: "officerContact", value: officerContact },
    ]);

    if (addressearchResults) {
      const selectElement = addressearchResults.querySelector('select');
      if (selectElement) {
        selectElement.style.display = 'none'; // Hides the element
        selectElement.classList.remove('dform_fielderror');
      }
      const validationMessage = addressearchResults?.querySelector('.dform_validationMessage');
      if (validationMessage) {
        validationMessage.style.display = "none";
        validationMessage.textContent = "Select the address";
      }
    }
    
    if (buttonContainer) {
      buttonContainer.style.display = 'none'; // Hides the element
    }

    hideShowMultipleElements([
      { name: setAddressButton.id.replace('dform_widget_button_', ''), display: "hide" },
      { name: selectedAddressContainer.id.replace('dform_widget_html_', ''), display: "show" },
      { name: manualAddressElement.id.replace('dform_widget_html_', ''), display: "hide" },
    ]);
  }