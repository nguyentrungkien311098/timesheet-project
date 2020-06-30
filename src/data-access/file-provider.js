import client from '@utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '@strings';

export default {
    upload(file) {
        return new Promise((resolve, reject) => {
            client.uploadFile(constants.api.file.upload, file).then(s => {
                let data = s.data;
                data.file = file;
                resolve(data);
            }).catch(e => {
                e.file = file;
                reject(e);
            })
        });
    },
}
