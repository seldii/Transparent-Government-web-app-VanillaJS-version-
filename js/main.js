const urlSenate = 'https://api.propublica.org/congress/v1/113/senate/members.json';
const urlHouse = 'https://api.propublica.org/congress/v1/113/house/members.json';
const opts = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": "OIg3ZQb6kfxzrPqdtMPvwGGFqW2UIRP8SP6ILTjR"
    }
}

let headerArrHouse = ["Congressmen", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "]
let headerArrSenate = ["Senator", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "];

let url = "";


if (document.title.includes("Senate")) {
    url = urlSenate;
    headerArr = headerArrSenate;
} else if (document.title.includes("House")) {
    url = urlHouse;
    headerArr = headerArrHouse;
};

showLoader();
fetch(url, opts)
    .then(res => res.json())
    .then(function (data) {
        data = data.results[0].members;
        if (document.title.includes("Senate") || document.title.includes("House")) {
            hideLoader();
            createTHead(table, headerArr)
            generateTable(data);
            populateDropdown(data);
            document.getElementById("republicanCheckbox").addEventListener("click", () => {
                updateTable(data)
            });
            document.getElementById("democratCheckbox").addEventListener("click", () => {
                updateTable(data)
            });
            document.getElementById("independentCheckbox").addEventListener("click", () => {
                updateTable(data)
            });
            document.getElementById("selectState").addEventListener("click", () => {
                updateTable(data)
            });
            document.forms["search-name"].querySelector("input").addEventListener('keyup', () => {
                updateTable(data)
            });
        };

    })
    .catch(console.error);





function showLoader() {
    let spinner = `<div class="spinner-grow" role="status" id="spinner">
                    <span class="sr-only" >Loading...</span>
                </div>`;
    let loader = document.getElementById("loader");
    loader.insertAdjacentHTML("beforeend", spinner);

}

function hideLoader() {
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


    var firstOption = "<option id='dropdown-state' value='All'>-- All--</option>";
    selectState.insertAdjacentHTML("beforeend", firstOption);
    for (var j = 0; j < statesArray.length; j++) {
        var newStateOption = "<option value='" + statesArray[j] + "'>" + statesArray[j] + "</option>";
        selectState.insertAdjacentHTML("beforeend", newStateOption);
    }

}






function updateTable(members) {


    var filteredMembers = [];
    var searchTerm = document.forms["search-name"].querySelector("input").value;

    selectedState = document.getElementById("selectState").value;

    var checkedBoxes = Array.from(document.querySelectorAll('input[name=mycheckboxes]:checked'));
    var checkedValues = checkedBoxes.map(function (checkedBox) {
        return checkedBox.getAttribute('value');
    });

    filteredMembers = members.filter(member => {
        let fullName = member.last_name + member.middle_name + member.first_name;
        let partyFilterValue = checkedValues.length == 0 || checkedValues.includes(member.party);
        let stateFilterValue = selectedState == 'All' || selectedState == member.state;
        let searchName = searchTerm.length === 0 || (fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);

        return partyFilterValue && stateFilterValue && searchName;
    });


    /* for (var i = 0; i < members.length; i++) {

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


     }*/
    generateTable(filteredMembers);
}
