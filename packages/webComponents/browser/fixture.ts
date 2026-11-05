import '../styles/theme.css';
import type {} from '../types';
import '../components/input';
import '../components/navigation/page-header';
import '../components/form/form';
import '../components/form/form-item';
import '../components/form/tree-select';
import '../components/form/transfer';
import '../components/form/time-picker';
import '../components/form/time-range';
import '../components/table';
import { setThemeColors, setThemeMode } from '../utils/theme';

const department = document.querySelector('su-tree-select')!;
department.nodes = [{ key: 'root', label: '公司', children: [
  { key: 'engineering', label: '研发' },
  { key: 'operations', label: '运营' },
  { key: 'disabled', label: '停用部门', disabled: true },
] }];
const roles = document.querySelector('su-transfer')!;
roles.items = [
  { key: 'read', label: '读取' },
  { key: 'write', label: '写入' },
  { key: 'locked', label: '禁用角色', disabled: true },
];
roles.targetKeys = ['read'];
const wrapper = document.querySelector('su-form')!;
wrapper.rules = { username: [{ required: true, message: '请输入用户名' }] };
wrapper.addEventListener('valid-submit', (event) => {
  document.querySelector('#submitted')!.textContent = JSON.stringify((event as CustomEvent).detail.values);
});

const params = new URLSearchParams(location.search);
setThemeMode(params.get('theme') === 'dark' ? 'dark' : 'light');
if (params.get('brand')) setThemeColors({ primary: '#7c3aed' });

await Promise.all([wrapper.updateComplete, department.updateComplete, roles.updateComplete, document.querySelector('su-input')!.updateComplete]);
document.documentElement.dataset.ready = 'true';
import '../components/navigation/segmented';
import '../components/feedback/result';
import '../components/form/auto-complete';
import '../components/navigation/menu';
import '../components/navigation/dropdown';
import '../components/feedback/tooltip';

import '../components/feedback/drawer';

import '../components/form/date-time-range';

import '../components/data/calendar';

import '../components/form/upload';
import '../components/form/rich-text-field';

import '../components/data/week-schedule';
import '../components/data/sortable-list';
import '../components/data/stat-card';

import '../components/form/import-wizard';
