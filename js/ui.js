/*=============================================================
 Lucien Resident Directory
 File : js/ui.js
 Version : 2.0
 Part 1
=============================================================*/

"use strict";

/*=============================================================
 Current Resident
=============================================================*/

let currentResident = null;

/*=============================================================
 Main Render Function
=============================================================*/

function renderResident(resident) {

    if (!resident) {

        updateStatus(
            "Resident not found.",
            "error"
        );

        return;

    }

    currentResident = resident;

    showAllSections();

    populateOwner();

    renderSummary();

    renderFamily(currentResident.family);

    renderEmergency(currentResident.emergency);

    renderVehicles(currentResident.vehicles);

    registerActionButtons();

    updateStatus(

        "Apartment " +

        currentResident.apartment +

        " loaded successfully.",

        "success"

    );

}


/*=============================================================
 Owner Profile
=============================================================*/

function populateOwner() {

    if (!currentResident)
        return;

    const owner = currentResident.owner;

    setText("ownerName",

        owner.name +

        " " +

        owner.surname

    );

    setText(

        "occupancyType",

        owner.occupiedBy

    );

    setText(

        "apartmentNo",

        currentResident.apartment

    );

    setText(

        "floor",

        owner.floor

    );

    setText(

        "moveInDate",

        formatDate(owner.moveIn)

    );

    setText(

        "mobile",

        owner.mobile

    );

    setText(

        "email",

        owner.email

    );

    setText(

        "officeAddress",

        owner.office

    );

    setText(

        "address",

        owner.address

    );

}


/*=============================================================
 Summary
=============================================================*/

function renderSummary() {

    if (!currentResident)
        return;

    setText(

        "familyCount",

        currentResident.family.length

    );

    setText(

        "vehicleCount",

        currentResident.vehicles.length

    );

    setText(

        "emergencyCount",

        currentResident.emergency.length

    );

    setText(

        "occupancySummary",

        currentResident.owner.occupiedBy

    );

}


/*=============================================================
 Generic Setter
=============================================================*/

function setText(id, value) {

    const element =

        document.getElementById(id);

    if (!element)
        return;

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        element.innerHTML = "-";

        return;

    }

    element.innerHTML = value;

}


/*=============================================================
 Show All Sections
=============================================================*/

function showAllSections() {

    [

        "profileSection",

        "familySection",

        "emergencySection",

        "vehicleSection",

        "summarySection"

    ]

    .forEach(section => {

        document

            .getElementById(section)

            .classList.remove("hidden");

    });

}


/*=============================================================
 Hide All Sections
=============================================================*/

function hideAllSections() {

    [

        "profileSection",

        "familySection",

        "emergencySection",

        "vehicleSection",

        "summarySection"

    ]

    .forEach(section => {

        document

            .getElementById(section)

            .classList.add("hidden");

    });

}
/*=============================================================
 Family Members
=============================================================*/

function renderFamily(family) {

    const tbody = document.getElementById("familyTableBody");

    tbody.innerHTML = "";

    if (!family || family.length === 0) {

        tbody.appendChild(

            createEmptyRow(
                3,
                "No family member information available."
            )

        );

        return;

    }

    family.forEach(member => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${member.name || "-"}</td>

            <td>${member.relationship || "-"}</td>

            <td>${member.age || "-"}</td>

        `;

        tbody.appendChild(row);

    });

}


/*=============================================================
 Emergency Contacts
=============================================================*/

function renderEmergency(contacts) {

    const tbody = document.getElementById("emergencyTableBody");

    tbody.innerHTML = "";

    if (!contacts || contacts.length === 0) {

        tbody.appendChild(

            createEmptyRow(
                3,
                "No emergency contact available."
            )

        );

        return;

    }

    contacts.forEach(contact => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>

                ${contact.name || "-"}

            </td>

            <td>

                ${contact.relationship || "-"}

            </td>

            <td>

                <a href="tel:${contact.mobile}">

                    ${contact.mobile || "-"}

                </a>

            </td>

        `;

        tbody.appendChild(row);

    });

}


/*=============================================================
 Vehicle Details
=============================================================*/

function renderVehicles(vehicles) {

    const tbody = document.getElementById("vehicleTableBody");

    tbody.innerHTML = "";

    if (!vehicles || vehicles.length === 0) {

        tbody.appendChild(

            createEmptyRow(
                4,
                "No vehicle information available."
            )

        );

        return;

    }

    vehicles.forEach(vehicle => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>

                ${vehicle.type || "-"}

            </td>

            <td>

                ${vehicle.make || "-"}

            </td>

            <td>

                ${vehicle.model || "-"}

            </td>

            <td>

                <strong>

                    ${vehicle.plate || "-"}

                </strong>

            </td>

        `;

        tbody.appendChild(row);

    });

}


/*=============================================================
 Common Empty Row
=============================================================*/

function createEmptyRow(colspan, message) {

    const tr = document.createElement("tr");

    const td = document.createElement("td");

    td.colSpan = colspan;

    td.className = "empty";

    td.textContent = message;

    tr.appendChild(td);

    return tr;

}


/*=============================================================
 Refresh Current Resident
=============================================================*/

function refreshResident() {

    if (!currentResident)
        return;

    populateOwner();

    renderSummary();

    renderFamily(currentResident.family);

    renderEmergency(currentResident.emergency);

    renderVehicles(currentResident.vehicles);

}
/*=============================================================
 Action Buttons
=============================================================*/

function registerActionButtons() {

    const callBtn = document.getElementById("callBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const copyBtn = document.getElementById("copyBtn");
    const printBtn = document.getElementById("printBtn");

    if (callBtn) {
        callBtn.onclick = () => {

            if (!currentResident) return;

            makeCall(currentResident.owner.mobile);

        };
    }

    if (whatsappBtn) {
        whatsappBtn.onclick = () => {

            if (!currentResident) return;

            openWhatsApp(currentResident.owner.mobile);

        };
    }

    if (copyBtn) {
        copyBtn.onclick = () => {

            if (!currentResident) return;

            copyToClipboard(currentResident.owner.mobile);

        };
    }

    if (printBtn) {
        printBtn.onclick = () => {

            printProfile();

        };
    }

}


/*=============================================================
 Double Click Support
=============================================================*/

function registerCopyActions() {

    const apartment = document.getElementById("apartmentNo");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");

    if (apartment) {

        apartment.ondblclick = () => {

            if (!currentResident) return;

            copyToClipboard(currentResident.apartment);

        };

    }

    if (mobile) {

        mobile.ondblclick = () => {

            if (!currentResident) return;

            copyToClipboard(currentResident.owner.mobile);

        };

    }

    if (email) {

        email.ondblclick = () => {

            if (!currentResident) return;

            copyToClipboard(currentResident.owner.email);

        };

    }

}


/*=============================================================
 Refresh Button
=============================================================*/

function registerRefreshButton() {

    const button = document.getElementById("refreshBtn");

    if (!button)
        return;

    button.onclick = async () => {

        clearResident();

        document.getElementById("searchBox").value = "";

        document.getElementById("apartmentSelect").selectedIndex = 0;

        residents = [];

        await loadExcel();

    };

}


/*=============================================================
 About Dialog
=============================================================*/

function openAboutDialog() {

    const modal = document.getElementById("aboutModal");

    if (modal)
        modal.classList.remove("hidden");

}

function closeAboutDialog() {

    const modal = document.getElementById("aboutModal");

    if (modal)
        modal.classList.add("hidden");

}


/*=============================================================
 Summary Refresh
=============================================================*/

function refreshDashboardSummary() {

    if (!currentResident)
        return;

    setText(
        "familyCount",
        currentResident.family.length
    );

    setText(
        "vehicleCount",
        currentResident.vehicles.length
    );

    setText(
        "emergencyCount",
        currentResident.emergency.length
    );

    setText(
        "occupancySummary",
        currentResident.owner.occupiedBy
    );

}


/*=============================================================
 Full UI Refresh
=============================================================*/

function refreshUI() {

    if (!currentResident)
        return;

    populateOwner();

    refreshDashboardSummary();

    renderFamily(currentResident.family);

    renderEmergency(currentResident.emergency);

    renderVehicles(currentResident.vehicles);

}


/*=============================================================
 Initialization
=============================================================*/

function initializeUI() {

    hideAllSections();

    registerActionButtons();

    registerCopyActions();

    registerRefreshButton();

}

document.addEventListener(
    "DOMContentLoaded",
    initializeUI
);/*=============================================================
 Clear Resident
=============================================================*/

function clearResident() {

    currentResident = null;

    const fields = [
        "ownerName",
        "occupancyType",
        "apartmentNo",
        "floor",
        "moveInDate",
        "mobile",
        "email",
        "officeAddress",
        "address",
        "familyCount",
        "vehicleCount",
        "emergencyCount",
        "occupancySummary"
    ];

    fields.forEach(id => {

        const el = document.getElementById(id);

        if (el)
            el.textContent = "-";

    });

    document.getElementById("familyTableBody").innerHTML = "";
    document.getElementById("vehicleTableBody").innerHTML = "";
    document.getElementById("emergencyTableBody").innerHTML = "";

    hideAllSections();

}


/*=============================================================
 Search Result Highlight
=============================================================*/

function highlightSearchBox() {

    const box = document.getElementById("searchBox");

    if (!box)
        return;

    box.classList.add("search-highlight");

    setTimeout(() => {

        box.classList.remove("search-highlight");

    }, 1200);

}


/*=============================================================
 Keyboard Shortcuts
=============================================================*/

function registerKeyboardShortcuts() {

    document.addEventListener("keydown", function (e) {

        /* Ctrl + F */

        if (e.ctrlKey && e.key.toLowerCase() === "f") {

            e.preventDefault();

            document.getElementById("searchBox").focus();

            highlightSearchBox();

        }

        /* Escape */

        if (e.key === "Escape") {

            clearResident();

            document.getElementById("searchBox").value = "";

            document.getElementById("apartmentSelect").selectedIndex = 0;

        }

        /* Ctrl + P */

        if (e.ctrlKey && e.key.toLowerCase() === "p") {

            e.preventDefault();

            if (currentResident)
                printProfile();

        }

    });

}


/*=============================================================
 Responsive Helpers
=============================================================*/

function scrollToProfile() {

    const profile = document.getElementById("profileSection");

    if (!profile)
        return;

    profile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/*=============================================================
 Display Resident
=============================================================*/

function displayResident(resident) {

    renderResident(resident);

    if (window.innerWidth < 768) {

        scrollToProfile();

    }

}


/*=============================================================
 Search Wrapper
=============================================================*/

function showResident(resident) {

    if (!resident) {

        updateStatus(

            "Resident not found.",

            "warning"

        );

        return;

    }

    displayResident(resident);

}


/*=============================================================
 Window Resize
=============================================================*/

window.addEventListener(

    "resize",

    function () {

        if (!currentResident)
            return;

        refreshUI();

    }

);


/*=============================================================
 Startup
=============================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        initializeUI();

        registerKeyboardShortcuts();

        hideAllSections();

    }

);


/*=============================================================
 End of File
=============================================================*/
