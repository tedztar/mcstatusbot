'use strict';
import 'dotenv/config';
import Beaver from 'beaver-logs';

export const beaver = process.env.USE_BEAVER == 'true' ? new Beaver(process.env.BEAVER_TOKEN) : console;
