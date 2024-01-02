import express from 'express';
import * as controller from './search-controller.js';
import * as schema from './schema/request-schema.js';
import { validate } from '../../lib/utils/validate.js';

export const router = express.Router();

// 3개 인덱스 통합 검색
router.get('/', validate(schema.multiSearchParam), controller.multiSearch);

// 1개 인덱스 통합/상세 검색
router.get('/:type', validate(schema.searchParam), controller.simpleSearch);

export default router;