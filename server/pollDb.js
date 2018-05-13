Polls.allow({
    insert: function (userId, poll) {
        return false;
    },
    update: function (userId, poll, fields, modifier) {
        return false;
    },
    remove: function (userId, poll) {
        return false;
    }
});

var spaceOnly = /^\s*$/g;
var htmlEntitiesEscapeMap = {
    '&': '&amp;',
    '&amp;': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};
var escapeHtmlEntites = function (input) {
    return input.replace(/[&<>]/g, function (char) {
        return htmlEntitiesEscapeMap[char] || char;
    });
};

Meteor.methods({

    addNewPoll: function (title, options) {
        if (Meteor.userId() &&
            spaceOnly.test(title) === false &&
            Array.isArray(options) &&
            options.length >= 2) {
            var pendingPoll = {};
            pendingPoll.owner = Meteor.userId();
            pendingPoll.title = escapeHtmlEntites(title);
            pendingPoll.results = {};
            pendingPoll.votedBy = [];
            pendingPoll.date = getMyDate();
            pendingPoll.tVotes = 0;
            options.map(escapeHtmlEntites).forEach(function (option) {
                pendingPoll.results[option] = 0;
            });
            return Polls.insert(pendingPoll);
        } else {
            throw new Meteor.Error(400,"Bad Request");
        }
    },

    getIp: function() {
        return (this.connection.httpHeaders["x-forwarded-for"]).split(",")[0];
    },

    voteFor: function (pollId, option) {
        var clientIp = (this.connection.httpHeaders["x-forwarded-for"]).split(",")[0];
        var poll = Polls.findOne(pollId);
        var userHaveNotVoted = Meteor.userId() && poll.votedBy.indexOf(Meteor.userId()) === -1;
        var IpHaveNotVoted = poll.votedBy.indexOf(clientIp) === -1;
        var inc = {};
        inc["results."+option] = 1;
        inc["tVotes"] = 1;

        if (spaceOnly.test(option) === false) {
            var whoVoting = [];
            if (userHaveNotVoted && Meteor.userId()) {
                whoVoting.push(Meteor.userId());
            }
            if (IpHaveNotVoted) {
                whoVoting.push(clientIp);
            }
            if (userHaveNotVoted || IpHaveNotVoted) {
                return Polls.update(pollId, {
                    $inc: inc,
                    $push: {votedBy: { $each: whoVoting }}
                });
            } else {
                throw new Meteor.Error("user-or-ip-voted","You can only vote once a poll.");
            }
        } else {
            throw new Meteor.Error(400,"Bad Request");
        }
    },

    removePoll: function (pollId) {
        var poll = Polls.findOne(pollId);
        if (poll.owner === Meteor.userId()) {
            Polls.remove(poll);
        } else {
            throw new Meteor.Error(400, "Bad Request");
        }
    }
});

function getMyDate() {
    var date = new Date();
    var day = date.getDate();
    if (day < 10) day = '0' + day;
    var month = date.getMonth();
    if (month < 10) month = '0' + month;
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
}
