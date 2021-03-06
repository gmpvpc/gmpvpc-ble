import App from '~/api/app'
import Dao from '~/repositories/dao'
import HitRepository from '~/repositories/hit';
import SeriesRepository from '~/repositories/series';
import TrainingRepository from '~/repositories/training';
import DeviceRepository from '~/repositories/device';

let dao = new Dao();
export let hitRepository = new HitRepository(dao);
export let seriesRepository = new SeriesRepository(dao);
export let trainingRepository = new TrainingRepository(dao);
export let deviceRepository = new DeviceRepository(dao);
dao.init();

let server = new App();
server.start();