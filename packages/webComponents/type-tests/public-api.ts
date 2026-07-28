import type { SuInput, SuTabs } from '../dist/index';
import '../dist/index';

const input: SuInput = document.createElement('su-input');
input.name = 'query';
input.value = 'Lit';

const tabs: SuTabs = document.createElement('su-tabs');
tabs.items = [{ key: 'api', label: 'API' }];

document.createElement('se-image').fit = 'contain';
