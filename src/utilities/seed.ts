import USER, { IUser } from '../models/userModel';
import logger from './logger';

export default async function seed() {
    USER.findOne({ email: 'docent@howest' })
        .then(() => {
            logger.info('Default admin exists');
        })
        .catch(() => {
            const admin: IUser = {
                email: 'docent@howest.be',
                password: 'P@ssw0rd',
                tos: true,
                role: 'admin'
            };
    
            USER.signup(admin).then(token => {
                logger.info('Seeding admin user');
            }).catch(err => {
                logger.error(err);
            });
        });
}