import { Io, Socket } from './socket-types.d';
import activeSurveysRepository, { ActiveSurvey, StartSurveyOptions } from '../db/active-surveys-repository';
import surveysHistoryRepository from '../db/surveys-history-repository';
import { ObjectId } from 'mongodb';
type ActiveSurveyCallback = (activeSurvey: ActiveSurvey) => void;

export default (io: Io, socket: Socket) => {
    const startSurvey = async (options: StartSurveyOptions, callback: ActiveSurveyCallback) => {
        let connectCode = generateConnectCode();

        while (await activeSurveysRepository.existsConnectCode(connectCode)) {
            connectCode = generateConnectCode();
        }

        let activeSurvey = await activeSurveysRepository.save(options, connectCode);

        if (activeSurvey.options.duration) {
            timeoutSurvey(activeSurvey.connectCode, activeSurvey.options.duration);
        }

        callback(activeSurvey);
    }

    const voteSurvey = async (activeSurveyId: string, voteIndex: number) => {
        let activeSurvey = await activeSurveysRepository.updateVote(activeSurveyId, voteIndex);

        if (activeSurvey) {
            await socket.join(activeSurvey.connectCode);
            io.to(activeSurvey.connectCode).emit('survey:voted', activeSurvey);
        }
    }

    const listenSurvey = async (connectCode: string) => {
        let activeSurvey = await activeSurveysRepository.load(connectCode);

        if (activeSurvey) {
            await socket.join(activeSurvey.connectCode);
            socket.emit('survey:voted', activeSurvey);
        }
    }

    const stopSurvey = async (connectCode: string) => {
        const activeSurvey = await activeSurveysRepository.load(connectCode);
        if (!activeSurvey) { return; }

        if (await surveysHistoryRepository.save(activeSurvey)) {
            await activeSurveysRepository.remove(connectCode);
        };

        io.to(connectCode).emit('survey:stopped', '');
        // io.in(connectCode).socketsLeave(connectCode);
    }

    const listenStopped = async (connectCode: string) => {
        await socket.join(connectCode);
    }

    function generateConnectCode() {
        const connectCodeLength = 6;
        const randomNumber = ('0'.repeat(connectCodeLength) + Math.floor(Math.random() * 10 ** connectCodeLength)).slice(-connectCodeLength);
    
        return randomNumber;
    }
    
    function timeoutSurvey(connectCode: string, duration: number) {
        setTimeout(async () => {
            await stopSurvey(connectCode);
        }, duration);
    }

    socket.on('survey:start', startSurvey);
    socket.on('survey:vote', voteSurvey);
    socket.on('survey:listen', listenSurvey);
    socket.on('survey:stop', stopSurvey);
    socket.on('survey:listenStopped', listenStopped);
}
