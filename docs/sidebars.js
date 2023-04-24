/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // But you can create a sidebar manually
  docsSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/playground',
        'getting-started/installation'
      ]
    },
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'tutorial/overview',
        'tutorial/login',
        'tutorial/service',
        'tutorial/data',
        'tutorial/worker',
        'tutorial/deploy',
        'tutorial/connect',
        'tutorial/estate-client',
        'tutorial/call-worker',
        'tutorial/conclusion',
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/introduction',
        'guides/services',
        'guides/workers',
        'guides/data',
        'guides/messages'
      ]
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: [
        'advanced-guides/platform',
        'advanced-guides/developer-tools',
        'advanced-guides/client-runtime',
        'advanced-guides/hosting',
        'advanced-guides/security',
      ]
    }
  ],
};

module.exports = sidebars;
