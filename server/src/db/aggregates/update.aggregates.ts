export function voteAggregate(answerVoteIndex) {
    return {
        '$set': {
            'totalVotesCount': {
                '$sum': [
                    '$totalVotesCount', 1
                ]
            },
            'survey.answers': {
                '$map': {
                    'input': '$survey.answers',
                    'in': {
                        '$mergeObjects': [
                            '$$this', {
                                'voteCount': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                {
                                                    '$indexOfArray': [
                                                        '$survey.answers', '$$this'
                                                    ]
                                                }, answerVoteIndex
                                            ]
                                        },
                                        'then': {
                                            '$sum': [
                                                '$$this.voteCount', 1
                                            ]
                                        },
                                        'else': '$$this.voteCount'
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    };
}

export function calcVoteInPercentAggregate() {
    return {
        '$set': {
            'survey.answers': {
                '$map': {
                    'input': '$survey.answers',
                    'in': {
                        '$mergeObjects': [
                            '$$this', {
                                'voteInPercent': {
                                    '$cond': {
                                        'if': {
                                            '$gt': ['$$this.voteCount', 0]
                                        },
                                        'then': {
                                            '$round': [
                                                {
                                                    '$multiply': [
                                                        {
                                                            '$divide': [
                                                                '$$this.voteCount', '$totalVotesCount'
                                                            ]
                                                        }, 100
                                                    ]
                                                }, 0
                                            ]
                                        },
                                        'else': 0
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    };
}