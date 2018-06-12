import HitDTO from '~/models/dto/hit'

export function toHitDTO(hit) {
    if (!hit) {
        return {};
    }
    let hitDTO = new HitDTO();
    hitDTO.id = hit.id;
    hitDTO.createdAt = hit.createdAt;
    hitDTO.updatedAt = hit.updatedAt;
    hitDTO.velocity = hit.velocity;
    hitDTO.duration = hit.duration;
    return hitDTO;
}

export function toHitsDTO(hits) {
    if (!hits) {
        return [];
    }
    let hitsDTO = [];
    hitsDTO.forEach(s => hitsDTO.add(toHitDTO(s)));
    return hitsDTO;
}