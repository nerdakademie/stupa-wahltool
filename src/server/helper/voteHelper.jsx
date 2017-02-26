'use strict';

const Contestant = require('../db').model('Vote');
const uuid = require('uuid/v4');
const Mailer = require('./mailer');
const config = require('../config');
const pug = require('pug');

module.exports = class ContestantHelper {

    static sendVoteMail(student, callback) {
        const token = uuid();
        const data = {};
        data.to = student.email;
        data.subject = config.get('mailer:voteSubject');
        data.template = {};
        data.template.name = 'voteRequest';
        data.template.replace = [];
        data.template.replace.push({
            placeholder: 'name',
            value: student.firstName
        });
        data.template.replace.push({
            placeholder: 'token',
            value: token
        });
        data.template.replace.push({
            placeholder: 'voteLink',
            value: `${config.get('webserver:defaultProtocol')}://${config.get('webserver:url')}/list/${token}`
        });

        Mailer.sendMailWithTemplate(data, (result) => {
            //TODO: UPDATE FOR VOTE MAILER
            if (result === true) {
                const contestant = new Contestant(contestantJSON);
                contestant.save((error2) => {
                    if (error2) {
                        return callback(false);
                    }
                    return callback(true);
                });
            } else {
                return callback(false);
            }
        });
    }
};
