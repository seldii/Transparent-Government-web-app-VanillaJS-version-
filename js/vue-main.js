const url = 'https://api.propublica.org/congress/v1/113/senate/members.json';
const url2 = 'https://api.propublica.org/congress/v1/113/house/members.json';
const opts = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": "OIg3ZQb6kfxzrPqdtMPvwGGFqW2UIRP8SP6ILTjR"
    }
}


var app = new Vue({
    el: '#app',
    data: {
        senators: [],
        columns: ["Senator", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "],
        isLoading: true,
        checkboxOptions: [
            {
                text: 'Democrat',
                value: "D",
                selected: false
                    },
            {
                text: 'Republican',
                value: "R",
                selected: false
                    },
            {
                text: 'Independent',
                value: "I",
                selected: false
                    },
        ],

        checkedParty: [],
        selectedState: "All",
        selectAll: true,
        states: [],
        sortKey: "last_name",
        currentSortDir: 'asc',
        searchName: "",
        reverse: false,


    },
    methods: {
        fetchData: function () {
            fetch(url, opts)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.senators = data.results[0].members
                    this.isLoading = false
                    this.getStates()
                

                })
                .catch(function (err) {
                    console.log(err)
                })
        },

        getStates: function () {
            let statesArr = [];

            this.senators.forEach(function (senator) {
                let stateCode = senator.state;
                if (statesArr.includes(stateCode) === false) {
                    statesArr.push(stateCode);
                }

            })

            statesArr.sort();

            this.states = statesArr

        },

        sort: function (s) {
            //if s == current sort, reverse
            if (s === this.sortKey) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.sortKey = s;
        },



    },

    computed: {

        filteredMembers: function () {
            return this.senators.filter(senator => {
                let partyFilterValue = this.checkedParty.length == 0 || this.checkedParty.includes(senator.party);
                let stateFilterValue = this.selectedState == 'All' || this.selectedState == senator.state;
                let searchedName = this.searchName.length === 0 || (senator.last_name.toLowerCase().indexOf(this.searchName.toLowerCase()) > -1)
                return partyFilterValue && stateFilterValue && searchedName;
            }).sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === 'desc') modifier = -1;
                if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                return 0;
            });
        },


    },

    created: function () {
        this.fetchData();

    },



});
