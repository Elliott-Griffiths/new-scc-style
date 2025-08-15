let userName;

document.addEventListener('DOMContentLoaded', function () {
  const headerElement = document.querySelector('.header');
  const areaElement = document.querySelector('.header > .area');

  const serviceHeaderBar = document.createElement('div');
  serviceHeaderBar.classList.add('service-header-bar');

  const logoContainer = document.createElement("div");
  logoContainer.classList.add("logo-container");

  const logoLink = document.createElement("a");
  logoLink.href = "https://www.sheffield.gov.uk";
  logoLink.title = "Back to homepage";
  logoLink.classList.add("header-logo-link");

  const logoImg = document.createElement("img");
  logoImg.classList.add("header-logo");
  logoImg.src = "https://cdn.uk.empro.verintcloudservices.com/tenants/sheffield/Images/logo.png";
  logoImg.alt = "Sheffield City Council Logo";

  logoLink.appendChild(logoImg);
  logoContainer.appendChild(logoLink);

  const serviceLabel = document.createElement('span');
  serviceLabel.id = 'service-label';
  serviceLabel.classList.add('service-label');
  serviceLabel.textContent = "My Account";

  serviceHeaderBar.appendChild(logoContainer);
  serviceHeaderBar.appendChild(serviceLabel);

  if (headerElement && areaElement) {
    headerElement.insertBefore(serviceHeaderBar, areaElement);
  }

  // --- \\

  const menuDiv = document.querySelector('.menu[role="navigation"]');
  const originalAccountHomeLi = document.getElementById('nav_home').closest('li');
  const accountHomeLink = document.getElementById('nav_home');
  const menuButtonContainer = document.querySelector('.menuButton');

  if (menuDiv && originalAccountHomeLi && accountHomeLink && menuButtonContainer) {
    accountHomeLink.classList.add('account-home-global-link');

    let iconSpan = accountHomeLink.querySelector('.icon-home');
    if (!iconSpan) {
      iconSpan = document.createElement('span');
      iconSpan.classList.add('icon-home');
      accountHomeLink.prepend(iconSpan);
    }

    iconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M298.2 72.6C310.5 61.2 329.5 61.2 341.7 72.6L432 156.3L432 144C432 126.3 446.3 112 464 112L496 112C513.7 112 528 126.3 528 144L528 245.5L565.8 280.6C575.4 289.6 578.6 303.5 573.8 315.7C569 327.9 557.2 336 544 336L528 336L528 512C528 547.3 499.3 576 464 576L176 576C140.7 576 112 547.3 112 512L112 336L96 336C82.8 336 71 327.9 66.2 315.7C61.4 303.5 64.6 289.5 74.2 280.6L298.2 72.6zM304 384C277.5 384 256 405.5 256 432L256 528L384 528L384 432C384 405.5 362.5 384 336 384L304 384z"/>
            </svg>
        `;

    menuDiv.insertBefore(accountHomeLink, menuButtonContainer);
    originalAccountHomeLi.remove();
  }

  // --- \\

  const loginRegisterLink = document.getElementById('nav_login');
  if (loginRegisterLink) {
    loginRegisterLink.textContent = 'Sign in / Register';
    console.log("Login/Register link text changed to 'Sign in / Register'.");
  }

  const logoutButton = document.querySelector('#nav_logout button');
  if (logoutButton) {
    logoutButton.textContent = 'Sign out';
  }

  const myProfileLink = document.getElementById('nav_username');
  userName = myProfileLink.textContent;
  if (myProfileLink) {
    myProfileLink.textContent = 'My profile';
  }

  // --- \\

  const navigationDiv = document.querySelector('.navigation');
  const usernameLink = document.createElement('a');

  usernameLink.href = '/site/sheffield_dev/profile';
  usernameLink.tabIndex = 0;

  usernameLink.textContent = userName;

  if (navigationDiv) {
    navigationDiv.prepend(usernameLink);
  }

  // --- \\

  const footerArea = document.getElementById('FooterAreaInSingleColumnNoNavigationTemplate');

  if (footerArea) {
    const footerLinksUl = document.createElement('ul');
    footerLinksUl.classList.add('footer-links');

    const cookiePolicyLi = document.createElement('li');
    const cookieAnchor = document.createElement('a');
    cookieAnchor.href = "#";
    cookieAnchor.classList.add('footer-link');
    cookieAnchor.textContent = "Cookie policy";
    cookiePolicyLi.appendChild(cookieAnchor);
    footerLinksUl.appendChild(cookiePolicyLi);

    const privacyStatementLi = document.createElement('li');
    const privacyAnchor = document.createElement('a');
    privacyAnchor.href = "#";
    privacyAnchor.classList.add('footer-link');
    privacyAnchor.textContent = "Privacy statement";
    privacyStatementLi.appendChild(privacyAnchor);
    footerLinksUl.appendChild(privacyStatementLi);

    const accessibilityStatementLi = document.createElement('li');
    const accessibilityAnchor = document.createElement('a');
    accessibilityAnchor.href = "#";
    accessibilityAnchor.classList.add('footer-link');
    accessibilityAnchor.textContent = "Accessibility statement";
    accessibilityStatementLi.appendChild(accessibilityAnchor);
    footerLinksUl.appendChild(accessibilityStatementLi);

    const footerCopyright = document.createElement('div');
    footerCopyright.classList.add('footer-copyright');
    footerCopyright.textContent = `© Sheffield City Council ${new Date().getFullYear()}`;

    footerArea.appendChild(footerLinksUl);
    footerArea.appendChild(footerCopyright);
  }

  // --- \\ 

  if (window.location.pathname.endsWith('/my-requests')) {
    document.querySelectorAll('li.le-request-status-text').forEach(el => {
      el.textContent = 'Status:';
    });

    document.querySelectorAll('.le-request-title a').forEach(el => {
      el.textContent = el.textContent.replace(/\s*\(.*?\)/g, '');
    });

    document.querySelectorAll('time').forEach(el => {
      const text = el.textContent.trim();

      const match = text.match(/^(.*?)\s*\((.*?)\s+([A-Za-z]+,\s+)?(.+?)\)$/);

      if (match) {
        let relative = match[1]; // "7 days ago"
        const timePart = match[2]; // "9:29am"
        const datePart = match[4]; // "8th August 2025"

        // Capitalize first character if it's a letter
        if (relative.length > 0 && /[a-zA-Z]/.test(relative[0])) {
          relative = relative[0].toUpperCase() + relative.slice(1);
        }

        el.textContent = `${relative}. ${datePart} at ${timePart}.`;
      }
    });
  }
});

