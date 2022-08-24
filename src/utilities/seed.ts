import USER, { IUser } from '../models/userModel';
import logger from './logger';

export default async function seed() {
    const admin: IUser = {
        email: 'docent@howest.be',
        password: 'P@ssw0rd',
        tos: true,
        role: 'admin'
    };


    USER.findOne({ email: 'docent@howest.be' })
        .then((user) => {
            if(!user){
                USER.signup(admin).then(() => {
                    logger.info('Seeding admin user');
                }).catch(err => {
                    logger.error(err);
                });
            } else {
                logger.info('Default admin exists');
            }   
        })
        .catch(() => {
            
            USER.signup(admin).then(() => {
                logger.info('Seeding admin user');
            }).catch(err => {
                logger.error(err);
            });
        });
}