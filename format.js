function checkAddressHasBeenSet(action = "next page") {
  const currentPageId = getCurrentPageId();
  const selectedAddressSpan = document.querySelector(`#${currentPageId} #selected-address`);
  const fullAddress = document.querySelector(
    `#${currentPageId} input[data-customalias="fullAddress"]`
  );
  const fullAddressHasValue = KDF.getVal(fullAddress.name) ? true : false;
  const siteName = document.querySelector(
    `#${currentPageId} input[data-customalias="siteName"]`
  );
  const siteCode = document.querySelector(
    `#${currentPageId} input[data-customalias="siteCode"]`
  );
  if (fullAddressHasValue) {
    if (siteName && siteCode) {
      const siteNameHasValue = KDF.getVal(siteName.name) ? true : false;
      const siteCodeHasValue = KDF.getVal(siteCode.name) ? true : false;
      const validSiteCode = acceptGMSites
        ? true
        : KDF.getVal(siteCode.name).startsWith("344")
          ? true
          : false;
      if (siteNameHasValue && siteCodeHasValue && validSiteCode) {
        if (action === "submit") {
          KDF.gotoPage("complete", true, true, false);
        } else {
          KDF.gotoNextPage();
        }
      } else {
        const errorMessage = acceptGMSites
          ? defaultSelectedAddressMessage
          : "Choose a location on the public highway";
        if (selectedAddressSpan) {
          selectedAddressSpan.textContent = errorMessage;
          selectedAddressSpan.classList.add('dform_validationMessage');
          selectedAddressSpan.style.display = 'block';
        }
        $("#map_container").addClass("map_container_error");
      }
    } else {
      if (action === "submit") {
        KDF.gotoPage("complete", true, true, false);
      } else {
        KDF.gotoNextPage();
      }
    }
  } else {
    const mapElement = document.querySelector(`#${currentPageId} .map-container`);

    // Check if the map element exists on the page
    if (mapElement) {
      const detailsElement = mapElement.querySelector('.details-accordion');

      // Check if the map accordion is open
      if (detailsElement && detailsElement.hasAttribute('open')) {

        // const isMapContainerVisible = $("#map_container").is(":visible");
        const errorMessage = acceptGMSites
          ? defaultSelectedAddressMessage
          : "Choose a location on the public highway";
        if (selectedAddressSpan) {
          selectedAddressSpan.textContent = errorMessage;
          selectedAddressSpan.classList.add('dform_validationMessage');
          selectedAddressSpan.style.display = 'block';
        }
        $("#map_container").addClass("map_container_error");
      }
    } else {
      const searchResult = document.querySelector(
        `#${currentPageId} select[data-customalias="searchResult"]`
      );

      const isSearchResultVisible = searchResult.offsetParent !== null;
      if (isSearchResultVisible) {
        const searchResultContainer = searchResult.closest('.dform_widget_field');
        const validationMessage = searchResultContainer?.querySelector('.dform_validationMessage');
        const selectedValue = searchResult.value;
        let message = "Select the address";

        if (selectedValue !== '' && selectedValue !== 'Please select...') {
          const message = "Click use this address";
        }
        if (validationMessage) {
          validationMessage.style.display = "block";
          validationMessage.textContent = message;
        }
        searchResult.classList.add('dform_fielderror');
      } else {
        const postcode = document.querySelector(
          `#${currentPageId} input[data-customalias="postcode"]`
        );
        const postcodeContainer = postcode?.closest('.dform_widget_field');
        const validationMessage = postcodeContainer?.querySelector('.dform_validationMessage');
        const postcodeHasValue = postcode ? KDF.getVal(postcode.name) : false;
        let message = "Enter the postcode";
        if (postcodeHasValue) {
          message = "Click find address";
        }
        if (validationMessage) {
          validationMessage.style.display = "block";
          validationMessage.textContent = message;
        }
        postcode?.classList.add('dform_fielderror');
      }

    }
  }
}