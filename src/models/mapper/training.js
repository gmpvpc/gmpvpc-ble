import TrainingDTO from '~/models/dto/training'
import {toSeriessDTO} from '~/models/mapper/series'
import {toSeriesDTO} from "./series";

export function toTrainingDTO(training) {
    if (!training) {
        return {};
    }
    let trainingDTO = new TrainingDTO();
    trainingDTO.id = training.id;
    trainingDTO.createdAt = training.createdAt;
    trainingDTO.updatedAt = training.updatedAt;
    trainingDTO.series = toSeriessDTO(training.series);
    trainingDTO.status = training.status;
    return trainingDTO;
}

export function toTrainingsDTO(trainings) {
    if (!trainings) {
        return [];
    }
    let trainingsDTO = [];
    trainings.forEach(s => trainingsDTO.add(toSeriesDTO(s)));
    return trainingsDTO;
}