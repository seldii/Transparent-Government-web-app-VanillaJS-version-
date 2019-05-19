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
        congressmen: [],
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
        pageSize: 10,
        currentPage: 1,


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

        fetchData2: function () {
            fetch(url2, opts)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.congressmen = data.results[0].members
                    this.isLoading = false
                    this.getStates2()


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

        getStates2: function () {
            let statesArr = [];

            this.congressmen.forEach(function (congressman) {
                let stateCode = senator.state;
                if (statesArr.includes(stateCode) === false) {
                    statesArr.push(stateCode);
                }

            })

            statesArr.sort();

            this.states = statesArr

        },

        nextPage: function () {
            if ((this.currentPage * this.pageSize) < this.congressmen.length) this.currentPage++;
        },
        prevPage: function () {
            if (this.currentPage > 1) this.currentPage--;
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
            }).filter((row, index) => {
                let start = (this.currentPage - 1) * this.pageSize;
                let end = this.currentPage * this.pageSize;
                if (index >= start && index < end) return true;
            });
        },
        filteredMembers2: function () {
            return this.congressmen.filter(congressman => {
                let partyFilterValue = this.checkedParty.length == 0 || this.checkedParty.includes(congressman.party);
                let stateFilterValue = this.selectedState == 'All' || this.selectedState == congressman.state;
                let searchedName = this.searchName.length === 0 || (congressman.last_name.toLowerCase().indexOf(this.searchName.toLowerCase()) > -1)
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
        this.fetchData();
        this.fetchData2();

    },



});
