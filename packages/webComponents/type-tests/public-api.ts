import type {
  SuIcon,
  SuForm,
  SuDateRange,
  FormRule,
  IconName,
  LineComponent,
  SeAssetViewer,
  SeImage,
  SeImagePreview,
  SePagination,
  SuAlert,
  SuAvatar,
  SuBadge,
  SuBreadcrumb,
  SuButton,
  SuCard,
  SuCascader,
  SuCheckbox,
  SuContainer,
  SuDatePicker,
  SuDescriptions,
  SuDivider,
  SuDrawer,
  SuDropdown,
  SuEmpty,
  SuFormItem,
  SuInput,
  SuInputNumber,
  SuMenu,
  SuMessage,
  SuModal,
  SuNotification,
  SuPopconfirm,
  SuProgress,
  SuRadioGroup,
  SuSelect,
  SuSkeleton,
  SuSpin,
  SuStatCard,
  SuSteps,
  SuSwitch,
  SuTabs,
  SuTag,
  SuTextarea,
  SuThemeToggle,
  SuTooltip,
  SuTree,
  SuUpload,
  seTable,
} from '../dist/index';
import type { SuButton as DirectSuButton } from '../dist/components/button/index';
const iconName: IconName = 'search';
const adminIcon: SuIcon = document.createElement('su-icon');
adminIcon.name = iconName;
const rule: FormRule = { required: true, validator: async () => '' };
const adminForm: SuForm = document.createElement('su-form');
adminForm.rules = { user: [rule] };
const dateRange: SuDateRange = document.createElement('su-date-range');
dateRange.value = ['2026-01-01', '2026-02-01'];
import type { SuSelect as DirectSuSelect } from '../dist/components/form/select/index';
import '../dist/index';
import { setThemeColors, initTheme } from 'silenceui/theme';
import type { SuButton as PackageButton } from 'silenceui/components/button';
import type { SuTypewriter, TypewriterEffect } from 'silenceui/components/data/typewriter';
const typewriter: SuTypewriter = document.createElement('su-typewriter');
const effect: TypewriterEffect = 'slide';
typewriter.texts = ['你好', 'SilenceUI'];
typewriter.effect = effect;
typewriter.pause();
typewriter.resume();
typewriter.restart();
const packageButton: PackageButton = document.createElement('su-button');
void packageButton;
void initTheme;
setThemeColors({ primary: '#7c3aed' });
import '../dist/components/button/index';
import '../dist/components/form/select/index';

const input: SuInput = document.createElement('su-input');
input.name = 'query';
input.value = 'Lit';

const directButton: DirectSuButton = document.createElement('su-button');
const directSelect: DirectSuSelect = document.createElement('su-select');
void directButton;
void directSelect;

const tabs: SuTabs = document.createElement('su-tabs');
tabs.items = [{ key: 'api', label: 'API' }];

const publicElements: [
  LineComponent,
  SeAssetViewer,
  SeImage,
  SeImagePreview,
  SePagination,
  seTable,
  SuAlert,
  SuAvatar,
  SuBadge,
  SuBreadcrumb,
  SuButton,
  SuCard,
  SuCascader,
  SuCheckbox,
  SuContainer,
  SuDatePicker,
  SuDescriptions,
  SuDivider,
  SuDrawer,
  SuDropdown,
  SuEmpty,
  SuFormItem,
  SuInput,
  SuInputNumber,
  SuMenu,
  SuMessage,
  SuModal,
  SuNotification,
  SuPopconfirm,
  SuProgress,
  SuRadioGroup,
  SuSelect,
  SuSkeleton,
  SuSpin,
  SuStatCard,
  SuSteps,
  SuSwitch,
  SuTabs,
  SuTag,
  SuTextarea,
  SuThemeToggle,
  SuTooltip,
  SuTree,
  SuUpload,
] = [
  document.createElement('line-component'),
  document.createElement('se-asset-viewer'),
  document.createElement('se-image'),
  document.createElement('se-image-preview'),
  document.createElement('se-pagination'),
  document.createElement('se-table'),
  document.createElement('su-alert'),
  document.createElement('su-avatar'),
  document.createElement('su-badge'),
  document.createElement('su-breadcrumb'),
  document.createElement('su-button'),
  document.createElement('su-card'),
  document.createElement('su-cascader'),
  document.createElement('su-checkbox'),
  document.createElement('su-container'),
  document.createElement('su-date-picker'),
  document.createElement('su-descriptions'),
  document.createElement('su-divider'),
  document.createElement('su-drawer'),
  document.createElement('su-dropdown'),
  document.createElement('su-empty'),
  document.createElement('su-form-item'),
  document.createElement('su-input'),
  document.createElement('su-input-number'),
  document.createElement('su-menu'),
  document.createElement('su-message'),
  document.createElement('su-modal'),
  document.createElement('su-notification'),
  document.createElement('su-popconfirm'),
  document.createElement('su-progress'),
  document.createElement('su-radio-group'),
  document.createElement('su-select'),
  document.createElement('su-skeleton'),
  document.createElement('su-spin'),
  document.createElement('su-stat-card'),
  document.createElement('su-steps'),
  document.createElement('su-switch'),
  document.createElement('su-tabs'),
  document.createElement('su-tag'),
  document.createElement('su-textarea'),
  document.createElement('su-theme-toggle'),
  document.createElement('su-tooltip'),
  document.createElement('su-tree'),
  document.createElement('su-upload'),
];

publicElements[2].fit = 'contain';

const accessibleTextarea: SuTextarea = document.createElement('su-textarea');
accessibleTextarea.label = '备注';
accessibleTextarea.helperText = '请填写补充说明';
accessibleTextarea.error = false;

// 原生表单回调必须同时存在于源码与发布声明中。
const nativeFormControls = [
  document.createElement('su-input'),
  document.createElement('su-select'),
  document.createElement('su-date-picker'),
  document.createElement('su-input-number'),
  document.createElement('su-textarea'),
  document.createElement('su-checkbox'),
  document.createElement('su-switch'),
  document.createElement('su-radio-group'),
  document.createElement('su-cascader'),
  document.createElement('su-upload'),
];
nativeFormControls.forEach((control) => {
  control.name = 'profile';
  control.formDisabledCallback(true);
  control.formDisabledCallback(false);
  control.formResetCallback();
});
