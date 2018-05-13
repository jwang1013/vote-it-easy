Meteor.startup( function () {
    if (Polls.find().count() === 0) {
        var polls = [
                { owner: "Eric",
                    title: "What is your favorite programming language?",
                    results: { "Java": 10,
                                "Python": 25,
                                "C#": 8,
                                "JavaScript": 3,
                                "Ruby": 2},
                    votedBy: [],
                    date: "2017-05-12",
                    tVotes: 48
                },
                { owner: "Cindy",
                    title: "What is your favorite PC brand",
                    results: { "Dell": 20,
                                "HP": 10,
                                "Lenovo": 8,
                                "Alienware": 25,
                                "Asus": 15,
                                "Apple": 50,
                                "Acer": 1},
                    votedBy: [],
                    date: "2017-09-13",
                    tVotes: 129
                },
                { owner: "Qiaochu",
                    title: "What is your car maker?",
                    results: { "Toyota": 5,
                                "Honda": 8,
                                "BMW":3,
                                "Mercedes":2,
                                "VW": 5,
                                "Ford": 4,
                                "Kia": 1,
                                "Chevy": 1,
                                "Subaru": 1,
                                "Porche": 1},
                    votedBy: [],
                    date: "2017-10-23",
                    tVotes: 31
                },
                { owner: "Bill",
                    title: "Which is your favorite Hearthstone class?",
                    results: { "Druid": 5,
                                "Hunter": 8,
                                "Mage":3,
                                "Warrior":9,
                                "Warlock": 5,
                                "Shaman": 1,
                                "Paladin": 10,
                                "Priest": 11,
                                "Rogue": 6},
                    votedBy: [],
                    date: "2017-10-23",
                    tVotes: 58
                },
                { owner: "Jack",
                    title: "What is your favorite poker game?",
                    results: { "BlackJack": 15,
                                "Texas Hold'em": 23,
                                "5-Card Draw":3,
                                "7-Card Stud":1,
                                "Follow the Queen": 2,
                                "Omaha": 1},
                    votedBy: [],
                    date: "2017-10-23",
                    tVotes: 45
                }
            ];
        for (var i = 0; i < polls.length; i++) {
            Polls.insert(polls[i]);
        }
    }
});