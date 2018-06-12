import TrainingDTO from '~/models/dto/training'

export function toTrainingDTO(training) {
    if (!training) {
        return {};
    }
    return new TrainingDTO();
}