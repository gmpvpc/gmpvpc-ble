import SeriesDTO from '~/models/dto/series'
import {toHitsDTO} from '~/models/mapper/hit'

export function toSeriesDTO(series) {
    if (!series) {
        return {};
    }
    let seriesDTO = new SeriesDTO();
    seriesDTO.id = series.id;
    seriesDTO.createdAt = series.createdAt;
    seriesDTO.updatedAt = series.updatedAt;
    seriesDTO.combinations = toHitsDTO(series.combinations);
    seriesDTO.occurrence = series.occurrence;
    seriesDTO.hits = series.hits;
    return seriesDTO;
}

export function toSeriessDTO(seriess) {
    if (!seriess) {
        return [];
    }
    let seriessDTO = [];
    seriess.forEach(s => seriessDTO.push(toSeriesDTO(s)));
    return seriessDTO;
}