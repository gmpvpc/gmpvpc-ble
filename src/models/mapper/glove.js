import GloveDTO from '~/models/dto/glove'

export function toGloveDTO(glove) {
    if (!glove) {
        return {};
    }
    return new GloveDTO(glove.id, glove.started, glove.isCalibrated());
}