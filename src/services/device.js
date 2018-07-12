import {Device} from "~/models/dao/device";
import Version from "~/models/dto/version";
import {deviceRepository} from '~/index';
import LogFormat from "~/utils/log-format";

class DeviceService extends LogFormat {

    constructor() {
        super("DeviceService");
    }

    register(uid) {
        this.log(uid, `Register...`);
        return new Promise((resolve, reject) => {
            deviceRepository.create({uid: uid})
                .then(d => {
                    this.log(uid, `Registered.`);
                    resolve(d);
                })
                .catch(err => {
                    this.log(uid, `Register failed - ${err}`);
                    reject();
                });
        });
    }

    unregister(uid) {
        this.log(uid, `Unregister...`);
        return new Promise((resolve, reject) => {
            deviceRepository.deleteByUid(uid)
                .then(d => {
                    this.log(uid, `Unregistered.`);
                    resolve(d);
                }).catch(err => {
                this.log(uid, `Unregister failed - ${err}`);
                reject();
            });
        })
    }

    info(uid, data) {
        this.log(uid, `Info...`);
        return new Promise((resolve, reject) => {
            deviceRepository.findByUid(uid)
                .then(d => {
                    if (d != null) {
                        deviceRepository.update(d.id, data);
                    }
                    this.log(uid, `Info gotten: ${d}`);
                    resolve(d);
                })
                .catch(err => {
                    this.log(uid, `Info failed - ${err}`);
                    reject();
                });
        });
    }

    version(uid) {
        this.log(uid, `Version...`);
        return new Promise((resolve, reject) => {
            deviceRepository.findByUid(uid)
                .then(d => {
                    let version = new Version();
                    if (d != null) {
                        version.link = "https://new_version";
                    }
                    this.log(uid, `Version gotten: ${version}`);
                    resolve(version);
                })
                .catch(err => {
                    this.log(uid, `Version failed - ${err}`);
                    reject();
                });
        });
    }

}

export default new DeviceService();