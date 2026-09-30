import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',use:{baseURL:process.env.TEST_BASE_URL||'http://127.0.0.1:3107',headless:true},workers:1,reporter:'list',projects:[{name:'desktop',use:{viewport:{width:1440,height:1080}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]});
