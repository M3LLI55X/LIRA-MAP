// Gustav F. H. Siegfried - s204490
import { getKnexConnectionToken } from 'nestjs-knex';
import {jest} from '@jest/globals';

export const OUR_DB_TOKEN = {
    provide: getKnexConnectionToken('our-db'),
    useValue: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
    },
}

export const LIRA_MAIN_TOKEN = {
    provide: getKnexConnectionToken('lira-main'),
    useValue: {
        find: jest.fn(),
        insert: jest.fn(),
    },
}

export const LIRA_VIS_TOKEN = {
    provide: getKnexConnectionToken('lira-vis'),
    useValue: {
        find: jest.fn(),
        insert: jest.fn(),
    },
}
