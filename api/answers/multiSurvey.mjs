import os from 'node:os'
import crypto from 'node:crypto'

function objectId() {
    const secondInHex = Math.floor(new Date()/1000).toString(16);
    const machineId = crypto.createHash('md5').update(os.hostname()).digest('hex').slice(0, 6);
    const processId = process.pid.toString(16).slice(0, 4).padStart(4, '0');
    const counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, '0');

    return secondInHex + machineId + processId + counter;
}

/*
survey, user, identifiertext, identifier, contentType,
*/

const buildMessage = (survey, user, identifier, textIndentifier, contentType) => {
    return {
        method: 'POST',
        message: {
            content: '', contentArray: [
                {
                    contentType: "application/vnd.cotalker.survey+text",
                    company: process.env.COMPANY,
                    identifier: textIndentifier, isActive: true
                },
                {
                    contentType,
                    company: process.env.COMPANY,
                    identifier, isActive: true
                }
        ]
        },
        
    }    
}

const bodyBuild = (group, parentTask, channel, survey, user, answerDict) => {}