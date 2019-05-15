const url = 'https://api.propublica.org/congress/v1/113/senate/members.json';
const url2 = 'https://api.propublica.org/congress/v1/113/house/members.json';
const opts = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": "OIg3ZQb6kfxzrPqdtMPvwGGFqW2UIRP8SP6ILTjR"
    }
}


if (document.title.indexOf("Senate") != -1) {

    showLoader();
    fetch(url, opts)
        .then(res => res.json())
        .then(function (senateData) {
            senateData = senateData.results[0].members;
            hideLoader();
            createTHead(tbl, headerArrSenate);
            generateTable(senateData);
            populateDropdown(senateData);
            document.getElementById("republicanCheckbox").addEventListener("click", () => {
                updateTable(senateData)
            });
            document.getElementById("democratCheckbox").addEventListener("click", () => {
                updateTable(senateData)
            });
            document.getElementById("independentCheckbox").addEventListener("click", () => {
                updateTable(senateData)
            });
            document.getElementById("selectState").addEventListener("click", () => {
                updateTable(senateData)
            });

        })
        .catch(console.error);

}

if (document.title.indexOf("House") != -1) {

    showLoader();
    fetch(url2, opts)
        .then(res => res.json())
        .then(function (houseData) {
            houseData = houseData.results[0].members;
            hideLoader();
            createTHead(tbl, headerArrHouse);
            generateTable(houseData);
            populateDropdown(houseData);

            document.getElementById("republicanCheckbox").addEventListener("click", () => {
                updateTable(houseData)
            });
            document.getElementById("democratCheckbox").addEventListener("click", () => {
                updateTable(houseData)
            });
            document.getElementById("independentCheckbox").addEventListener("click", () => {
                updateTable(houseData)
            });
            document.getElementById("selectState").addEventListener("click", () => {
                updateTable(houseData)
            });

        })
        .catch(console.error);


}



function showLoader() {
    let spinner = `<div class="spinner-grow" role="status" id="spinner">
                    <span class="sr-only" >Loading...</span>
                </div>`;
    let loader = document.getElementById("loader");
    loader.insertAdjacentHTML("beforeend", spinner);
    
}

function hideLoader () {
    let spinner = document.getElementById("loader");
    spinner.innerHTML = "";
}



//
//Variables
//



var tbl = document.getElementById("table");
var tblBody = document.createElement("tbody");
var thead = document.createElement("thead");
tbl.appendChild(tblBody);
tbl.appendChild(thead);
var headerArrHouse = ["Congressmen", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "]
var headerArrSenate = ["Senator", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "];


//Table Header Method

function createTHead(table, headerArr) {


    var row = document.createElement("tr");

    for (var i = 0; i < headerArr.length; i++) {
        var th = document.createElement("th");
        var text = document.createTextNode(headerArr[i]);
        row.appendChild(th);
        th.appendChild(text);
        thead.appendChild(row);
    }
}



//Create Table Method

function generateTable(members) {

    var memberUrl;
    var fullName;
    var fullNameLinkTd;
    var party;
    var state;
    var seniority;
    var votePercentage;

    tblBody.innerHTML = ""; //To start with an empty table body

    for (var i = 0; i < members.length; i++) {

        var newTr = document.createElement("tr");
        tblBody.insertAdjacentElement("beforeend", newTr);
        if (members[i].middle_name === null) {
            members[i].middle_name = "";
        };

        fullName = members[i].last_name + ", " + members[i].first_name + " " + members[i].middle_name;
        memberUrl = "<a class='iframe_colorbox' target='_blank' href=" + members[i].url + ">" + fullName + "</a>";
        fullNameLinkTd = "<td>" + memberUrl + "</td>";
        newTr.insertAdjacentHTML("beforeend", fullNameLinkTd);
        party = "<td>" + members[i].party + "</td>";
        newTr.insertAdjacentHTML("beforeend", party);
        state = "<td>" + members[i].state + "</td>";
        newTr.insertAdjacentHTML("beforeend", state);
        seniority = "<td>" + members[i].seniority + "</td>";
        newTr.insertAdjacentHTML("beforeend", seniority);
        votePercentage = "<td>" + members[i].votes_with_party_pct + "</td>";
        newTr.insertAdjacentHTML("beforeend", votePercentage);

    }



}





//
// Populate a dropdown menu from states
//

//Variables

var statesArray = [];
var selectedState = "";



function populateDropdown(members) {


    for (var i = 0; i < members.length; i++) {
        if (!statesArray.includes(members[i].state))
            statesArray.push(members[i].state);
    }

    statesArray.sort();


    var firstOption = "<option id='dropdown-state' value='All'>-- All States --</option>";
    selectState.insertAdjacentHTML("beforeend", firstOption);
    for (var j = 0; j < statesArray.length; j++) {
        var newStateOption = "<option value='" + statesArray[j] + "'>" + statesArray[j] + "</option>";
        selectState.insertAdjacentHTML("beforeend", newStateOption);
    }

}






function updateTable(members) {


    var filteredMembers = [];

    selectedState = document.getElementById("selectState").value;

    var checkedBoxes = Array.from(document.querySelectorAll('input[name=mycheckboxes]:checked'));
    var checkedValues = checkedBoxes.map(function (checkedBox) {
        return checkedBox.getAttribute('value');
    });



    for (var i = 0; i < members.length; i++) {

        if ((checkedValues.length === 0) && (selectedState === "All")) {
            filteredMembers = members;
        } else if ((checkedValues.length != 0) && (selectedState === "All")) {

            if (checkedValues.indexOf(members[i].party) > -1) {
                filteredMembers.push(members[i]);

            }
        } else if ((checkedValues.length === 0) && (selectedState != "All")) {

            if (selectedState === members[i].state) {
                filteredMembers.push(members[i]);

            }
        } else if (checkedValues.indexOf(members[i].party) > -1 && selectedState === members[i].state) {
            filteredMembers.push(members[i]);
        }


    }
    generateTable(filteredMembers);
}
