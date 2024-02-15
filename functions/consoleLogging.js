'use strict';
import 'dotenv/config';
import Beaver from 'beaver-logs';

export const beaver = new Beaver(process.env.BEAVER_TOKEN);
