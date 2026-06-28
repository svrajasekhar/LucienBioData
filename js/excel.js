/*=============================================================
 Lucien Resident Directory
 File : js/excel.js
 Version : 1.0
==============================================================*/

const EXCEL_FILE = "KYC Lucien.xlsx";

let workbook = null;
let worksheet = null;
let residents = [];

/*-------------------------------------------------------------
 Load Workbook
--------------------------------------------------------------*/

async function loadExcel() {

    showLoading(true);

    try {

        const response = await fetch(EXCEL_FILE);

        if (!response.ok) {
            throw new Error("Unable to locate " + EXCEL_FILE);
        }

        const buffer = await response.arrayBuffer();

        workbook = XLSX.read(buffer, {
            type: "array"
        });

        worksheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        parseWorksheet();

        populateApartmentDropdown();

        calculateDashboard();

        updateStatus(
            residents.length +
            " residents loaded successfully.",
            "success"
        );

    }
    catch (error) {

        console.error(error);

        updateStatus(
            error.message,
            "error"
        );

    }

    showLoading(false);

}

/*-------------------------------------------------------------
 Parse Worksheet
--------------------------------------------------------------*/

function parseWorksheet() {

    residents = [];

    const rows =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                header:1,
                blankrows:false,
                defval:""
            }
        );

    if(rows.length < 3)
        return;

    /*
      Row 1 = Group Header
      Row 2 = Column Header
      Row 3 onwards = Data
    */

    for(let r=2; r<rows.length; r++){

        const row = rows[r];

        if(
            row.length===0 ||
            row[0]===""
        )
            continue;

        residents.push(

            createResidentObject(row)

        );

    }

}

/*-------------------------------------------------------------
 Create Resident Object
--------------------------------------------------------------*/

function createResidentObject(row){

    return {

        apartment : safe(row[0]),

        owner : {

            name : safe(row[1]),

            surname : safe(row[2]),

            floor : safe(row[3]),

            occupiedBy : safe(row[4]),

            moveIn : safe(row[5]),

            mobile : safe(row[6]),

            email : safe(row[7]),

            address : safe(row[8]),

            office : safe(row[21])

        },

        family :

            getFamilyMembers(row),

        emergency :

            getEmergencyContacts(row),

        vehicles :

            getVehicles(row)

    };

}

/*-------------------------------------------------------------
 Safe Value
--------------------------------------------------------------*/

function safe(value){

    if(value===undefined)
        return "";

    if(value===null)
        return "";

    return String(value).trim();

}

/*-------------------------------------------------------------
 Dashboard Statistics
--------------------------------------------------------------*/

function calculateDashboard(){

    document.getElementById(
        "totalFlats"
    ).innerHTML = residents.length;

    let owners=0;
    let tenants=0;
    let totalResidents=0;

    residents.forEach(r=>{

        if(
            r.owner.occupiedBy
            .toLowerCase()
            .includes("owner")
        )
            owners++;

        else
            tenants++;

        totalResidents +=
            1 + r.family.length;

    });

    document.getElementById(
        "ownerCount"
    ).innerHTML = owners;

    document.getElementById(
        "tenantCount"
    ).innerHTML = tenants;

    document.getElementById(
        "residentCount"
    ).innerHTML = totalResidents;

}

/*-------------------------------------------------------------
 Apartment Dropdown
--------------------------------------------------------------*/

function populateApartmentDropdown(){

    const ddl =
        document.getElementById(
            "apartmentSelect"
        );

    ddl.innerHTML =
        '<option value="">Select Apartment</option>';

    residents

        .sort(
            (a,b)=>
            Number(a.apartment)-
            Number(b.apartment)
        )

        .forEach(r=>{

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                r.apartment;

            option.textContent =
                r.apartment;

            ddl.appendChild(option);

        });

}

/*-------------------------------------------------------------
 Initialize
--------------------------------------------------------------*/

window.addEventListener(

    "load",

    loadExcel

);
/*-------------------------------------------------------------
 Family Members
 Columns:
 9  Name
10 Relationship
11 Age

12 Name
13 Relationship
14 Age

15 Name
16 Relationship
17 Age

18 Name
19 Relationship
20 Age
--------------------------------------------------------------*/

function getFamilyMembers(row){

    const members=[];

    const indexes=[
        [9,10,11],
        [12,13,14],
        [15,16,17],
        [18,19,20]
    ];

    indexes.forEach(i=>{

        const name=safe(row[i[0]]);

        if(name==="")
            return;

        members.push({

            name:name,

            relationship:safe(row[i[1]]),

            age:safe(row[i[2]])

        });

    });

    return members;

}


/*-------------------------------------------------------------
 Emergency Contacts

22 Primary Contact
23 Relationship
24 Mobile

25 Secondary Contact
26 Mobile
--------------------------------------------------------------*/

function getEmergencyContacts(row){

    const contacts=[];

    if(safe(row[22])!==""){

        contacts.push({

            name:safe(row[22]),

            relationship:safe(row[23]),

            mobile:safe(row[24])

        });

    }

    if(safe(row[25])!==""){

        contacts.push({

            name:safe(row[25]),

            relationship:"Secondary",

            mobile:safe(row[26])

        });

    }

    return contacts;

}


/*-------------------------------------------------------------
 Vehicle Details

Vehicle 1
27 Type
28 Make
29 Model
30 Plate

Vehicle 2
31 Type
32 Make
33 Model
34 Plate

Vehicle 3
35 Type
36 Make
37 Model
38 Plate

Vehicle 4
39 Type
40 Make
41 Model
42 Plate
--------------------------------------------------------------*/

function getVehicles(row){

    const vehicles=[];

    const indexes=[

        [27,28,29,30],

        [31,32,33,34],

        [35,36,37,38],

        [39,40,41,42]

    ];

    indexes.forEach(v=>{

        if(safe(row[v[0]])==="")
            return;

        vehicles.push({

            type:safe(row[v[0]]),

            make:safe(row[v[1]]),

            model:safe(row[v[2]]),

            plate:safe(row[v[3]])

        });

    });

    return vehicles;

}


/*-------------------------------------------------------------
 Find Resident
--------------------------------------------------------------*/

function getResidentByApartment(apartment){

    return residents.find(r=>

        String(r.apartment)===String(apartment)

    );

}


/*-------------------------------------------------------------
 Search by Name
--------------------------------------------------------------*/

function searchByName(keyword){

    keyword=keyword.toLowerCase();

    return residents.filter(r=>

        (

            r.owner.name+" "+r.owner.surname

        )

        .toLowerCase()

        .includes(keyword)

    );

}


/*-------------------------------------------------------------
 Search by Mobile
--------------------------------------------------------------*/

function searchByMobile(number){

    return residents.filter(r=>

        r.owner.mobile

        .replace(/\s/g,"")

        .includes(number)

    );

}


/*-------------------------------------------------------------
 Search Vehicle Number
--------------------------------------------------------------*/

function searchVehicle(plate){

    plate=plate.toLowerCase();

    return residents.filter(r=>

        r.vehicles.some(v=>

            v.plate

            .toLowerCase()

            .includes(plate)

        )

    );

}


/*-------------------------------------------------------------
 Global Search
--------------------------------------------------------------*/

function globalSearch(text){

    text=text.trim();

    if(text==="")
        return [];

    if(!isNaN(text)){

        const apartment=getResidentByApartment(text);

        if(apartment)
            return [apartment];

    }

    let result=searchByMobile(text);

    if(result.length>0)
        return result;

    result=searchVehicle(text);

    if(result.length>0)
        return result;

    return searchByName(text);

}


/*-------------------------------------------------------------
 Sort Residents
--------------------------------------------------------------*/

function sortResidents(){

    residents.sort(

        (a,b)=>

        Number(a.apartment)-

        Number(b.apartment)

    );

}
/*=============================================================
 Utility Functions
==============================================================*/

/*-------------------------------------------------------------
 Show / Hide Loading Overlay
--------------------------------------------------------------*/

function showLoading(show){

    const overlay =
        document.getElementById("loadingOverlay");

    if(!overlay)
        return;

    overlay.style.display =
        show ? "flex" : "none";

}


/*-------------------------------------------------------------
 Status Message
--------------------------------------------------------------*/

function updateStatus(message,type="success"){

    const status =
        document.getElementById("statusMessage");

    if(!status)
        return;

    status.innerHTML = message;

    switch(type){

        case "success":

            status.style.borderLeft =
                "5px solid #198754";

            break;

        case "warning":

            status.style.borderLeft =
                "5px solid #fd7e14";

            break;

        case "error":

            status.style.borderLeft =
                "5px solid #dc3545";

            break;

        default:

            status.style.borderLeft =
                "5px solid #0B5ED7";

    }

}


/*-------------------------------------------------------------
 Toast
--------------------------------------------------------------*/

function showToast(message){

    const toast =
        document.getElementById("toast");

    if(!toast)
        return;

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


/*-------------------------------------------------------------
 Copy Text
--------------------------------------------------------------*/

async function copyToClipboard(text){

    if(!text)
        return;

    try{

        await navigator.clipboard.writeText(text);

        showToast("Copied successfully");

    }
    catch(e){

        console.error(e);

    }

}


/*-------------------------------------------------------------
 Call
--------------------------------------------------------------*/

function makeCall(number){

    if(!number)
        return;

    window.location.href =
        "tel:"+number;

}


/*-------------------------------------------------------------
 WhatsApp
--------------------------------------------------------------*/

function openWhatsApp(number){

    if(!number)
        return;

    number =
        number.replace(/\D/g,"");

    if(number.length===10){

        number="91"+number;

    }

    window.open(

        "https://wa.me/"+number,

        "_blank"

    );

}


/*-------------------------------------------------------------
 Email
--------------------------------------------------------------*/

function sendEmail(email){

    if(!email)
        return;

    window.location.href =
        "mailto:"+email;

}


/*-------------------------------------------------------------
 Print Profile
--------------------------------------------------------------*/

function printProfile(){

    window.print();

}


/*-------------------------------------------------------------
 Format Date
--------------------------------------------------------------*/

function formatDate(value){

    if(!value)
        return "";

    const date =
        new Date(value);

    if(isNaN(date))
        return value;

    return date.toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}


/*-------------------------------------------------------------
 Format Mobile
--------------------------------------------------------------*/

function formatMobile(number){

    if(!number)
        return "";

    return number.toString().trim();

}


/*-------------------------------------------------------------
 Get Resident Count
--------------------------------------------------------------*/

function getResidentCount(resident){

    return 1 + resident.family.length;

}


/*-------------------------------------------------------------
 Today's Date
--------------------------------------------------------------*/

function today(){

    return new Date()

    .toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}


/*-------------------------------------------------------------
 Last Updated Footer
--------------------------------------------------------------*/

function updateFooter(){

    const footer =
        document.getElementById(

            "lastUpdated"

        );

    if(!footer)
        return;

    footer.innerHTML =

        "Data Source : KYC Lucien.xlsx | Loaded : "

        + today();

}


/*-------------------------------------------------------------
 Initialize Utilities
--------------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateFooter();

    }

);