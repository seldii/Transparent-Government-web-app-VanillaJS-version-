var vm = new Vue({
    el: "#app",
    data: {
        members: [],
        isLoading: true,
        statistic: {
            Democrats: {
                NoOfReps: 0,
                AveVotedWParty: 0,

            },
            Republicans: {
                NoOfReps: 0,
                AveVotedWParty: 0,

            },
            Independents: {
                NoOfReps: 0,
                AveVotedWParty: 0,

            },

            Total: {
                NoOfReps: 0,
                AveVotedWParty: 0,
                LeastEngagedGuys: [],
                MostEngagedGuys: [],
                LeastLoyalGuys: [],
                MostLoyalGuys: [],

            },


        },

        sortKey: "",
        currentSortDir: "asc",

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
                    this.members = data.results[0].members
                    this.isLoading = false
                    console.log(this.members)
                    this.getPartyArr()
                    this.loyaltyAndEngagement()


                })
                .catch(function (err) {
                    console.log(err)
                })

        },



        loyaltyAndEngagement: function () {

            var mostLoyalGuys = [];
            var leastLoyalGuys = [];
            var votesWpartyArr = this.members.map(x => x.votes_with_party_pct);
            var reverseVotesWpartyArr = [];
            var firstTenPercentNum = Math.round(this.members.length * 0.1);

            votesWpartyArr.sort(function (a, b) {
                return a - b;
            });

            reverseVotesWpartyArr = votesWpartyArr.slice().reverse()


            var firstTenPerMostLoyal = reverseVotesWpartyArr.slice(0, firstTenPercentNum);

            for (var j = 0; j < this.members.length; j++) {

                if (firstTenPerMostLoyal.includes(this.members[j].votes_with_party_pct)) {

                    mostLoyalGuys.push(this.members[j]);

                }

            }


            var firstTenPerLeastLoyal = votesWpartyArr.slice(0, firstTenPercentNum);


            for (var j = 0; j < this.members.length; j++) {

                if (firstTenPerLeastLoyal.includes(this.members[j].votes_with_party_pct)) {

                    leastLoyalGuys.push(this.members[j]);

                }

            }

            this.statistic.Total.MostLoyalGuys = mostLoyalGuys;
            this.statistic.Total.LeastLoyalGuys = leastLoyalGuys;


            var leastEngagedGuys = [];
            var mostEngagedGuys = [];
            var missedVotesPerc = this.members.map(x => x.missed_votes_pct);
            var reverseMissedVotesPerc = [];

            missedVotesPerc.sort(function (a, b) {
                return a - b;
            });

            reverseMissedVotesPerc = missedVotesPerc.slice().reverse();



            var firstTenPerLeastEngaged = reverseMissedVotesPerc.slice(0, firstTenPercentNum);

            for (var j = 0; j < this.members.length; j++) {

                if (firstTenPerLeastEngaged.includes(this.members[j].missed_votes_pct)) {

                    leastEngagedGuys.push(this.members[j]);

                }

            }

            var firstTenPerMostEngaged = missedVotesPerc.slice(0, firstTenPercentNum);

            for (var j = 0; j < this.members.length; j++) {

                if (firstTenPerMostEngaged.includes(this.members[j].missed_votes_pct)) {

                    mostEngagedGuys.push(this.members[j]);

                }

            }

            this.statistic.Total.LeastEngagedGuys = leastEngagedGuys;

            this.statistic.Total.MostEngagedGuys = mostEngagedGuys;



        },

        getPartyArr: function () {

            var democratsArr = [];
            var republicanArr = [];
            var independentArr = [];

            this.members.forEach(function (member) {
                if (member.party.includes("D"))
                    democratsArr.push(member)
            })

            this.members.forEach(function (member) {
                if (member.party.includes("R"))
                    republicanArr.push(member)
            })


            this.members.forEach(function (member) {
                if (member.party.includes("I"))
                    independentArr.push(member)
            })



            function averageVoteWithParty(partyArr) {
                var votesWpartyArr = partyArr.map(x => x.votes_with_party_pct);
                var arrSum = arr => arr.reduce((a, b) => a + b, 0);

                if (partyArr.length === 0) return "-";

                return (arrSum(votesWpartyArr) / partyArr.length).toFixed(2);


            }



            this.statistic.Democrats.NoOfReps = democratsArr.length;



            this.statistic.Democrats.AveVotedWParty = averageVoteWithParty(democratsArr);





            this.statistic.Republicans.NoOfReps = republicanArr.length;

            this.statistic.Republicans.AveVotedWParty = averageVoteWithParty(republicanArr);




            this.statistic.Independents.NoOfReps = independentArr.length;

            this.statistic.Independents.AveVotedWParty = averageVoteWithParty(independentArr);



            this.statistic.Total.NoOfReps = this.members.length;
            this.statistic.Total.AveVotedWParty = averageVoteWithParty(this.members);

        },

        sort: function (s) {
            //if s == current sort, reverse
            if (s === this.sortKey) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.sortKey = s;
        }
    },

    computed: {
        sortedMembers: function () {
            return this.statistic.Total.LeastEngagedGuys.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === 'desc') modifier = -1;
                if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                return 0;
            });
        }
    },


    created: function () {
        if (document.title.includes("Senate")) {
            this.fetchData(this.urlSenate);
        };
        if (document.title.includes("House")) {
            this.fetchData(this.urlHouse);
        }
    },

})
