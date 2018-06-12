import GloveDTO from '~/models/dto/glove'

export function toGloveDTO(glove) {
    if (!glove) {
        return {};
    }
    let gloveDTO = new GloveDTO();
    gloveDTO.id = glove.id;
    gloveDTO.started = glove.started;
    gloveDTO.calibrated = glove.isCalibrated();
    return gloveDTO;
}