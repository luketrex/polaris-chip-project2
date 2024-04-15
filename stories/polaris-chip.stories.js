import { html } from 'lit';
import '../src/polaris-chip.js';

export default {
  title: 'PolarisChip',
  component: 'polaris-chip',
};

function Template({ title }) {
  return html`
    <polaris-chip
      .title=${title}
    >
    </polaris-chip>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
