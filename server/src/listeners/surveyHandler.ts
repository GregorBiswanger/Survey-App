import { Io, Socket } from './socket-types.d';
import activeSurveysRepository, { ActiveSurvey } from '../db/active-surveys-repository';
type ActiveSurveyCallback = (activeSurvey: ActiveSurvey) => void;

export default (io: Io, socket: Socket) => {
    const startSurvey = async (surveyId: string, callback: ActiveSurveyCallback) => {
        let connectCode = generateConnectCode();

        while (await activeSurveysRepository.existsConnectCode(connectCode)) {
            connectCode = generateConnectCode();
        }

        const activeSurvey = await activeSurveysRepository.save(surveyId, connectCode);
        callback(activeSurvey);
    }

    const voteSurvey = async (activeSurveyId: string, voteIndex: number) => {
        const activeSurvey = await activeSurveysRepository.updateVote(activeSurveyId, voteIndex);

        if(activeSurvey) {
            socket.join(activeSurvey.connectCode);
            io.to(activeSurvey.connectCode).emit('survey:voted', activeSurvey);
        }
    }

    socket.on('survey:start', startSurvey);
    socket.on('survey:vote', voteSurvey);
}

function generateConnectCode() {
    const connectCodeLength = 6;
    const randomNumber = ('0'.repeat(connectCodeLength) + Math.floor(Math.random() * 10 ** connectCodeLength)).slice(-connectCodeLength);

    return randomNumber;
}
