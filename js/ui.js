/*=============================================================
 Lucien Resident Directory
 File : js/ui.js
 Part 1 - Resident Profile
==============================================================*/

/*-------------------------------------------------------------
 Render Resident
--------------------------------------------------------------*/

function renderResident(resident){

    if(!resident){

        updateStatus(
            "Resident not found.",
            "error"
        );

        return;

    }

    currentResident = resident;

    document
        .getElementById("profileSection")
        .classList.remove("hidden");

    document
        .getElementById("familySection")
        .classList.remove("hidden");

    document
        .getElementById("vehicleSection")
        .classList.remove("hidden");

    document
        .getElementById("emergencySection")
        .classList.remove("hidden");

    populateOwner(resident);
    
    registerButtons();

    renderFamily(resident.family);

    renderEmergency(resident.emergency);

    renderVehicles(resident.vehicles);

    updateStatus(
        "Apartment " +
        resident.apartment +
        " loaded successfully.",
        "success"
    );

}


/*-------------------------------------------------------------
 Owner Profile
--------------------------------------------------------------*/

function populateOwner(resident){

    document.getElementById("ownerName").innerHTML =

        resident.owner.name +

        " " +

        resident.owner.surname;

    document.getElementById("occupancyType").innerHTML =

        resident.owner.occupiedBy;

    document.getElementById("apartmentNo").innerHTML =

        resident.apartment;

    document.getElementById("floor").innerHTML =

        resident.owner.floor;

    document.getElementById("moveInDate").innerHTML =

        formatDate(
            resident.owner.moveIn
        );

    document.getElementById("mobile").innerHTML =

        formatMobile(
            resident.owner.mobile
        );

    document.getElementById("email").innerHTML =

        resident.owner.email;

    document.getElementById("address").innerHTML =

        resident.owner.address;

}


/*-------------------------------------------------------------
 Action Buttons
--------------------------------------------------------------*/

function registerButtons(){

    document
        .getElementById("callBtn")
        .onclick = ()=>{

            makeCall(
                currentResident.owner.mobile
            );

        };

    document
        .getElementById("whatsappBtn")
        .onclick = ()=>{

            openWhatsApp(
                currentResident.owner.mobile
            );

        };

    document
        .getElementById("copyBtn")
        .onclick = ()=>{

            copyToClipboard(
                currentResident.owner.mobile
            );

        };

    document
        .getElementById("printBtn")
        .onclick = ()=>{

            printProfile();

        };

}


/*-------------------------------------------------------------
 Refresh Buttons
--------------------------------------------------------------*/

function refreshProfile(){

    if(!currentResident)
        return;

    populateOwner(currentResident);

    registerButtons();

}


/*-------------------------------------------------------------
 Clear Profile
--------------------------------------------------------------*/

function clearProfile(){

    document.getElementById("ownerName").innerHTML="";

    document.getElementById("occupancyType").innerHTML="";

    document.getElementById("apartmentNo").innerHTML="-";

    document.getElementById("floor").innerHTML="-";

    document.getElementById("moveInDate").innerHTML="-";

    document.getElementById("mobile").innerHTML="-";

    document.getElementById("email").innerHTML="-";

    document.getElementById("address").innerHTML="-";

}


/*-------------------------------------------------------------
 Current Resident
--------------------------------------------------------------*/

let currentResident = null;


/*-------------------------------------------------------------
 Initialize
--------------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        registerButtons();

    }

);
/*=============================================================
 Family Members
==============================================================*/

/*-------------------------------------------------------------
 Render Family Members
--------------------------------------------------------------*/

function renderFamily(family){

    const tbody =
        document.getElementById(
            "familyTableBody"
        );

    tbody.innerHTML = "";

    if(
        !family ||
        family.length===0
    ){

        tbody.innerHTML =

        `
        <tr>

            <td colspan="3"
                class="empty">

                No family member information available

            </td>

        </tr>
        `;

        return;

    }

    family.forEach(member=>{

        tbody.appendChild(

            createFamilyRow(member)

        );

    });

}


/*-------------------------------------------------------------
 Create Family Row
--------------------------------------------------------------*/

function createFamilyRow(member){

    const tr =
        document.createElement("tr");

    tr.innerHTML =

    `
    <td>

        ${member.name}

    </td>

    <td>

        ${formatRelationship(

            member.relationship

        )}

    </td>

    <td>

        ${formatAge(

            member.age

        )}

    </td>
    `;

    return tr;

}


/*-------------------------------------------------------------
 Relationship Formatting
--------------------------------------------------------------*/

function formatRelationship(value){

    if(!value)
        return "-";

    value =
        value.toString().trim();

    if(value==="")
        return "-";

    return value;

}


/*-------------------------------------------------------------
 Age Formatting
--------------------------------------------------------------*/

function formatAge(age){

    if(
        age===undefined ||
        age===null
    )
        return "-";

    age =
        age.toString().trim();

    if(age==="")
        return "-";

    return age;

}


/*-------------------------------------------------------------
 Family Count
--------------------------------------------------------------*/

function familyCount(){

    if(!currentResident)
        return 0;

    return currentResident.family.length;

}


/*-------------------------------------------------------------
 Family Exists
--------------------------------------------------------------*/

function hasFamily(){

    return familyCount()>0;

}


/*-------------------------------------------------------------
 Show / Hide Family Section
--------------------------------------------------------------*/

function updateFamilySection(){

    const section =
        document.getElementById(
            "familySection"
        );

    if(hasFamily()){

        section.classList.remove(

            "hidden"

        );

    }
    else{

        section.classList.add(

            "hidden"

        );

    }

}
/*=============================================================
 Emergency Contacts
==============================================================*/

/*-------------------------------------------------------------
 Render Emergency Contacts
--------------------------------------------------------------*/

function renderEmergency(contacts){

    const tbody =
        document.getElementById(
            "emergencyTableBody"
        );

    tbody.innerHTML="";

    if(!contacts || contacts.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="3" class="empty">
                No emergency contacts available
            </td>
        </tr>
        `;

        updateEmergencySection();

        return;
    }

    contacts.forEach(contact=>{

        tbody.appendChild(

            createEmergencyRow(contact)

        );

    });

    updateEmergencySection();

}


/*-------------------------------------------------------------
 Create Emergency Row
--------------------------------------------------------------*/

function createEmergencyRow(contact){

    const tr=document.createElement("tr");

    tr.innerHTML=`

        <td>${contact.name}</td>

        <td>${contact.relationship}</td>

        <td>

            <a href="tel:${contact.mobile}">

                ${formatMobile(contact.mobile)}

            </a>

        </td>

    `;

    return tr;

}


/*-------------------------------------------------------------
 Emergency Section
--------------------------------------------------------------*/

function updateEmergencySection(){

    const section=document.getElementById(
        "emergencySection"
    );

    if(
        currentResident &&
        currentResident.emergency.length>0
    ){

        section.classList.remove("hidden");

    }
    else{

        section.classList.add("hidden");

    }

}


/*=============================================================
 Vehicle Details
==============================================================*/

/*-------------------------------------------------------------
 Render Vehicles
--------------------------------------------------------------*/

function renderVehicles(vehicles){

    const tbody=
        document.getElementById(
            "vehicleTableBody"
        );

    tbody.innerHTML="";

    if(!vehicles || vehicles.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="4"
                class="empty">

                No vehicle information available

            </td>

        </tr>

        `;

        updateVehicleSection();

        return;

    }

    vehicles.forEach(vehicle=>{

        tbody.appendChild(

            createVehicleRow(vehicle)

        );

    });

    updateVehicleSection();

}


/*-------------------------------------------------------------
 Create Vehicle Row
--------------------------------------------------------------*/

function createVehicleRow(vehicle){

    const tr=document.createElement("tr");

    tr.innerHTML=`

        <td>${vehicle.type}</td>

        <td>${vehicle.make}</td>

        <td>${vehicle.model}</td>

        <td>

            <strong>

                ${vehicle.plate}

            </strong>

        </td>

    `;

    return tr;

}


/*-------------------------------------------------------------
 Vehicle Section
--------------------------------------------------------------*/

function updateVehicleSection(){

    const section=document.getElementById(
        "vehicleSection"
    );

    if(
        currentResident &&
        currentResident.vehicles.length>0
    ){

        section.classList.remove("hidden");

    }
    else{

        section.classList.add("hidden");

    }

}


/*-------------------------------------------------------------
 Vehicle Count
--------------------------------------------------------------*/

function vehicleCount(){

    if(!currentResident)
        return 0;

    return currentResident.vehicles.length;

}
/*=============================================================
 UI Refresh
==============================================================*/

/*-------------------------------------------------------------
 Refresh Entire Screen
--------------------------------------------------------------*/

function refreshUI(){

    if(!currentResident)
        return;

    populateOwner(currentResident);

    renderFamily(currentResident.family);

    renderEmergency(currentResident.emergency);

    renderVehicles(currentResident.vehicles);

    registerButtons();

}


/*-------------------------------------------------------------
 Hide All Sections
--------------------------------------------------------------*/

function hideAllSections(){

    document
        .getElementById("profileSection")
        .classList.add("hidden");

    document
        .getElementById("familySection")
        .classList.add("hidden");

    document
        .getElementById("emergencySection")
        .classList.add("hidden");

    document
        .getElementById("vehicleSection")
        .classList.add("hidden");

}


/*-------------------------------------------------------------
 Clear Resident Data
--------------------------------------------------------------*/

function clearResident(){

    currentResident=null;

    clearProfile();

    document.getElementById("familyTableBody").innerHTML=
    `
    <tr>
        <td colspan="3" class="empty">
            No family member information available
        </td>
    </tr>
    `;

    document.getElementById("emergencyTableBody").innerHTML=
    `
    <tr>
        <td colspan="3" class="empty">
            No emergency contacts available
        </td>
    </tr>
    `;

    document.getElementById("vehicleTableBody").innerHTML=
    `
    <tr>
        <td colspan="4" class="empty">
            No vehicle information available
        </td>
    </tr>
    `;

    hideAllSections();

}


/*-------------------------------------------------------------
 Refresh Button
--------------------------------------------------------------*/

const refreshButton=document.getElementById("refreshBtn");

if(refreshButton){

    refreshButton.addEventListener(

        "click",

        ()=>{

            document.getElementById("searchBox").value="";

            document.getElementById("apartmentSelect").selectedIndex=0;

            clearResident();

            loadExcel();

        }

    );

}


/*-------------------------------------------------------------
 Double Click Apartment Number
 Copy Apartment Number
--------------------------------------------------------------*/

const apartmentLabel=document.getElementById("apartmentNo");

if(apartmentLabel){

    apartmentLabel.addEventListener(

        "dblclick",

        ()=>{

            if(currentResident){

                copyToClipboard(

                    currentResident.apartment

                );

            }

        }

    );

}


/*-------------------------------------------------------------
 Double Click Mobile
 Copy Mobile
--------------------------------------------------------------*/

const mobileLabel=document.getElementById("mobile");

if(mobileLabel){

    mobileLabel.addEventListener(

        "dblclick",

        ()=>{

            if(currentResident){

                copyToClipboard(

                    currentResident.owner.mobile

                );

            }

        }

    );

}


/*-------------------------------------------------------------
 Keyboard Shortcuts

Ctrl + F = Search Box

Esc = Clear

Ctrl + P = Print
--------------------------------------------------------------*/

document.addEventListener(

    "keydown",

    function(e){

        if(e.ctrlKey && e.key==="f"){

            e.preventDefault();

            document
                .getElementById("searchBox")
                .focus();

        }

        if(e.key==="Escape"){

            clearResident();

            document
                .getElementById("searchBox")
                .value="";

            document
                .getElementById("apartmentSelect")
                .selectedIndex=0;

        }

        if(e.ctrlKey && e.key==="p"){

            e.preventDefault();

            printProfile();

        }

    }

);


/*-------------------------------------------------------------
 Initialize UI
--------------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        hideAllSections();

        registerButtons();

    }

);

/*-------------------------------------------------------------
 Refresh Vehicle Data
--------------------------------------------------------------*/

function refreshVehicles(){

    if(!currentResident)
        return;

    renderVehicles(

        currentResident.vehicles

    );

}

/*-------------------------------------------------------------
 Refresh Family
--------------------------------------------------------------*/

function refreshFamily(){

    if(!currentResident)
        return;

    renderFamily(

        currentResident.family

    );

    updateFamilySection();

}
/*=============================================================
 Emergency Contacts
==============================================================*/

/*-------------------------------------------------------------
 Render Emergency Contacts
--------------------------------------------------------------*/

function renderEmergency(contacts){

    const tbody =
        document.getElementById(
            "emergencyTableBody"
        );

    tbody.innerHTML="";

    if(!contacts || contacts.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="3" class="empty">
                No emergency contacts available
            </td>
        </tr>
        `;

        updateEmergencySection();

        return;
    }

    contacts.forEach(contact=>{

        tbody.appendChild(

            createEmergencyRow(contact)

        );

    });

    updateEmergencySection();

}


/*-------------------------------------------------------------
 Create Emergency Row
--------------------------------------------------------------*/

function createEmergencyRow(contact){

    const tr=document.createElement("tr");

    tr.innerHTML=`

        <td>${contact.name}</td>

        <td>${contact.relationship}</td>

        <td>

            <a href="tel:${contact.mobile}">

                ${formatMobile(contact.mobile)}

            </a>

        </td>

    `;

    return tr;

}


/*-------------------------------------------------------------
 Emergency Section
--------------------------------------------------------------*/

function updateEmergencySection(){

    const section=document.getElementById(
        "emergencySection"
    );

    if(
        currentResident &&
        currentResident.emergency.length>0
    ){

        section.classList.remove("hidden");

    }
    else{

        section.classList.add("hidden");

    }

}


/*=============================================================
 Vehicle Details
==============================================================*/

/*-------------------------------------------------------------
 Render Vehicles
--------------------------------------------------------------*/

function renderVehicles(vehicles){

    const tbody=
        document.getElementById(
            "vehicleTableBody"
        );

    tbody.innerHTML="";

    if(!vehicles || vehicles.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="4"
                class="empty">

                No vehicle information available

            </td>

        </tr>

        `;

        updateVehicleSection();

        return;

    }

    vehicles.forEach(vehicle=>{

        tbody.appendChild(

            createVehicleRow(vehicle)

        );

    });

    updateVehicleSection();

}


/*-------------------------------------------------------------
 Create Vehicle Row
--------------------------------------------------------------*/

function createVehicleRow(vehicle){

    const tr=document.createElement("tr");

    tr.innerHTML=`

        <td>${vehicle.type}</td>

        <td>${vehicle.make}</td>

        <td>${vehicle.model}</td>

        <td>

            <strong>

                ${vehicle.plate}

            </strong>

        </td>

    `;

    return tr;

}


/*-------------------------------------------------------------
 Vehicle Section
--------------------------------------------------------------*/

function updateVehicleSection(){

    const section=document.getElementById(
        "vehicleSection"
    );

    if(
        currentResident &&
        currentResident.vehicles.length>0
    ){

        section.classList.remove("hidden");

    }
    else{

        section.classList.add("hidden");

    }

}


/*-------------------------------------------------------------
 Vehicle Count
--------------------------------------------------------------*/

function vehicleCount(){

    if(!currentResident)
        return 0;

    return currentResident.vehicles.length;

}


/*-------------------------------------------------------------
 Refresh Vehicle Data
--------------------------------------------------------------*/

function refreshVehicles(){

    if(!currentResident)
        return;

    renderVehicles(

        currentResident.vehicles

    );

}
/*=============================================================
 UI Refresh
==============================================================*/

/*-------------------------------------------------------------
 Refresh Entire Screen
--------------------------------------------------------------*/

function refreshUI(){

    if(!currentResident)
        return;

    populateOwner(currentResident);

    renderFamily(currentResident.family);

    renderEmergency(currentResident.emergency);

    renderVehicles(currentResident.vehicles);

    registerButtons();

}


/*-------------------------------------------------------------
 Hide All Sections
--------------------------------------------------------------*/

function hideAllSections(){

    document
        .getElementById("profileSection")
        .classList.add("hidden");

    document
        .getElementById("familySection")
        .classList.add("hidden");

    document
        .getElementById("emergencySection")
        .classList.add("hidden");

    document
        .getElementById("vehicleSection")
        .classList.add("hidden");

}


/*-------------------------------------------------------------
 Clear Resident Data
--------------------------------------------------------------*/

function clearResident(){

    currentResident=null;

    clearProfile();

    document.getElementById("familyTableBody").innerHTML=
    `
    <tr>
        <td colspan="3" class="empty">
            No family member information available
        </td>
    </tr>
    `;

    document.getElementById("emergencyTableBody").innerHTML=
    `
    <tr>
        <td colspan="3" class="empty">
            No emergency contacts available
        </td>
    </tr>
    `;

    document.getElementById("vehicleTableBody").innerHTML=
    `
    <tr>
        <td colspan="4" class="empty">
            No vehicle information available
        </td>
    </tr>
    `;

    hideAllSections();

}


/*-------------------------------------------------------------
 Refresh Button
--------------------------------------------------------------*/

const refreshButton=document.getElementById("refreshBtn");

if(refreshButton){

    refreshButton.addEventListener(

        "click",

        ()=>{

            document.getElementById("searchBox").value="";

            document.getElementById("apartmentSelect").selectedIndex=0;

            clearResident();

            loadExcel();

        }

    );

}


/*-------------------------------------------------------------
 Double Click Apartment Number
 Copy Apartment Number
--------------------------------------------------------------*/

const apartmentLabel=document.getElementById("apartmentNo");

if(apartmentLabel){

    apartmentLabel.addEventListener(

        "dblclick",

        ()=>{

            if(currentResident){

                copyToClipboard(

                    currentResident.apartment

                );

            }

        }

    );

}


/*-------------------------------------------------------------
 Double Click Mobile
 Copy Mobile
--------------------------------------------------------------*/

const mobileLabel=document.getElementById("mobile");

if(mobileLabel){

    mobileLabel.addEventListener(

        "dblclick",

        ()=>{

            if(currentResident){

                copyToClipboard(

                    currentResident.owner.mobile

                );

            }

        }

    );

}


/*-------------------------------------------------------------
 Keyboard Shortcuts

Ctrl + F = Search Box

Esc = Clear

Ctrl + P = Print
--------------------------------------------------------------*/

document.addEventListener(

    "keydown",

    function(e){

        if(e.ctrlKey && e.key==="f"){

            e.preventDefault();

            document
                .getElementById("searchBox")
                .focus();

        }

        if(e.key==="Escape"){

            clearResident();

            document
                .getElementById("searchBox")
                .value="";

            document
                .getElementById("apartmentSelect")
                .selectedIndex=0;

        }

        if(e.ctrlKey && e.key==="p"){

            e.preventDefault();

            printProfile();

        }

    }

);


/*-------------------------------------------------------------
 Initialize UI
--------------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        hideAllSections();

        registerButtons();

    }

);