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
        tbl: document.querySelector("#glanceTable"),
        tblSecond: document.getElementById("leastEngaged"),
        tblThird: document.getElementById("mostEngaged"),
        urlSenate: 'https://api.propublica.org/congress/v1/113/senate/members.json',
        urlHouse: 'https://api.propublica.org/congress/v1/113/house/members.json',


    },
    methods: {

        fetchedData: function () {
            let opts = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": "OIg3ZQb6kfxzrPqdtMPvwGGFqW2UIRP8SP6ILTjR"
                }
            };
            fetch(url, opts)
                .then(res => res.json())
                .then(function (data) {
                    this.members = data.results[0].members;
                    this.loading = false;

                    getPartyArr(data)
                    loyaltyAndEngagement(data)
                    createTableEngandLoy()

                })
                .catch(console.error);

        },



        loyaltyAndEngagement: function (data) {

            var mostLoyalGuys = [];
            var leastLoyalGuys = [];
            var votesWpartyArr = data.map(x => x.votes_with_party_pct);
            var reverseVotesWpartyArr = [];
            var firstTenPercentNum = Math.round(data.length * 0.1);

            votesWpartyArr.sort(function (a, b) {
                return a - b;
            });

            reverseVotesWpartyArr = votesWpartyArr.slice().reverse()


            var firstTenPerMostLoyal = reverseVotesWpartyArr.slice(0, firstTenPercentNum);

            for (var j = 0; j < data.length; j++) {

                if (firstTenPerMostLoyal.includes(data[j].votes_with_party_pct)) {

                    mostLoyalGuys.push(data[j]);

                }

            }


            var firstTenPerLeastLoyal = votesWpartyArr.slice(0, firstTenPercentNum);


            for (var j = 0; j < data.length; j++) {

                if (firstTenPerLeastLoyal.includes(data[j].votes_with_party_pct)) {

                    leastLoyalGuys.push(data[j]);

                }

            }

            statistic.Total.MostLoyalGuys = mostLoyalGuys;
            statistic.Total.LeastLoyalGuys = leastLoyalGuys;


            var leastEngagedGuys = [];
            var mostEngagedGuys = [];
            var missedVotesPerc = data.map(x => x.missed_votes_pct);
            var reverseMissedVotesPerc = [];

            missedVotesPerc.sort(function (a, b) {
                return a - b;
            });

            reverseMissedVotesPerc = missedVotesPerc.slice().reverse();



            var firstTenPerLeastEngaged = reverseMissedVotesPerc.slice(0, firstTenPercentNum);

            for (var j = 0; j < data.length; j++) {

                if (firstTenPerLeastEngaged.includes(data[j].missed_votes_pct)) {

                    leastEngagedGuys.push(data[j]);

                }

            }

            var firstTenPerMostEngaged = missedVotesPerc.slice(0, firstTenPercentNum);

            for (var j = 0; j < data.length; j++) {

                if (firstTenPerMostEngaged.includes(data[j].missed_votes_pct)) {

                    mostEngagedGuys.push(data[j]);

                }

            }

            statistic.Total.LeastEngagedGuys = leastEngagedGuys;

            statistic.Total.MostEngagedGuys = mostEngagedGuys;



        },

        getPartyArr: function (data) {

            var democratsArr = [];
            var republicanArr = [];
            var independentArr = [];

            data.forEach(function (member) {
                if (member.party.includes("D"))
                    democratsArr.push(member)
            })

            data.forEach(function (member) {
                if (member.party.includes("R"))
                    republicanArr.push(member)
            })


            data.forEach(function (member) {
                if (member.party.includes("I"))
                    independentArr.push(member)
            })

            function averageVoteWithParty(partyArr) {
                var votesWpartyArr = partyArr.map(x => x.votes_with_party_pct);
                var arrSum = arr => arr.reduce((a, b) => a + b, 0);

                if (partyArr.length === 0) return "-";

                return (arrSum(votesWpartyArr) / partyArr.length).toFixed(2);


            }

            //Democrats

            statistic.Democrats.NoOfReps = democratsArr.length;

            statistic.Democrats.AveVotedWParty = averageVoteWithParty(democratsArr);



            //Republicans

            statistic.Republicans.NoOfReps = republicanArr.length;

            statistic.Republicans.AveVotedWParty = averageVoteWithParty(republicanArr);



            //Independents

            statistic.Independents.NoOfReps = independentArr.length;

            statistic.Independents.AveVotedWParty = averageVoteWithParty(independentArr);

            //Total

            statistic.Total.NoOfReps = data.length;
            statistic.Total.AveVotedWParty = averageVoteWithParty(data);

        }
    },

    createTableEngandLoy: function () {

        if (document.title.includes("Party Loyalty")) {
            var leastLoyalMembers = statistic.Total.LeastLoyalGuys;
            var mostLoyalMembers = statistic.Total.MostLoyalGuys;

            generateTableLoyalty(leastLoyalMembers, tblSecondLoyalty)
            generateTableLoyalty(mostLoyalMembers, tblThirdLoyalty)
        }




        if (document.title.includes("Attendance")) {

            var leastEngagedMembers = statistic.Total.LeastEngagedGuys;
            var mostEngagedMembers = statistic.Total.MostEngagedGuys;
            generateTableEngagement(leastEngagedMembers, tblSecond)
            generateTableEngagement(mostEngagedMembers, tblThird)

        }

    }

})
