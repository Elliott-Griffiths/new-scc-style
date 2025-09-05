let initialProfileAddressLoad = false;

if (kdf.profileData['customerid'] && kdf.profileData['customerid'] !== "" 
 && kdf.profileData['profile-Postcode'] && kdf.profileData['profile-Postcode'] !== "") {
  initialProfileAddressLoad = true;
  $('#dform_widget_button_but_find_address_about_you').click();
}

if (
  action === "search-local-address" ||
  action === "search-national-address"
) {
  let targetPageId = getCurrentPageId();
  if (initialProfileAddressLoad === true) {
    initialProfileAddressLoad = false;
    targetPageId = "dform_page_page_about_you";
    setTimeout(function () {
      setProfileAddressDetails(targetPageId, kdf);
    }, 0);
  }

  if (action === "search-local-address") {
    addressSearchType[targetPageId] = "local";
  }
  if (action === "search-national-address") {
    addressSearchType[targetPageId] = "national";
  }

  const { propertySearchResult } = response.data;
  // if (propertySearchResult.length > 0) {
  const formattedSearchResult = propertySearchResult.map((addressLine) => {
    // Create a copy to avoid mutating the original object
    const newAddressLine = { ...addressLine };
    const parts = newAddressLine.label.split(",");
    newAddressLine.label =
      formatTitleCase(parts[0]) + "," + parts.slice(1).join(",");
    return newAddressLine;
  });
  setValuesToInputFields([
    { alias: "searchResult", value: formattedSearchResult },
  ]);

  const numberOfResults = propertySearchResult ? propertySearchResult.length : 0;

  const searchInput = document.querySelector(`#${targetPageId} input[data-customalias="postcode"]`);
  let searchButton = document.querySelector(`#${targetPageId} .address-search-btn`);

  const resultsList = document.querySelector(`#${targetPageId} .address-search-results`);
  let resultsLabelId = null;
  if (resultsList) {
    const labelElement = resultsList.querySelector('label');
    if (labelElement) {
      resultsLabelId = labelElement.id;
    }
  }

  let manualAddressElement = document.querySelector(`#${targetPageId} .manual-address-container`);
  let setAddressButton = document.querySelector(`#${targetPageId} .set-address-btn`);
  const searchedPostcode = searchInput ? searchInput.value : '';

  const resultsContent = `
      ${numberOfResults} addresses found for <strong>${searchedPostcode}</strong>.
      <button type="button" class="search-again-btn link-btn">Search again</button>
    `;

  if (resultsList && searchInput && searchButton) {
    let searchStatusMessageElement = document.getElementById(resultsLabelId);
    if (searchStatusMessageElement) {
      searchStatusMessageElement.innerHTML = resultsContent;
    }

    let selectElement = resultsList.querySelector('select');
    if (selectElement) {
      selectElement.style.display = 'block'; // Shows the element
    }

    searchButton = searchButton.id.replace('dform_widget_button_', '');

    if (manualAddressElement) {
      manualAddressElement = manualAddressElement.id.replace('dform_widget_html_', '');
    }
    if (setAddressButton) {
      setAddressButton = setAddressButton.id.replace('dform_widget_button_', '');
    }

    hideShowMultipleElements([
      { name: searchInput.name, display: "hide" },
      { name: searchButton, display: "hide" },
      { name: resultsList.dataset.name, display: "show" },
      { name: manualAddressElement, display: "show" },
      { name: setAddressButton, display: "show" },
    ]);
  }
}

function setProfileAddressDetails(targetPageId, kdf) {
  let {
    'profile-AddressNumber': property,
    'profile-AddressLine1': streetName,
    'profile-AddressLine2': locality,
    'profile-AddressLine4': city,
    'profile-Postcode': postcode,
  } = kdf.profileData;
  let subProperty, buildingName, buildingNumber, fullAddress;

  const addressSelectionSection = document.querySelector(`#${targetPageId} .address-selection-section`);
  const selectedAddressSpan = document.querySelector(`#${targetPageId} #selected-address`);

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
  let selectedAddressContainer = document.querySelector(`#${targetPageId} .selected-address-container`);
  if (selectedAddressContainer) {
    selectedAddressContainer.innerHTML = fullAddressDisplay;
    selectedAddressContainer = selectedAddressContainer.id.replace('dform_widget_html_', '');
  }

  if (addressSelectionSection) {
    addressSelectionSection.classList.add('dform_fieldsuccess');
  }

  if (selectedAddressSpan) {
    const addressParts = Object.values(addressDataForDisplay)
      .filter(Boolean)
      .join(', ');
    selectedAddressSpan.innerHTML = addressParts;
    selectedAddressSpan.classList.remove('dform_validationMessage');
  }

  const addressearchResults = document.querySelector(`#${targetPageId} .address-search-results`);
  let setAddressButton = document.querySelector(`#${targetPageId} .set-address-btn`);
  if (setAddressButton) {
    setAddressButton = setAddressButton.id.replace('dform_widget_button_', '');
  }
  const buttonContainer = document.querySelector(`#${targetPageId} .address-search-btn-container`);
  let manualAddressElement = document.querySelector(`#${targetPageId} .manual-address-container`);
  if (manualAddressElement) {
    manualAddressElement = manualAddressElement.id.replace('dform_widget_html_', '');
  }

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

  let findOnMapElement = document.querySelector(`#${targetPageId} .map-container`);
  if (findOnMapElement) {
    if (easting && northing) {
      plotLocationOnMap(easting, northing);
    }
    findOnMapElement = findOnMapElement.id.replace('dform_widget_html_', '');
  }

  console.log(addressearchResults.querySelector('select'), manualAddressElement);
  hideShowMultipleElements([
    { name: setAddressButton, display: "hide" },
    { name: selectedAddressContainer, display: "show" },
    { name: manualAddressElement, display: "hide" },
    { name: findOnMapElement, display: "hide" },
  ]);
}