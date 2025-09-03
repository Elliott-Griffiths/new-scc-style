// --- FORM LOAD ------------------------------------------------------------ \\

(() => {
  const schoolTermSpan = document.querySelector('.schoolTerm');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

  // Check if the current date is between August 1 and December 31
  if (currentMonth >= 8) {
    const nextYear = currentYear + 1;
    schoolTermSpan.textContent = `${currentYear} - ${nextYear}`;
  }
  // Else, the date is between January 1 and July 31
  else {
    const previousYear = currentYear - 1;
    schoolTermSpan.textContent = `${previousYear} - ${currentYear}`;
  }
})();

handleInitialisingEvent();

// --- FORM READY ----------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_ready')
  .on('_KDF_ready', function (event, kdf) {
    handleOnReadyEvent(event, kdf);

    KDF.disableNavToLastPage();

    $('#dform_widget_button_but_my_requests').on('click', function () {
      window.location.href = `${PORTAL_URL}/requests`;
    });

    $('#dform_widget_button_but_my_saved_drafts').on('click', function () {
      window.location.href = `${PORTAL_URL}/requests?type=drafts`;
    });

    $('#dform_widget_button_but_my_profile').on('click', function () {
      window.location.href = `${PORTAL_URL}/profile`;
    });

// ---------------------------------------- \\
// --- EXAMPLE ---------------------------- \\

    setCouncilTaxBand("D");

    const sitesToDisplay = [
      "Greaves Lane",
      "Longley Avenue West"
    ];
    setRecyclingSites(sitesToDisplay);

    function getFormattedDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const collectionData = [{
      bin: "Blue Bin",
      due: getFormattedDate(today),
      issues: false
    }, {
      bin: "Black Bin",
      due: getFormattedDate(sevenDaysFromNow),
      issues: false
    }];
    const uprn = "100050940900";
    buildBinCards(collectionData, uprn);

    const locationsData = [{
      title: "Library",
      address: [
        "Sheffield Central Library",
        "Surrey St,",
        "Sheffield City Centre,",
        "Sheffield S1 1XZ"
      ],
      mapLink: "https://www.google.com/maps/place/Beighton+Road+HWRC/@53.3538879,-1.3551176,399m/data=!3m1!1e3!4m6!3m5!1s0x48799de8ccc686fd:0x40642cb8ee4d63ef!8m2!3d53.3541255!4d-1.3524958!16s%2Fg%2F11y1dx8gr1?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
      openingTimes: [{
        days: "Monday, Tuesday, Wednesday and Friday",
        hours: "9am to 4pm"
      }, {
        days: "Thursdays",
        hours: "Closed"
      }]
    }, {
      title: "Neighbourhood Office",
      address: [
        "Chambers Court",
        "1b Station Road,",
        "Chapeltown,",
        "Sheffield S35 2XE"
      ],
      mapLink: "https://www.google.com/maps/place/Blackstock+Road+HWRC/@53.3503537,-1.4512779,159m/data=!3m1!1e3!4m6!3m5!1s0x487983e7b570cfaf:0xdbe2e10d468af211!8m2!3d53.3502496!4d-1.4501577!16s%2Fg%2F11v9cf7vvx?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
      openingTimes: [{
        days: "Monday, Tuesday, Wednesday and Friday",
        hours: "9am to 4pm"
      }, {
        days: "Thursdays",
        hours: "Closed"
      }]
    }];
    buildNearestCards(locationsData);

    const contactData = [{
      title: "Councillors",
      introText: "Your 3 Manor Castle councillors:",
      contacts: [{
        name: "Laura Moynahan",
        link: "https://democracy.sheffield.gov.uk/mgUserInfo.aspx?UID=36917",
        info: "Labour"
      }, {
        name: "Terry Fox",
        link: "https://democracy.sheffield.gov.uk/mgUserInfo.aspx?UID=156",
        info: "Community Councillors Group"
      }, {
        name: "Elle Dodd",
        link: "https://democracy.sheffield.gov.uk/mgUserInfo.aspx?UID=37910",
        info: "Labour"
      }]
    }];

    buildContactCards(contactData);

// ---------------------------------------- \\
// ---------------------------------------- \\

    $('#your-requests-link').on('click', function (event) {
      event.preventDefault();
      window.location.href = `${PORTAL_URL}/requests`;
    });

    $('#edit-profile-link').on('click', function (event) {
      event.preventDefault();
      window.location.href = `${PORTAL_URL}/profile?a=edit`;
    });
  });

// --- PAGE CHANGES --------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_pageChange')
  .on('_KDF_pageChange', function (event, kdf, currentpageid, targetpageid) {
    handlePageChangeEvent(event, kdf, currentpageid, targetpageid);
  });

// --- FIELD CHANGES -------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_fieldChange')
  .on('_KDF_fieldChange', function (event, kdf, field) {
    handleFieldChangeEvent(event, kdf, field);
  });

$('#dform_cpe_dashboard')
  .off('_KDF_optionSelected')
  .on('_KDF_optionSelected', function (event, kdf, field, label, val) {
    handleOptionSelectedEvent(event, kdf, field, label, val);
  });

// --- OBJECT --------------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_objectidSet')
  .on('_KDF_objectidSet', function (event, kdf, type, id) {
    handleObjectIdSet(event, kdf, type, id);
  });

$('#dform_cpe_dashboard')
  .off('_KDF_objectdataLoaded')
  .on('_KDF_objectdataLoaded', function (event, kdf, response, type, id) {
    handleObjectIdLoaded(event, kdf, response, type, id);
  });

// --- CUSTOM ACTIONS ------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_custom')
  .on('_KDF_custom', function (event, kdf, response, action, actionedby) {
    handleSuccessfulAction(event, kdf, response, action, actionedby);
  });

$('#dform_cpe_dashboard')
  .off('_KDF_customError')
  .on('_KDF_customError', function (event, customaction, xhr, settings, thrownError) {
    handleFailedAction(event, customaction, xhr, settings, thrownError);
  });

// --- SAVE FORM ------------------------------------------------------------ \\

$('#dform_cpe_dashboard')
  .off('_KDF_save')
  .on('_KDF_save', function (event, kdf) {
    handleFormSave(event, kdf);
  });

$('#dform_cpe_dashboard')
  .off('_KDF_saveError')
  .on('_KDF_saveError', function (event, kdf) {
    handleFailedSave();
  });

// --- COMPLETE FORM -------------------------------------------------------- \\

$('#dform_cpe_dashboard')
  .off('_KDF_complete')
  .on('_KDF_complete', function (event, kdf) {
    handleFomComplate(event, kdf);
  });

// --- FUNCTIONS ------------------------------------------------------------ \\

/**
 * Updates the council tax band displayed on the page.
 *
 * @param {string} band - The council tax band to display (e.g., "A", "B", "C", "D").
 */
function setCouncilTaxBand(band) {
  // Select the <span> element by its ID
  const taxBandSpan = document.getElementById('taxBand');

  // Check if the element exists to prevent errors
  if (taxBandSpan) {
    // Update the text content to the new band
    taxBandSpan.textContent = `Council Tax Band ${band}`;
  } else {
    console.error("The element with ID 'taxBand' was not found.");
  }
}

/**
 * Dynamically builds a list of specific recycling sites and their links.
 *
 * @param {string[]} siteNames - An array of site names to display.
 */
function setRecyclingSites(siteNames) {
  // Master data object with all recycling sites and their unique URLs.
  const recyclingSiteData = {
    "Greaves Lane": "https://www.google.com/maps/place/High+Green+Greaves+Lane+HWRC/@53.4792861,-1.4954401,398m/data=!3m1!1e3!4m6!3m5!1s0x48797bfe06ca2d1f:0xb84865762be9eb3a!8m2!3d53.4792864!4d-1.4932575!16s%2Fg%2F11vbzklvfb?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
    "Longley Avenue West": "https://www.google.com/maps/place/Shirecliffe+Hillsborough+HWRC/@53.4106324,-1.479326,181m/data=!3m1!1e3!4m6!3m5!1s0x487979ea80f2cdb9:0x44d689033e29cada!8m2!3d53.4107034!4d-1.4788604!16s%2Fg%2F11kqb_cwfy?entry=tts&g_ep=EgoyMDI1MDMxOS4yIPu8ASoASAFQAw%3D%3D",
    "Beighton Road": "https://www.google.com/maps/place/Beighton+Road+HWRC/@53.3538879,-1.3551176,399m/data=!3m1!1e3!4m6!3m5!1s0x48799de8ccc686fd:0x40642cb8ee4d63ef!8m2!3d53.3541255!4d-1.3524958!16s%2Fg%2F11y1dx8gr1?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
    "Blackstock Road": "https://www.google.com/maps/place/Blackstock+Road+HWRC/@53.3503537,-1.4512779,159m/data=!3m1!1e3!4m6!3m5!1s0x487983e7b570cfaf:0xdbe2e10d468af211!8m2!3d53.3502496!4d-1.4501577!16s%2Fg%2F11v9cf7vvx?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
    "Manchester Road": "https://www.google.com/maps/place/Deepcar+HWRC/@53.4732228,-1.5651897,398m/data=!3m1!1e3!4m6!3m5!1s0x48797d0bb19d1c1d:0xd5e4727b277ceb46!8m2!3d53.4729928!4d-1.5633536!16s%2Fg%2F11y5mjfsd7?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
  };

  // Select the parent <ul> element where the links will be placed.
  const linksList = document.querySelector('.card.recycling .links');

  // Check if the element was found.
  if (!linksList) {
    console.error("The '.card.recycling .links' element was not found.");
    return;
  }

  // Clear any existing hard-coded list items
  linksList.innerHTML = '';

  // Loop through the provided array of site names.
  siteNames.forEach(siteName => {
    const siteUrl = recyclingSiteData[siteName]; // Get the URL from the master data.

    // Only create a link if the site name exists in the master data.
    if (siteUrl) {
      // Create a new list item (<li>) and link (<a>).
      const li = document.createElement('li');
      const a = document.createElement('a');

      // Set the link's text and its unique href.
      a.textContent = siteName;
      a.href = siteUrl;

      // Append the link to the list item and the list item to the <ul>.
      li.appendChild(a);
      linksList.appendChild(li);
    }
  });
}

/**
 * Dynamically builds and updates the bin collection cards and status banner.
 *
 * @param {object[]} collections - An array of objects, each containing bin collection data.
 * @param {string} uprn - The UPRN (Unique Property Reference Number) for the dynamic link.
 */
function buildBinCards(collections, uprn) {
  const container = document.querySelector('.waste-recycling-container');
  if (!container) {
    console.error("Container '.waste-recycling-container' not found.");
    return;
  }

  // Clear any existing cards
  container.innerHTML = '';

  // Sort collections by date
  collections.sort((a, b) => new Date(a.due) - new Date(b.due));

  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('en-GB', options);
  };

  // Helper function to create a card
  const createCard = (binType, collectionDate, headerText) => {
    const card = document.createElement('div');
    const cardClass = binType.toLowerCase().includes('blue') ? 'card recycling' : 'card general';
    card.className = cardClass;

    const h2 = document.createElement('h2');
    h2.textContent = headerText;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    const p = document.createElement('p');
    const binTypeMap = {
      'Blue Bin': 'Paper and card',
      'Black Bin': 'Non Recyclable Waste'
    };
    const formattedDate = formatDate(collectionDate);

    p.innerHTML = `<span class="collection">${formattedDate}</span> <span class="bin">${binType}</span> <span class="type">${binTypeMap[binType]}</span>`;

    detailsDiv.appendChild(p);
    card.appendChild(h2);
    card.appendChild(detailsDiv);
    return card;
  };

  // Build and append cards for each collection that has not passed
  let cardCount = 0;
  collections.forEach(collection => {
    const collectionDate = new Date(collection.due);
    collectionDate.setHours(0, 0, 0, 0);

    if (collectionDate.getTime() >= today.getTime()) {
      let headerText;
      if (cardCount === 0) {
        if (collectionDate.getTime() === today.getTime()) {
          headerText = "Today!";
        } else if (collectionDate.getTime() === tomorrow.getTime()) {
          headerText = "Tomorrow";
        } else {
          headerText = "Due";
        }
      } else {
        headerText = "Next collection";
      }

      const card = createCard(collection.bin, collection.due, headerText);
      container.appendChild(card);
      cardCount++;
    }
  });

  // Handle the status banner logic
  const statusBanner = document.querySelector('.status-banner');
  const bannerLink = statusBanner ? statusBanner.querySelector('a') : null;
  const bannerSpan = statusBanner ? statusBanner.querySelector('span') : null;

  if (statusBanner && bannerSpan && bannerLink) {
    // Find if there is a collection today with issues
    const hasIssuesToday = collections.some(c => {
      const dueDate = new Date(c.due);
      // Check if the due date is the same day as today, ignoring time
      const isSameDay = dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear();
      return c.issues === true && isSameDay;
    });

    if (hasIssuesToday) {
      statusBanner.className = 'status-banner error';
      bannerSpan.className = 'error';
      bannerSpan.textContent = "Collections are delayed on your route due to a shortage of crew members";
      bannerLink.textContent = "See all collection updates";
      bannerLink.href = "https://www.sheffield.veolia.co.uk/service-alerts";
    } else {
      statusBanner.className = 'status-banner success';
      bannerSpan.className = 'success';
      bannerSpan.textContent = "There are currently no issues reported on your collection route";
      bannerLink.textContent = "Report a missed collection";
      bannerLink.href = "https://www.sheffield.gov.uk/bins-recycling-services/report-missed-collection";
    }
  }

  // Update the calendar link with the UPRN
  const calendarLink = document.querySelector('.calendar-link');
  if (calendarLink && uprn) {
    calendarLink.href = `https://wasteservices.sheffield.gov.uk/property/${uprn}/calendar`;
  }
}

/**
 * Dynamically builds cards for nearest locations.
 *
 * @param {object[]} locations - An array of objects, each containing location data.
 */
function buildNearestCards(locations) {
  const container = document.querySelector('.your-nearest-container');
  if (!container) {
    console.error("Container '.your-nearest-container' not found.");
    return;
  }

  // Clear any existing cards
  container.innerHTML = '';

  locations.forEach(location => {
    // Create the main card div
    const card = document.createElement('div');
    card.className = 'card';

    // Create the title
    const h3 = document.createElement('h3');
    h3.textContent = location.title;

    // Create the location section
    const locationDiv = document.createElement('div');
    locationDiv.className = 'location';

    // Create the address
    const address = document.createElement('address');
    address.innerHTML = location.address.join('<br>');

    // Create the map link
    const mapLink = document.createElement('a');
    mapLink.href = location.mapLink;
    mapLink.className = 'map-link';
    mapLink.textContent = 'View on map';

    // Append to the location section
    locationDiv.appendChild(address);
    locationDiv.appendChild(mapLink);

    // Create the opening times section
    const openingTimesDiv = document.createElement('div');
    openingTimesDiv.className = 'opening-times';
    const openingTimesP = document.createElement('p');
    openingTimesP.textContent = 'Opening times';
    openingTimesDiv.appendChild(openingTimesP);

    // Loop through and create each time row
    location.openingTimes.forEach(time => {
      const timeRow = document.createElement('div');
      timeRow.className = 'time-row';

      const daysSpan = document.createElement('span');
      daysSpan.className = 'days';
      daysSpan.textContent = time.days;

      const hoursSpan = document.createElement('span');
      hoursSpan.className = 'hours';
      hoursSpan.textContent = time.hours;

      timeRow.appendChild(daysSpan);
      timeRow.appendChild(hoursSpan);
      openingTimesDiv.appendChild(timeRow);
    });

    // Append all sections to the card
    card.appendChild(h3);
    card.appendChild(locationDiv);
    card.appendChild(openingTimesDiv);

    // Append the card to the container
    container.appendChild(card);
  });
}

/**
 * Dynamically builds contact cards for different sections.
 *
 * @param {object[]} sections - An array of objects, each representing a section.
 */
function buildContactCards(sections) {
  const container = document.querySelector('.area-contacts-container');
  if (!container) {
    console.error("Container '.area-contacts-container' not found.");
    return;
  }

  // Clear any existing sections
  container.innerHTML = '';

  sections.forEach(section => {
    // Create the main section container
    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'section-container';

    // Create the header
    const h3 = document.createElement('h3');
    h3.className = 'section-header';
    h3.textContent = section.title;

    // Create the contact list div
    const contactListDiv = document.createElement('div');
    contactListDiv.className = 'contact-list';

    // Create the introductory paragraph
    const p = document.createElement('p');
    p.textContent = section.introText;
    contactListDiv.appendChild(p);

    // Create the list of contacts
    const ul = document.createElement('ul');

    section.contacts.forEach(contact => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = contact.link;
      a.textContent = contact.name;
      li.appendChild(a);

      if (contact.info) {
        const span = document.createElement('span');
        span.className = 'party-info';
        span.textContent = `(${contact.info})`;
        li.appendChild(span);
      }
      ul.appendChild(li);
    });

    contactListDiv.appendChild(ul);

    // Append all parts to the main section container
    sectionContainer.appendChild(h3);
    sectionContainer.appendChild(contactListDiv);

    // Append the final section to the main container
    container.appendChild(sectionContainer);
  });
}
