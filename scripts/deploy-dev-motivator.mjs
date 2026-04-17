#!/usr/bin/env node

import { deploySuites } from './deploy-private-skills.mjs';

// 既存の npm script / ドキュメント互換のため、dev-motivator だけを同期する薄いラッパーとして残す。
deploySuites(['dev-motivator']);
