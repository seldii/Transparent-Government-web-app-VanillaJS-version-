var app = new Vue({
    el: '#app',
    data: {
        senators: [],
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
        sortKey: "",
        currentSortDir: 'asc',
        searchName: "",
        reverse: false,
        pageSize: 10,
        currentPage: 1,
        urlSenate: 'https://api.propublica.org/congress/v1/113/senate/members.json',
        urlHouse: 'https://api.propublica.org/congress/v1/113/house/members.json',

    },
    methods: {
        fetchData: function (x) {
            let opts = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": "OIg3ZQb6kfxzrPqdtMPvwGGFqW2UIRP8SP6ILTjR"
                }
            };
            fetch(x, opts)
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


        nextPage: function () {
            if ((this.currentPage * this.pageSize) < this.senators.length) this.currentPage++;
        },
        prevPage: function () {
            if (this.currentPage > 1) this.currentPage--;
        },

        sort: function (s) {

            if (s === this.sortKey) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.sortKey = s;
        },



    },

    computed: {

        filteredMembers: function () {

            return this.senators.filter(senator => {
                let fullName = senator.last_name + senator.middle_name + senator.first_name;
                let partyFilterValue = this.checkedParty.length == 0 || this.checkedParty.includes(senator.party);
                let stateFilterValue = this.selectedState == 'All' || this.selectedState == senator.state;
                let searchedName = this.searchName.length === 0 || (fullName.toLowerCase().indexOf(this.searchName.toLowerCase()) > -1)
                return partyFilterValue && stateFilterValue && searchedName;
            }).sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === 'desc') modifier = -1;
                if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                return 0;
            }).filter((row, index) => {
                let start = (this.currentPage - 1) * this.pageSize;
                let end = this.currentPage * this.pageSize;
                if (index >= start && index < end) return true;
            });
        },


    },

    created: function () {
        if (document.title.indexOf("Senate") != -1) {
            this.fetchData(this.urlSenate);
        };
        if (document.title.indexOf("House") != -1) {
            this.fetchData(this.urlHouse);
        }
    },



});
