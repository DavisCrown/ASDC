 // All code is wrapped in the DOMContentLoaded listener to ensure all elements exist before scripting.
        document.addEventListener("DOMContentLoaded", function () {
            // --- 0. Initialize AOS Library ---
            if (typeof AOS !== "undefined") {
                AOS.init({
                    once: true,
                    duration: 800,
                });
            }

            // --- 1. Mobile Menu Toggle ---
            const mobileMenuButton = document.getElementById("mobile-menu-button");
            const mobileMenu = document.getElementById("mobile-menu");
            const menuIcon = document.getElementById("menu-icon");

            if (mobileMenuButton && mobileMenu && menuIcon) {
                mobileMenuButton.addEventListener("click", () => {
                    // 1. Toggle the visibility of the menu
                    mobileMenu.classList.toggle("hidden");

                    // 2. Change the menu icon path based on visibility
                    if (mobileMenu.classList.contains("hidden")) {
                        // Menu is hidden (closed) -> show hamburger icon (3 bars)
                        menuIcon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7">
                            </path>
                        `;
                        document.body.style.overflow = ''; // Enable scrolling
                        menuIcon.classList.remove("rotate-180");
                    } else {
                        // Menu is visible (open) -> show close icon (X)
                        menuIcon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        `;
                        document.body.style.overflow = 'hidden'; // Disable background scrolling
                        menuIcon.classList.add("rotate-180");
                    }
                    mobileMenu.classList.toggle('-translate-x-full');
                    mobileMenu.classList.toggle('translate-x-0');
                });
            }

            // --- 2. Toggle "Read More" functionality ---
            const readMoreButtons = document.querySelectorAll(".toggle-read-more");

            readMoreButtons.forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.preventDefault();

                    // The 'Read More' link (button) is a sibling of the <p> element that contains the full text span.
                    const textContainer = button.previousElementSibling;

                    // Find the hidden span within that specific <p>
                    const fullText = textContainer
                        ? textContainer.querySelector(".full-text")
                        : null;

                    if (fullText) {
                        // Toggle the 'hidden' class to expand/collapse the text
                        fullText.classList.toggle("hidden");

                        // Update the button text based on the new state
                        if (fullText.classList.contains("hidden")) {
                            button.textContent = "Read More";
                        } else {
                            button.textContent = "Read Less";
                        }
                    }
                });
            });

            // --- 3. Counter animation logic helper function ---
            function animateCounter(element, targetValue) {
                let currentValue = 0;
                const duration = 2000; // 2 seconds
                const step = targetValue / (duration / 16); // 16ms is roughly 60fps

                function updateCounter() {
                    currentValue += step;
                    if (currentValue < targetValue) {
                        element.innerText = Math.floor(currentValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.innerText = targetValue;
                    }
                }
                updateCounter();
            }

            // --- 3. Counter animation logic Intersection Observer ---
            const awardsCount = document.getElementById("awards-count");
            const volunteerCount = document.getElementById("volunteer-count");
            const projectsCount = document.getElementById("projects-count");
            // NOTE: The counter-section class is not in the provided HTML. Leaving observer logic for future use.
            const counterSection = document.querySelector(".counter-section"); 

            let animated = false;

            if (counterSection && awardsCount && volunteerCount && projectsCount) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting && !animated) {
                                // Start animations when the section is visible
                                animateCounter(awardsCount, 365);
                                animateCounter(volunteerCount, 2200);
                                animateCounter(projectsCount, 155);
                                animated = true; // Set flag to true to prevent re-animation
                                observer.unobserve(counterSection); // Stop observing after animation runs
                            }
                        });
                    },
                    {
                        threshold: 0.5, // Trigger when 50% of the section is visible
                    }
                );

                observer.observe(counterSection);
            }

            // --- 4. Accordion functionality for the volunteer section ---
            const accordionHeaders = document.querySelectorAll(".accordion-header");

            accordionHeaders.forEach((header) => {
                header.addEventListener("click", () => {
                    const parentItem = header.closest(".accordion-item");
                    const content = parentItem.querySelector(".accordion-content");
                    const icon = parentItem.querySelector("i");

                    // Toggle the visibility of the content
                    if (content) content.classList.toggle("hidden");

                    // Toggle the rotation of the icon
                    if (icon) icon.classList.toggle("rotate-90");
                });
            });

            // --- 6. Tab functionality for Our Purpose section ---
            const tabButtons = document.querySelectorAll(".tab-btn");
            const tabContents = document.querySelectorAll(".tab-content");

            // Ensure the initial active tab (Mission) has the correct classes applied
            const initialActiveButton = document.getElementById("mission-tab");
            if (initialActiveButton) {
                // Ensure mission-tab starts active
                initialActiveButton.classList.remove("text-gray-500");
                initialActiveButton.classList.add(
                    "text-green-700",
                    "border-b-2",
                    "border-green-700"
                );
            }

            tabButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    // Remove active styles from all buttons
                    tabButtons.forEach((btn) => {
                        btn.classList.remove(
                            "text-green-700",
                            "border-b-2",
                            "border-green-700"
                        );
                        btn.classList.add("text-gray-500");
                    });

                    // Add active styles to the clicked button
                    button.classList.remove("text-gray-500");
                    button.classList.add("text-green-700", "border-b-2", "border-green-700");

                    // Hide all content divs
                    tabContents.forEach((content) => {
                        content.classList.add("hidden");
                    });

                    // Show the content corresponding to the clicked button
                    const contentId = button.id.replace("-tab", "-content");
                    const activeContent = document.getElementById(contentId);
                    if (activeContent) {
                        activeContent.classList.remove("hidden");
                    }
                });
            });


            // --- 7. Local Search Functionality (Now attached via JS event listeners) ---
// --- 7. Local Search Functionality (Now attached via JS event listeners) ---

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const programGrid = document.getElementById('program-areas-grid');

/**
 * Performs the card filtering based on the search input value.
 *
 * @returns {number} The count of program cards that matched the search term.
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Select the containers for each program area card
    const cards = programGrid.querySelectorAll('div[data-aos="fade-up"]');
    let resultsFound = 0;

    // Store and restore default placeholder
    if (!searchInput.dataset.defaultPlaceholder) {
        searchInput.dataset.defaultPlaceholder = searchInput.placeholder;
    } else {
        searchInput.placeholder = searchInput.dataset.defaultPlaceholder;
    }

    cards.forEach(cardContainer => {
        const cardContent = cardContainer.querySelector('.card-bg');
        if (cardContent) {
            const textContent = cardContent.innerText.toLowerCase();

            if (textContent.includes(searchTerm)) {
                cardContainer.classList.remove('hidden');
                resultsFound++;
            } else {
                cardContainer.classList.add('hidden');
            }
        }
    });

    // Show "No results found" in placeholder and clear input
    if (resultsFound === 0 && searchTerm.length > 0) {
        searchInput.value = ''; // Clear the input so placeholder is visible
        searchInput.placeholder = `No results found for "${searchTerm}"`;
    }

    return resultsFound;
}

// Attach listeners to make search fully functional:
if (searchInput && searchForm) {
    // 1. Real-time filtering (as the user types)
    searchInput.addEventListener('input', handleSearch);

    // 2. On submit (Enter key or search button click)
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const foundCount = handleSearch(); 
        const targetSection = document.getElementById('focused-programs');

        // Scroll to section regardless of result count
        if (targetSection) {
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        searchInput.blur(); // Optional: remove focus from input after search
    });
}

        });