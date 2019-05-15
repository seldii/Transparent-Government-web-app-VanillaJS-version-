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
        headers : ["Senator", "Party Affilication", "State", "Years in Ofiice", "% Votes w/ party "],
        isLoading: true,
    },
    methods: {
        fetchData: function()  {
            fetch(url, opts)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.senators = data.results[0].members
                    this.isLoading = false
                console.log(this.senators)
                    
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
    },
    created: function() {
        this.fetchData();
    }
});
