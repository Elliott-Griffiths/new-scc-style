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
  
  const binTypeMap = {
    'Black Bin': 'Non Recyclable Waste',
    'Blue Bin': 'Paper and card',
    'Green Bin': 'Garden Waste',
  };

  const upcomingCollections = collections.filter(collection => {
      const collectionDate = new Date(collection.due);
      collectionDate.setHours(0, 0, 0, 0);
      return collectionDate.getTime() >= today.getTime();
  });

  // --- Today Card ---
  const todayCard = document.createElement('div');
  todayCard.className = 'card today';
  const todayHeader = document.createElement('h2');
  todayHeader.textContent = 'Today';
  todayCard.appendChild(todayHeader);
  const todayDetails = document.createElement('div');
  todayDetails.className = 'details';

  const todayCollection = upcomingCollections.find(c => {
      const collectionDate = new Date(c.due);
      collectionDate.setHours(0, 0, 0, 0);
      return collectionDate.getTime() === today.getTime();
  });

  if (todayCollection) {
    // Scenario 1: Collection today
    const formattedDate = formatDate(todayCollection.due);
    todayDetails.innerHTML = `
      <p class="date">${formattedDate}</p>
      <p class="bin">${todayCollection.bin}</p>
      <p class="type">${binTypeMap[todayCollection.bin]}</p>
    `;
  } else {
    // Scenario 2: No collection today
    const formattedDate = formatDate(today.toISOString());
    todayDetails.innerHTML = `
        <p class="date">${formattedDate}</p>
        <p>You don't have a collection scheduled at your address.</p>
    `;
  }
  todayCard.appendChild(todayDetails);
  container.appendChild(todayCard);


  // --- Next Collection Card ---
  const nextCollectionCard = document.createElement('div');
  nextCollectionCard.className = 'card next';
  const nextHeader = document.createElement('h2');
  nextHeader.textContent = 'Next collection';
  nextCollectionCard.appendChild(nextHeader);
  const nextDetails = document.createElement('div');
  nextDetails.className = 'details';

  let nextCollection;
  if(todayCollection) {
      // if there was a collection today, the next one is the second in the upcoming list
      if(upcomingCollections.length > 1) {
          nextCollection = upcomingCollections[1];
      }
  } else {
      // if no collection today, the next one is the first in the upcoming list
      if(upcomingCollections.length > 0) {
        nextCollection = upcomingCollections[0];
      }
  }

  if (nextCollection) {
    const formattedDate = formatDate(nextCollection.due);
    nextDetails.innerHTML = `
      <p class="date">${formattedDate}</p>
      <p class="bin">${nextCollection.bin}</p>
      <p class="type">${binTypeMap[nextCollection.bin]}</p>
    `;
  } else {
    nextDetails.innerHTML = `<p>No further collections scheduled.</p>`;
  }
  nextCollectionCard.appendChild(nextDetails);
  container.appendChild(nextCollectionCard);

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