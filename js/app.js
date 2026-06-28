/*=============================================================
 Lucien Resident Directory
 File : js/app.js
==============================================================*/

"use strict";

/*-------------------------------------------------------------
 Application Information
--------------------------------------------------------------*/

const APP = {

    name: "Lucien Resident Directory",

    version: "1.0.0",

    author: "Lucien Apartment Association"

};


/*-------------------------------------------------------------
 Initialize Application
--------------------------------------------------------------*/

async function initializeApplication(){

    console.log(APP.name);

    console.log("Version :", APP.version);

    try{

        await loadExcel();

        initializeControls();

        initializeEvents();

        updateFooter();

        updateStatus(

            "Application Ready",

            "success"

        );

    }
    catch(error){

        console.error(error);

        updateStatus(

            error.message,

            "error"

        );

    }

}


/*-------------------------------------------------------------
 Controls
--------------------------------------------------------------*/

function initializeControls(){

    hideAllSections();

    clearProfile();

}


/*-------------------------------------------------------------
 Events
--------------------------------------------------------------*/

function initializeEvents(){

    document

        .getElementById("searchBtn")

        .addEventListener(

            "click",

            performSearch

        );


    document

        .getElementById("clearBtn")

        .addEventListener(

            "click",

            ()=>{

                clearResident();

                document.getElementById(

                    "searchBox"

                ).value="";

                document.getElementById(

                    "apartmentSelect"

                ).selectedIndex=0;

                updateStatus(

                    "Ready",

                    "success"

                );

            }

        );


    document

        .getElementById(

            "searchBox"

        )

        .addEventListener(

            "keyup",

            function(event){

                if(event.key==="Enter")

                    performSearch();

            }

        );


    document

        .getElementById(

            "apartmentSelect"

        )

        .addEventListener(

            "change",

            performSearch

        );

}


/*-------------------------------------------------------------
 Refresh Data
--------------------------------------------------------------*/

async function refreshApplication(){

    residents=[];

    clearResident();

    await loadExcel();

}


/*-------------------------------------------------------------
 Search Statistics
--------------------------------------------------------------*/

function getStatistics(){

    return{

        totalResidents:residents.length,

        owners:

            residents.filter(

                r=>r.owner.occupiedBy

                .toLowerCase()

                .includes("owner")

            ).length,

        tenants:

            residents.filter(

                r=>r.owner.occupiedBy

                .toLowerCase()

                .includes("tenant")

            ).length

    };

}


/*-------------------------------------------------------------
 About
--------------------------------------------------------------*/

function about(){

    alert(

`${APP.name}

Version : ${APP.version}

GitHub Pages Edition`

    );

}


/*-------------------------------------------------------------
 Startup
--------------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);