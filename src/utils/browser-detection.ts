interface NavigatorExtended extends Navigator {
	brave?: {
		isBrave: () => Promise<boolean>;
	};
}

export async function detectBrowser(): Promise<'chrome' | 'firefox' | 'firefox-mobile' | 'brave' | 'edge' | 'safari' | 'mobile-safari' | 'ipad-os' | 'orion' | 'other'> {
	const userAgent = navigator.userAgent.toLowerCase();
	
	// Check for Orion first since it's based on WebKit/Safari
	if ('KAGI' in window) {
		return 'orion';
	}
	
	if (userAgent.includes('firefox')) {
		return userAgent.includes('mobile') ? 'firefox-mobile' : 'firefox';
	} else if (userAgent.indexOf("edg/") > -1) {
		return 'edge';
	} else if (userAgent.indexOf("chrome") > -1) {
		// Check for Brave
		const nav = navigator as NavigatorExtended;
		if (nav.brave && await nav.brave.isBrave()) {
			return 'brave';
		}
		return 'chrome';
	} else if (userAgent.includes('safari')) {
		if (isIPad()) {
			return 'ipad-os';
		} else if (userAgent.includes('mobile') || userAgent.includes('iphone')) {
			return 'mobile-safari';
		}
		return 'safari';
	} else {
		return 'other';
	}
}

function isIPad(): boolean {
	return navigator.userAgent.includes('iPad') ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export async function addBrowserClassToHtml() {
	const browser = await detectBrowser();
	const htmlElement = document.documentElement;

	// Remove any existing browser classes
	htmlElement.classList.remove(
		'is-firefox-mobile',
		'is-chromium',
		'is-firefox',
		'is-edge',
		'is-chrome',
		'is-brave',
		'is-safari',
		'is-mobile-safari',
		'is-ipad-os',
		'is-orion'
	);

	// Add the appropriate class based on the detected browser
	switch (browser) {
		case 'firefox-mobile':
			htmlElement.classList.add('is-mobile', 'is-firefox-mobile', 'is-firefox');
			break;
		case 'firefox':
			htmlElement.classList.add('is-firefox');
			break;
		case 'edge':
			htmlElement.classList.add('is-chromium', 'is-edge');
			break;
		case 'chrome':
			htmlElement.classList.add('is-chromium', 'is-chrome');
			break;
		case 'brave':
			htmlElement.classList.add('is-chromium','is-brave');
			break;
		case 'safari':
			htmlElement.classList.add('is-safari');
			break;
		case 'mobile-safari':
			htmlElement.classList.add('is-mobile', 'is-mobile-safari', 'is-safari', 'is-ios');
			break;
		case 'ipad-os':
			htmlElement.classList.add('is-tablet', 'is-ipad-os', 'is-safari');
			break;
		case 'orion':
			htmlElement.classList.add('is-orion');
			break;
		default:
			// For 'other' browsers, we don't add any class
			break;
	}
}