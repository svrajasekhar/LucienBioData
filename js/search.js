/* ==========================================================
   Lucien Resident Directory
   search.js
========================================================== */

/* ---------------------------------------------------------
   Search by Apartment Dropdown
--------------------------------------------------------- */

function searchByApartment() {

    const apartment =
        document.getElementById("apartmentSelect").value;

    if (!apartment)
        return;

    const resident =
        getResidentByApartment(apartment);

    if (!resident) {

        updateStatus(
            "Apartment not found.",
            "error"
        );

        hideSections();

        return;

    }

    renderResident(resident);

}


/* ---------------------------------------------------------
   Search by Name / Mobile
--------------------------------------------------------- */

function searchByKeyword() {

    const keyword =
        document
            .getElementById("searchBox")
            .value
            .trim();

    if (keyword === "") {

        updateStatus(
            "Please enter Apartment, Name or Mobile.",
            "warning"
        );

        return;

    }

    const result =
        globalSearch(keyword);

    if (result.length === 0) {

        updateStatus(
            "No matching resident found.",
            "error"
        );

        hideSections();

        return;

    }

    if (result.length === 1) {

        renderResident(result[0]);

        return;

    }

    showSearchResults(result);

}


/* ---------------------------------------------------------
   Combined Search Button
--------------------------------------------------------- */

function performSearch() {

    const apartment =
        document.getElementById("apartmentSelect").value;

    const keyword =
        document.getElementById("searchBox").value.trim();

    if (apartment !== "") {

        searchByApartment();

        return;

    }

    if (keyword !== "") {

        searchByKeyword();

        return;

    }

    updateStatus(
        "Please select Apartment or enter search text.",
        "warning"
    );

}


/* ---------------------------------------------------------
   Search Result List
--------------------------------------------------------- */

function showSearchResults(result) {

    let html = "<h3>Multiple Residents Found</h3>";

    html += "<table class='data-table'>";

    html += `
        <thead>
        <tr>
            <th>Flat</th>
            <th>Name</th>
            <th>Mobile</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
    `;

    result.forEach((r, index) => {

        html += `
        <tr>

            <td>${getApartmentNumber(r)}</td>

            <td>${getOwnerName(r)}</td>

            <td>${getMobile(r)}</td>

            <td>

                <button
                    class="primary-btn"
                    onclick="renderResident(residents[${residents.indexOf(r)}])">

                    View

                </button>

            </td>

        </tr>
        `;

    });

    html += "</tbody></table>";

    document.getElementById("profileSection")
        .classList.remove("hidden");

    document.getElementById("profileSection")
        .innerHTML = html;

}


/* ---------------------------------------------------------
   Clear
--------------------------------------------------------- */

function clearSearch() {

    document.getElementById("searchBox").value = "";

    document.getElementById("apartmentSelect").selectedIndex = 0;

    hideSections();

    updateStatus(
        "Ready.",
        "success"
    );

}


/* ---------------------------------------------------------
   Hide Sections
--------------------------------------------------------- */

function hideSections() {

    document
        .getElementById("profileSection")
        .classList.add("hidden");

    document
        .getElementById("familySection")
        .classList.add("hidden");

    document
        .getElementById("vehicleSection")
        .classList.add("hidden");

    document
        .getElementById("emergencySection")
        .classList.add("hidden");

}


/* ---------------------------------------------------------
   Keyboard Search
--------------------------------------------------------- */

document
.getElementById("searchBox")
.addEventListener("keypress", function(e){

    if(e.key==="Enter")
        performSearch();

});


document
.getElementById("searchBtn")
.addEventListener("click", performSearch);


document
.getElementById("clearBtn")
.addEventListener("click", clearSearch);


document
.getElementById("apartmentSelect")
.addEventListener("change", searchByApartment);