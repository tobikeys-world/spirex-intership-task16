/* =========================================
   INTERNLINK - STUDENT INTERNSHIP PORTAL
========================================= */


/* ---------- MOBILE NAVIGATION ---------- */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


/* Close mobile menu after clicking a link */

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});


/* ---------- DARK / LIGHT MODE ---------- */

const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("internLinkTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon();
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const darkMode =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "internLinkTheme",
        darkMode ? "dark" : "light"
    );

    updateThemeIcon();
});


function updateThemeIcon() {

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}


/* ---------- INTERNSHIP SEARCH & FILTER ---------- */

const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const internshipCards =
    document.querySelectorAll(".internship-card");
const noResults = document.getElementById("noResults");


function filterInternships() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const selectedLocation =
        locationFilter.value;

    let visibleCards = 0;


    internshipCards.forEach((card) => {

        const title =
            card.dataset.title.toLowerCase();

        const company =
            card.dataset.company.toLowerCase();

        const location =
            card.dataset.location;


        const matchesSearch =
            title.includes(searchTerm) ||
            company.includes(searchTerm);


        const matchesLocation =
            selectedLocation === "all" ||
            location === selectedLocation;


        if (matchesSearch && matchesLocation) {

            card.style.display = "block";
            visibleCards++;

        } else {

            card.style.display = "none";
        }
    });


    if (visibleCards === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";
    }
}


searchInput.addEventListener(
    "input",
    filterInternships
);

locationFilter.addEventListener(
    "change",
    filterInternships
);


/* ---------- SAVE INTERNSHIP ---------- */

const saveButtons =
    document.querySelectorAll(".save-btn");


let savedInternships =
    JSON.parse(
        localStorage.getItem("savedInternships")
    ) || [];


function updateSavedButton(button, jobTitle) {

    const icon = button.querySelector("i");

    if (savedInternships.includes(jobTitle)) {

        button.classList.add("saved");

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

    } else {

        button.classList.remove("saved");

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
    }
}


saveButtons.forEach((button) => {

    const card =
        button.closest(".internship-card");

    const jobTitle =
        card.dataset.title;


    updateSavedButton(
        button,
        jobTitle
    );


    button.addEventListener("click", () => {

        if (savedInternships.includes(jobTitle)) {

            savedInternships =
                savedInternships.filter(
                    (job) => job !== jobTitle
                );

        } else {

            savedInternships.push(jobTitle);
        }


        localStorage.setItem(
            "savedInternships",
            JSON.stringify(savedInternships)
        );


        updateSavedButton(
            button,
            jobTitle
        );
    });
});


/* ---------- INTERNSHIP MODAL ---------- */

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalCompany = document.getElementById("modalCompany");
const modalLocation = document.getElementById("modalLocation");
const modalApply = document.getElementById("modalApply");

const applyButtons = document.querySelectorAll(".apply-btn");

let selectedInternship = null;

console.log("Apply buttons found:", applyButtons.length);
console.log("Modal found:", modal);

applyButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const card = button.closest(".internship-card");

        selectedInternship = {
            title: button.dataset.job,
            company: button.dataset.company,
            location: card.dataset.location
        };

        modalTitle.textContent =
            selectedInternship.title;

        modalCompany.textContent =
            selectedInternship.company;

        modalLocation.textContent =
            selectedInternship.location;

        modal.classList.add("show");

        document.body.style.overflow = "hidden";

        console.log(
            "Opening modal:",
            selectedInternship
        );
    });

});

function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("show")
    ) {
        closeModal();
    }

});
/* ---------- APPLICATION TRACKER ---------- */

const applicationList =
    document.getElementById("applicationList");


let applications =
    JSON.parse(
        localStorage.getItem("internApplications")
    ) || [];


function renderApplications() {

    if (applications.length === 0) {

        applicationList.innerHTML = `
            <div class="empty-application">

                <i class="fa-regular fa-folder-open"></i>

                <h3>No applications yet</h3>

                <p>
                    Apply for an internship and your
                    application will appear here.
                </p>

            </div>
        `;

        return;
    }


    applicationList.innerHTML =
        applications.map((application, index) => {

            return `
                <div class="application-card">

                    <div>
                        <strong>
                            ${application.title}
                        </strong>

                        <p>
                            ${application.company}
                            • ${application.location}
                        </p>
                    </div>

                    <span class="application-status">
                        Applied
                    </span>

                    <button
                        class="remove-application"
                        data-index="${index}"
                        aria-label="Remove application"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;
        }).join("");


    const removeButtons =
        document.querySelectorAll(
            ".remove-application"
        );


    removeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.index);

            applications.splice(index, 1);

            localStorage.setItem(
                "internApplications",
                JSON.stringify(applications)
            );

            renderApplications();
        });
    });
}


renderApplications();


/* ---------- APPLICATION FORM ---------- */

const internshipDetails =
    document.getElementById("internshipDetails");

const applicationFormContainer =
    document.getElementById(
        "applicationFormContainer"
    );

const applicationForm =
    document.getElementById("applicationForm");


/* Open application form */

modalApply.addEventListener("click", () => {

    if (!selectedInternship) {
        return;
    }

    internshipDetails.style.display = "none";

    applicationFormContainer.style.display =
        "block";

});


/* Submit application */

applicationForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!selectedInternship) {
        return;
    }


    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const institution =
        document.getElementById("institution").value.trim();

    const course =
        document.getElementById("course").value.trim();


    const alreadyApplied =
        applications.some(
            (application) =>
                application.title ===
                selectedInternship.title &&
                application.email === email
        );


    if (alreadyApplied) {

        alert(
            "You have already applied for this internship with this email."
        );

        closeModal();

        return;
    }


    const newApplication = {

        title:
            selectedInternship.title,

        company:
            selectedInternship.company,

        location:
            selectedInternship.location,

        fullName,
        email,
        phone,
        institution,
        course,

        status: "Applied",

        date:
            new Date().toLocaleDateString()

    };


    applications.push(newApplication);


    localStorage.setItem(
        "internApplications",
        JSON.stringify(applications)
    );


    renderApplications();


    alert(
        `Application received, ${fullName}!`
    );


    applicationForm.reset();

    internshipDetails.style.display =
        "block";

    applicationFormContainer.style.display =
        "none";


    closeModal();


    document
        .getElementById("applications")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* ---------- SCROLL REVEAL ---------- */

const revealElements =
    document.querySelectorAll(
        ".internship-card, .benefit-card"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(
                        entry.target
                    );
                }
            });
        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach((element) => {

    observer.observe(element);
});


/* ---------- INITIAL LOG ---------- */

console.log(
    `InternLink loaded successfully - ${new Date().getFullYear()}`
);